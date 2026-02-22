# Deployment Guide - Jodhpur Boys PG

Complete guide for deploying the application to production.

---

## Pre-Deployment Checklist

### Backend
- [ ] Set `DEBUG=False` in production
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set up production database (PostgreSQL)
- [ ] Configure `CORS_ALLOWED_ORIGINS`
- [ ] Verify Brevo API credentials
- [ ] Set admin emails in `ADMIN_USERS`
- [ ] Test all API endpoints
- [ ] Run security checks

### Frontend
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Build production bundle
- [ ] Test production build locally
- [ ] Optimize images and assets
- [ ] Check for console errors

### General
- [ ] Set up SSL/HTTPS certificates
- [ ] Configure domain DNS
- [ ] Set up monitoring and logging
- [ ] Create backup strategy
- [ ] Document deployment process

---

## Backend Deployment

### Option 1: Deploy on VPS (Ubuntu/Debian)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install Supervisor (for process management)
sudo apt install supervisor -y
```

#### 2. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE jodhpur_pg_db;
CREATE USER pguser WITH PASSWORD 'strong_password_here';
ALTER ROLE pguser SET client_encoding TO 'utf8';
ALTER ROLE pguser SET default_transaction_isolation TO 'read committed';
ALTER ROLE pguser SET timezone TO 'Asia/Kolkata';
GRANT ALL PRIVILEGES ON DATABASE jodhpur_pg_db TO pguser;
\q
```

#### 3. Application Setup
```bash
# Create app directory
sudo mkdir -p /var/www/jodhpur-pg
cd /var/www/jodhpur-pg

# Clone repository
git clone <your-repo-url> .

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
pip install gunicorn

# Create production .env file
nano .env
```

**Production .env:**
```env
SECRET_KEY=generate-strong-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_NAME=jodhpur_pg_db
DATABASE_USER=pguser
DATABASE_PASSWORD=strong_password_here
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Brevo Email
EMAIL_HOST_USER=your-brevo-email
EMAIL_HOST_PASSWORD=your-brevo-api-key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Admin Users
ADMIN_USERS=admin1@yourdomain.com,admin2@yourdomain.com

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### 4. Run Migrations
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

#### 5. Configure Gunicorn
Create `/etc/supervisor/conf.d/jodhpur-pg.conf`:
```ini
[program:jodhpur-pg]
directory=/var/www/jodhpur-pg/backend
command=/var/www/jodhpur-pg/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/jodhpur-pg.log
```

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start jodhpur-pg
```

#### 6. Configure Nginx
Create `/etc/nginx/sites-available/jodhpur-pg`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /static/ {
        alias /var/www/jodhpur-pg/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/jodhpur-pg/backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jodhpur-pg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

---

### Option 2: Deploy on Heroku

#### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Prepare Backend
Create `Procfile` in backend directory:
```
web: gunicorn config.wsgi --log-file -
```

Create `runtime.txt`:
```
python-3.11.0
```

Update `requirements.txt`:
```bash
pip install gunicorn whitenoise
pip freeze > requirements.txt
```

Update `settings.py`:
```python
# Add whitenoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... rest of middleware
]

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

#### 3. Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create jodhpur-pg-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=jodhpur-pg-backend.herokuapp.com
heroku config:set EMAIL_HOST_PASSWORD=your-brevo-api-key
# ... set all other env variables

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate
```

---

## Frontend Deployment

### Option 1: Deploy on Netlify

#### 1. Build Production Bundle
```bash
cd frontend

# Update .env for production
echo "VITE_API_URL=https://yourdomain.com" > .env

# Build
npm run build
```

#### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

Or use Netlify web interface:
1. Go to https://app.netlify.com
2. Drag and drop `dist` folder
3. Configure environment variables in site settings

#### 3. Configure Redirects
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

---

### Option 2: Deploy on Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel --prod
```

Or connect GitHub repository on Vercel dashboard.

#### 3. Configure Environment Variables
Add in Vercel dashboard:
- `VITE_API_URL`: Your backend URL

---

### Option 3: Deploy on VPS with Nginx

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Copy to Server
```bash
scp -r dist/* user@yourserver:/var/www/jodhpur-pg-frontend/
```

#### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name frontend.yourdomain.com;

    root /var/www/jodhpur-pg-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

---

## Database Backup Strategy

### Automated PostgreSQL Backups

Create `/usr/local/bin/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="jodhpur_pg_db"

mkdir -p $BACKUP_DIR
pg_dump -U pguser $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Monitoring & Logging

### 1. Application Logs
```bash
# Backend logs
tail -f /var/log/jodhpur-pg.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Setup Sentry (Error Tracking)
```bash
# Install Sentry SDK
pip install sentry-sdk

# Add to settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True
)
```

### 3. Setup Uptime Monitoring
Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Performance Optimization

### Backend
1. Enable database connection pooling
2. Add Redis for caching
3. Use CDN for static files
4. Enable Gzip compression
5. Optimize database queries

### Frontend
1. Code splitting
2. Lazy loading
3. Image optimization
4. Enable browser caching
5. Use CDN for assets

---

## Security Hardening

### Backend
```python
# settings.py

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Server
```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

---

## Rollback Strategy

### Backend Rollback
```bash
# Keep previous version
cd /var/www/jodhpur-pg
git tag -a v1.0.0 -m "Production release"

# To rollback
git checkout v1.0.0
sudo supervisorctl restart jodhpur-pg
```

### Frontend Rollback
Keep previous `dist` folder:
```bash
mv dist dist.backup
# Deploy new version
# If issues, restore:
rm -rf dist
mv dist.backup dist
```

---

## Post-Deployment Testing

### Backend Tests
```bash
# Test API endpoints
curl https://yourdomain.com/users/profile/

# Check database connection
python manage.py dbshell

# Test email sending
python manage.py shell
>>> from utils.email_service import send_otp_email
>>> send_otp_email('test@example.com', '123456', 'Test User')
```

### Frontend Tests
- Test all pages load correctly
- Test user registration and login
- Test password reset flow
- Test admin panel access
- Test lead submission
- Check mobile responsiveness
- Test in different browsers

---

## Maintenance

### Regular Tasks
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Review database backups
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security patches
- [ ] Quarterly: Performance audit
- [ ] Yearly: SSL certificate renewal (auto with Let's Encrypt)

### Update Process
```bash
# Backend updates
cd /var/www/jodhpur-pg
git pull origin main
source venv/bin/activate
pip install -r backend/requirements.txt
python backend/manage.py migrate
sudo supervisorctl restart jodhpur-pg

# Frontend updates
cd frontend
npm install
npm run build
# Copy dist to server
```

---

## Troubleshooting

### Backend Issues
```bash
# Check if service is running
sudo supervisorctl status jodhpur-pg

# Restart service
sudo supervisorctl restart jodhpur-pg

# Check logs
tail -f /var/log/jodhpur-pg.log

# Test database connection
python manage.py dbshell
```

### Frontend Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check logs
tail -f /var/log/nginx/error.log
```

---

## Support

For deployment issues, contact: himanshuyada70@gmail.com

## Additional Resources
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
