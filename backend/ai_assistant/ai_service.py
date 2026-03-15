import os

# Disable ChromaDB telemetry BEFORE any imports
os.environ['ANONYMIZED_TELEMETRY'] = 'False'

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from decouple import config
from .vector_store import VectorStoreManager

class AIAssistant:
    def __init__(self):
        # Use Gemini 2.5 Flash model (free version without "models/" prefix)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=config('GEMINI_API_KEY'),
            temperature=0.7
        )
        
        self.vector_manager = VectorStoreManager()
        self.vector_store = self.vector_manager.initialize_vector_store()
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_template("""
Answer the question based on the provided context about Marvar Boys PG & Tiffin Center.
If the question is about location or address, make sure to mention that user can view it on Google Maps.
If asked about the owner, mention that the owner is Ishwar Jaat.
If asked about menu or food, provide detailed information about daily meals and weekly menu in a clean, readable format without using markdown formatting like ** or *.

IMPORTANT: Do not use any markdown formatting (**, *, etc.) in your response. Provide clean, plain text answers.

Context: {context}

Question: {input}

Answer:""")
        
        # Create retriever and chains using NEW METHOD
        if self.vector_store:
            self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 3})
            
            # NEW METHOD: create_stuff_documents_chain + create_retrieval_chain
            self.question_answer_chain = create_stuff_documents_chain(self.llm, self.prompt)
            self.rag_chain = create_retrieval_chain(self.retriever, self.question_answer_chain)
        else:
            self.rag_chain = None
    
    def get_response(self, question):
        """Get AI response for user question using NEW retrieval method"""
        try:
            if self.rag_chain is None:
                return {
                    "answer": "AI Assistant is not initialized. Please initialize the vector store first.",
                    "sources": []
                }
            
            # NEW METHOD: Use invoke with 'input' key
            response = self.rag_chain.invoke({"input": question})
            
            return {
                "answer": response["answer"],
                "sources": [doc.page_content for doc in response.get("context", [])]
            }
        except Exception as e:
            return {
                "answer": f"Sorry, I encountered an error: {str(e)}",
                "sources": []
            }
