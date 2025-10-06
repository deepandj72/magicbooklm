# Groq-Powered Multi-Agent Research System

A NotebookLM-inspired application that uses Groq's high-speed LLM API with a sequential multi-agent architecture to provide research, synthesis, and editing capabilities.

## Features

- **Multi-Agent System**: Three specialized AI agents (Researcher, Synthesizer, Editor) work sequentially to generate comprehensive reports
- **Interactive Notebooks**: Create and manage multiple research notebooks with sources
- **Real-time Chat**: Chat with your sources using Groq's fast LLM inference
- **Studio Features**: Generate interactive Flashcards and Quiz assessments from your sources
- **Source Management**: Add text sources, upload files, and organize research materials

## Architecture

### Backend (Python + Groq)

The backend implements a minimal multi-agent system with three sequential agents:

1. **Researcher Agent**: Analyzes topics and extracts key facts into structured JSON
2. **Synthesizer Agent**: Transforms facts into coherent Markdown documents
3. **Editor Agent**: Polishes content for grammar, clarity, and professional tone

### Frontend (React + TypeScript + Tailwind)

A modern, dark-themed UI inspired by NotebookLM featuring:
- Notebook listing with grid view
- Source management sidebar
- Chat interface with streaming responses
- Studio page for generating various content types

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- Groq API Key (get one at https://console.groq.com)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set your Groq API key:
```bash
export GROQ_API_KEY="your_groq_api_key_here"
```

4. Start the Flask API server:
```bash
python api.py
```

The API will run on `http://localhost:5000`

### Frontend Setup

1. Install Node dependencies (from project root):
```bash
npm install
```

2. Start the development server (automatically started):
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Using the Standalone Python Script

You can run the multi-agent system directly:

```bash
cd backend
python main.py
```

This will generate a report and save it to `final_report.md`.

To customize the topic, edit the `TOPIC` variable in `main.py`.

### Using the Web Interface

1. Make sure both backend and frontend are running
2. Open `http://localhost:5173` in your browser
3. Click "Create new notebook" to start
4. Add sources by clicking the "Add" button
5. Chat with your sources or use Studio to generate reports

## API Endpoints

### POST /api/chat
Chat with sources using Groq LLM

**Request Body:**
```json
{
  "query": "Your question",
  "sources": [{"title": "Source 1", "content": "..."}],
  "model": "llama-3.1-70b-versatile"
}
```

### POST /api/generate-report
Generate a comprehensive report using the multi-agent system

**Request Body:**
```json
{
  "topic": "Your research topic",
  "model": "llama-3.1-70b-versatile"
}
```

## Available Models

- `llama-3.1-70b-versatile` (default, recommended)
- `mixtral-8x7b-32768`

## Technology Stack

**Backend:**
- Python 3.10+
- Flask (Web API)
- Groq SDK (LLM API)
- Flask-CORS (Cross-origin support)

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)

## Project Structure

```
.
├── backend/
│   ├── main.py           # Multi-agent orchestration
│   ├── api.py            # Flask API server
│   └── requirements.txt  # Python dependencies
├── src/
│   ├── components/
│   │   ├── NotebookList.tsx
│   │   ├── NotebookDetail.tsx
│   │   └── AddSourcesModal.tsx
│   ├── types.ts
│   └── App.tsx
└── README.md
```

## Key Features Explained

### Multi-Agent Workflow

1. **Research Phase**: The Researcher Agent analyzes the topic and extracts structured facts
2. **Synthesis Phase**: The Synthesizer Agent creates a flowing Markdown document from the facts
3. **Editing Phase**: The Editor Agent polishes the content for professional quality

### Speed Optimization

- Uses Groq's LPU architecture for ultra-fast inference
- Minimal abstraction layers
- Sequential processing for data consistency
- No external tools/APIs required

## Notes

- All information comes from the LLM's internal knowledge base
- No external web search is performed
- Reports are generated in Markdown format
- The system prioritizes simplicity and speed

## License

MIT
