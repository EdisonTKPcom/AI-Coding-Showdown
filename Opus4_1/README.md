# ClaimTrack - Production-Ready Insurance Claims Management System

A full-stack application built with FastAPI (backend) and React (frontend) for managing insurance claims efficiently.

## 🌟 Features

- ✅ **Create Claims**: Submit insurance claims with policy ID, amount, description, and incident date
- ✅ **View Claims**: List all claims with server-side pagination and status filtering
- ✅ **Approve Claims**: One-click approval for pending claims
- ✅ **Input Validation**: Client-side and server-side validation with Pydantic
- ✅ **Rate Limiting**: 10 requests per minute using slowapi
- ✅ **Database Migrations**: Alembic for database schema management
- ✅ **Comprehensive Testing**: Backend (pytest) and frontend (Jest) test suites
- ✅ **Docker Support**: Complete containerization with docker-compose
- ✅ **Production Ready**: Security, error handling, and logging

## 📁 Project Structure

```
ClaimTrack/
├── .github/
│   └── copilot-instructions.md     # GitHub Copilot instructions
├── backend/                        # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application
│   │   ├── database.py             # Database configuration
│   │   ├── config.py               # Application settings
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── claim.py            # SQLAlchemy Claim model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── claim.py            # Pydantic schemas
│   │   └── api/
│   │       ├── __init__.py
│   │       └── claims.py           # Claims API endpoints
│   ├── alembic/                    # Database migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── tests/                      # Backend tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_claims.py
│   ├── alembic.ini                 # Alembic configuration
│   ├── requirements.txt            # Python dependencies
│   ├── init.sql                    # Database initialization
│   └── Dockerfile                  # Backend container
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClaimForm.jsx       # Claim creation form
│   │   │   ├── ClaimTable.jsx      # Claims list table
│   │   │   └── Dashboard.jsx       # Main dashboard
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── __tests__/              # Frontend tests
│   │   │   ├── ClaimForm.test.jsx
│   │   │   └── ClaimTable.test.jsx
│   │   ├── App.jsx                 # Main App component
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # TailwindCSS styles
│   │   └── setupTests.js           # Test configuration
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # NPM dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # TailwindCSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── jest.config.js              # Jest configuration
│   └── Dockerfile                  # Frontend container
├── docker-compose.yml              # Multi-container setup
├── .env                            # Environment variables
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone and Start
```bash
git clone <repository-url>
cd ClaimTrack
docker-compose up --build
```

### 2. Run Database Migrations
```bash
docker-compose exec backend alembic upgrade head
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (postgres/password)

## 🛠️ Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://postgres:password@localhost:5432/claimtrack"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Migrations
```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 📋 API Endpoints

### Claims API
- `POST /api/v1/claims/` - Create a new claim
- `GET /api/v1/claims/` - List claims (with pagination and filtering)
- `PUT /api/v1/claims/{id}/approve` - Approve a claim

### System
- `GET /` - Root endpoint with rate limiting
- `GET /health` - Health check

### Query Parameters for GET /claims/
- `status` - Filter by status (`pending`, `approved`, `rejected`)
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 10, max: 100)

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/claimtrack

# API Settings
ENVIRONMENT=development
DEBUG=true
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60

# Frontend
VITE_API_URL=http://localhost:8000
```

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database schema management
- **Validation**: Pydantic for request/response validation
- **Rate Limiting**: slowapi middleware
- **Testing**: pytest with httpx for async testing

### Frontend (React)
- **Framework**: React with functional components and hooks
- **Build Tool**: Vite for fast development and builds
- **Styling**: TailwindCSS for utility-first styling
- **HTTP Client**: Axios for API communication
- **Testing**: Jest with React Testing Library

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Database**: PostgreSQL 15 with health checks
- **Networking**: Custom Docker network for service communication

## 🔒 Security Features

- Input validation on both client and server
- SQL injection prevention with SQLAlchemy ORM
- Rate limiting to prevent abuse
- CORS configuration for frontend access
- Error handling without information leakage
- Non-root user in Docker containers

## 📊 Monitoring & Health Checks

- Health check endpoints for all services
- Docker health checks for container orchestration
- Comprehensive error logging
- Request/response interceptors for debugging

## 🚀 Deployment

### Production Deployment
1. Update environment variables for production
2. Configure proper database credentials
3. Set up SSL/TLS certificates
4. Configure reverse proxy (nginx/traefik)
5. Set up monitoring and logging

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using FastAPI, React, PostgreSQL, and Docker**
