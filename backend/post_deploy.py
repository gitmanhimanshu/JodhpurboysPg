#!/usr/bin/env python
"""
Post-deployment script to initialize AI vector store
This script runs after deployment to ensure AI assistant is ready
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def post_deploy():
    """Run post-deployment tasks"""
    print("🚀 Running post-deployment tasks...")
    
    try:
        # Reinitialize vector store
        print("🤖 Reinitializing AI Assistant Vector Store...")
        execute_from_command_line(['manage.py', 'reinitialize_vectorstore', '--force'])
        
        print("✅ Post-deployment tasks completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error in post-deployment: {str(e)}")
        return False

if __name__ == '__main__':
    success = post_deploy()
    sys.exit(0 if success else 1)