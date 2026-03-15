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
        
    def get_pg_data_from_db(self):
        """Get PG data from database if available, otherwise use defaults"""
        try:
            # Try to import and get PG info from database
            from django.apps import apps
            if apps.ready:
                try:
                    from pg_info.models import PGInfo
                    pg_info = PGInfo.get_active_info()
                    if pg_info:
                        return self._create_documents_from_db(pg_info)
                except:
                    pass  # Fall back to default data
        except:
            pass  # Fall back to default data
        
        # Default data if database is not available
        return self._create_default_documents()
    
    def _create_documents_from_db(self, pg_info):
        """Create documents from database PG info"""
        return [
            Document(
                page_content=f"{pg_info.pg_name} is located in Jaipur at {pg_info.address}. GPS Coordinates: Latitude {pg_info.latitude}, Longitude {pg_info.longitude}. Owner: {pg_info.owner_name}",
                metadata={"type": "address"}
            ),
            Document(
                page_content=f"Contact number: {pg_info.contact_number}. Email: {pg_info.email}",
                metadata={"type": "contact"}
            ),
            Document(
                page_content=f"Room pricing: Starting from ₹{pg_info.starting_price}/month. 3-seater room: ₹{pg_info.three_seater_price}/month, 2-seater room: ₹{pg_info.two_seater_price}/month, Single room: ₹{pg_info.single_room_price}/month. All prices are for students and working professionals.",
                metadata={"type": "pricing"}
            ),
            Document(
                page_content=f"Amenities: {pg_info.amenities}",
                metadata={"type": "amenities"}
            ),
            Document(
                page_content=f"PG gate closes at {pg_info.gate_closing_time}. Late entry not permitted.",
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
                page_content=f"Maintain silence after {pg_info.silence_after}. No loud music or noise.",
                metadata={"type": "rules"}
            ),
            Document(
                page_content="Monthly rent due by 5th of every month. One month advance notice required before vacating.",
                metadata={"type": "payment"}
            ),
            Document(
                page_content=f"Food timings: Breakfast {pg_info.breakfast_timing}, Lunch {pg_info.lunch_timing}, Dinner {pg_info.dinner_timing}. Outside food allowed in rooms only.",
                metadata={"type": "food"}
            ),
            Document(
                page_content="Weekly Menu - Monday: Breakfast (आलू पराठा, दही, अचार), Lunch (चावल, दाल, सब्जी, रोटी, सलाद), Dinner (चावल, दाल, सब्जी, रोटी, पापड़). Tuesday: Breakfast (पोहा, चाय, नमकीन), Lunch (चावल, राजमा, आलू गोभी, रोटी, दही), Dinner (चावल, दाल, भिंडी, रोटी, अचार).",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="Weekly Menu - Wednesday: Breakfast (उपमा, चटनी, चाय), Lunch (चावल, छोले, आलू मटर, रोटी, सलाद), Dinner (चावल, दाल, करेला, रोटी, पापड़). Thursday: Breakfast (दलिया, दूध, फल), Lunch (चावल, कढ़ी, आलू बैंगन, रोटी, दही), Dinner (चावल, दाल, पालक पनीर, रोटी, अचार).",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="Weekly Menu - Friday: Breakfast (पराठा, सब्जी, दही, अचार), Lunch (चावल, दाल, मिक्स वेज, रोटी, सलाद), Dinner (चावल, दाल, आलू गोभी, रोटी, पापड़). Saturday: Breakfast (इडली, सांभर, चटनी), Lunch (चावल, राजमा, भिंडी, रोटी, दही), Dinner (चावल, दाल, पनीर मटर, रोटी, अचार).",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="Weekly Menu - Sunday: Breakfast (छोले भटूरे, अचार, प्याज), Lunch (चावल, दाल मखनी, आलू मटर, रोटी, सलाद), Dinner (चावल, दाल, मिक्स वेज, रोटी, पापड़). All meals are vegetarian and prepared with fresh ingredients. Menu may vary based on market availability.",
                metadata={"type": "menu"}
            ),
            Document(
                page_content=f"Prime location near colleges, markets, and bus stands in Mansarovar, Jaipur. View on Google Maps: {pg_info.latitude}, {pg_info.longitude}",
                metadata={"type": "location"}
            ),
            Document(
                page_content=f"{pg_info.pg_name} - Boys only accommodation for students and working professionals with friendly community. Owner: {pg_info.owner_name} provides personal care and attention to all residents.",
                metadata={"type": "target"}
            ),
            Document(
                page_content=f"The owner of {pg_info.pg_name} is Mr. {pg_info.owner_name}. He is the proprietor and manages the PG operations personally.",
                metadata={"type": "owner"}
            ),
        ]
    
    def _create_default_documents(self):
        """Create default documents when database is not available"""
        return [
            Document(
                page_content="Marvar Boys PG & Tiffin Center is located in Jaipur at 112/103, Jhalana Chhod, Mansarovar, Jaipur, Rajasthan 302020. GPS Coordinates: Latitude 26.84636, Longitude 75.7694464. Owner: Ishwar Jaat",
                metadata={"type": "address"}
            ),
            Document(
                page_content="Contact number: +91 81078 42564. Email: info@marvarpg.com",
                metadata={"type": "contact"}
            ),
            Document(
                page_content="Room pricing: Starting from ₹4999/month. 3-seater room: ₹5,499/month, 2-seater room: ₹5,999/month, Single room: ₹6,999/month. All prices are for students and working professionals.",
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
                page_content="Food timings: Breakfast 8:30-10:00 AM, Lunch 1:00-3:00 PM, Dinner 8:00-10:00 PM. Outside food allowed in rooms only.",
                metadata={"type": "food"}
            ),
            Document(
                page_content="रविवार का मेन्यू - नाश्ता: आलू पराठा, अचार, टमाटर सॉस, रायता। दोपहर का खाना: आलू पराठा, अचार, टमाटर सॉस, रायता। रात का खाना: मटर पनीर, चपाती।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="सोमवार का मेन्यू - नाश्ता: पोहा, चाय। दोपहर का खाना: आलू, शिमला मिर्च, चपाती। रात का खाना: दाल, चपाती।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="मंगलवार का मेन्यू - नाश्ता: पास्ता, चाय। दोपहर का खाना: गाजर, मटर, चपाती। रात का खाना: कढ़ी, चपाती।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="बुधवार का मेन्यू - नाश्ता: उपमा, चाय। दोपहर का खाना: मिक्स वेज, चपाती। रात का खाना: बेसन गट्टा, चपाती।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="गुरुवार का मेन्यू - नाश्ता: मैकरोनी, चाय। दोपहर का खाना: लौकी, चना दाल, चपाती। रात का खाना: सोयाबीन, चपाती।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="शुक्रवार का मेन्यू - नाश्ता: नमकीन चावल, चाय। दोपहर का खाना: सेव टमाटर, चपाती। रात का खाना: चटनी, पूरी, आलू छोला।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="शनिवार का मेन्यू - नाश्ता: पोहा, चाय। दोपहर का खाना: गोभी, टमाटर, मटर, आलू, चपाती। रात का खाना: दाल बाटी, चटनी।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="सभी भोजन शाकाहारी होते हैं और ताज़ी सामग्री से तैयार किए जाते हैं। मेन्यू बाज़ार में उपलब्धता के आधार पर भिन्न हो सकता है। खाना समय पर परोसा जाता है।",
                metadata={"type": "menu"}
            ),
            Document(
                page_content="Prime location near colleges, markets, and bus stands in Mansarovar, Jaipur. View on Google Maps: 26.84636, 75.7694464",
                metadata={"type": "location"}
            ),
            Document(
                page_content="Marvar Boys PG & Tiffin Center - Boys only accommodation for students and working professionals with friendly community. Owner: Ishwar Jaat provides personal care and attention to all residents.",
                metadata={"type": "target"}
            ),
            Document(
                page_content="The owner of Marvar Boys PG & Tiffin Center is Mr. Ishwar Jaat. He is the proprietor and manages the PG operations personally.",
                metadata={"type": "owner"}
            ),
        ]
        
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
        pg_data = self.get_pg_data_from_db()
        
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
