import os
import io
import csv
import pandas as pd
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from database import engine, Base, get_db
import models
import schemas
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    require_admin,
    require_faculty_or_admin,
)

app = FastAPI(
    title="KiTE AI & DS Innovation Lab API",
    description="Enterprise backend API for KGiSL Institute of Technology AI & DS Portal",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def log_audit(db: Session, user_id: Optional[int], action: str, details: str, ip: str = "127.0.0.1"):
    log = models.AuditLog(
        user_id=user_id,
        action=action,
        details=details,
        ip_address=ip,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "portal": "KiTE AI & DS Innovation Lab", "timestamp": datetime.utcnow().isoformat()}


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================
@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
    log_audit(db, user.id, "USER_LOGIN", f"User {user.email} logged in as role '{user.role}'.")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name
    }


@app.get("/api/auth/me")
def get_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    res = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "created_at": current_user.created_at
    }
    if current_user.role == "student" and current_user.student_profile:
        sp = current_user.student_profile
        res["student_profile"] = {
            "id": sp.id,
            "roll_number": sp.roll_number,
            "batch": sp.batch,
            "department": sp.department,
            "placement_status": sp.placement_status,
            "company_tier": sp.company_tier,
            "company_name": sp.company_name,
            "package_lpa": sp.package_lpa,
            "github_url": sp.github_url,
            "leetcode_url": sp.leetcode_url,
            "linkedin_url": sp.linkedin_url,
            "resume_url": sp.resume_url,
            "skills": sp.skills or [],
            "attendance_pct": sp.attendance_pct
        }
    elif current_user.role == "faculty" and current_user.faculty_profile:
        fp = current_user.faculty_profile
        res["faculty_profile"] = {
            "id": fp.id,
            "employee_id": fp.employee_id,
            "designation": fp.designation,
            "specialization": fp.specialization,
            "office_room": fp.office_room
        }
    return res


# ==========================================
# ANALYTICS ENDPOINTS
# ==========================================
@app.get("/api/analytics/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    total_students = db.query(models.StudentProfile).count()
    active_lab_users = db.query(models.LabProject.student_id).distinct().count()

    batches = ["SOI Placement Batch", "3rd Year AI & DS Batch", "2nd Year AI & DS Batch"]
    batch_metrics = []
    for b in batches:
        b_count = db.query(models.StudentProfile).filter(models.StudentProfile.batch == b).count()
        b_active = db.query(models.LabProject.student_id)\
            .join(models.StudentProfile, models.StudentProfile.user_id == models.LabProject.student_id)\
            .filter(models.StudentProfile.batch == b).distinct().count()
        b_placed = db.query(models.StudentProfile).filter(models.StudentProfile.batch == b, models.StudentProfile.placement_status == "Placed").count()
        avg_att = db.query(func.avg(models.StudentProfile.attendance_pct)).filter(models.StudentProfile.batch == b).scalar() or 0.0

        batch_metrics.append({
            "batch_name": b,
            "total_students": b_count,
            "active_lab_users": b_active,
            "placed_students": b_placed,
            "avg_attendance": round(float(avg_att), 1)
        })

    # Placement Stats (SOI Batch focus)
    soi_profiles = db.query(models.StudentProfile).filter(models.StudentProfile.batch == "SOI Placement Batch").all()
    placed_count = sum(1 for p in soi_profiles if p.placement_status == "Placed")
    unplaced_count = sum(1 for p in soi_profiles if p.placement_status == "Unplaced")
    higher_studies_count = sum(1 for p in soi_profiles if p.placement_status == "Higher Studies")
    tier1_count = sum(1 for p in soi_profiles if p.company_tier == "Tier 1")
    tier2_count = sum(1 for p in soi_profiles if p.company_tier == "Tier 2")
    tier3_count = sum(1 for p in soi_profiles if p.company_tier == "Tier 3")
    
    packages = [p.package_lpa for p in soi_profiles if p.package_lpa > 0]
    avg_pkg = round(sum(packages) / len(packages), 2) if packages else 0.0
    highest_pkg = max(packages) if packages else 0.0

    # Skill matrix distribution
    all_profiles = db.query(models.StudentProfile).all()
    skill_counts = {}
    for p in all_profiles:
        if p.skills and isinstance(p.skills, list):
            for sk in p.skills:
                skill_counts[sk] = skill_counts.get(sk, 0) + 1
    
    sorted_skills = [{"skill_name": k, "student_count": v} for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)]

    return {
        "overview": {
            "total_students": total_students,
            "active_lab_users": active_lab_users,
            "total_projects": db.query(models.LabProject).count(),
            "total_announcements": db.query(models.Announcement).count()
        },
        "batch_metrics": batch_metrics,
        "placement_stats": {
            "placed_count": placed_count,
            "unplaced_count": unplaced_count,
            "higher_studies_count": higher_studies_count,
            "tier1_count": tier1_count,
            "tier2_count": tier2_count,
            "tier3_count": tier3_count,
            "avg_package_lpa": avg_pkg,
            "highest_package_lpa": highest_pkg
        },
        "skill_distribution": sorted_skills[:10]
    }


# ==========================================
# STUDENT MANAGEMENT & DATA GRID
# ==========================================
@app.post("/api/students")
def create_student(
    data: schemas.StudentCreate,
    admin_user: models.User = Depends(require_faculty_or_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    user = models.User(
        email=data.email,
        password_hash=get_password_hash(data.password or "student123"),
        full_name=data.full_name,
        role="student",
        avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={data.roll_number}"
    )
    db.add(user)
    db.flush()

    sp = models.StudentProfile(
        user_id=user.id,
        roll_number=data.roll_number,
        batch=data.batch,
        department=data.department,
        placement_status=data.placement_status,
        company_tier=data.company_tier,
        company_name=data.company_name,
        package_lpa=data.package_lpa,
        skills=data.skills,
        attendance_pct=data.attendance_pct
    )
    db.add(sp)
    db.commit()
    db.refresh(sp)

    log_audit(db, admin_user.id, "CREATE_STUDENT", f"Created student {user.full_name} ({sp.roll_number}).")
    return {"message": "Student created successfully", "id": sp.id, "roll_number": sp.roll_number}


@app.get("/api/students")
def list_students(
    search: Optional[str] = None,
    batch: Optional[str] = None,
    skill: Optional[str] = None,
    placement_status: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.StudentProfile).join(models.User, models.User.id == models.StudentProfile.user_id)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                models.User.full_name.ilike(term),
                models.User.email.ilike(term),
                models.StudentProfile.roll_number.ilike(term),
                models.StudentProfile.company_name.ilike(term)
            )
        )
    if batch and batch != "All":
        query = query.filter(models.StudentProfile.batch == batch)
    if placement_status and placement_status != "All":
        query = query.filter(models.StudentProfile.placement_status == placement_status)

    all_results = query.all()

    if skill and skill != "All":
        all_results = [
            p for p in all_results
            if p.skills and isinstance(p.skills, list) and any(skill.lower() in s.lower() for s in p.skills)
        ]

    total_records = len(all_results)
    start_idx = (page - 1) * limit
    paginated = all_results[start_idx : start_idx + limit]

    output = []
    for sp in paginated:
        output.append({
            "id": sp.id,
            "user_id": sp.user_id,
            "full_name": sp.user.full_name if sp.user else "N/A",
            "email": sp.user.email if sp.user else "N/A",
            "roll_number": sp.roll_number,
            "batch": sp.batch,
            "department": sp.department,
            "placement_status": sp.placement_status,
            "company_tier": sp.company_tier,
            "company_name": sp.company_name,
            "package_lpa": sp.package_lpa,
            "github_url": sp.github_url,
            "leetcode_url": sp.leetcode_url,
            "linkedin_url": sp.linkedin_url,
            "resume_url": sp.resume_url,
            "skills": sp.skills or [],
            "attendance_pct": sp.attendance_pct
        })

    return {
        "total": total_records,
        "page": page,
        "limit": limit,
        "students": output
    }


@app.put("/api/students/{student_id}")
def update_student(
    student_id: int,
    data: schemas.StudentProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sp = db.query(models.StudentProfile).filter(models.StudentProfile.id == student_id).first()
    if not sp:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Access control: Admin or Faculty can update any student. Student can only update own profile.
    if current_user.role == "student" and current_user.id != sp.user_id:
        raise HTTPException(status_code=403, detail="Permission denied to edit this profile")

    for field, val in data.dict(exclude_unset=True).items():
        setattr(sp, field, val)

    db.commit()
    db.refresh(sp)
    log_audit(db, current_user.id, "UPDATE_STUDENT", f"Updated student profile ID {sp.id} (Roll: {sp.roll_number}).")
    return {"message": "Student profile updated successfully", "id": sp.id}


@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, admin_user: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    sp = db.query(models.StudentProfile).filter(models.StudentProfile.id == student_id).first()
    if not sp:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    user = db.query(models.User).filter(models.User.id == sp.user_id).first()
    roll = sp.roll_number
    db.delete(sp)
    if user:
        db.delete(user)
    db.commit()

    log_audit(db, admin_user.id, "DELETE_STUDENT", f"Deleted student roll number {roll}.")
    return {"message": f"Student roll {roll} deleted successfully"}


@app.post("/api/students/bulk-upload")

def bulk_upload_students(
    file: UploadFile = File(...),
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV or Excel file.")

    contents = file.file.read()
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_excel(io.BytesIO(contents))

    created_count = 0
    errors = []

    for idx, row in df.iterrows():
        try:
            email = str(row.get("email", "")).strip()
            name = str(row.get("full_name", "")).strip()
            roll = str(row.get("roll_number", "")).strip()
            batch = str(row.get("batch", "2nd Year AI & DS Batch")).strip()

            if not email or not name or not roll:
                errors.append(f"Row {idx+1}: Missing required field (email, full_name, roll_number)")
                continue

            existing_user = db.query(models.User).filter(models.User.email == email).first()
            if existing_user:
                errors.append(f"Row {idx+1}: User with email {email} already exists")
                continue

            user = models.User(
                email=email,
                password_hash=get_password_hash("student123"),
                full_name=name,
                role="student",
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={roll}"
            )
            db.add(user)
            db.flush()

            skills_raw = str(row.get("skills", "Python,Data Science")).split(",")
            skills_list = [s.strip() for s in skills_raw if s.strip()]

            sp = models.StudentProfile(
                user_id=user.id,
                roll_number=roll,
                batch=batch,
                department=str(row.get("department", "AI & DS")).strip(),
                placement_status=str(row.get("placement_status", "Unplaced")).strip(),
                company_tier=str(row.get("company_tier", "N/A")).strip(),
                company_name=str(row.get("company_name", "")) if pd.notna(row.get("company_name")) else None,
                package_lpa=float(row.get("package_lpa", 0.0)) if pd.notna(row.get("package_lpa")) else 0.0,
                skills=skills_list
            )
            db.add(sp)
            created_count += 1
        except Exception as e:
            errors.append(f"Row {idx+1}: {str(e)}")

    db.commit()
    log_audit(db, admin_user.id, "BULK_UPLOAD", f"Uploaded {created_count} students via {file.filename}.")
    return {"message": f"Successfully imported {created_count} students.", "created_count": created_count, "errors": errors}


@app.get("/api/students/export/csv")
def export_students_csv(db: Session = Depends(get_db)):
    students = db.query(models.StudentProfile).join(models.User).all()
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Roll Number", "Full Name", "Email", "Batch", "Department",
        "Placement Status", "Company Tier", "Company Name", "Package (LPA)",
        "Skills", "Attendance %", "GitHub URL"
    ])

    for sp in students:
        skills_str = ", ".join(sp.skills) if sp.skills else ""
        writer.writerow([
            sp.roll_number,
            sp.user.full_name if sp.user else "",
            sp.user.email if sp.user else "",
            sp.batch,
            sp.department,
            sp.placement_status,
            sp.company_tier,
            sp.company_name or "",
            sp.package_lpa,
            skills_str,
            sp.attendance_pct,
            sp.github_url or ""
        ])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=kite_aids_students_export.csv"}
    )


# ==========================================
# FACULTY OPERATIONS
# ==========================================
@app.get("/api/faculties")
def list_faculties(db: Session = Depends(get_db)):
    faculties = db.query(models.FacultyProfile).join(models.User).all()
    res = []
    for fp in faculties:
        res.append({
            "id": fp.id,
            "user_id": fp.user_id,
            "full_name": fp.user.full_name if fp.user else "N/A",
            "email": fp.user.email if fp.user else "N/A",
            "employee_id": fp.employee_id,
            "designation": fp.designation,
            "specialization": fp.specialization,
            "office_room": fp.office_room
        })
    return res


# ==========================================
# LAB PROJECTS / PROTOTYPE TRACKER
# ==========================================
@app.get("/api/projects")
def list_projects(
    batch: Optional[str] = None,
    student_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.LabProject)
    if batch and batch != "All":
        query = query.filter(models.LabProject.batch == batch)
    if student_id:
        query = query.filter(models.LabProject.student_id == student_id)
    if status_filter and status_filter != "All":
        query = query.filter(models.LabProject.status == status_filter)

    projects = query.order_by(models.LabProject.created_at.desc()).all()
    res = []
    for p in projects:
        res.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack or [],
            "accuracy_metric": p.accuracy_metric,
            "github_url": p.github_url,
            "demo_url": p.demo_url,
            "status": p.status,
            "batch": p.batch,
            "student_id": p.student_id,
            "student_name": p.student.full_name if p.student else "N/A",
            "assigned_faculty_id": p.assigned_faculty_id,
            "assigned_faculty_name": p.faculty.full_name if p.faculty else "Unassigned",
            "created_at": p.created_at
        })
    return res


@app.post("/api/projects")
def create_project(
    data: schemas.LabProjectCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = "SOI Placement Batch"
    if current_user.role == "student" and current_user.student_profile:
        batch = current_user.student_profile.batch

    project = models.LabProject(
        title=data.title,
        description=data.description,
        tech_stack=data.tech_stack,
        accuracy_metric=data.accuracy_metric,
        github_url=data.github_url,
        demo_url=data.demo_url,
        status="In Progress",
        batch=batch,
        student_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    log_audit(db, current_user.id, "CREATE_PROJECT", f"Created prototype project '{project.title}'.")
    return {"message": "Project prototype created successfully", "id": project.id}


@app.put("/api/projects/{project_id}")
def update_project(
    project_id: int,
    data: schemas.LabProjectUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.LabProject).filter(models.LabProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, val in data.dict(exclude_unset=True).items():
        setattr(project, field, val)

    db.commit()
    log_audit(db, current_user.id, "UPDATE_PROJECT", f"Updated project '{project.title}'.")
    return {"message": "Project updated successfully"}


# ==========================================
# ANNOUNCEMENTS & AUDIT LOGS
# ==========================================
@app.get("/api/announcements")
def list_announcements(db: Session = Depends(get_db)):
    announcements = db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).all()
    res = []
    for a in announcements:
        res.append({
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "target_batch": a.target_batch,
            "priority": a.priority,
            "posted_by_id": a.posted_by_id,
            "author_name": a.author.full_name if a.author else "Admin",
            "created_at": a.created_at
        })
    return res


@app.post("/api/announcements")
def create_announcement(
    data: schemas.AnnouncementCreate,
    user: models.User = Depends(require_faculty_or_admin),
    db: Session = Depends(get_db)
):
    a = models.Announcement(
        title=data.title,
        content=data.content,
        target_batch=data.target_batch,
        priority=data.priority,
        posted_by_id=user.id
    )
    db.add(a)
    db.commit()
    log_audit(db, user.id, "POST_ANNOUNCEMENT", f"Posted announcement '{a.title}'.")
    return {"message": "Announcement posted successfully"}


@app.get("/api/audit-logs")
def get_audit_logs(admin_user: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(100).all()
    res = []
    for l in logs:
        res.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_name": l.user.full_name if l.user else "System",
            "action": l.action,
            "details": l.details,
            "ip_address": l.ip_address,
            "timestamp": l.timestamp
        })
    return res
