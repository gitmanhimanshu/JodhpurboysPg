from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ai_service import AIAssistant
from .vector_store import VectorStoreManager

# Initialize AI Assistant (singleton pattern)
ai_assistant = None

def get_ai_assistant():
    global ai_assistant
    if ai_assistant is None:
        ai_assistant = AIAssistant()
    return ai_assistant

@api_view(['POST'])
def chat(request):
    """Chat endpoint for AI assistant"""
    question = request.data.get('question', '')
    
    if not question:
        return Response(
            {'error': 'Question is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        assistant = get_ai_assistant()
        result = assistant.get_response(question)
        
        return Response({
            'answer': result['answer'],
            'sources': result['sources']
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def initialize_data(request):
    """Initialize vector store with PG data"""
    try:
        vector_manager = VectorStoreManager()
        vector_manager.initialize_vector_store()
        vector_manager.add_pg_data()
        
        return Response({
            'message': 'Vector store initialized successfully'
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
