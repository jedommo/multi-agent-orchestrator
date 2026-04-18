"""
Agent Callback Handler - Custom callbacks for CrewAI agent events
Streams agent thoughts, actions, and results through WebSocket
"""

from typing import Any, Dict, Optional
from crewai.agents.agent_callback.base_callback_handler import AgentCallbackHandler as CrewAICallbackHandler


class AgentCallbackHandler(CrewAICallbackHandler):
    """
    Custom callback handler for streaming agent events
    """
    
    def __init__(self, on_thought=None, on_action=None, on_complete=None):
        super().__init__()
        self.on_thought_callback = on_thought
        self.on_action_callback = on_action
        self.on_complete_callback = on_complete
    
    async def on_agent_action(self, action: Any, **kwargs: Any) -> Any:
        """Called when agent performs an action"""
        if self.on_action_callback:
            await self.on_action_callback(action, kwargs)
    
    async def on_tool_start(self, tool_name: str, tool_input: Dict[str, Any], **kwargs: Any) -> Any:
        """Called when a tool starts executing"""
        if self.on_action_callback:
            await self.on_action_callback(f"tool:{tool_name}", tool_input)
    
    async def on_tool_end(self, output: str, **kwargs: Any) -> Any:
        """Called when a tool finishes executing"""
        if self.on_action_callback:
            await self.on_action_callback("tool_complete", {"output": output})
    
    async def on_text(self, text: str, **kwargs: Any) -> Any:
        """Called when agent outputs text/thought"""
        if self.on_thought_callback:
            await self.on_thought_callback(text, kwargs)
    
    async def on_agent_finish(self, return_value: Any, **kwargs: Any) -> Any:
        """Called when agent finishes"""
        if self.on_complete_callback:
            await self.on_complete_callback(return_value, kwargs)
