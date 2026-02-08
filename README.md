# NL Query System

A Natural Language to SQL Query System that allows users to ask questions in plain English and get database results powered by AI.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black)
![Tech Stack](https://img.shields.io/badge/Node.js-20-green)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-15-blue)
![Tech Stack](https://img.shields.io/badge/Docker-Enabled-blue)

## 🎯 Project Overview

This full-stack application demonstrates the integration of modern web technologies with AI to create an intelligent database query interface. Users can ask questions in natural language, and the system uses Google's Gemini AI to convert these questions into SQL queries, execute them, and return human-readable answers.

## 🏗️ Architecture
```
┌──────────────────────────────────────────────────────────┐
│                    User's Browser                         │
│                  (http://localhost:3000)                  │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │         Next.js Frontend (TypeScript)          │     │
│  │  • Natural language input interface            │     │
│  │  • Real-time response display                  │     │
│  │  • SQL query visualization                     │     │
│  └──────────────────┬─────────────────────────────┘     │
└────────────────────┼──────────────────────────────────┘
                      │ HTTP REST API
                      ▼
┌──────────────────────────────────────────────────────────┐
│              Node.js Backend (Express)                    │
│              (http://localhost:3001)                      │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │         AI Agent (Google Gemini)               │     │
│  │  1. Natural language → SQL conversion          │     │
│  │  2. Query execution                            │     │
│  │  3. Result → Natural language formatting       │     │
│  └──────────────────┬─────────────────────────────┘     │
└────────────────────┼──────────────────────────────────┘
                      │ SQL Queries
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PostgreSQL Database (Docker Container)            │
│                                                           │
│  • Users table (5 sample users)                          │
│  • Orders table (9 sample orders)                        │
└──────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Google Gemini AI** - Natural language processing

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git & GitHub** - Version control

### Testing
- **Jest** - Testing framework
- **Supertest** - API testing
- **React Testing Library** - Component testing

## ✨ Features

- 🤖 **AI-Powered Queries**: Convert natural language to SQL using Google Gemini
- 💬 **Interactive UI**: Clean, responsive interface built with Next.js
- 🔍 **Query Transparency**: View generated SQL queries
- 📊 **Data Visualization**: See both raw data and natural language answers
- 🐳 **Fully Dockerized**: One-command setup with Docker Compose
- ✅ **Tested**: Comprehensive test coverage for backend and frontend
- 🔒 **Secure**: Environment variable management, input validation

## 📦 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/suhal1060/nl-query-system.git
   cd nl-query-system
```

2. **Create environment file**
```bash
   # Create .env file in project root
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

3. **Start all services with Docker**
```bash
   docker compose up --build
```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

### Without Docker (Local Development)

#### Backend
```bash
cd backend
npm install
cp .env.example .env  # Add your API keys
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

## 📝 Sample Queries

Try these natural language questions:

- "How many users ordered in the last month?"
- "What is the total revenue from all orders?"
- "Show me all users who placed orders"
- "What is the average order amount?"
- "How many orders are completed?"

## 🗂️ Project Structure
```
nl-query-system/
├── frontend/              # Next.js application
│   ├── app/              # Next.js app directory
│   │   └── page.tsx      # Main page component
│   ├── __tests__/        # Frontend tests
│   ├── Dockerfile        # Frontend Docker config
│   └── package.json
│
├── backend/              # Node.js API server
│   ├── server.js         # Express server
│   ├── db.js             # Database connection
│   ├── ai-agent-gemini.js # AI integration
│   ├── __tests__/        # Backend tests
│   ├── Dockerfile        # Backend Docker config
│   └── package.json
│
├── database/             # Database initialization
│   └── init.sql          # Sample data schema
│
├── docker-compose.yml    # Multi-container orchestration
├── DOCKER.md            # Docker documentation
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

**Root `.env`** (for Docker Compose):
```bash
GEMINI_API_KEY=your_api_key_here
```

**Backend `.env`**:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=nlquery_db
PORT=3001
GEMINI_API_KEY=your_api_key_here
```

**Frontend `.env.local`**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Kill process
sudo kill -9 <PID>
```

### Docker Issues
```bash
# Stop all containers
docker compose down

# Remove all containers and volumes
docker compose down -v

# Rebuild from scratch
docker compose up --build
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

## 🚀 Deployment

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.

The application can be deployed to:
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, AWS ECS
- **Database**: AWS RDS, Supabase, DigitalOcean

## 📚 Learning Outcomes

This project demonstrates proficiency in:

- Full-stack development (Frontend + Backend + Database)
- RESTful API design and implementation
- AI/ML integration (Google Gemini API)
- Database design and SQL queries
- Docker containerization
- Testing (Unit, Integration, Component tests)
- Git version control
- TypeScript/JavaScript development
- Modern React with Next.js
- Environment configuration management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Suhail**
- GitHub: [@suhail1060](https://github.com/suhail1060)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/suhailkhani/)
- Email: suhailkhan.i1060@gmail.com

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- Next.js team for the amazing framework
- PostgreSQL community
- Docker for containerization

## 📊 Project Stats

- **Lines of Code**: ~2000+
- **Test Coverage**: Backend 80%+, Frontend 85%+
- **Technologies Used**: 10+
- **Development Time**: 3 weeks

---

⭐ **Star this repository if you found it helpful!**