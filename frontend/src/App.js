import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VantaBackground } from './components/VantaBackground';
import { Header } from './components/Header';
import { CorePulse } from './components/CorePulse';
import { ControlPanel } from './components/ControlPanel';
import { AgentCard } from './components/AgentCard';
import { TerminalPanel } from './components/TerminalPanel';
import { SecurityPanel } from './components/SecurityPanel';
import { SystemMetrics } from './components/SystemMetrics';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const {
    isConnected,
    developerLogs,
    securityLogs,
    systemMetrics,
    agentStates,
    startAgents,
    stopAgents,
    resetAgents,
    clearLogs
  } = useWebSocket('ws://localhost:8000/ws/agents');

  const [isRunning, setIsRunning] = useState(false);

  // Update running state based on agent states
  useEffect(() => {
    const anyActive = Object.values(agentStates).some(
      state => state.status === 'thinking' || state.status === 'acting'
    );
    setIsRunning(anyActive);
  }, [agentStates]);

  return (
    <div className="relative min-h-screen">
      {/* Vanta.js Background */}
      <VantaBackground />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Header />
        
        {/* Control Panel */}
        <ControlPanel
          isConnected={isConnected}
          isRunning={isRunning}
          onStart={startAgents}
          onStop={stopAgents}
          onReset={resetAgents}
        />
        
        {/* Agent Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AgentCard
            name="Senior Developer"
            role="Code Generation & Architecture"
            status={agentStates.developer.status}
            currentTask={agentStates.developer.current_task}
            color="cyan"
          />
          <AgentCard
            name="Network Security"
            role="Security Auditing & Scanning"
            status={agentStates.security.status}
            currentTask={agentStates.security.current_task}
            color="purple"
          />
          <AgentCard
            name="System Monitor"
            role="Resource & Health Monitoring"
            status={agentStates.monitor.status}
            currentTask={agentStates.monitor.current_task}
            color="green"
          />
        </div>
        
        {/* Core Pulse Animation */}
        <div className="flex justify-center mb-6">
          <CorePulse isActive={isRunning} />
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal Panel - Developer Agent */}
          <div className="lg:col-span-1 min-h-[400px]">
            <TerminalPanel
              logs={developerLogs}
              title="Developer Terminal"
              onClear={() => clearLogs('developer')}
            />
          </div>
          
          {/* Security Panel - Network Agent */}
          <div className="lg:col-span-1 min-h-[400px]">
            <SecurityPanel
              logs={securityLogs}
              title="Network Security"
              onClear={() => clearLogs('security')}
            />
          </div>
          
          {/* System Metrics - Monitor Agent */}
          <div className="lg:col-span-1 min-h-[400px]">
            <SystemMetrics
              metrics={systemMetrics}
              title="System Vitals"
            />
          </div>
        </div>
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-xs text-gray-500"
        >
          <p>Futuristic Multi-Agent Orchestrator - Built with FastAPI, CrewAI, and React</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
