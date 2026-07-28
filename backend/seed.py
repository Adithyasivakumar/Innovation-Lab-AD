import os
from database import Base, engine, SessionLocal
from models import User, StudentProfile, FacultyProfile, LabProject, Announcement, AuditLog
from auth import get_password_hash

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding database with KiTE AI & DS Innovation Lab data...")

        # 1. Admin User
        admin_user = User(
            email="admin@kite.ac.in",
            password_hash=get_password_hash("admin123"),
            full_name="Dr. A. R. Suresh (Lab Head)",
            role="admin",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        )
        db.add(admin_user)
        db.commit()

        # 2. Faculty Users
        f1_user = User(
            email="faculty1@kite.ac.in",
            password_hash=get_password_hash("faculty123"),
            full_name="Prof. K. Venkatesh",
            role="faculty",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        )
        f2_user = User(
            email="faculty2@kite.ac.in",
            password_hash=get_password_hash("faculty123"),
            full_name="Dr. M. Deepa",
            role="faculty",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        )
        db.add_all([f1_user, f2_user])
        db.commit()

        # Faculty Profiles
        fp1 = FacultyProfile(
            user_id=f1_user.id,
            employee_id="KITE-FAC-101",
            designation="Professor & Lead AI Mentor",
            specialization="Natural Language Processing & Large Language Models",
            office_room="AI-DS Innovation Hub 302"
        )
        fp2 = FacultyProfile(
            user_id=f2_user.id,
            employee_id="KITE-FAC-104",
            designation="Associate Professor",
            specialization="Computer Vision, Autonomous Systems & Edge AI",
            office_room="AI-DS Vision Lab 305"
        )
        db.add_all([fp1, fp2])
        db.commit()

        # 3. Student Users across 3 Batches
        batch1_name = "SOI Placement Batch"
        batch2_name = "3rd Year AI & DS Batch"
        batch3_name = "2nd Year AI & DS Batch"

        student_specs = [
            # --- Batch 1: SOI Placement Batch ---
            {
                "name": "Adithya V",
                "email": "student@kite.ac.in", # Demo student login
                "password": "student123",
                "roll": "7177212101",
                "batch": batch1_name,
                "status": "Placed",
                "tier": "Tier 1",
                "company": "Zoho Corporation",
                "package": 14.5,
                "github": "https://github.com/adithya-v-kite",
                "leetcode": "https://leetcode.com/adithya_ai",
                "linkedin": "https://linkedin.com/in/adithya-kite",
                "resume": "https://kite.ac.in/resumes/7177212101.pdf",
                "skills": ["PyTorch", "NLP", "FastAPI", "Transformers", "LLM", "Docker"],
                "attendance": 96.0
            },
            {
                "name": "Priya Dharshini R",
                "email": "priya.r@kite.ac.in",
                "password": "student123",
                "roll": "7177212102",
                "batch": batch1_name,
                "status": "Placed",
                "tier": "Tier 1",
                "company": "Tiger Analytics",
                "package": 12.0,
                "github": "https://github.com/priyar-ai",
                "leetcode": "https://leetcode.com/priya_d",
                "linkedin": "https://linkedin.com/in/priyar",
                "resume": "https://kite.ac.in/resumes/7177212102.pdf",
                "skills": ["TensorFlow", "Computer Vision", "OpenCV", "Scikit-Learn", "Python"],
                "attendance": 92.5
            },
            {
                "name": "Karthik Subramanian",
                "email": "karthik.s@kite.ac.in",
                "password": "student123",
                "roll": "7177212103",
                "batch": batch1_name,
                "status": "Placed",
                "tier": "Tier 2",
                "company": "Bosch Global Software",
                "package": 9.2,
                "github": "https://github.com/karthik-subramanian",
                "leetcode": "https://leetcode.com/karthiks",
                "linkedin": "https://linkedin.com/in/karthiks",
                "resume": "https://kite.ac.in/resumes/7177212103.pdf",
                "skills": ["PyTorch", "Reinforcement Learning", "ROS", "C++", "Python"],
                "attendance": 89.0
            },
            {
                "name": "Sneha Krishnan",
                "email": "sneha.k@kite.ac.in",
                "password": "student123",
                "roll": "7177212104",
                "batch": batch1_name,
                "status": "Higher Studies",
                "tier": "N/A",
                "company": "IIT Madras (M.Tech AI)",
                "package": 0.0,
                "github": "https://github.com/sneha-ai-research",
                "leetcode": "https://leetcode.com/sneha_k",
                "linkedin": "https://linkedin.com/in/snehak",
                "resume": "https://kite.ac.in/resumes/7177212104.pdf",
                "skills": ["Graph Neural Networks", "PyTorch", "Mathematical Modeling", "NLP"],
                "attendance": 98.2
            },
            {
                "name": "Vijay Ananth",
                "email": "vijay.a@kite.ac.in",
                "password": "student123",
                "roll": "7177212105",
                "batch": batch1_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/vijay-ananth",
                "leetcode": "https://leetcode.com/vijay_a",
                "linkedin": "https://linkedin.com/in/vijay-a",
                "resume": "https://kite.ac.in/resumes/7177212105.pdf",
                "skills": ["Python", "FastAPI", "SQL", "Pandas", "Scikit-Learn"],
                "attendance": 84.0
            },
            {
                "name": "Harini Murugan",
                "email": "harini.m@kite.ac.in",
                "password": "student123",
                "roll": "7177212106",
                "batch": batch1_name,
                "status": "Placed",
                "tier": "Tier 1",
                "company": "Freshworks Inc",
                "package": 16.0,
                "github": "https://github.com/harini-ml",
                "leetcode": "https://leetcode.com/harini_m",
                "linkedin": "https://linkedin.com/in/harinim",
                "resume": "https://kite.ac.in/resumes/7177212106.pdf",
                "skills": ["NLP", "Bert", "LangChain", "Vector Databases", "FastAPI", "React"],
                "attendance": 95.0
            },

            # --- Batch 2: 3rd Year AI & DS Batch ---
            {
                "name": "Siddharth Raj",
                "email": "siddharth.r@kite.ac.in",
                "password": "student123",
                "roll": "7177222101",
                "batch": batch2_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/sid-raj-ai",
                "leetcode": "https://leetcode.com/sid_raj",
                "linkedin": "https://linkedin.com/in/sidraj",
                "resume": "https://kite.ac.in/resumes/7177222101.pdf",
                "skills": ["TensorFlow", "Keras", "OpenCV", "Deep Learning", "Flask"],
                "attendance": 91.0
            },
            {
                "name": "Ananya Sundaram",
                "email": "ananya.s@kite.ac.in",
                "password": "student123",
                "roll": "7177222102",
                "batch": batch2_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/ananya-ds",
                "leetcode": "https://leetcode.com/ananyas",
                "linkedin": "https://linkedin.com/in/ananyas",
                "resume": "https://kite.ac.in/resumes/7177222102.pdf",
                "skills": ["Data Science", "Pandas", "Seaborn", "Scikit-Learn", "SQL"],
                "attendance": 94.0
            },
            {
                "name": "Deepak Balaji",
                "email": "deepak.b@kite.ac.in",
                "password": "student123",
                "roll": "7177222103",
                "batch": batch2_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/deepak-b",
                "leetcode": "https://leetcode.com/deepakb",
                "linkedin": "https://linkedin.com/in/deepakb",
                "resume": "https://kite.ac.in/resumes/7177222103.pdf",
                "skills": ["PyTorch", "YOLOv8", "Computer Vision", "Jetson Nano"],
                "attendance": 88.5
            },
            {
                "name": "Kavitha N",
                "email": "kavitha.n@kite.ac.in",
                "password": "student123",
                "roll": "7177222104",
                "batch": batch2_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/kavitha-n",
                "leetcode": "https://leetcode.com/kavithan",
                "linkedin": "https://linkedin.com/in/kavithan",
                "resume": "https://kite.ac.in/resumes/7177222104.pdf",
                "skills": ["NLP", "HuggingFace", "Python", "Streamlit", "NLTK"],
                "attendance": 93.0
            },

            # --- Batch 3: 2nd Year AI & DS Batch ---
            {
                "name": "Naveen Kumar",
                "email": "naveen.k@kite.ac.in",
                "password": "student123",
                "roll": "7177232101",
                "batch": batch3_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/naveenk-2nd",
                "leetcode": "https://leetcode.com/naveenk",
                "linkedin": "https://linkedin.com/in/naveenk",
                "resume": "https://kite.ac.in/resumes/7177232101.pdf",
                "skills": ["Python", "C++", "Data Structures", "HTML/CSS"],
                "attendance": 87.0
            },
            {
                "name": "Meera Ramesh",
                "email": "meera.r@kite.ac.in",
                "password": "student123",
                "roll": "7177232102",
                "batch": batch3_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/meerar",
                "leetcode": "https://leetcode.com/meera_r",
                "linkedin": "https://linkedin.com/in/meerar",
                "resume": "https://kite.ac.in/resumes/7177232102.pdf",
                "skills": ["Python", "SQL", "Pandas", "Matplotlib"],
                "attendance": 95.5
            },
            {
                "name": "Gokul Prasad",
                "email": "gokul.p@kite.ac.in",
                "password": "student123",
                "roll": "7177232103",
                "batch": batch3_name,
                "status": "Unplaced",
                "tier": "N/A",
                "company": None,
                "package": 0.0,
                "github": "https://github.com/gokulp",
                "leetcode": "https://leetcode.com/gokul_p",
                "linkedin": "https://linkedin.com/in/gokulp",
                "resume": "https://kite.ac.in/resumes/7177232103.pdf",
                "skills": ["Python", "Data Structures", "OpenCV Basics"],
                "attendance": 89.2
            }
        ]

        created_student_users = []
        for sspec in student_specs:
            user = User(
                email=sspec["email"],
                password_hash=get_password_hash(sspec["password"]),
                full_name=sspec["name"],
                role="student",
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={sspec['roll']}"
            )
            db.add(user)
            db.commit()

            sp = StudentProfile(
                user_id=user.id,
                roll_number=sspec["roll"],
                batch=sspec["batch"],
                department="AI & DS",
                placement_status=sspec["status"],
                company_tier=sspec["tier"],
                company_name=sspec["company"],
                package_lpa=sspec["package"],
                github_url=sspec["github"],
                leetcode_url=sspec["leetcode"],
                linkedin_url=sspec["linkedin"],
                resume_url=sspec["resume"],
                skills=sspec["skills"],
                attendance_pct=sspec["attendance"]
            )
            db.add(sp)
            created_student_users.append((user, sspec["batch"]))
        
        db.commit()

        # 4. Lab Projects / Prototypes
        adithya_user = db.query(User).filter(User.email == "student@kite.ac.in").first()
        priya_user = db.query(User).filter(User.email == "priya.r@kite.ac.in").first()
        deepak_user = db.query(User).filter(User.email == "deepak.b@kite.ac.in").first()

        projects_data = [
            LabProject(
                title="KiTE-RAG: Autonomous Campus Knowledge Retrieval System",
                description="End-to-end Retrieval Augmented Generation pipeline fine-tuned on KiTE academic syllabus and lab policy guidelines using Llama 3 8B and Milvus Vector Database.",
                tech_stack=["PyTorch", "LangChain", "FastAPI", "Milvus", "Llama-3"],
                accuracy_metric="96.8% ROUGE-L Score",
                github_url="https://github.com/adithya-v-kite/kite-rag-llm",
                demo_url="https://rag.kite.ac.in/demo",
                status="Verified",
                batch=batch1_name,
                student_id=adithya_user.id if adithya_user else 1,
                assigned_faculty_id=f1_user.id
            ),
            LabProject(
                title="Real-Time Defect Detection in Industrial PCB Manufacturing",
                description="Computer vision model deployed on Nvidia Jetson Orin Nano for inspecting micro-solder defects on high-speed SMT lines at 60 FPS.",
                tech_stack=["YOLOv8", "OpenCV", "TensorRT", "C++", "Python"],
                accuracy_metric="98.4% mAP@0.5",
                github_url="https://github.com/priyar-ai/pcb-defect-vision",
                demo_url="https://vision-pcb.kite.ac.in",
                status="Verified",
                batch=batch1_name,
                student_id=priya_user.id if priya_user else 2,
                assigned_faculty_id=f2_user.id
            ),
            LabProject(
                title="Autonomous Rover Obstacle Avoidance via Depth Estimation",
                description="Monocular depth estimation integrated with ROS2 navigation stack for mini-autonomous rover prototyping in KiTE Innovation Lab.",
                tech_stack=["ROS2", "MiDaS Depth", "PyTorch", "Python", "Raspberry Pi 4"],
                accuracy_metric="93.1% Depth Precision",
                github_url="https://github.com/deepak-b/rover-depth-nav",
                demo_url="https://rover-demo.kite.ac.in",
                status="In Progress",
                batch=batch2_name,
                student_id=deepak_user.id if deepak_user else 7,
                assigned_faculty_id=f2_user.id
            )
        ]
        db.add_all(projects_data)
        db.commit()

        # 5. Lab Announcements
        announcements = [
            Announcement(
                title="🚀 KiTE Innovation Lab GPU Server Reservation Policy",
                content="All students in Batch 1 (SOI Placement) and Batch 2 (3rd Year) can now request SSH access to our dual Nvidia RTX 4090 GPU server for model training. Please submit your project abstract first.",
                target_batch="All Batches",
                priority="High",
                posted_by_id=admin_user.id
            ),
            Announcement(
                title="💼 Special SOI Mock Technical Interview Series",
                content="Special technical interview training for SOI Placement Batch candidates starting this Saturday. Industry mentors from Tiger Analytics and Zoho will evaluate LLM & Vision coding rounds.",
                target_batch=batch1_name,
                priority="Urgent",
                posted_by_id=f1_user.id
            ),
            Announcement(
                title="🤖 2nd Year AI & DS Onboarding & Python Hackathon",
                content="Welcome 2nd Year students to the AI & DS Innovation Hub! Join the introductory Python & OpenCV 24-Hour Mini-Hackathon next weekend.",
                target_batch=batch3_name,
                priority="Normal",
                posted_by_id=f2_user.id
            )
        ]
        db.add_all(announcements)
        db.commit()

        # 6. Audit Logs
        logs = [
            AuditLog(
                user_id=admin_user.id,
                action="SYSTEM_INIT",
                details="Initial KiTE AI & DS Lab Management Portal initialization completed.",
                ip_address="127.0.0.1"
            ),
            AuditLog(
                user_id=f1_user.id,
                action="VERIFY_PROJECT",
                details="Prof. K. Venkatesh verified 'KiTE-RAG: Autonomous Campus Knowledge Retrieval System'.",
                ip_address="192.168.1.45"
            ),
            AuditLog(
                user_id=admin_user.id,
                action="BULK_STUDENT_IMPORT",
                details="Imported 13 student profiles across Batch 1, 2, and 3.",
                ip_address="127.0.0.1"
            )
        ]
        db.add_all(logs)
        db.commit()

        print("Database successfully seeded with KiTE AI & DS sample data!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
