# Time-Z

## Setup
Copy the env template and fill in your own values:
- `cp .env.compose.example .env.compose`

## Dev environment
- `docker compose --env-file .env.compose up --watch`
- `docker compose --env-file .env.compose down`

`--env-file` is required: compose reads `${...}` from it, not from `env_file:`.

## Docker
- `docker build -t times-z -f Dockerfile.web .`
- `docker run times-z`
