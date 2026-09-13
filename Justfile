default:
    just --list

# Run both frontend and backend (Ctrl-C stops both)
dev:
    just frontend &
    just backend

# Start frontend dev server
frontend:
    npm --prefix frontend run dev

# Start backend via Docker Compose with watch mode
backend:
    docker compose --env-file .env.compose up --watch

# Stop backend containers
down:
    docker compose --env-file .env.compose down

# Build Docker image
build:
    docker build -t times-z -f Dockerfile.web .

# Build and run Docker container
run:
    docker build -t times-z -f Dockerfile.web .
    docker run times-z

# Copy env template if .env.compose doesn't exist
setup:
    @if [ ! -f .env.compose ]; then cp .env.compose.example .env.compose && echo "Created .env.compose — fill in your values"; else echo ".env.compose already exists"; fi

# Lint frontend
lint:
    npm --prefix frontend run lint

# Build frontend for production
build-frontend:
    npm --prefix frontend run build
