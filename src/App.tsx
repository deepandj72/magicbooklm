import { useState } from 'react';
import NotebookList from './components/NotebookList';
import NotebookDetail from './components/NotebookDetail';
import AddSourcesModal from './components/AddSourcesModal';
import { Notebook, Source, ChatMessage } from './types';

function App() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: '1',
      title: 'Real-Time Public Transport Tracking System',
      emoji: '🚌',
      created_at: '2025-09-29T00:00:00Z',
      sources_count: 1
    },
    {
      id: '2',
      title: 'Big Data Services for Aviation Management',
      emoji: '✈️',
      created_at: '2025-10-06T00:00:00Z',
      sources_count: 1
    }
  ]);

  const [sources, setSources] = useState<Record<string, Source[]>>({
    '1': [{
      id: 's1',
      notebook_id: '1',
      title: 'Transport System Overview',
      type: 'text',
      content: 'Real-time public transport tracking systems use GPS and IoT sensors to monitor vehicle locations, providing passengers with accurate arrival times and route information.',
      created_at: '2025-09-29T00:00:00Z'
    }],
    '2': [{
      id: 's2',
      notebook_id: '2',
      title: 'bda co4,co5.pdf',
      type: 'pdf',
      content: 'Aviation management systems leverage Apache Hive for data warehousing and Apache Spark with GraphX for network analysis. These technologies enable efficient processing of massive flight schedules, airport connectivity analysis, and operational decision-making.',
      created_at: '2025-10-06T00:00:00Z'
    }]
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [isAddSourcesModalOpen, setIsAddSourcesModalOpen] = useState(false);

  const handleCreateNotebook = () => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title: 'Untitled Notebook',
      emoji: '📓',
      created_at: new Date().toISOString(),
      sources_count: 0
    };
    setNotebooks([...notebooks, newNotebook]);
    setSelectedNotebookId(newNotebook.id);
    setSources({ ...sources, [newNotebook.id]: [] });
    setMessages({ ...messages, [newNotebook.id]: [] });
    setIsAddSourcesModalOpen(true);
  };

  const handleSelectNotebook = (id: string) => {
    setSelectedNotebookId(id);
  };

  const handleAddSource = (source: { title: string; type: string; content: string }) => {
    if (!selectedNotebookId) return;

    const newSource: Source = {
      id: Date.now().toString(),
      notebook_id: selectedNotebookId,
      title: source.title,
      type: source.type as any,
      content: source.content,
      created_at: new Date().toISOString()
    };

    const notebookSources = sources[selectedNotebookId] || [];
    setSources({
      ...sources,
      [selectedNotebookId]: [...notebookSources, newSource]
    });

    setNotebooks(notebooks.map(nb =>
      nb.id === selectedNotebookId
        ? { ...nb, sources_count: nb.sources_count + 1 }
        : nb
    ));
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedNotebookId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      notebook_id: selectedNotebookId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString()
    };

    const notebookMessages = messages[selectedNotebookId] || [];
    setMessages({
      ...messages,
      [selectedNotebookId]: [...notebookMessages, userMessage]
    });

    try {
      const notebookSources = sources[selectedNotebookId] || [];
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          sources: notebookSources,
          model: 'llama-3.1-70b-versatile'
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          notebook_id: selectedNotebookId,
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString()
        };

        setMessages({
          ...messages,
          [selectedNotebookId]: [...notebookMessages, userMessage, assistantMessage]
        });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        notebook_id: selectedNotebookId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running and your GROQ_API_KEY is set.',
        created_at: new Date().toISOString()
      };

      setMessages({
        ...messages,
        [selectedNotebookId]: [...notebookMessages, userMessage, errorMessage]
      });
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedNotebookId) return [];

    const notebookSources = sources[selectedNotebookId] || [];
    if (notebookSources.length === 0) return [];

    const sourcesContent = notebookSources.map(s => `${s.title}: ${s.content}`).join('\n\n');
    const topic = `Generate 10 flashcards based on the following sources. Return a JSON array of objects with "id" (number), "question" (string), and "answer" (string) fields. Return ONLY the JSON array, no additional text:\n\n${sourcesContent}`;

    try {
      const response = await fetch('http://localhost:5000/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          model: 'llama-3.1-70b-versatile'
        })
      });

      const data = await response.json();

      if (data.success) {
        try {
          let content = data.report.trim();
          if (content.startsWith('```json')) content = content.substring(7);
          if (content.startsWith('```')) content = content.substring(3);
          if (content.endsWith('```')) content = content.slice(0, -3);
          const flashcards = JSON.parse(content.trim());
          return Array.isArray(flashcards) ? flashcards : [];
        } catch (e) {
          console.error('Error parsing flashcards:', e);
          return [];
        }
      } else {
        throw new Error(data.error || 'Failed to generate flashcards');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Failed to generate flashcards. Please make sure the backend server is running and your GROQ_API_KEY is set.');
      return [];
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedNotebookId) return [];

    const notebookSources = sources[selectedNotebookId] || [];
    if (notebookSources.length === 0) return [];

    const sourcesContent = notebookSources.map(s => `${s.title}: ${s.content}`).join('\n\n');
    const topic = `Generate 10 multiple choice quiz questions based on the following sources. Return a JSON array of objects with "id" (number), "question" (string), "options" (array of objects with "label" (A/B/C/D) and "text" fields), and "correctAnswer" (string - the label). Return ONLY the JSON array, no additional text:\n\n${sourcesContent}`;

    try {
      const response = await fetch('http://localhost:5000/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          model: 'llama-3.1-70b-versatile'
        })
      });

      const data = await response.json();

      if (data.success) {
        try {
          let content = data.report.trim();
          if (content.startsWith('```json')) content = content.substring(7);
          if (content.startsWith('```')) content = content.substring(3);
          if (content.endsWith('```')) content = content.slice(0, -3);
          const questions = JSON.parse(content.trim());
          return Array.isArray(questions) ? questions : [];
        } catch (e) {
          console.error('Error parsing quiz questions:', e);
          return [];
        }
      } else {
        throw new Error(data.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please make sure the backend server is running and your GROQ_API_KEY is set.');
      return [];
    }
  };

  const selectedNotebook = notebooks.find(nb => nb.id === selectedNotebookId);

  return (
    <>
      {!selectedNotebookId ? (
        <NotebookList
          notebooks={notebooks}
          onCreateNotebook={handleCreateNotebook}
          onSelectNotebook={handleSelectNotebook}
        />
      ) : (
        selectedNotebook && (
          <NotebookDetail
            notebookId={selectedNotebook.id}
            notebookTitle={selectedNotebook.title}
            notebookEmoji={selectedNotebook.emoji}
            sources={sources[selectedNotebook.id] || []}
            messages={messages[selectedNotebook.id] || []}
            onClose={() => setSelectedNotebookId(null)}
            onAddSource={() => setIsAddSourcesModalOpen(true)}
            onSendMessage={handleSendMessage}
            onGenerateFlashcards={handleGenerateFlashcards}
            onGenerateQuiz={handleGenerateQuiz}
          />
        )
      )}

      {selectedNotebook && (
        <AddSourcesModal
          isOpen={isAddSourcesModalOpen}
          onClose={() => setIsAddSourcesModalOpen(false)}
          onAddSource={handleAddSource}
          notebookTitle={selectedNotebook.title}
        />
      )}
    </>
  );
}

export default App;
