from fastapi import APIRouter, HTTPException
from typing import Optional

router = APIRouter(prefix="/interview", tags=["interview"])

# Mock conversation storage - in production this would be in a database
conversations = {}

@router.post("/chat")
async def send_interview_message(
    user_id: str, 
    role: str, 
    message: str, 
    conversation_id: Optional[str] = None
):
    """Send a message in an interview conversation"""
    try:
        # Initialize conversation if needed
        if not conversation_id:
            conversation_id = f"conv_{user_id}_{len(conversations)}"
        
        if conversation_id not in conversations:
            conversations[conversation_id] = {
                "messages": [],
                "user_id": user_id,
                "role": role
            }
        
        # Add user message
        conversations[conversation_id]["messages"].append({
            "sender": "user",
            "message": message,
            "timestamp": "2024-01-01T00:00:00Z"
        })
        
        # Generate AI response based on role
        ai_response = generate_ai_response(role, message)
        
        # Add AI response
        conversations[conversation_id]["messages"].append({
            "sender": "ai",
            "message": ai_response,
            "timestamp": "2024-01-01T00:00:00Z"
        })
        
        return {
            "conversation_id": conversation_id,
            "response": ai_response,
            "messages": conversations[conversation_id]["messages"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

def generate_ai_response(role: str, message: str) -> str:
    """Generate AI response based on interview role"""
    role_responses = {
        "technical": [
            "That's an interesting approach. Can you explain the time complexity of your solution?",
            "Good answer! How would you handle edge cases in this scenario?",
            "I see you're using that data structure. What are the trade-offs compared to alternatives?"
        ],
        "behavioral": [
            "That's a great example. What did you learn from that experience?",
            "How did you handle the challenges in that situation?",
            "What would you do differently if you faced that again?"
        ],
        "hr": [
            "Thank you for sharing that. What are your career goals for the next 2-3 years?",
            "That's helpful to know. How do you handle stress and pressure?",
            "What motivates you in your work?"
        ]
    }
    
    import random
    responses = role_responses.get(role, role_responses["technical"])
    return random.choice(responses)

@router.get("/conversations/{user_id}")
async def get_user_conversations(user_id: str):
    """Get all conversations for a user"""
    user_conversations = {
        conv_id: conv for conv_id, conv in conversations.items()
        if conv["user_id"] == user_id
    }
    
    return {
        "conversations": user_conversations,
        "total": len(user_conversations)
    } 