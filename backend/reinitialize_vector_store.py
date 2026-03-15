"""
Reinitialize Vector Store with Updated Data
Run this script to recreate the vector store with new Marvar Boys PG data
Usage: python reinitialize_vector_store.py
"""

import os
import django
import sys
import shutil

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from ai_assistant.vector_store import VectorStoreManager

def reinitialize_vector_store():
    print("🚀 Reinitializing Vector Store with Marvar Boys PG data...\n")
    
    # Remove existing vector store
    vector_manager = VectorStoreManager()
    if os.path.exists(vector_manager.persist_directory):
        print("🗑️  Removing existing vector store...")
        shutil.rmtree(vector_manager.persist_directory)
        print("✓ Existing vector store removed\n")
    
    # Create new vector store with updated data
    print("📚 Creating new vector store...")
    vector_manager.add_pg_data()
    
    print("\n✅ Vector store reinitialized successfully!")
    print("🤖 AI Assistant is now ready with updated Marvar Boys PG data")
    print("\n💡 The AI will now respond with:")
    print("   • Correct PG name: Marvar Boys PG & Tiffin Center")
    print("   • Updated pricing: Starting ₹499, 3-seater ₹5,499, 2-seater ₹5,999, Single ₹6,999")
    print("   • Owner information: Ishwar Jaat")

if __name__ == '__main__':
    try:
        reinitialize_vector_store()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("1. You're in the backend directory")
        print("2. Virtual environment is activated")
        print("3. GEMINI_API_KEY is set in .env file")
        sys.exit(1)