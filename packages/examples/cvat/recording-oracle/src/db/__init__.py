import sqlalchemy
from sqlalchemy.orm import declarative_base, sessionmaker

import src.utils.logging
from src.core.config import Config

DATABASE_URL = Config.postgres_config.connection_url()
engine = sqlalchemy.create_engine(
    DATABASE_URL,
    echo="debug" if Config.loglevel <= src.utils.logging.TRACE else False,
    connect_args={"options": f"-c lock_timeout={Config.postgres_config.lock_timeout:d}"},
)
SessionLocal = sessionmaker(autocommit=False, bind=engine)

Base = declarative_base()
