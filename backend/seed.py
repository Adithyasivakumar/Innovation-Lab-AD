import sys
import os
from sqlalchemy.orm import Session

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
import models
from auth import get_password_hash

def seed_database():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # 1. Admin Users
        admin_user = models.User(
            email="admin@kite.ac.in",
            password_hash=get_password_hash("admin123"),
            full_name="Dr. A. R. Suresh (Lab Head)",
            role="admin",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        )
        db.add(admin_user)

        soi_admin = models.User(
            email="soi.admin@kite.ac.in",
            password_hash=get_password_hash("admin123"),
            full_name="School of Innovation Director",
            role="admin",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=soiadmin"
        )
        db.add(soi_admin)

        # 2. Faculty Mentors
        faculty_1 = models.User(
            email="faculty1@kite.ac.in",
            password_hash=get_password_hash("faculty123"),
            full_name="Prof. S. Karthikeyan",
            role="faculty",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=karthik"
        )
        db.add(faculty_1)
        db.flush()

        fp1 = models.FacultyProfile(
            user_id=faculty_1.id,
            employee_id="KITE-AIDS-101",
            designation="Associate Professor",
            specialization="Deep Learning & Computer Vision",
            office_room="Lab Block 302"
        )
        db.add(fp1)

        faculty_2 = models.User(
            email="faculty2@kite.ac.in",
            password_hash=get_password_hash("faculty123"),
            full_name="Dr. M. Priyadharshini",
            role="faculty",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=priya"
        )
        db.add(faculty_2)
        db.flush()

        fp2 = models.FacultyProfile(
            user_id=faculty_2.id,
            employee_id="KITE-AIDS-102",
            designation="Assistant Professor",
            specialization="Generative AI & Agentic Workflows",
            office_room="Lab Block 304"
        )
        db.add(fp2)

        # 3. Authentic Placement / Domain Students (Transcribed from Staff Sheet)
        placement_students_data = [
            {
                "full_name": "ANUSHWATHI R",
                "roll_number": "23AIA09",
                "email": "23aia09anushwathi@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "ML Engineer, Software Engineer, AI Engineer",
                "skills": ["Python", "SQL", "LangChain", "RAG Pipelines", "LLaMA", "HuggingFace Transformers", "Vector DBs (FAISS, Qdrant)", "OpenCV", "NLP"],
                "projects": [
                    {"title": "Mental Health Voice Coach", "desc": "AI Voice Coach providing conversational mental health support via RAG."},
                    {"title": "Byteguard - AI Security System", "desc": "AI Security System for automated network anomaly detection."}
                ],
                "company_name": "Zoho Corporation",
                "package_lpa": 8.5
            },
            {
                "full_name": "Kiruthika S",
                "roll_number": "23CB30",
                "email": "23cb30kiruthika@soi.kgkite.ac.in",
                "department": "B.TECH CSBS",
                "role_choice": "AI Engineer, GenAI/LLM Engineer, ML Engineer",
                "skills": ["Python", "SQL", "CrewAI", "LlamaIndex", "NLP", "PyTorch"],
                "projects": [
                    {"title": "AI Research Assistant Agent (CrewAI)", "desc": "Multi-agent research assistant built with CrewAI and LLMs."},
                    {"title": "Course Notes AI Assistant (RAG Chatbot)", "desc": "RAG chatbot indexing college course notes."},
                    {"title": "Smart News Summarizer Agent", "desc": "Automated news fetching and summarization agent."}
                ],
                "company_name": "Cognizant",
                "package_lpa": 6.5
            },
            {
                "full_name": "GOPI KRISHNA S",
                "roll_number": "23AIA28",
                "email": "23aia28gopikrishna@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer / SDE / Data Analyst",
                "skills": ["Python", "SQL", "PowerBI", "Excel"],
                "projects": [
                    {"title": "Sales Forecasting Dashboard", "desc": "Interactive sales forecasting dashboard with time-series analysis."}
                ],
                "company_name": "Virtusa",
                "package_lpa": 5.5
            },
            {
                "full_name": "MAHESH KUMAR M",
                "roll_number": "23AIA54",
                "email": "23aia54maheshkumar@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "AI Engineer, Data Analyst, Robotics, Software Engineer",
                "skills": ["Python", "SQL", "PowerBI", "Excel", "RAG", "OpenCV", "LLMs"],
                "projects": [
                    {"title": "RAG-Based AI Assistant using FastAPI & ChromaDB", "desc": "FastAPI powered RAG assistant with Gemini API & ChromaDB."},
                    {"title": "Farm AI Assistant (TensorFlow + LLM)", "desc": "Smart agriculture assistant detecting crop diseases."},
                    {"title": "Developer Analytics Dashboard", "desc": "Analytics dashboard tracking developer velocity."}
                ],
                "company_name": "Bosch Global Software",
                "package_lpa": 7.0
            },
            {
                "full_name": "Harishankar M",
                "roll_number": "23AIA35",
                "email": "23aia35harishankar@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "AI Engineer, Robotics, ROS Engineer, ML Engineer",
                "skills": ["Python", "ROS2", "PyTorch", "TensorFlow", "Scikit-learn", "CNN", "NLP", "LLMs", "FastAPI", "AWS", "GitHub Actions"],
                "projects": [
                    {"title": "FarmApp - AI Farm Assistant", "desc": "AI Farm assistant integrated with ROS2 and IoT sensors."},
                    {"title": "Byteguard - AI based IDS/IPS System", "desc": "AI Intrusion detection system with instant alert dispatch."},
                    {"title": "Autonomous Car Project", "desc": "ROS2 powered autonomous car prototype with LIDAR mapping."}
                ],
                "company_name": "L&T Technology Services",
                "package_lpa": 8.0
            },
            {
                "full_name": "Dhanvanth Kumar V U",
                "roll_number": "23AIA18",
                "email": "23aia18dhanvanth@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "AI Engineer, Data Scientist, Software Developer",
                "skills": ["Python", "SQL", "LLMs", "Scikit-learn", "NLP", "OpenCV", "Transformers", "Flask"],
                "projects": [
                    {"title": "AI-Powered News Summarizer", "desc": "Extractive and abstractive news summarization engine."},
                    {"title": "Handwritten-to-Multilingual Digital Text Converter", "desc": "OCR pipeline converting handwritten Tamil to English text."},
                    {"title": "Turf Booking System", "desc": "Full stack turf slot booking application."}
                ],
                "company_name": "TCS Digital",
                "package_lpa": 7.2
            },
            {
                "full_name": "KAMALESH J",
                "roll_number": "23AIA41",
                "email": "23aia41kamalesh@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "AI Engineer / Agentic AI / Robotics",
                "skills": ["Python", "SQL", "ML", "ROS2", "RAG", "Transformers", "OpenCV"],
                "projects": [
                    {"title": "AI-Powered CAD Revision Analyzer", "desc": "Analyzes CAD revision diffs using Computer Vision."},
                    {"title": "Brain-Tumor-Detection-Classification", "desc": "MRI Brain tumor classification with 97.2% accuracy."}
                ],
                "company_name": "Infosys",
                "package_lpa": 6.0
            },
            {
                "full_name": "TURAGA VIJAYAAKASH",
                "roll_number": "23AIB54",
                "email": "23aib54vijayaakash@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer / Data Analyst / ML Engineer",
                "skills": ["Python", "Excel", "SQL", "Power BI", "ML", "Statistics", "AWS"],
                "projects": [
                    {"title": "AI Website conversion rate optimizer", "desc": "Predicts user dropoff and optimizes conversion funnel."},
                    {"title": "Business intelligence dashboard", "desc": "Interactive BI dashboard with AWS QuickSight integration."}
                ],
                "company_name": "Wipro",
                "package_lpa": 5.8
            },
            {
                "full_name": "AMITH ADITYA C P",
                "roll_number": "23CB04",
                "email": "23cb04amithaditya@soi.kgkite.ac.in",
                "department": "B.TECH CSBS",
                "role_choice": "Data Engineer / Data Analyst",
                "skills": ["Python", "Excel", "SQL", "Power BI", "ETL", "ML", "Cloud"],
                "projects": [
                    {"title": "AI - Farmer Assistant", "desc": "AI assistance bot for local farmers."},
                    {"title": "Early detection of mastitis in dairy cows", "desc": "ML model for early detection of mastitis disease."},
                    {"title": "Online Polling System", "desc": "Secure blockchain-inspired polling platform."}
                ],
                "company_name": "Mindtree",
                "package_lpa": 5.5
            },
            {
                "full_name": "Yogiram K V",
                "roll_number": "23AIB60",
                "email": "23aib60yogiram@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer / Data Analyst / Data Scientist",
                "skills": ["Python", "Excel", "SQL", "Power BI", "Kafka", "ML", "Flask", "Linux"],
                "projects": [
                    {"title": "Interactive Data Analytics Platform", "desc": "Real-time streaming analytics platform using Apache Kafka."},
                    {"title": "Stock market sentiment analysis companion", "desc": "NLP sentiment analysis on stock news and Twitter feeds."},
                    {"title": "Facial Recognition Attendance Solution", "desc": "Real-time OpenCV facial recognition for class attendance."}
                ],
                "company_name": "Kaar Technologies",
                "package_lpa": 6.8
            },
            {
                "full_name": "HAMSINI A",
                "roll_number": "23CSA30",
                "email": "23csa30hamsini@soi.kgkite.ac.in",
                "department": "B.E. CSE",
                "role_choice": "AI/ML Engineer, Software Developer, GenAI Engineer",
                "skills": ["Python", "SQL", "ML", "DL", "CV", "LLM", "RAG", "Gen AI", "Prompt Engineering", "Docker", "Flask"],
                "projects": [
                    {"title": "AI-Powered Assessment Recommender System", "desc": "Recommends personalized learning tests based on student performance."},
                    {"title": "Real-Time Sign Language Recognition & Translation", "desc": "OpenCV + LSTM Sign language to speech translation."},
                    {"title": "AI-Powered Corporate FP&A Copilot", "desc": "Financial planning copilot parsing balance sheets with LLMs."},
                    {"title": "CAD Difference Spotter (DiffCAD)", "desc": "Computer vision tool detecting geometric variances in engineering drawings."},
                    {"title": "AI Resume Skill Analyzer", "desc": "Extracts candidate skills and matches against job descriptions."}
                ],
                "company_name": "Zoho Corporation",
                "package_lpa": 8.8
            },
            {
                "full_name": "SANJAY B",
                "roll_number": "23AIB21",
                "email": "23aib21sanjay@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer / Data Analyst / Data Scientist / ML Engineer",
                "skills": ["Python", "SQL", "Excel", "Power BI", "ML", "ETL"],
                "projects": [
                    {"title": "Traveller Analytics Dashboard and Insight System", "desc": "Tourism trend prediction and visitor demographic analytics."},
                    {"title": "Legal law assistant", "desc": "RAG powered assistant trained on Indian Penal Code statutes."}
                ],
                "company_name": "Hexaware",
                "package_lpa": 5.4
            },
            {
                "full_name": "PRIYADARSAN P",
                "roll_number": "23AIB07",
                "email": "23aib07priyadarsan@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer / Data Analyst / Data Scientist",
                "skills": ["Python", "Excel", "SQL", "Power BI"],
                "projects": [
                    {"title": "Brain Tumor Analysis System", "desc": "Segmentation of MRI brain scans using U-Net architecture."},
                    {"title": "Expense tracker dashboard", "desc": "Personal finance and budgeting visualization."}
                ],
                "company_name": "Sify Technologies",
                "package_lpa": 5.2
            },
            {
                "full_name": "ADITHYA S",
                "roll_number": "23CSA06",
                "email": "23csa06adithya@soi.kgkite.ac.in",
                "department": "B.E. CSE",
                "role_choice": "Software Engineer (SWE), Full-Stack Developer",
                "skills": ["Python", "SQL", "JavaScript", "React.js", "Node.js", "Django", "Flask", "Docker", "Git"],
                "projects": [
                    {"title": "Drowsiness Detection System", "desc": "Real-time webcam driver drowsiness detection with alarm system."},
                    {"title": "Diabetic Retinopathy Detection", "desc": "Deep learning fundus image classification for eye disease."}
                ],
                "company_name": "Accenture",
                "package_lpa": 6.5
            },
            {
                "full_name": "VARSHINI JANAKI K",
                "roll_number": "23IT61",
                "email": "23it61varshini@soi.kgkite.ac.in",
                "department": "B.TECH IT",
                "role_choice": "Software Developer, Data Engineer, AI Engineer",
                "skills": ["Python", "SQL", "Power BI", "NLP", "ML", "RAG"],
                "projects": [
                    {"title": "AI Citation & Hallucination Guardrail System", "desc": "Evaluates LLM outputs to prevent factual hallucinations."},
                    {"title": "AI Auditing & Finance Tracking", "desc": "Automated receipt parsing and invoice anomaly detection."},
                    {"title": "Mental Health Chatbot", "desc": "Empathetic mental health conversation bot."}
                ],
                "company_name": "Thoughtworks",
                "package_lpa": 9.0
            },
            {
                "full_name": "Kanishka P",
                "roll_number": "23AIA44",
                "email": "23aia44kanishka@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Software Engineer, AI Engineer, ML Engineer",
                "skills": ["Python", "Excel", "SQL", "Power BI", "HTML", "CSS", "Flask", "NLP", "Transformers", "LSTM", "EDA"],
                "projects": [
                    {"title": "CNN-LSTM Intrusion Detection System (IDS)", "desc": "Network traffic anomaly detection using CNN-LSTM."},
                    {"title": "News Summarizer", "desc": "Automated news summarizer with Flask API."},
                    {"title": "Book Recommendation System", "desc": "Collaborative filtering book recommendation engine."}
                ],
                "company_name": "Capgemini",
                "package_lpa": 6.2
            },
            {
                "full_name": "NARMADHA B",
                "roll_number": "23AIA61",
                "email": "23aia61narmadha@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "Data Engineer, Data Analyst, ML Engineer",
                "skills": ["Python", "SQL", "Excel", "Power BI", "ML", "Deep Learning", "OpenCV", "LSTM"],
                "projects": [
                    {"title": "Social Media & Retail Sales Analysis Dashboard", "desc": "Combined sentiment and retail point-of-sale analytics."},
                    {"title": "Calorie Burn Predictor", "desc": "Fitness tracker calorie prediction algorithm."},
                    {"title": "PDF Visualization Summarizer", "desc": "Converts PDF documents into interactive visual graphs."}
                ],
                "company_name": "NTT Data",
                "package_lpa": 5.8
            },
            {
                "full_name": "MAHADARSHINI S",
                "roll_number": "23AIA53",
                "email": "23aia53mahadarshini@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "ML Engineer, Software Engineer, AI Engineer",
                "skills": ["Python", "Java", "React", "Flask", "SQL", "OpenCV", "LLM"],
                "projects": [
                    {"title": "AI Coaching Voice Agent", "desc": "Speech-to-speech AI mock interviewer for placement training."},
                    {"title": "Accident Detection and Emergency Alert System", "desc": "OpenCV highway accident detector sending instant SMS alert."}
                ],
                "company_name": "Renault Nissan",
                "package_lpa": 6.4
            },
            {
                "full_name": "SANJAY AKASH V",
                "roll_number": "23AIB25",
                "email": "23aib25sanjayakash@soi.kgkite.ac.in",
                "department": "B.TECH AI & DS",
                "role_choice": "ML Engineer / AI Engineer / GenAI Engineer",
                "skills": ["Python", "SQL", "Machine Learning", "RAG", "FAISS", "OpenCV", "Pandas", "NumPy", "Scikit-learn"],
                "projects": [
                    {"title": "AI Legal Help Desk (RAG + FAISS)", "desc": "High speed FAISS vector search across legal databases."},
                    {"title": "AI Referee Assistance System (YOLOv8 + CV)", "desc": "Offside and ball tracking for sports matches using YOLOv8."},
                    {"title": "Exoplanet Detection using NASA Kepler Dataset", "desc": "Machine learning prediction of exoplanets from light curves."}
                ],
                "company_name": "LTI Mindtree",
                "package_lpa": 7.5
            },
            {
                "full_name": "Dharun Kumar S",
                "roll_number": "23IT09",
                "email": "23it09dharunkumar@soi.kgkite.ac.in",
                "department": "B.TECH IT",
                "role_choice": "AI Engineer / ML Engineer / GenAI Engineer",
                "skills": ["Python", "SQL", "PyTorch", "TensorFlow", "FastAPI", "React", "Deep Learning", "NLP", "RAG", "HuggingFace", "Vector DBs"],
                "projects": [
                    {"title": "Intelligent Document Question Answering System", "desc": "Enterprise document Q&A engine handling complex PDF tables."},
                    {"title": "Waste Type Classification (IIT Hyderabad Internship)", "desc": "YOLOv8 image classification sorting recyclable waste."},
                    {"title": "Weather Trend Prediction", "desc": "Time-series forecasting model for local rainfall."},
                    {"title": "AI-Based Ancient Tamil Script Translation", "desc": "Deep learning OCR translating ancient Palm-leaf Inscriptions."},
                    {"title": "Dynamic Player Transfer Value Prediction", "desc": "Sports analytics model predicting football player market values."}
                ],
                "company_name": "Bosch Global Software",
                "package_lpa": 8.2
            }
        ]

        for s_data in placement_students_data:
            user = models.User(
                email=s_data["email"],
                password_hash=get_password_hash("student123"),
                full_name=s_data["full_name"],
                role="student",
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={s_data['roll_number']}"
            )
            db.add(user)
            db.flush()

            tier = "Tier 1" if s_data["package_lpa"] >= 7.5 else ("Tier 2" if s_data["package_lpa"] >= 6.0 else "Tier 3")

            sp = models.StudentProfile(
                user_id=user.id,
                roll_number=s_data["roll_number"],
                batch="SOI Placement Batch",
                department=s_data["department"],
                placement_status="Placed",
                company_tier=tier,
                company_name=s_data["company_name"],
                package_lpa=s_data["package_lpa"],
                github_url=f"https://github.com/{s_data['roll_number'].lower()}",
                leetcode_url=f"https://leetcode.com/{s_data['roll_number'].lower()}",
                linkedin_url=f"https://linkedin.com/in/{s_data['roll_number'].lower()}",
                resume_url="https://drive.google.com/sample_resume",
                skills=s_data["skills"],
                attendance_pct=92.5
            )
            db.add(sp)
            db.flush()

            for p_info in s_data["projects"]:
                proj = models.LabProject(
                    title=p_info["title"],
                    description=p_info["desc"],
                    tech_stack=s_data["skills"][:4],
                    accuracy_metric="96.2% F1-Score",
                    github_url=f"https://github.com/{s_data['roll_number'].lower()}/{p_info['title'].lower().replace(' ', '-')}",
                    demo_url="https://demo.soi.kgkite.ac.in",
                    status="Verified",
                    batch="SOI Placement Batch",
                    student_id=user.id,
                    assigned_faculty_id=faculty_1.id
                )
                db.add(proj)

        # 4. Authentic 2nd Year Students (Transcribed from 2nd YRS Sheet)
        second_year_students = [
            {"name": "ANITHA K", "roll": "711724UAAD111", "email": "24uad111anitha@soi.kgkite.ac.in"},
            {"name": "ANUSHA A", "roll": "711724UAAD112", "email": "24uad112anusha@soi.kgkite.ac.in"},
            {"name": "BAVITHRA S", "roll": "711724UAAD118", "email": "24uad118bavithra@soi.kgkite.ac.in"},
            {"name": "DHIVYA LAXMI S S", "roll": "711724UAAD127", "email": "24uad127dhivya@soi.kgkite.ac.in"},
            {"name": "GOKUL P P", "roll": "711724UAAD131", "email": "24uad131gokul@soi.kgkite.ac.in"},
            {"name": "GURUPRASATH S", "roll": "711724UAAD135", "email": "24uad135guru@soi.kgkite.ac.in"},
        ]

        for s in second_year_students:
            user = models.User(
                email=s["email"],
                password_hash=get_password_hash("student123"),
                full_name=s["name"],
                role="student",
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={s['roll']}"
            )
            db.add(user)
            db.flush()

            sp = models.StudentProfile(
                user_id=user.id,
                roll_number=s["roll"],
                batch="2nd Year AI & DS Batch",
                department="AI & DS",
                placement_status="Unplaced",
                company_tier="N/A",
                company_name=None,
                package_lpa=0.0,
                skills=["Python", "Data Structures", "OpenCV", "Machine Learning"],
                attendance_pct=94.0
            )
            db.add(sp)
            db.flush()

            proj = models.LabProject(
                title=f"AI Prototype - {s['name'].split()[0]}",
                description="2nd Year AI & DS vertical hands-on computer vision project.",
                tech_stack=["Python", "OpenCV"],
                accuracy_metric="92.0%",
                status="Pending",
                batch="2nd Year AI & DS Batch",
                student_id=user.id,
                assigned_faculty_id=faculty_2.id
            )
            db.add(proj)

        # 5. Department Announcements
        ann1 = models.Announcement(
            title="School of Innovation - AI & DS Vertical Hackathon 2026",
            content="Registration is now open for the annual AI & DS Innovation Hackathon. Submit your prototype projects via the portal for faculty verification.",
            target_batch="All Batches",
            priority="High",
            posted_by_id=admin_user.id
        )
        db.add(ann1)

        ann2 = models.Announcement(
            title="SOI Placement Batch - Mock Technical Review",
            content="All SOI placement batch students must ensure their GitHub, LeetCode, and project repository URLs are updated in their portfolio profile before Friday.",
            target_batch="SOI Placement Batch",
            priority="Urgent",
            posted_by_id=admin_user.id
        )
        db.add(ann2)

        db.commit()
        print("Database populated successfully with authentic AI & DS student data!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
