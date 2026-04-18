import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Network Security Panel Component
 * Displays network scan logs and security status indicators
 */
export function SecurityPanel({ logs, title = "Network Security", onClear }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getStatusIcon = (action) => {
    if (action?.includes('scan')) return '◈';
    if (action?.includes('vulnerability')) return '◈';
    if (action?.includes('firewall')) return '◈';
    if (action?.includes('SSL')) return '◈';
    if (action?.includes('report')) return '◈';
    return '◇';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel rounded-xl overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/10 bg-midnight-800/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <h3 className="text-sm font-medium text-cyber-cyan tracking-wide">
            {title}
          </h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-cyber-cyan transition-colors px-2 py-1 glass-button rounded"
        >
          CLEAR
        </button>
      </div>

      {/* Network Visualization */}
      <div className="p-4 border-b border-cyber-cyan/10 bg-midnight-900/50">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-8 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center"
              animate={{
                backgroundColor: [
                  'rgba(6, 182, 212, 0.1)',
                  'rgba(6, 182, 212, 0.3)',
                  'rgba(6, 182, 212, 0.1)'
                ]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <span className="text-xs text-cyber-cyan/60">{i + 1}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="status-dot status-active" />
            <span className="text-gray-400">Network Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Ports Monitored:</span>
            <span className="text-cyber-cyan">1024</span>
          </div>
        </div>
      </div>

      {/* Security Log Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-midnight-900/80"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <AnimatePresence>
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 italic"
            >
              Waiting for security scans...
            </motion.div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="terminal-line mb-2"
              >
                <span className="text-gray-500 mr-2">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-cyber-cyan mr-2">
                  {getStatusIcon(log.action)}
                </span>
                <span className="text-neon-green">{log.content}</span>
                {log.action && (
                  <span className="text-cyber-purple/80 ml-2 block text-xs">
                    [{log.action}]
                  </span>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
