import os

# Disable ChromaDB telemetry BEFORE any imports
os.environ['ANONYMIZED_TELEMETRY'] = 'False'

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from decouple import config

class VectorStoreManager:
    def __init__(self):
        # Use embedding model exactly as in reference (free version without "models/" prefix)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=config('GEMINI_API_KEY')
        )
        self.persist_directory = "chroma_db"
        self.vector_store = None
        
    def initialize_vector_store(self):
        """Initialize or load existing vector store"""
        if os.path.exists(self.persist_directory):
            try:
                self.vector_store = Chroma(
                    persist_directory=self.persist_directory,
                    embedding_function=self.embeddings
                )
                print("✅ Loaded existing vector store")
            except Exception as e:
                print(f"⚠️ Error loading store: {e}")
                self.vector_store = None
        
        return self.vector_store
    
    def add_pg_data(self):
        """Add PG information to vector store - using from_documents like reference"""
        pg_data = [
            Document(
                page_content="Jodhpur Boys PG & Tiffin Center is located in Jaipur at 112/103, Jhalana Chhod, Mansarovar, Jaipur, Rajasthan 302020. GPS Coordinates: Latitude 26.84636, Longitude 75.7694464",
                metadata={"type": "address"}
            ),
            Document(
                page_content="Contact number: +91 81078 42564. Email: info@jaipurpg.com",
                metadata={"type": "contact"}
            ),
            Document(
                page_content="Monthly rent is ₹5,499 per month for students and professionals.",
                metadata={"type": "pricing"}
            ),
            Document(
                page_content="Amenities: Fully furnished rooms, High-speed WiFi 24/7, Home-cooked meals, 24/7 security, Power backup, Daily housekeeping, Weekly laundry, Common area with TV and games.",
                metadata={"type": "amenities"}
            ),
            Document(
                page_content="PG gate closes at 12:00 AM midnight. Late entry not permitted.",
                metadata={"type": "rules"}
            ),
            Document(
                page_content="Smoking and alcohol strictly prohibited inside PG premises.",
                metadata={"type": "rules"}
            ),
            Document(
                page_content="Visitors allowed in common areas 10 AM to 8 PM with prior permission.",
                metadata={"type": "rules"}
            ),
            Document(
                page_content="Maintain silence after 11 PM. No loud music or noise.",
                metadata={"type": "rules"}
            ),
            Document(
                page_content="Monthly rent due by 5th of every month. One month advance notice required before vacating.",
                metadata={"type": "payment"}
            ),
            Document(
                page_content="Food timings: Breakfast 8-10 AM, Lunch 1-3 PM, Dinner 8-10 PM. Outside food allowed in rooms only.",
                metadata={"type": "food"}
            ),
            Document(
                page_content="Prime location near colleges, markets, and bus stands in Mansarovar, Jaipur. View on Google Maps: 26.84636, 75.7694464",
                metadata={"type": "location"}
            ),
            Document(
                page_content="Boys only PG for students and working professionals with friendly community.",
                metadata={"type": "target"}
            ),
        ]
        
        # Create vector store using from_documents (like reference code)
        self.vector_store = Chroma.from_documents(
            documents=pg_data,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )
        
        print(f"✅ Created vector store with {len(pg_data)} documents")
        print(f"Location: {self.persist_directory}")
        
    def search(self, query, k=3):
        """Search vector store"""
        if self.vector_store is None:
            self.initialize_vector_store()
        
        if self.vector_store:
            results = self.vector_store.similarity_search(query, k=k)
            return results
        return []
