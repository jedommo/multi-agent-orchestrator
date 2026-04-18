import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

/**
 * System Metrics Panel Component
 * Displays real-time CPU, RAM, and disk usage with animated graphs
 */
export function SystemMetrics({ metrics, title = "System Vitals" }) {
  // Generate chart data from metrics
  const chartData = [
    { name: 'CPU', value: metrics.cpu_usage, color: '#06b6d4' },
    { name: 'RAM', value: metrics.memory_usage, color: '#8b5cf6' },
    { name: 'Disk', value: metrics.disk_usage, color: '#10b981' }
  ];

  const MetricBar = ({ label, value, color, suffix = '%' }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono text-cyber-cyan">
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <div className="h-2 bg-midnight-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
        <div className="flex items-center gap-2">
          <span className="status-dot status-active" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Metrics Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Metric Bars */}
        <div className="mb-6">
          <MetricBar
            label="CPU Usage"
            value={metrics.cpu_usage || 0}
            color="#06b6d4"
          />
          <MetricBar
            label="Memory Usage"
            value={metrics.memory_usage || 0}
            color="#8b5cf6"
          />
          <MetricBar
            label="Disk Usage"
            value={metrics.disk_usage || 0}
            color="#10b981"
          />
        </div>

        {/* Memory Available */}
        <div className="glass-card rounded-lg p-3 mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Available Memory
          </div>
          <div className="text-2xl font-mono text-cyber-cyan">
            {metrics.memory_available || '0 GB'}
          </div>
        </div>

        {/* Mini Charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">CPU Trend</div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.slice(0, 1)}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    fill="url(#cpuGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">Memory Trend</div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.slice(1, 2)}>
                  <defs>
                    <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="url(#memGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        {metrics.timestamp && (
          <div className="mt-4 text-xs text-gray-500 text-center font-mono">
            Last update: {new Date(metrics.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
