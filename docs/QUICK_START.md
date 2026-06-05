# 🚀 Quick Start Guide - Backend Setup

Get the Kugoo backend running in 5 minutes.

---

## 📋 Prerequisites

```bash
✅ Node.js 18+ installed
✅ npm 9+ or yarn 3+ installed
✅ PostgreSQL 14+ installed & running
✅ Redis installed & running
✅ Git installed
```

---

## 🔧 Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/div00000/kugooapp.git
cd kugooapp
```

### Step 2: Install Dependencies

```bash
cd backend
npm install
# or
yarn install
```

### Step 3: Create Environment File

```bash
cp .env.example .env.development
```

### Step 4: Configure Environment Variables

Edit `backend/.env.development` and add your API keys:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kugoo_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_super_secret_key_here_change_this
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email

# Payment (Paystack example)
PAYSTACK_SECRET_KEY=sk_test_your_key
PAYSTACK_PUBLIC_KEY=pk_test_your_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key

# OpenAI (Zaam AI)
OPENAI_API_KEY=sk_your_api_key

# Email (SendGrid)
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@kugoo.app
```

### Step 5: Create Database

```bash
# Create database
createdb kugoo_dev

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### Step 6: Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Server running on http://localhost:5000
✅ Database connected
✅ Redis connected
✅ API ready at http://localhost:5000/api/v1
```

---

## ✅ Verify Installation

### Test Health Endpoint

```bash
curl http://localhost:5000/api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-06-05T01:50:00Z",
  "database": "connected",
  "redis": "connected"
}
```

### Test Sign Up

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "firstName": "Test",
    "lastName": "User",
    "accountType": "customer"
  }'
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── database/        # Migrations & seeds
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example         # Environment template
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

---

## 🔑 Key npm Scripts

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm start                # Start production build

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:reset         # Reset database

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting errors
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript
```

---

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Create database if not exists
createdb kugoo_dev
```

### Issue: Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
redis-server
```

### Issue: Environment Variables Not Loaded

```bash
# Ensure .env file is in backend directory
ls -la backend/.env.development

# Verify format (no spaces around =)
cat backend/.env.development | head -5
```

### Issue: Port 5000 Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 🔒 Security Tips

✅ **DO:**
- Use strong JWT_SECRET (32+ characters)
- Keep .env file in .gitignore
- Use environment variables for all secrets
- Enable HTTPS in production
- Rotate API keys regularly

❌ **DON'T:**
- Commit .env files to git
- Use default passwords
- Log sensitive data
- Hardcode secrets in code
- Share API keys

---

## 📚 Next Steps

1. **Read API Documentation:** `/docs/API.md`
2. **Database Schema:** `/docs/DATABASE_SCHEMA.md`
3. **Environment Setup:** `/docs/ENVIRONMENT_SETUP.md`
4. **Deployment Guide:** `/docs/DEPLOYMENT.md`

---

## 💬 Need Help?

- 📖 Check `/docs` folder for detailed guides
- 🐛 Report issues on GitHub
- 📧 Email: support@kugoo.app

---

**Happy coding! 🚀**
