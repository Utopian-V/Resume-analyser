from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, Boolean, Date, Text
from sqlalchemy.future import select
import os
import ssl

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"ssl": ssl_context},
    echo=True,
)

async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

router = APIRouter()

class JobDB(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    location = Column(String)
    description = Column(Text)
    requirements = Column(Text)
    salary_range = Column(String)
    posted_date = Column(Date)
    application_deadline = Column(String)
    source = Column(String)
    source_url = Column(String)
    category = Column(String)
    employment_type = Column(String)
    experience_level = Column(String)
    remote_friendly = Column(Boolean)
    government_job = Column(Boolean)

@router.get("/api/apple-jobs")
def get_apple_jobs():
    file_path = os.path.join(os.path.dirname(__file__), '../jobs_data/jobs_apple.com.json')
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    return FileResponse(file_path, media_type="application/json")

@router.get("/test", response_class=HTMLResponse)
async def test_view():
    async with async_session() as session:
        result = await session.execute(select(JobDB))
        jobs = result.scalars().all()

    table_html = """
    <html>
    <head><title>Jobs Table</title></head>
    <body>
    <h2>Jobs from Neon Database</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr>
                <th>ID</th><th>Title</th><th>Company</th><th>Location</th><th>Posted Date</th>
            </tr>
        </thead>
        <tbody>
    """
    for job in jobs:
        table_html += f"""
        <tr>
            <td>{job.id}</td>
            <td>{job.title}</td>
            <td>{job.company}</td>
            <td>{job.location}</td>
            <td>{job.posted_date}</td>
        </tr>
        """
    table_html += """
        </tbody>
    </table>
    </body>
    </html>
    """
    return HTMLResponse(content=table_html)


app = FastAPI()
app.include_router(router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created and DB connection successful!")
