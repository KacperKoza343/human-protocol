from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI

from src.core.config import Config
from src.crons.cvat.state_trackers import (
    track_assignments,
    track_completed_escrows,
    track_completed_projects,
    track_completed_tasks,
    track_escrow_creation,
    track_escrow_validations,
    track_task_creation,
)
from src.crons.webhooks.job_launcher import (
    process_incoming_job_launcher_webhooks,
    process_outgoing_job_launcher_webhooks,
)
from src.crons.webhooks.recording_oracle import (
    process_incoming_recording_oracle_webhook_job_completed,
    process_incoming_recording_oracle_webhooks,
    process_outgoing_recording_oracle_webhooks,
)
from src.crons.webhooks.reputation_oracle import process_incoming_reputation_oracle_webhooks


def setup_cron_jobs(app: FastAPI) -> None:
    @app.on_event("startup")
    def cron_record():
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            process_incoming_job_launcher_webhooks,
            "interval",
            seconds=Config.cron_config.process_job_launcher_webhooks_int,
        )
        scheduler.add_job(
            process_outgoing_job_launcher_webhooks,
            "interval",
            seconds=Config.cron_config.process_job_launcher_webhooks_int,
        )
        scheduler.add_job(
            process_incoming_recording_oracle_webhooks,
            "interval",
            seconds=Config.cron_config.process_recording_oracle_webhooks_int,
        )
        scheduler.add_job(
            process_incoming_recording_oracle_webhook_job_completed,
            "interval",
            seconds=Config.cron_config.process_recording_oracle_webhooks_int,
        )
        scheduler.add_job(
            process_outgoing_recording_oracle_webhooks,
            "interval",
            seconds=Config.cron_config.process_recording_oracle_webhooks_int,
        )
        scheduler.add_job(
            process_incoming_reputation_oracle_webhooks,
            "interval",
            seconds=Config.cron_config.process_reputation_oracle_webhooks_int,
        )
        scheduler.add_job(
            track_completed_projects,
            "interval",
            seconds=Config.cron_config.track_completed_projects_int,
        )
        scheduler.add_job(
            track_completed_tasks,
            "interval",
            seconds=Config.cron_config.track_completed_tasks_int,
        )
        scheduler.add_job(
            track_completed_escrows,
            "interval",
            seconds=Config.cron_config.track_completed_escrows_int,
        )
        scheduler.add_job(
            track_escrow_validations,
            "interval",
            seconds=Config.cron_config.track_escrow_validations_int,
        )
        scheduler.add_job(
            track_task_creation,
            "interval",
            seconds=Config.cron_config.track_creating_tasks_int,
        )
        scheduler.add_job(
            track_escrow_creation,
            "interval",
            seconds=Config.cron_config.track_escrow_creation_int,
        )
        scheduler.add_job(
            track_assignments,
            "interval",
            seconds=Config.cron_config.track_assignments_int,
        )
        scheduler.start()
