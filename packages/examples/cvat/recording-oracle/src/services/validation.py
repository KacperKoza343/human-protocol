import uuid

from sqlalchemy import func, update
from sqlalchemy.orm import Session

from src.core.gt_stats import GtKey, ValidationFrameStats
from src.db import engine as db_engine
from src.db.utils import ForUpdateParams
from src.db.utils import maybe_for_update as _maybe_for_update
from src.models.validation import GtStats, Job, Task, ValidationResult


def create_task(session: Session, escrow_address: str, chain_id: int) -> str:
    obj_id = str(uuid.uuid4())
    obj = Task(id=obj_id, escrow_address=escrow_address, chain_id=chain_id)

    session.add(obj)

    return obj_id


def get_task_by_escrow_address(
    session: Session, escrow_address: str, *, for_update: bool | ForUpdateParams = False
) -> Task | None:
    return (
        _maybe_for_update(session.query(Task), enable=for_update)
        .where(Task.escrow_address == escrow_address)
        .first()
    )


def get_task_by_id(
    session: Session, task_id: str, *, for_update: bool | ForUpdateParams = False
) -> Task | None:
    return (
        _maybe_for_update(session.query(Task), enable=for_update).where(Task.id == task_id).first()
    )


def get_task_validation_results(
    session: Session, task_id: str, *, for_update: bool | ForUpdateParams = False
) -> list[ValidationResult]:
    return (
        _maybe_for_update(session.query(ValidationResult), enable=for_update)
        .where(ValidationResult.job.has(Job.task_id == task_id))
        .all()
    )


def update_escrow_iteration(session: Session, escrow_address: str, chain_id: int, iteration: int):
    expression = (
        update(Task)
        .where(Task.escrow_address == escrow_address, Task.chain_id == chain_id)
        .values(iteration=iteration)
    )

    session.execute(expression)


def mark_escrow_as_cleaned(session: Session, escrow_address: str, chain_id: int):
    expression = (
        update(Task)
        .where(Task.escrow_address == escrow_address, Task.chain_id == chain_id)
        .values(cleaned_at=func.now())
    )

    session.execute(expression)


def create_job(session: Session, job_cvat_id: int, task_id: str) -> str:
    obj_id = str(uuid.uuid4())
    obj = Job(id=obj_id, cvat_id=job_cvat_id, task_id=task_id)

    session.add(obj)

    return obj_id


def get_job_by_cvat_id(
    session: Session, job_cvat_id: int, *, for_update: bool | ForUpdateParams = False
) -> Job | None:
    return (
        _maybe_for_update(session.query(Job), enable=for_update)
        .where(Job.cvat_id == job_cvat_id)
        .first()
    )


def get_job_by_id(
    session: Session, job_id: str, *, for_update: bool | ForUpdateParams = False
) -> Job | None:
    return _maybe_for_update(session.query(Job), enable=for_update).where(Job.id == job_id).first()


def create_validation_result(
    session: Session,
    job_id: str,
    annotator_wallet_address: str,
    annotation_quality: float,
    assignment_id: str,
) -> str:
    obj_id = str(uuid.uuid4())
    obj = ValidationResult(
        id=obj_id,
        job_id=job_id,
        annotator_wallet_address=annotator_wallet_address,
        annotation_quality=annotation_quality,
        assignment_id=assignment_id,
    )

    session.add(obj)

    return obj_id


def get_validation_result_by_assignment_id(
    session: Session, assignment_id: str, *, for_update: bool | ForUpdateParams = False
) -> ValidationResult | None:
    return (
        _maybe_for_update(session.query(ValidationResult), enable=for_update)
        .where(ValidationResult.assignment_id == assignment_id)
        .first()
    )


def get_task_gt_stats(
    session: Session, task_id: str, *, for_update: bool | ForUpdateParams = False
) -> list[GtStats]:
    return (
        _maybe_for_update(session.query(GtStats), enable=for_update)
        .where(GtStats.task_id == task_id)
        .all()
    )


def update_gt_stats(
    session: Session, task_id: str, updated_gt_stats: dict[GtKey, ValidationFrameStats]
):
    # Read more about upsert:
    # https://docs.sqlalchemy.org/en/20/orm/queryguide/dml.html#orm-upsert-statements

    if not updated_gt_stats:
        return

    if db_engine.driver != "psycopg2":
        raise NotImplementedError

    from sqlalchemy.dialects.postgresql import insert as psql_insert
    from sqlalchemy.inspection import inspect

    statement = psql_insert(GtStats).values(
        [
            {
                "task_id": task_id,
                "gt_frame_name": gt_key.filename,
                "label_set": GtStats.encode_label_set(gt_key.labels),
                "failed_attempts": val_frame_stats.failed_attempts,
                "accepted_attempts": val_frame_stats.accepted_attempts,
                "accumulated_quality": val_frame_stats.accumulated_quality,
                "total_uses": val_frame_stats.total_uses,
                "enabled": val_frame_stats.enabled,
            }
            for gt_key, val_frame_stats in updated_gt_stats.items()
        ],
    )
    statement = statement.on_conflict_do_update(
        index_elements=inspect(GtStats).primary_key, set_=statement.excluded
    )

    session.execute(statement)
