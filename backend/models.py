import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), index=True, nullable=False)  # admin, faculty, student
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    faculty_profile = relationship("FacultyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects = relationship("LabProject", foreign_keys="[LabProject.student_id]", back_populates="student")
    assigned_projects = relationship("LabProject", foreign_keys="[LabProject.assigned_faculty_id]", back_populates="faculty")
    announcements = relationship("Announcement", back_populates="author")
    audit_logs = relationship("AuditLog", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    batch = Column(String(100), index=True, nullable=False)
    # Batch categories:
    # 'SOI Placement Batch', '3rd Year AI & DS Batch', '2nd Year AI & DS Batch'
    department = Column(String(100), default="AI & DS")
    placement_status = Column(String(50), default="Unplaced") # Placed, Unplaced, Higher Studies
    company_tier = Column(String(50), default="N/A") # Tier 1, Tier 2, Tier 3, N/A
    company_name = Column(String(255), nullable=True)
    package_lpa = Column(Float, default=0.0)
    github_url = Column(String(500), nullable=True)
    leetcode_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    skills = Column(JSON, default=list) # e.g. ["TensorFlow", "PyTorch", "NLP", "CV", "Python"]
    attendance_pct = Column(Float, default=85.0)

    user = relationship("User", back_populates="student_profile")


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id = Column(String(50), unique=True, nullable=False)
    designation = Column(String(100), default="Assistant Professor")
    specialization = Column(String(255), default="Machine Learning & Deep Learning")
    office_room = Column(String(100), default="AI-DS Lab 201")

    user = relationship("User", back_populates="faculty_profile")


class LabProject(Base):
    __tablename__ = "lab_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, default=list) # e.g. ["PyTorch", "YOLOv8", "FastAPI", "React"]
    accuracy_metric = Column(String(100), nullable=True) # e.g. "96.4% MAP", "94.2% F1-score"
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    status = Column(String(50), default="In Progress") # Idea, In Progress, Completed, Verified
    batch = Column(String(100), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_faculty_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("User", foreign_keys=[student_id], back_populates="projects")
    faculty = relationship("User", foreign_keys=[assigned_faculty_id], back_populates="assigned_projects")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    target_batch = Column(String(100), default="All Batches") # All Batches, SOI Placement Batch, etc.
    priority = Column(String(20), default="Normal") # High, Normal, Urgent
    posted_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    author = relationship("User", back_populates="announcements")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
