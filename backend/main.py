"""
Futuristic Multi-Agent Orchestrator - FastAPI Backend
Real-time WebSocket communication with CrewAI agents
"""

import asyncio
import json
import os
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

from agents.orchestrator import AgentOrchestrator

app = FastAPI(title="Multi-Agent Orchestrator", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection manager for WebSocket clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[+] New WebSocket connection. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"[-] WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)

    async def send_personal(self, message: dict, websocket: WebSocket):
        """Send message to specific client"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            self.disconnect(websocket)

manager = ConnectionManager()

# Global orchestrator instance
orchestrator: Optional[AgentOrchestrator] = None


@app.on_event("startup")
async def startup_event():
    """Initialize the agent orchestrator on startup"""
    global orchestrator
    orchestrator = AgentOrchestrator(manager)
    print("[*] Agent Orchestrator initialized")


@app.get("/")
async def get_frontend():
    """Serve the React frontend"""
    try:
        with open("../frontend/build/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Frontend not built. Run npm build in frontend folder.</h1>")


@app.get("/api/status")
async def get_status():
    """Get current system status"""
    return {
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "connections": len(manager.active_connections),
        "agents_active": orchestrator.is_running if orchestrator else False
    }


@app.websocket("/ws/agents")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time agent communication"""
    await manager.connect(websocket)
    
    # Send initial connection confirmation
    await manager.send_personal({
        "type": "system",
        "event": "connected",
        "message": "Connected to Multi-Agent Orchestrator",
        "timestamp": datetime.now().isoformat()
    }, websocket)
    
    try:
        while True:
            # Receive messages from frontend (for control commands)
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "control":
                action = message.get("action")
                if action == "start" and orchestrator:
                    await orchestrator.start_agents()
                elif action == "stop" and orchestrator:
                    await orchestrator.stop_agents()
                elif action == "reset" and orchestrator:
                    await orchestrator.reset_agents()
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[!] WebSocket error: {e}")
        manager.disconnect(websocket)


@app.post("/api/agents/start")
async def start_agents():
    """Start all agents via REST API"""
    if orchestrator:
        await orchestrator.start_agents()
        return {"status": "started", "message": "All agents initiated"}
    return {"status": "error", "message": "Orchestrator not initialized"}


@app.post("/api/agents/stop")
async def stop_agents():
    """Stop all agents via REST API"""
    if orchestrator:
        await orchestrator.stop_agents()
        return {"status": "stopped", "message": "All agents halted"}
    return {"status": "error", "message": "Orchestrator not initialized"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
