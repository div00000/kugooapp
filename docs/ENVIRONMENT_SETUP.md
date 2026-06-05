# 🔧 Environment Setup Guide - Kugoo Ecosystem

Complete step-by-step guide to configure all API keys and services for the Kugoo platform.

---

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Firebase Authentication](#firebase-authentication)
3. [Payment Gateways](#payment-gateways)
4. [Google Maps](#google-maps)
5. [OpenAI (Zaam AI)](#openai-zaam-ai)
6. [WhatsApp Business API](#whatsapp-business-api)
7. [Email Service](#email-service)
8. [SMS Service](#sms-service)
9. [File Storage](#file-storage)
10. [Error Tracking](#error-tracking)
11. [Production Checklist](#production-checklist)

---

## 🗄️ Database Setup

### PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and follow prompts
- Note down password for `postgres` user

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kugoo_dev;
CREATE DATABASE kugoo_staging;
CREATE DATABASE kugoo_prod;

# Create user
CREATE USER kugoo_user WITH PASSWORD 'secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kugoo_dev TO kugoo_user;
GRANT ALL PRIVILEGES ON DATABASE kugoo_staging TO kugoo_user;
GRANT ALL PRIVILEGES ON DATABASE kugoo_prod TO kugoo_user;

# Exit psql
\q
```

### Redis Installation

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

**Windows:**
- Use Windows Subsystem for Linux (WSL)
- Or download from [memurai.com](https://www.memurai.com/)

### Environment Variables

```bash
# Add to backend/.env.development
DATABASE_URL=postgresql://kugoo_user:secure_password_here@localhost:5432/kugoo_dev
REDIS_URL=redis://localhost:6379
```

---

## 🔐 Firebase Authentication

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `Kugoo Food Delivery`
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Generate Service Account Key

1. Go to Project Settings (⚙️ icon)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save JSON file securely

### Step 3: Configure Authentication

1. Go to "Authentication" in left menu
2. Click "Get Started"
3. Enable these sign-in methods:
   - Email/Password
   - Phone Number
   - Google
   - Apple (for iOS)

### Step 4: Add to Environment

```bash
# From downloaded JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
```

---

## 💳 Payment Gateways

### Paystack Setup

**Step 1: Create Account**
1. Go to [paystack.com](https://paystack.com/signup)
2. Sign up as Merchant
3. Complete KYC verification

**Step 2: Get API Keys**
1. Login to Dashboard
2. Go to Settings → API Keys & Webhooks
3. Copy Secret Key and Public Key

**Step 3: Configure Webhook**
1. In API Keys section, set Webhook URL:
   ```
   https://api.kugoo.app/webhooks/paystack
   ```
2. Save webhook URL

**Step 4: Add to Environment**
```bash
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=whsk_test_xxxxxxxxxxxxx
```

### Flutterwave Setup

**Step 1: Create Account**
1. Go to [flutterwave.com](https://app.flutterwave.com/signup)
2. Sign up and complete verification

**Step 2: Get API Keys**
1. Dashboard → Settings → API
2. Copy Secret Key and Public Key

**Step 3: Configure Webhook**
```
https://api.kugoo.app/webhooks/flutterwave
```

**Step 4: Add to Environment**
```bash
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxx
FLUTTERWAVE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx
```

### Korapay Setup

**Step 1: Create Account**
1. Go to [korapay.com](https://korapay.com)
2. Sign up and complete setup

**Step 2: Get API Keys**
1. Dashboard → API Settings
2. Generate and copy keys

**Step 3: Add to Environment**
```bash
KORAPAY_SECRET_KEY=sk_test_xxxxxxxxxxxxx
KORAPAY_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
KORAPAY_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx
```

---

## 🗺️ Google Maps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create New Project → Name: `Kugoo Food Delivery`
3. Wait for project creation

### Step 2: Enable APIs

1. Search for "Maps JavaScript API"
2. Click "Enable"
3. Search for "Directions API"
4. Click "Enable"
5. Search for "Distance Matrix API"
6. Click "Enable"
7. Search for "Geocoding API"
8. Click "Enable"

### Step 3: Create API Key

1. Go to "Credentials" in left menu
2. Click "Create Credentials" → "API Key"
3. Copy the key
4. (Optional) Add restrictions:
   - Application restrictions: HTTP referrers
   - Add your domains
   - API restrictions: Select the 4 APIs above

### Step 4: Add to Environment

```bash
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_MAPS_SECRET_KEY=xxxxxxxxxxxxxxx # For server-side signing
```

---

## 🤖 OpenAI (Zaam AI)

### Step 1: Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Verify email

### Step 2: Generate API Key

1. Go to API Keys → [manage.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy immediately (can't see again)
4. Store securely

### Step 3: Setup Billing

1. Go to Settings → Billing
2. Add payment method
3. Set usage limits

### Step 4: Add to Environment

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ORG_ID=org-xxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4 # or gpt-3.5-turbo for cost savings
```

---

## 📱 WhatsApp Business API

### Step 1: Create Meta Developer Account

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Sign up as Developer
3. Create App

### Step 2: Set Up WhatsApp Business Account

1. Dashboard → Apps → Your App
2. Add "WhatsApp" product
3. Choose "Messaging API"
4. Complete setup steps

### Step 3: Get Phone Number ID & Access Token

1. Dashboard → WhatsApp → API Setup
2. Select phone number
3. Copy Phone Number ID
4. Generate temporary token first
5. Create System User & create permanent token

### Step 4: Configure Webhook

1. Webhook URL: `https://api.kugoo.app/webhooks/whatsapp`
2. Verify Token: Create random string
3. Save configuration

### Step 5: Add to Environment

```bash
WHATSAPP_BUSINESS_ACCOUNT_ID=11111111111111111
WHATSAPP_PHONE_NUMBER_ID=111111111111111111
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_verify_token
```

---

## 📧 Email Service (SendGrid)

### Step 1: Create SendGrid Account

1. Go to [sendgrid.com](https://signup.sendgrid.com/)
2. Sign up
3. Verify email
4. Complete setup

### Step 2: Generate API Key

1. Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: `Kugoo Backend`
4. Permissions: Full Access
5. Copy immediately

### Step 3: Verify Sender Email

1. Dashboard → Sender Authentication
2. Verify Domain or Single Sender
3. Follow verification steps

### Step 4: Create Email Templates

1. Dashboard → Email API → Dynamic Templates
2. Create templates for:
   - Email Verification
   - Order Confirmation
   - Order Ready
   - Order Delivered
3. Note template IDs

### Step 5: Add to Environment

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@kugoo.app
SENDGRID_FROM_NAME=Kugoo
EMAIL_VERIFICATION_TEMPLATE_ID=d-xxxxxxxxxxxxxxxxxxxxxxxx
ORDER_CONFIRMATION_TEMPLATE_ID=d-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📱 SMS Service (Twilio)

### Step 1: Create Twilio Account

1. Go to [twilio.com](https://www.twilio.com/try-twilio)
2. Sign up
3. Verify phone number
4. Create project

### Step 2: Get Credentials

1. Console Dashboard
2. Copy Account SID
3. Copy Auth Token

### Step 3: Get Phone Number

1. Console → Phone Numbers → Manage Numbers
2. Click "Get your first Twilio phone number"
3. Accept suggested number or choose
4. Note the number

### Step 4: Configure Webhooks (Optional)

1. Phone Numbers → Active Numbers
2. Select your number
3. Set Messaging webhook
4. URL: `https://api.kugoo.app/webhooks/twilio`

### Step 5: Add to Environment

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 💾 File Storage

### Supabase Storage Setup

**Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com/)
2. Sign up with GitHub
3. Create new project
4. Choose region (closest to your users)
5. Create password

**Step 2: Create Storage Bucket**
1. Dashboard → Storage
2. Create new bucket: `kugoo-storage`
3. Set public/private as needed

**Step 3: Get Keys**
1. Settings → API
2. Copy Project URL
3. Copy anon key
4. Copy service_role key

**Step 4: Add to Environment**
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### AWS S3 Setup (Alternative)

**Step 1: Create AWS Account**
1. Go to [aws.amazon.com](https://aws.amazon.com/)
2. Sign up
3. Create IAM user with S3 access

**Step 2: Create S3 Bucket**
1. S3 → Create Bucket
2. Name: `kugoo-app-storage-dev`
3. Region: Your region
4. Unblock public access if needed

**Step 3: Get Credentials**
1. IAM → Users → Your User
2. Security Credentials → Access Keys
3. Create New Access Key
4. Copy Access Key ID and Secret

**Step 4: Add to Environment**
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxxxx...
AWS_S3_BUCKET=kugoo-app-storage-dev
AWS_REGION=us-east-1
```

---

## 🐛 Error Tracking (Sentry)

### Step 1: Create Sentry Account

1. Go to [sentry.io](https://sentry.io/signup/)
2. Sign up
3. Create organization

### Step 2: Create Project

1. New Project
2. Select "Node.js" platform
3. Name: `Kugoo Backend`
4. Create Project

### Step 3: Get DSN

1. Project Settings → Client Keys (DSN)
2. Copy DSN

### Step 4: Add to Environment

```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## ✅ Production Checklist

Before deploying to production:

### Security
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Generate strong ADMIN_PASSWORD
- [ ] All API keys rotated and secured
- [ ] Set NODE_ENV=production
- [ ] SSL certificates configured
- [ ] CORS_ORIGIN set to production domain only
- [ ] Database SSL enabled (SSLMODE=require)
- [ ] Redis password set

### Configuration
- [ ] DATABASE_URL points to production database
- [ ] REDIS_URL points to production Redis
- [ ] All third-party services in production mode (not test)
- [ ] Email templates created and IDs added
- [ ] SMS service numbers verified
- [ ] WhatsApp webhook configured
- [ ] Payment webhook URLs set

### Services
- [ ] Firebase project configured for production
- [ ] Google Maps API key restricted
- [ ] OpenAI billing configured
- [ ] SendGrid domain verified
- [ ] Twilio production credentials
- [ ] Supabase/S3 production setup

### Monitoring
- [ ] Sentry project configured
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Monitoring alerts set up
- [ ] Log aggregation configured

### Database
- [ ] Database backed up
- [ ] Backup automated (daily)
- [ ] Backups tested for restore
- [ ] Database migrations run
- [ ] Seed data loaded

### Deployment
- [ ] Code deployed to production
- [ ] Environment variables set
- [ ] Health check endpoints working
- [ ] APIs responding correctly
- [ ] Payment processing tested
- [ ] Notifications tested
- [ ] Email service tested
- [ ] SMS service tested

---

## 🆘 Troubleshooting

### Database Connection Failing
```bash
# Test connection
psql $DATABASE_URL

# Check if PostgreSQL is running
sudo service postgresql status

# Verify credentials
echo $DATABASE_URL
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check Redis status
sudo service redis-server status
```

### API Key Issues
```bash
# Verify environment variables loaded
node -e "console.log(process.env.PAYSTACK_SECRET_KEY)"

# Check .env file format
cat backend/.env.development
```

### Payment Gateway Issues
- Use test/sandbox credentials first
- Check webhook URL is correct
- Verify webhook is receiving requests
- Check API key permissions

---

**Need help?** Check the main [README.md](/README.md) or contact support@kugoo.app
