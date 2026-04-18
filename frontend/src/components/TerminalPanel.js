import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Terminal Panel Component
 * Displays scrolling neon-green text feed for the Developer Agent
 */
export function TerminalPanel({ logs, title = "Developer Terminal", onClear }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'thought':
        return 'text-cyber-cyan/80';
      case 'action':
        return 'text-neon-green';
      default:
        return 'text-gray-300';
    }
  };

  const getLogPrefix = (type) => {
    switch (type) {
      case 'thought':
        return '>>';
      case 'action':
        return '>>';
      default:
        return '  ';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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

      {/* Terminal Content */}
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
              Waiting for agent activity...
            </motion.div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`terminal-line mb-2 ${getLogColor(log.type)}`}
              >
                <span className="text-gray-500 mr-2">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-cyber-cyan/60 mr-2">
                  {getLogPrefix(log.type)}
                </span>
                <span>{log.content}</span>
                {log.action && (
                  <span className="text-cyber-purple/80 ml-2">
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
