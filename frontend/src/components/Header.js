import { motion } from 'framer-motion';

/**
 * Header Component
 * Futuristic header with title and status indicators
 */
export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-light text-white tracking-tight"
          >
            Multi-Agent <span className="text-cyber-cyan font-medium">Orchestrator</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-400 mt-1"
          >
            Autonomous AI Agent Coordination System
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              System Status
            </div>
            <div className="text-sm text-cyber-cyan font-mono">
              OPERATIONAL
            </div>
          </div>
          <div className="w-px h-10 bg-gray-700" />
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              Version
            </div>
            <div className="text-sm text-cyber-cyan font-mono">
              v1.0.0
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"
      />
    </motion.header>
  );
}
