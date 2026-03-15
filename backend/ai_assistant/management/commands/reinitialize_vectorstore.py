"""
Django Management Command to Reinitialize Vector Store
Usage: python manage.py reinitialize_vectorstore
"""

from django.core.management.base import BaseCommand
from django.conf import settings
import os
import shutil
from ai_assistant.vector_store import VectorStoreManager

class Command(BaseCommand):
    help = 'Reinitialize the AI vector store with updated PG data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force reinitialize even if vector store exists',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting Vector Store Reinitialization...')
        )
        
        try:
            vector_manager = VectorStoreManager()
            
            # Check if GEMINI_API_KEY exists
            if not hasattr(settings, 'GEMINI_API_KEY') or not os.getenv('GEMINI_API_KEY'):
                self.stdout.write(
                    self.style.ERROR('❌ GEMINI_API_KEY not found in environment variables')
                )
                self.stdout.write('Please set GEMINI_API_KEY in your .env file')
                return
            
            # Remove existing vector store if force flag is used or if it doesn't exist
            if options['force'] or not os.path.exists(vector_manager.persist_directory):
                if os.path.exists(vector_manager.persist_directory):
                    self.stdout.write('🗑️  Removing existing vector store...')
                    shutil.rmtree(vector_manager.persist_directory)
                    self.stdout.write(self.style.SUCCESS('✓ Existing vector store removed'))
                
                # Create new vector store
                self.stdout.write('📚 Creating new vector store with Marvar Boys PG data...')
                vector_manager.add_pg_data()
                
                self.stdout.write(
                    self.style.SUCCESS('✅ Vector store reinitialized successfully!')
                )
                self.stdout.write('🤖 AI Assistant is now ready with updated data')
                
            else:
                self.stdout.write(
                    self.style.WARNING('⚠️  Vector store already exists. Use --force to recreate.')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error reinitializing vector store: {str(e)}')
            )
            self.stdout.write('Make sure GEMINI_API_KEY is valid and network is available')
            raise e