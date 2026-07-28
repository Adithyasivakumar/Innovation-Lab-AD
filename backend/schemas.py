from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # admin, faculty, student
    roll_number: Optional[str] = None
    employee_id: Optional[str] = None
    batch: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Student Profile Schemas ---
class StudentProfileBase(BaseModel):
    roll_number: str
    batch: str
    department: str = "AI & DS"
    placement_status: str = "Unplaced"
    company_tier: str = "N/A"
    company_name: Optional[str] = None
    package_lpa: float = 0.0
    github_url: Optional[str] = None
    leetcode_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    skills: List[str] = []
    attendance_pct: float = 85.0

class StudentProfileUpdate(BaseModel):
    batch: Optional[str] = None
    placement_status: Optional[str] = None
    company_tier: Optional[str] = None
    company_name: Optional[str] = None
    package_lpa: Optional[float] = None
    github_url: Optional[str] = None
    leetcode_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    skills: Optional[List[str]] = None
    attendance_pct: Optional[float] = None

class StudentResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    roll_number: str
    batch: str
    department: str
    placement_status: str
    company_tier: str
    company_name: Optional[str]
    package_lpa: float
    github_url: Optional[str]
    leetcode_url: Optional[str]
    linkedin_url: Optional[str]
    resume_url: Optional[str]
    skills: List[str]
    attendance_pct: float

    class Config:
        from_attributes = True

# --- Faculty Profile Schemas ---
class FacultyResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    employee_id: str
    designation: str
    specialization: str
    office_room: str

    class Config:
        from_attributes = True

# --- Project Schemas ---
class LabProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    accuracy_metric: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class LabProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    accuracy_metric: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    status: Optional[str] = None
    assigned_faculty_id: Optional[int] = None

class LabProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    accuracy_metric: Optional[str]
    github_url: Optional[str]
    demo_url: Optional[str]
    status: str
    batch: str
    student_id: int
    student_name: Optional[str] = None
    assigned_faculty_id: Optional[int] = None
    assigned_faculty_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Announcement Schemas ---
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target_batch: str = "All Batches"
    priority: str = "Normal"

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    target_batch: str
    priority: str
    posted_by_id: int
    author_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Audit Log Schema ---
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    user_name: Optional[str] = None
    action: str
    details: Optional[str]
    ip_address: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Analytics Response Schema ---
class BatchAnalytics(BaseModel):
    batch_name: str
    total_students: int
    active_lab_users: int
    placed_students: int
    avg_attendance: float

class PlacementAnalytics(BaseModel):
    placed_count: int
    unplaced_count: int
    higher_studies_count: int
    tier1_count: int
    tier2_count: int
    tier3_count: int
    avg_package_lpa: float
    highest_package_lpa: float

class SkillDistribution(BaseModel):
    skill_name: str
    student_count: int
