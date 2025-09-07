# backend-dev/ml_service/Dockerfile
FROM python:3.12

WORKDIR /app

COPY ./app ./app
# COPY ./ml_models ./ml_models
COPY ./model ./model

COPY requirements.txt ./

COPY ./databases ./databases

COPY ./alembic.ini ./

COPY ./init_db.py ./

COPY ./data/flights_processed_for_analytics.parquet ./data/flights_processed_for_analytics.parquet
# Use OpenJDK 21 for Debian trixie/arm64 (Linux compatible)
RUN apt-get update && apt-get install -y openjdk-21-jre
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-arm64
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]