import random
import uuid
from string import ascii_letters
from uuid import uuid4

from fastapi import HTTPException
from starlette.responses import Response

from src.config import Config
from src.db import Session, Statuses, JobRequest, AnnotationProject


def assert_http_error_response(response: Response, error: HTTPException):
    assert response.status_code == error.status_code
    assert response.json()["detail"] == error.detail


def assert_no_entries_in_db(entry_type):
    with Session() as s:
        jobs = s.query(entry_type).all()
        assert len(jobs) == 0


def random_address(seed=None):
    if seed is not None:
        random.seed(seed)
    return "0x" + "".join([str(random.randint(0, 9)) for _ in range(40)])


def random_username(seed=None):
    if seed is not None:
        random.seed(seed)
    return "TEST_USER_" + ''.join(random.choices(ascii_letters, k=16))


def random_escrow_info(seed=None):
    if seed is not None:
        random.seed(seed)
    escrow_address = random_address()
    chain_id = Config.localhost.chain_id
    info = {
        "escrow_address": escrow_address,
        "chain_id": chain_id
    }
    return info, escrow_address, chain_id


def random_userinfo(seed=None):
    if seed is not None:
        random.seed(seed)
    address = random_address(seed)
    name = random_username(seed)
    return {"worker_address": address, "name": name}, address, name


def is_valid_uuid(obj):
    try:
        uuid.UUID(str(obj), version=4)
        return True
    except ValueError:
        return False


def add_job_request(status: Statuses=Statuses.pending):
    _, escrow_address, chain_id = random_escrow_info()
    job_id = str(uuid4())

    with Session() as session:
        session.add(JobRequest(id=job_id, escrow_address=escrow_address, chain_id=chain_id, status=status))
        session.commit()
    return job_id


def add_projects_to_job_request(job_id: str, n_projects: int, status: Statuses):
    with Session() as session:
        job = session.query(JobRequest).where(JobRequest.id == job_id).one()
        projects = []
        for i in range(n_projects):
            project = AnnotationProject(id=i, name=str(job.id) + f'__{i}', job_request=job, status=status)
            session.add(project)
            projects.append(project)
        session.commit()
    return projects