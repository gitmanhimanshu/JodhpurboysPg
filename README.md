# Jodhpur Boys PG Management System

A comprehensive web application for managing PG (Paying Guest) accommodations in Jodhpur. Built with modern technologies and featuring a beautiful, responsive UI.

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Django 5.0 with Django REST Framework
- PostgreSQL database
- JWT authentication (Simple JWT)
- Brevo API for email notifications
- Python Decouple for environment management

## ✨ Features

### For Visitors
- 🏠 Beautiful landing page with PG information
- 📝 Lead submission form (name + mobile)
- 📧 Automatic email notifications to admin
- 📱 Fully responsive design

### For Residents
- 🔐 Secure registration and login
- 👤 Personal dashboard with profile information
- 🔑 Password reset with OTP verification
- 👁️ Show/hide password toggle
- 📊 View personal details (contact, ID, address)

### For Admins
- 👥 View all leads and registered users
- 📊 Admin panel with tabbed interface
- 🔒 Role-based access control
- 📧 Email notifications for new leads

### Security Features
- JWT-based authentication
- OTP verification for password reset (6-digit, 10-minute expiry)
- Secure password hashing
- CORS protection
- Environment-based configuration

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Brevo account (for email service)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jodhpur-boys-pg
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory (see `backend/.env.example`):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=

# Database
DATABASE_NAME=jodhpur_pg_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Brevo Email Settings
EMAIL_HOST_USER=your-brevo-email
EMAIL_HOST_PASSWORD=your-brevo-api-key
DEFAULT_FROM_EMAIL=your-sender-email
ADMIN_EMAIL=admin-email

# Admin Users (comma-separated)
ADMIN_USERS=admin1@email.com,admin2@email.com

# JWT Settings (in minutes)
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

#### Setup Database
```bash
# Create PostgreSQL database
createdb jodhpur_pg_db

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

#### Start Backend Server
```bash
python manage.py runserver
```
Backend will run on `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:8000
```

#### Start Frontend Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
jodhpur-boys-pg/
├── backend/
│   ├── config/              # Django settings
│   ├── users/               # User management app
│   │   ├── models.py        # User & OTPVerification models
│   │   ├── views.py         # Authentication & profile views
│   │   ├── serializers.py   # API serializers
│   │   └── urls.py          # User routes
│   ├── leads/               # Lead management app
│   │   ├── models.py        # Lead model
│   │   ├── views.py         # Lead views
│   │   └── urls.py          # Lead routes
│   ├── utils/               # Utility functions
│   │   └── email_service.py # Brevo email integration
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Authentication Flow

### Registration
1. User fills registration form with all details
2. Account is created with `is_resident=True`
3. User is automatically logged in
4. JWT tokens are generated and stored

### Login
1. User enters email and password
2. Backend validates credentials
3. JWT tokens are returned
4. User is redirected to dashboard

### Password Reset
1. User enters email address
2. 6-digit OTP is sent via email
3. User verifies OTP
4. User sets new password
5. OTP is deleted after successful reset

## 📧 Email Configuration

The system uses Brevo API for sending emails:

1. Sign up at [Brevo](https://www.brevo.com/)
2. Get your API key from Settings > SMTP & API
3. Add credentials to backend `.env` file
4. Emails are sent for:
   - New lead notifications (to admin)
   - Password reset OTP

## 🎨 UI Features

- Modern gradient designs
- Card-based layouts
- Hover effects and animations
- Progress indicators
- Success/error modals
- Mobile-responsive hamburger menu
- Touch-friendly buttons
- Accessible form inputs

## 🔒 Security Best Practices

- Passwords are hashed using Django's built-in system
- JWT tokens for stateless authentication
- OTP expires after 10 minutes
- Environment variables for sensitive data
- CORS protection
- SQL injection prevention (Django ORM)
- XSS protection (React)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure `ALLOWED_HOSTS`
3. Use production database
4. Set strong `SECRET_KEY`
5. Configure CORS properly
6. Use gunicorn/uwsgi for serving

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy `dist` folder to hosting service
3. Update `VITE_API_URL` to production backend URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed with ❤️ for Jodhpur Boys PG

## 📞 Support

For support, email: himanshuyada70@gmail.com
