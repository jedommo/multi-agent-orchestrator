import { motion } from 'framer-motion';

/**
 * Agent Status Card Component
 * Displays individual agent status with animated indicators
 */
export function AgentCard({ name, role, status, currentTask, color }) {
  const statusConfig = {
    idle: {
      label: 'IDLE',
      class: 'text-gray-400',
      dotClass: 'status-dot status-idle'
    },
    thinking: {
      label: 'THINKING',
      class: 'text-yellow-400',
      dotClass: 'status-dot status-thinking'
    },
    acting: {
      label: 'EXECUTING',
      class: 'text-cyber-cyan',
      dotClass: 'status-dot status-active'
    },
    completed: {
      label: 'COMPLETED',
      class: 'text-neon-green',
      dotClass: 'status-dot status-active'
    }
  };

  const config = statusConfig[status] || statusConfig.idle;

  const colorClasses = {
    cyan: 'border-cyber-cyan/30 bg-cyber-cyan/5',
    purple: 'border-cyber-purple/30 bg-cyber-purple/5',
    green: 'border-neon-green/30 bg-neon-green/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-lg p-4 border ${colorClasses[color] || colorClasses.cyan}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-white">{name}</h4>
          <p className="text-xs text-gray-400 mt-0.5">{role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={config.dotClass} />
          <span className={`text-xs font-mono ${config.class}`}>
            {config.label}
          </span>
        </div>
      </div>
      
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 pt-2 border-t border-gray-700/50"
        >
          <p className="text-xs text-gray-400">Current Task:</p>
          <p className="text-xs text-cyber-cyan font-mono mt-1">{currentTask}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
