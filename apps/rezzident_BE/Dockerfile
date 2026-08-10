# ── Build Stage ──
FROM python:3.11-slim AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Production Stage ──
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs media tmp/media

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash rezzident \
    && chown -R rezzident:rezzident /app

USER rezzident

EXPOSE 7001

CMD ["gunicorn", "main:app", \
     "--bind", "0.0.0.0:7001", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--timeout", "120"]
