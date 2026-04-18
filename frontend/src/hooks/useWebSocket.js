import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for WebSocket connection to the agent orchestrator
 * Manages connection state and distributes events to agent-specific handlers
 */
export function useWebSocket(url = 'ws://localhost:8000/ws/agents') {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Agent-specific state
  const [developerLogs, setDeveloperLogs] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu_usage: 0,
    memory_usage: 0,
    memory_available: '0 GB',
    disk_usage: 0,
    timestamp: null
  });
  const [agentStates, setAgentStates] = useState({
    developer: { status: 'idle', current_task: null },
    security: { status: 'idle', current_task: null },
    monitor: { status: 'idle', current_task: null }
  });
  const [systemEvents, setSystemEvents] = useState([]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('[WS] Connected to orchestrator');
        setIsConnected(true);
      };

      wsRef.current.onclose = () => {
        console.log('[WS] Disconnected from orchestrator');
        setIsConnected(false);
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[WS] Attempting reconnection...');
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('[WS] Error:', error);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          handleMessage(message);
        } catch (err) {
          console.error('[WS] Failed to parse message:', err);
        }
      };
    } catch (error) {
      console.error('[WS] Failed to connect:', error);
    }
  }, [url]);

  // Handle incoming messages and distribute to appropriate state
  const handleMessage = useCallback((message) => {
    const { type, agent, data, timestamp } = message;

    switch (type) {
      case 'agent_thought':
        if (agent === 'developer') {
          setDeveloperLogs(prev => [...prev.slice(-99), {
            id: Date.now(),
            type: 'thought',
            content: data.thought,
            timestamp
          }]);
        } else if (agent === 'security') {
          setSecurityLogs(prev => [...prev.slice(-99), {
            id: Date.now(),
            type: 'thought',
            content: data.thought,
            timestamp
          }]);
        }
        break;

      case 'agent_action':
        if (agent === 'developer') {
          setDeveloperLogs(prev => [...prev.slice(-99), {
            id: Date.now(),
            type: 'action',
            action: data.action,
            content: data.output,
            timestamp
          }]);
        } else if (agent === 'security') {
          setSecurityLogs(prev => [...prev.slice(-99), {
            id: Date.now(),
            type: 'action',
            action: data.action,
            content: data.output,
            timestamp
          }]);
        }
        break;

      case 'task_complete':
        if (agent === 'developer' || agent === 'security' || agent === 'monitor') {
          setAgentStates(prev => ({
            ...prev,
            [agent]: { status: 'idle', current_task: null }
          }));
        }
        break;

      case 'metrics':
        if (data) {
          setSystemMetrics(data);
        }
        break;

      case 'system':
        setSystemEvents(prev => [...prev.slice(-49), {
          id: Date.now(),
          event: data?.event,
          message: data?.message,
          timestamp
        }]);
        break;

      default:
        console.log('[WS] Unknown message type:', type);
    }
  }, []);

  // Send control message to orchestrator
  const sendControl = useCallback((action) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'control',
        action: action
      }));
    }
  }, []);

  // Start agents
  const startAgents = useCallback(() => {
    sendControl('start');
  }, [sendControl]);

  // Stop agents
  const stopAgents = useCallback(() => {
    sendControl('stop');
  }, [sendControl]);

  // Reset agents
  const resetAgents = useCallback(() => {
    sendControl('reset');
    setDeveloperLogs([]);
    setSecurityLogs([]);
    setSystemEvents([]);
  }, [sendControl]);

  // Clear logs
  const clearLogs = useCallback((agent) => {
    if (agent === 'developer') {
      setDeveloperLogs([]);
    } else if (agent === 'security') {
      setSecurityLogs([]);
    }
  }, []);

  // Initial connection
  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    developerLogs,
    securityLogs,
    systemMetrics,
    agentStates,
    systemEvents,
    startAgents,
    stopAgents,
    resetAgents,
    clearLogs,
    reconnect: connect
  };
}
