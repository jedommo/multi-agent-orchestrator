import { motion } from 'framer-motion';

/**
 * Control Panel Component
 * Main controls for starting, stopping, and resetting agents
 */
export function ControlPanel({ isConnected, isRunning, onStart, onStop, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl px-6 py-4 mb-6"
    >
      <div className="flex items-center justify-between">
        {/* Connection Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`status-dot ${isConnected ? 'status-active' : 'status-idle'}`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className={`status-dot ${isRunning ? 'status-active' : 'status-idle'}`} />
            <span className="text-sm text-gray-300">
              {isRunning ? 'Agents Running' : 'Agents Stopped'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              disabled={!isConnected}
              className="px-6 py-2 glass-button rounded-lg text-cyber-cyan font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              START AGENTS
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="px-6 py-2 glass-button rounded-lg text-red-400 font-medium text-sm border-red-500/30 hover:bg-red-500/10"
            >
              STOP AGENTS
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-2 glass-button rounded-lg text-gray-400 font-medium text-sm"
          >
            RESET
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
