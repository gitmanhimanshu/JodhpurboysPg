#!/usr/bin/env bash
# Build script for deployment

set -o errexit  # Exit on error

echo "🚀 Starting deployment build process..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

# Run database migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Create superuser if it doesn't exist (for production)
echo "👤 Setting up admin user..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='himanshuyada70@gmail.com').exists():
    User.objects.create_superuser('himanshuyada70@gmail.com', 'himanshuyada70@gmail.com', '12345678')
    print('✓ Admin user created')
else:
    print('✓ Admin user already exists')
"

# Initialize vector store for AI assistant
echo "🤖 Initializing AI Assistant Vector Store..."
python manage.py reinitialize_vectorstore --force

echo "✅ Build process completed successfully!"
echo "🌐 Application is ready for deployment"