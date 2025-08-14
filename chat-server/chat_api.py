from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

# Create FastAPI instance
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama + Langchain for chatbot
llm = Ollama(model="llama3")  
memory = ConversationBufferMemory()
conversation = ConversationChain(llm=llm, memory=memory)

# Request schema
class ChatRequest(BaseModel):
    question: str

# API endpoint
@app.post("/analyze")
async def analyze(req: ChatRequest):
    user_question = req.question
    try:
        response = conversation.predict(input=user_question)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}


# Run command: uvicorn chatbot_server:app --reload --port 5000
