# Futuristic Multi-Agent Orchestrator

A high-end, futuristic web application that visualizes a Multi-Agent AI System working in real-time. Built with FastAPI, CrewAI, and React with a "Sci-Fi" aesthetic.

## Features

- **Three Autonomous Agents:**
  - Senior Developer Agent - Code generation and architecture
  - Network Security Agent - Security scanning and auditing
  - System Monitor Agent - Real-time CPU/RAM metrics

- **Real-time Communication:** WebSocket streaming of agent logs and metrics
- **Futuristic UI:** Glassmorphism design with Midnight Blue & Cyberpunk Cyan theme
- **Interactive Background:** Vanta.js Net effect that responds to mouse movement
- **Animated Components:** Framer Motion transitions and real-time graphs

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- CrewAI (Agent Framework)
- WebSockets
- psutil (System metrics)

### Frontend
- React.js 18
- Tailwind CSS
- Framer Motion
- Vanta.js (WebGL background)
- Recharts (Data visualization)

## Project Structure

```
multi-agent-orchestrator/
├── backend/
│   ├── main.py                 # FastAPI server with WebSocket endpoint
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py     # Agent orchestration logic
│   │   └── callbacks.py        # Agent callback handlers
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VantaBackground.js
│   │   │   ├── CorePulse.js
│   │   │   ├── ControlPanel.js
│   │   │   ├── Header.js
│   │   │   ├── AgentCard.js
│   │   │   ├── TerminalPanel.js
│   │   │   ├── SecurityPanel.js
│   │   │   └── SystemMetrics.js
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- OpenAI API Key (or OpenRouter API Key)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create and configure `.env` file:
```bash
copy .env.example .env
```

Edit `.env` and add your API key:
```
OPENAI_API_KEY=your_api_key_here
# or
OPENROUTER_API_KEY=your_openrouter_key
```

5. Run the backend server:
```bash
python main.py
```

The server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## Usage

1. **Start the Backend:** Run `python main.py` in the backend directory
2. **Start the Frontend:** Run `npm start` in the frontend directory
3. **Open the Application:** Navigate to `http://localhost:3000`
4. **Start Agents:** Click the "START AGENTS" button to begin agent orchestration
5. **Monitor Activity:** Watch real-time logs, security scans, and system metrics
6. **Stop/Reset:** Use the control panel to stop or reset agents

## API Endpoints

- `GET /` - Serves the frontend application
- `GET /api/status` - Get current system status
- `POST /api/agents/start` - Start all agents
- `POST /api/agents/stop` - Stop all agents
- `WebSocket /ws/agents` - Real-time agent communication

## WebSocket Message Format

### System Messages
```json
{
  "type": "system",
  "agent": "orchestrator",
  "data": { "event": "agents_starting", "message": "..." },
  "timestamp": "2024-01-01T00:00:00"
}
```

### Agent Thoughts
```json
{
  "type": "agent_thought",
  "agent": "developer",
  "data": { "thought": "Starting: Analyzing requirements", "status": "processing" },
  "timestamp": "2024-01-01T00:00:00"
}
```

### Agent Actions
```json
{
  "type": "agent_action",
  "agent": "security",
  "data": { "action": "Network scan", "output": "Scanning ports...", "status": "executing" },
  "timestamp": "2024-01-01T00:00:00"
}
```

### System Metrics
```json
{
  "type": "metrics",
  "agent": "monitor",
  "data": {
    "cpu_usage": 45.2,
    "memory_usage": 62.5,
    "memory_available": "6.24 GB",
    "disk_usage": 38.1,
    "timestamp": "2024-01-01T00:00:00"
  }
}
```

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  midnight: { /* ... */ },
  cyber: { /* ... */ },
  neon: { /* ... */ }
}
```

### Agent Configuration
Modify `backend/agents/orchestrator.py` to customize agent behaviors and tasks.

### Background Effect
Edit `frontend/src/components/VantaBackground.js` to change the Vanta.js effect parameters.

## Troubleshooting

### WebSocket Connection Failed
- Ensure the backend server is running
- Check that port 8000 is not blocked by firewall
- Verify CORS settings if running on different ports

### Agents Not Responding
- Check that API key is correctly configured in `.env`
- Verify internet connectivity for API access
- Check backend console for error messages

### Frontend Not Loading
- Run `npm install` to ensure all dependencies are installed
- Clear browser cache and reload
- Check browser console for JavaScript errors

## License

MIT License - Feel free to use and modify as needed.

## Credits

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [CrewAI](https://www.crewai.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vanta.js](https://www.vantajs.com/)
