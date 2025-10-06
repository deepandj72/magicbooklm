export interface Notebook {
  id: string;
  title: string;
  emoji: string;
  created_at: string;
  sources_count: number;
}

export interface Source {
  id: string;
  notebook_id: string;
  title: string;
  type: 'pdf' | 'text' | 'link' | 'youtube' | 'file';
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  notebook_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Report {
  id: string;
  notebook_id: string;
  type: 'audio_overview' | 'video_overview' | 'mind_map' | 'flashcards' | 'quiz' | 'report';
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}
