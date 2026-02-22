"""
Demo Data Insertion Script
Run this script to insert sample data for testing
Usage: python insert_demo_data.py
"""

import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from leads.models import Lead
from django.utils import timezone

def insert_demo_data():
    print("🚀 Starting demo data insertion...\n")
    
    # Clear existing demo data (optional)
    print("🗑️  Clearing existing demo data...")
    User.objects.filter(email__in=[
        'himanshuyada70@gmail.com',
        'rahul.sharma@example.com',
        'priya.patel@example.com',
        'amit.kumar@example.com'
    ]).delete()
    
    Lead.objects.filter(mobile__in=[
        '9876543210',
        '9876543211',
        '9876543212',
        '9876543213',
        '9876543214'
    ]).delete()
    
    print("✓ Cleared existing demo data\n")
    
    # Insert Admin User
    print("👤 Creating Admin User...")
    admin_user = User.objects.create_user(
        username='himanshuyada70@gmail.com',
        email='himanshuyada70@gmail.com',
        password='12345678',
        mobile='9876543210',
        first_name='Himanshu',
        last_name='Yadav',
        father_name='Mr. Yadav',
        aadhar='123456789012',
        address='Admin Address, Jaipur, Rajasthan',
        is_resident=True,
        is_active=True
    )
    print(f"✓ Admin created: {admin_user.email}")
    print(f"  Password: 12345678")
    print(f"  Mobile: {admin_user.mobile}\n")
    
    # Insert Regular Users (Residents)
    print("👥 Creating Regular Users...")
    
    users_data = [
        {
            'email': 'rahul.sharma@example.com',
            'password': 'password123',
            'mobile': '9876543211',
            'first_name': 'Rahul',
            'last_name': 'Sharma',
            'father_name': 'Rajesh Sharma',
            'aadhar': '234567890123',
            'address': '123 MG Road, Jaipur, Rajasthan - 302001'
        },
        {
            'email': 'priya.patel@example.com',
            'password': 'password123',
            'mobile': '9876543212',
            'first_name': 'Priya',
            'last_name': 'Patel',
            'father_name': 'Prakash Patel',
            'aadhar': '345678901234',
            'address': '456 Station Road, Jaipur, Rajasthan - 302002'
        },
        {
            'email': 'amit.kumar@example.com',
            'password': 'password123',
            'mobile': '9876543213',
            'first_name': 'Amit',
            'last_name': 'Kumar',
            'father_name': 'Anil Kumar',
            'aadhar': '456789012345',
            'address': '789 Civil Lines, Jaipur, Rajasthan - 302003'
        }
    ]
    
    for user_data in users_data:
        user = User.objects.create_user(
            username=user_data['email'],
            email=user_data['email'],
            password=user_data['password'],
            mobile=user_data['mobile'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            father_name=user_data['father_name'],
            aadhar=user_data['aadhar'],
            address=user_data['address'],
            is_resident=True,
            is_active=True
        )
        print(f"✓ User created: {user.first_name} {user.last_name} ({user.email})")
    
    print(f"\n✓ Created {len(users_data)} regular users\n")
    
    # Insert Leads
    print("📝 Creating Leads...")
    
    leads_data = [
        {
            'name': 'Vikram Singh',
            'mobile': '9876543214'
        },
        {
            'name': 'Neha Gupta',
            'mobile': '9876543215'
        },
        {
            'name': 'Rohan Verma',
            'mobile': '9876543216'
        },
        {
            'name': 'Anjali Mehta',
            'mobile': '9876543217'
        },
        {
            'name': 'Karan Joshi',
            'mobile': '9876543218'
        }
    ]
    
    for lead_data in leads_data:
        lead = Lead.objects.create(
            name=lead_data['name'],
            mobile=lead_data['mobile']
        )
        print(f"✓ Lead created: {lead.name} ({lead.mobile})")
    
    print(f"\n✓ Created {len(leads_data)} leads\n")
    
    # Summary
    print("=" * 60)
    print("✅ DEMO DATA INSERTION COMPLETED!")
    print("=" * 60)
    print("\n📊 Summary:")
    print(f"   • Total Users: {User.objects.count()}")
    print(f"   • Total Leads: {Lead.objects.count()}")
    print("\n🔐 Admin Login Credentials:")
    print(f"   Email: himanshuyada70@gmail.com")
    print(f"   Password: 12345678")
    print("\n💡 You can now:")
    print("   1. Login with admin credentials")
    print("   2. View Admin Panel to see all leads and users")
    print("   3. Test the dashboard with regular user accounts")
    print("\n🌐 Frontend URL: http://localhost:3000")
    print("🔧 Backend URL: http://localhost:8000")
    print("\n" + "=" * 60)

if __name__ == '__main__':
    try:
        insert_demo_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is running")
        print("2. Database is created and migrated")
        print("3. You're in the backend directory")
        print("4. Virtual environment is activated")
        sys.exit(1)
