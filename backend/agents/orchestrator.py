"""
Agent Orchestrator - Manages multiple AI agents with CrewAI
Handles agent coordination and WebSocket event streaming
"""

import asyncio
import json
import os
import random
from datetime import datetime
from typing import Dict, List, Optional, Callable

from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

from agents.callbacks import AgentCallbackHandler


class AgentOrchestrator:
    """
    Central orchestrator for managing multiple AI agents
    Streams all agent activities through WebSocket
    """
    
    def __init__(self, connection_manager):
        self.manager = connection_manager
        self.is_running = False
        self.agents: Dict[str, Agent] = {}
        self.tasks: Dict[str, Task] = {}
        self.crew: Optional[Crew] = None
        self.llm: Optional[ChatOpenAI] = None
        
        # Agent state tracking
        self.agent_states = {
            "developer": {"status": "idle", "current_task": None},
            "security": {"status": "idle", "current_task": None},
            "monitor": {"status": "idle", "current_task": None}
        }
        
        # Initialize LLM
        self._initialize_llm()
        
        # Create agents
        self._create_agents()
        
    def _initialize_llm(self):
        """Initialize the language model"""
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")
        api_base = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        
        if api_key:
            self.llm = ChatOpenAI(
                model="gpt-4-turbo-preview",
                temperature=0.7,
                api_key=api_key,
                base_url=api_base if os.getenv("OPENROUTER_API_KEY") else None
            )
        else:
            # Fallback to simulation mode without API key
            self.llm = None
            print("[*] Running in simulation mode (no API key detected)")
    
    def _create_agents(self):
        """Create the three specialized agents"""
        
        # Senior Developer Agent
        self.agents["developer"] = Agent(
            role="Senior Software Developer",
            goal="Generate clean, efficient code and manage file structures",
            backstory="""You are a senior software developer with 15 years of experience 
            in building scalable applications. You specialize in Python, JavaScript, and 
            system architecture. You write clean, documented code and follow best practices.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        ) if self.llm else self._create_mock_agent("developer")
        
        # Network Security Agent
        self.agents["security"] = Agent(
            role="Network Security Specialist",
            goal="Monitor network traffic, scan for vulnerabilities, and ensure security",
            backstory="""You are a cybersecurity expert with deep knowledge of network 
            protocols, penetration testing, and security auditing. You proactively identify 
            and mitigate potential security threats.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        ) if self.llm else self._create_mock_agent("security")
        
        # System Monitor Agent
        self.agents["monitor"] = Agent(
            role="System Monitoring Specialist",
            goal="Track system health, resource usage, and performance metrics",
            backstory="""You are a DevOps engineer specializing in system monitoring and 
            performance optimization. You continuously track CPU, memory, disk, and network 
            metrics to ensure optimal system health.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        ) if self.llm else self._create_mock_agent("monitor")
    
    def _create_mock_agent(self, agent_type: str) -> Agent:
        """Create a mock agent for simulation mode"""
        return Agent(
            role=f"Mock {agent_type.title()} Agent",
            goal="Simulate agent behavior for demonstration",
            backstory="Mock agent for testing without API key",
            verbose=True
        )
    
    async def _broadcast_event(self, event_type: str, agent: str, data: dict):
        """Broadcast an event to all connected WebSocket clients"""
        message = {
            "type": event_type,
            "agent": agent,
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "sequence": int(datetime.now().timestamp() * 1000)
        }
        await self.manager.broadcast(message)
    
    async def _on_agent_thought(self, agent: str, thought: str):
        """Callback when agent has a thought"""
        self.agent_states[agent]["status"] = "thinking"
        await self._broadcast_event("agent_thought", agent, {
            "thought": thought,
            "status": "processing"
        })
        await asyncio.sleep(0.5)
    
    async def _on_agent_action(self, agent: str, action: str, output: str):
        """Callback when agent performs an action"""
        self.agent_states[agent]["status"] = "acting"
        await self._broadcast_event("agent_action", agent, {
            "action": action,
            "output": output,
            "status": "executing"
        })
        await asyncio.sleep(0.3)
    
    async def _on_task_complete(self, agent: str, result: str):
        """Callback when task is complete"""
        self.agent_states[agent]["status"] = "idle"
        await self._broadcast_event("task_complete", agent, {
            "result": result,
            "status": "completed"
        })
    
    async def start_agents(self):
        """Start all agents in parallel"""
        if self.is_running:
            return
        
        self.is_running = True
        await self._broadcast_event("system", "orchestrator", {
            "event": "agents_starting",
            "message": "Initializing all agents..."
        })
        
        # Start agent tasks concurrently
        await asyncio.gather(
            self._run_developer_agent(),
            self._run_security_agent(),
            self._run_monitor_agent()
        )
    
    async def stop_agents(self):
        """Stop all running agents"""
        self.is_running = False
        await self._broadcast_event("system", "orchestrator", {
            "event": "agents_stopped",
            "message": "All agents halted"
        })
    
    async def reset_agents(self):
        """Reset all agent states"""
        self.agent_states = {
            "developer": {"status": "idle", "current_task": None},
            "security": {"status": "idle", "current_task": None},
            "monitor": {"status": "idle", "current_task": None}
        }
        await self._broadcast_event("system", "orchestrator", {
            "event": "agents_reset",
            "message": "All agents reset"
        })
    
    async def _run_developer_agent(self):
        """Run the developer agent simulation"""
        activities = [
            ("Analyzing project requirements", "Parsing specification documents..."),
            ("Designing architecture", "Creating module structure..."),
            ("Writing code", "Generating Python modules..."),
            ("Code review", "Checking for best practices..."),
            ("Documentation", "Writing docstrings and comments...")
        ]
        
        for task, detail in activities:
            if not self.is_running:
                break
            
            self.agent_states["developer"]["current_task"] = task
            await self._on_agent_thought("developer", f"Starting: {task}")
            await asyncio.sleep(random.uniform(1, 3))
            await self._on_agent_action("developer", task, detail)
            await asyncio.sleep(random.uniform(0.5, 2))
        
        await self._on_task_complete("developer", "Development cycle completed")
    
    async def _run_security_agent(self):
        """Run the security agent simulation"""
        activities = [
            ("Network scan initiated", "Scanning ports 1-1024..."),
            ("Vulnerability assessment", "Checking for known CVEs..."),
            ("Firewall analysis", "Reviewing firewall rules..."),
            ("SSL/TLS verification", "Validating certificate chain..."),
            ("Security report", "Generating security audit report...")
        ]
        
        for task, detail in activities:
            if not self.is_running:
                break
            
            self.agent_states["security"]["current_task"] = task
            await self._on_agent_thought("security", f"Executing: {task}")
            await asyncio.sleep(random.uniform(1.5, 3.5))
            await self._on_agent_action("security", task, detail)
            await asyncio.sleep(random.uniform(0.5, 1.5))
        
        await self._on_task_complete("security", "Security audit completed")
    
    async def _run_monitor_agent(self):
        """Run the system monitor agent with real metrics"""
        try:
            import psutil
            has_psutil = True
        except ImportError:
            has_psutil = False
        
        iterations = 0
        while self.is_running and iterations < 10:
            iterations += 1
            
            if has_psutil:
                cpu_percent = psutil.cpu_percent(interval=0.5)
                memory = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                metrics = {
                    "cpu_usage": cpu_percent,
                    "memory_usage": memory.percent,
                    "memory_available": f"{memory.available / (1024**3):.2f} GB",
                    "disk_usage": disk.percent,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # Simulation mode
                metrics = {
                    "cpu_usage": random.uniform(15, 45),
                    "memory_usage": random.uniform(40, 65),
                    "memory_available": f"{random.uniform(4, 8):.2f} GB",
                    "disk_usage": random.uniform(30, 50),
                    "timestamp": datetime.now().isoformat()
                }
            
            await self._broadcast_event("metrics", "monitor", metrics)
            await asyncio.sleep(2)
        
        await self._on_task_complete("monitor", "Monitoring cycle completed")
