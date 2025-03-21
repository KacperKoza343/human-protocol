FROM python:3.10

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y jq ffmpeg libsm6 libxext6 && \
    pip install --no-cache poetry

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root \
    && poetry cache clear pypi --all

COPY . .

RUN rm -f ./src/.env

CMD ["pytest", "-W", "ignore::DeprecationWarning", "-v"]