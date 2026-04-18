import { motion } from 'framer-motion';

/**
 * Central Core Pulse Component
 * Animated core that pulses when agents are communicating
 */
export function CorePulse({ isActive }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rings */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-cyber-cyan/20"
        animate={isActive ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-cyber-cyan/30"
        animate={isActive ? {
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      
      {/* Inner glow */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-cyber-cyan/10 blur-xl"
        animate={isActive ? {
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Core center */}
      <motion.div
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan/40 to-cyber-blue/40 backdrop-blur-sm border border-cyber-cyan/40 shadow-lg"
        animate={isActive ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 0 20px rgba(6, 182, 212, 0.4)',
            '0 0 40px rgba(6, 182, 212, 0.6)',
            '0 0 20px rgba(6, 182, 212, 0.4)'
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 rounded-full bg-cyber-cyan"
            animate={isActive ? {
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
      
      {/* Status label */}
      <div className="absolute -bottom-8 text-xs text-cyber-cyan/70 uppercase tracking-widest">
        {isActive ? 'Active' : 'Standby'}
      </div>
    </div>
  );
}
