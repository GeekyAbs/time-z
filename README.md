# ChronoFlow

A real-time traffic analytics dashboard built on top of a FastAPI + TimescaleDB time-series pipeline. Visualizes live page-view events as animated charts — a traffic simulator generates weighted random hits, and the dashboard reacts within seconds.

<p>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/TimescaleDB-FDB515?style=flat&logo=timescale&logoColor=white" alt="TimescaleDB">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker">
</p>

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) (for the frontend)
- [just](https://just.systems/) (optional, for convenience commands)

## Getting Started

1. **Copy the env template** and fill in your values:

   ```sh
   just setup
   ```

2. **Run everything** (frontend + backend):

   ```sh
   just dev
   ```

   This starts the Vite dev server and Docker Compose in parallel. Press `Ctrl-C` to stop both.

3. **Open the dashboard** at [http://localhost:5173](http://localhost:5173)

### Other Commands

| Command | Description |
|---|---|
| `just frontend` | Start only the frontend dev server |
| `just backend` | Start only the backend via Docker Compose |
| `just down` | Stop backend containers |
| `just build` | Build the Docker image |
| `just lint` | Lint the frontend |

Run `just --list` to see all available recipes.

## Architecture

```
frontend/          React + Vite (TypeScript)
src/               FastAPI backend
compose.yml        Docker Compose with TimescaleDB
```

The backend serves the API on port `8002` and stores events in a TimescaleDB hypertable. The frontend polls `GET /api/events/` and renders live traffic charts. Use the **Simulate Traffic** button on the dashboard (or the notebook in `notebooks/`) to generate sample events.
