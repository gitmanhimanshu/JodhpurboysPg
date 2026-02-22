# Quick Start Guide - Jodhpur Boys PG

Get the application running in 5 minutes!

## Prerequisites Check
```bash
# Check Python version (need 3.11+)
python --version

# Check Node.js version (need 18+)
node --version

# Check PostgreSQL (need 14+)
psql --version
```

## Step 1: Database Setup (2 minutes)
```bash
# Create database
createdb jodhpur_pg_db

# Or using psql
psql -U postgres
CREATE DATABASE jodhpur_pg_db;
\q
```

## Step 2: Backend Setup (2 minutes)
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env file with your settings
# IMPORTANT: Update these values:
# - DATABASE_PASSWORD (your PostgreSQL password)
# - EMAIL_HOST_PASSWORD (your Brevo API key)
# - ADMIN_EMAIL (your admin email)
# - ADMIN_USERS (comma-separated admin emails)

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

Backend will run on: http://localhost:8000

## Step 3: Frontend Setup (1 minute)
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Start frontend server
npm run dev
```

Frontend will run on: http://localhost:3000

## Step 4: Test the Application

### Test Lead Submission
1. Go to http://localhost:3000
2. Fill the contact form with name and mobile
3. Submit the form
4. Check admin email for notification

### Test User Registration
1. Click "Login" in navbar
2. Click "Fill registration form"
3. Fill all details and submit
4. You'll be automatically logged in
5. View your dashboard

### Test Admin Panel
1. Login with an email listed in ADMIN_USERS
2. Click "Admin Panel" in navbar
3. View leads and registered users

### Test Password Reset
1. Click "Forgot Password?" on login page
2. Enter your email
3. Check email for OTP
4. Enter OTP and verify
5. Set new password
6. Login with new password

## Common Issues & Solutions

### Issue: Database connection error
**Solution:** Check PostgreSQL is running and credentials in `.env` are correct

### Issue: Email not sending
**Solution:** 
- Verify Brevo API key in `.env`
- Check EMAIL_HOST_PASSWORD is set correctly
- Ensure DEFAULT_FROM_EMAIL is verified in Brevo

### Issue: Admin panel not showing
**Solution:** 
- Ensure your email is in ADMIN_USERS in backend `.env`
- Logout and login again to refresh user data

### Issue: CORS error
**Solution:** 
- Check VITE_API_URL in frontend `.env` matches backend URL
- Ensure backend is running on port 8000

## Default Ports
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Next Steps
- Read full [README.md](README.md) for detailed documentation
- Check [OTP_FLOW_DOCUMENTATION.md](OTP_FLOW_DOCUMENTATION.md) for OTP system details
- Customize the UI in `frontend/src/pages/`
- Add more features as needed

## Getting Brevo API Key
1. Sign up at https://www.brevo.com/
2. Go to Settings > SMTP & API
3. Create new API key
4. Copy the key to EMAIL_HOST_PASSWORD in backend `.env`
5. Verify your sender email (DEFAULT_FROM_EMAIL)

## Production Deployment Checklist
- [ ] Set DEBUG=False in backend
- [ ] Set strong SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Use production database
- [ ] Set proper CORS_ALLOWED_ORIGINS
- [ ] Build frontend: `npm run build`
- [ ] Use gunicorn/uwsgi for backend
- [ ] Set up SSL/HTTPS
- [ ] Configure domain DNS

## Support
For issues or questions, contact: himanshuyada70@gmail.com

Happy coding! 🚀
