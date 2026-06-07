# 1 - Download & Install Python 3.14.4
FROM python:3.14.4-slim

# Set Python-related environment variables early
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install OS dependencies for our mini vm
# Note: We do the cleanup (rm -rf) in the same step to keep the image layer small
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libjpeg-dev \
    libcairo2 \
    gcc \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- UV SETUP ---
# Copy uv directly from the official image (Best practice for Docker)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Create a virtual environment using uv (blazing fast)
RUN uv venv /opt/venv

# Set the virtual environment as the current location
ENV PATH="/opt/venv/bin:$PATH"
# ----------------

# Set the working directory to the code directory
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt /tmp/requirements.txt

# Install the Python project requirements using uv
# (Because we set the PATH above, uv automatically knows to install these into /opt/venv)
RUN uv pip install -r /tmp/requirements.txt

# Copy the project code into the container's working directory
COPY ./src /code

# Make the bash script executable
COPY ./boot/docker-run.sh /opt/run.sh
RUN chmod +x /opt/run.sh

# Run the FastAPI project via the runtime script when the container starts
CMD ["/opt/run.sh"]