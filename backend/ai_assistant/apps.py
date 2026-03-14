from django.apps import AppConfig
import os


class AiAssistantConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ai_assistant'
    
    def ready(self):
        """Initialize vector store on app startup"""
        # Only run in main process, not in reloader
        if os.environ.get('RUN_MAIN') != 'true':
            return
            
        try:
            from .vector_store import VectorStoreManager
            
            print("🤖 Initializing AI Assistant...")
            vector_manager = VectorStoreManager()
            vector_store = vector_manager.initialize_vector_store()
            
            # Check if data already exists
            try:
                results = vector_store.similarity_search("test", k=1)
                if not results:
                    print("📚 Adding PG data to vector store...")
                    vector_manager.add_pg_data()
                    print("✅ Vector store initialized with PG data!")
                else:
                    print("✅ Vector store already has data!")
            except:
                print("📚 Adding PG data to vector store...")
                vector_manager.add_pg_data()
                print("✅ Vector store initialized with PG data!")
                
        except Exception as e:
            print(f"⚠️ AI Assistant initialization skipped: {str(e)}")
