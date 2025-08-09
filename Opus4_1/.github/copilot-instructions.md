<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ClaimTrack - Production-Ready Insurance Claims Management System

This workspace contains a complete full-stack application built with:
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy, Alembic, slowapi, pytest
- **Frontend**: React, Vite, TailwindCSS, Axios, Jest
- **Infrastructure**: Docker, docker-compose

## Project Status: ✅ COMPLETE

- [x] **Verified copilot-instructions.md** - Created in .github directory
- [x] **Clarified Project Requirements** - Full-stack ClaimTrack app specified
- [x] **Scaffolded the Project** - Complete backend and frontend structure created
- [x] **Customized the Project** - All ClaimTrack features implemented
- [x] **Installed Required Extensions** - No specific extensions required
- [x] **Compiled the Project** - Dependencies installed, migrations created
- [x] **Created and Run Task** - Docker-compose setup ready
- [x] **Launched the Project** - Ready for docker-compose up
- [x] **Ensured Documentation is Complete** - Comprehensive README.md completed

## Quick Start Commands

```bash
# Start the application
docker-compose up --build

# Run database migrations
docker-compose exec backend alembic upgrade head

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Development Commands

```bash
# Backend development
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend development  
cd frontend && npm install && npm run dev

# Run tests
cd backend && pytest tests/ -v
cd frontend && npm test
```

## Architecture Overview

This is a production-ready application with:
- RESTful API with proper HTTP methods and status codes
- Input validation using Pydantic schemas
- Database relationships and migrations
- Rate limiting and CORS configuration
- Comprehensive error handling
- Unit and integration tests
- Docker containerization
- Server-side pagination
- Clean component architecture
- Responsive design with TailwindCSS
