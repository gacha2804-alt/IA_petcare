# Dockerfile para PetCare Backend (FastAPI)
# Usado como alternativa si Render no detecta el runtime automáticamente

FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema para psycopg (PostgreSQL)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
