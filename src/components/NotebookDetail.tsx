import { useState, useRef, useEffect } from 'react';
import { X, Plus, Settings, Share2, ChevronRight, Sparkles, Send, FileText, Check, FileStack, Grid3x3, FileQuestion, Copy, Edit3 } from 'lucide-react';
import { Source, ChatMessage } from '../types';
import FlashcardViewer from './FlashcardViewer';
import QuizViewer from './QuizViewer';

interface NotebookDetailProps {
  notebookId: string;
  notebookTitle: string;
  notebookEmoji: string;
  sources: Source[];
  messages: ChatMessage[];
  onClose: () => void;
  onAddSource: () => void;
  onSendMessage: (message: string) => Promise<void>;
  onGenerateFlashcards: () => Promise<any[]>;
  onGenerateQuiz: () => Promise<any[]>;
}

export default function NotebookDetail({
  notebookTitle,
  notebookEmoji,
  sources,
  messages,
  onClose,
  onAddSource,
  onSendMessage,
  onGenerateFlashcards,
  onGenerateQuiz
}: NotebookDetailProps) {
  const [activeTab, setActiveTab] = useState<'sources' | 'chat' | 'studio'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [activeViewer, setActiveViewer] = useState<'flashcards' | 'quiz' | null>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSelectedSources(sources.map(s => s.id));
  }, [sources]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleGenerateFlashcards = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    try {
      const cards = await onGenerateFlashcards();
      setFlashcards(cards);
      setActiveViewer('flashcards');
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    try {
      const questions = await onGenerateQuiz();
      setQuizQuestions(questions);
      setActiveViewer('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const studioCards = [
    { id: 'flashcards', title: 'Flashcards', icon: FileStack, color: 'from-pink-500/20 to-pink-600/20', onClick: handleGenerateFlashcards },
    { id: 'quiz', title: 'Quiz', icon: FileQuestion, color: 'from-teal-500/20 to-teal-600/20', onClick: handleGenerateQuiz }
  ];

  if (activeViewer === 'flashcards' && flashcards.length > 0) {
    return (
      <FlashcardViewer
        title={`${notebookTitle} Flashcards`}
        sourceCount={sources.length}
        flashcards={flashcards}
        onClose={() => setActiveViewer(null)}
      />
    );
  }

  if (activeViewer === 'quiz' && quizQuestions.length > 0) {
    return (
      <QuizViewer
        title={`${notebookTitle} Quiz`}
        sourceCount={sources.length}
        questions={quizQuestions}
        onClose={() => setActiveViewer(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1f1f1f] text-white flex flex-col z-50">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#3d3d3d]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3851dd] flex items-center justify-center text-xl">
            {notebookEmoji}
          </div>
          <h1 className="text-lg font-normal">{notebookTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors flex items-center gap-2 text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors">
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-[#3d3d3d] flex flex-col">
          <div className="p-4 border-b border-[#3d3d3d]">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2d2d2d] transition-colors flex items-center justify-between">
              <span className="text-white font-medium">Sources</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedSources(sources.map(s => s.id))}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Select all sources
              </button>
            </div>

            {sources.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-4">No sources added yet</p>
                <button
                  onClick={onAddSource}
                  className="text-[#6b8afd] hover:underline text-sm"
                >
                  Add your first source
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => toggleSourceSelection(source.id)}
                    className={`w-full p-3 rounded-lg transition-colors text-left flex items-start gap-3 ${
                      selectedSources.includes(source.id)
                        ? 'bg-[#3851dd]/20 border border-[#3851dd]'
                        : 'bg-[#2d2d2d] border border-[#3d3d3d] hover:border-[#4d4d4d]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedSources.includes(source.id)
                        ? 'bg-[#3851dd]'
                        : 'border border-[#4d4d4d]'
                    }`}>
                      {selectedSources.includes(source.id) && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white truncate">{source.title}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onAddSource}
              className="w-full mt-4 px-4 py-2.5 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors flex items-center justify-center gap-2 text-sm border border-[#3d3d3d]"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>

            <button className="w-full mt-2 px-4 py-2.5 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors flex items-center justify-center gap-2 text-sm border border-[#3d3d3d]">
              <Sparkles className="w-4 h-4" />
              Discover
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 border-b border-[#3d3d3d]">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'text-white border-b-2 border-[#3851dd]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'studio'
                    ? 'text-white border-b-2 border-[#3851dd]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Studio
              </button>
            </div>
            <button className="p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-4">{notebookEmoji}</div>
                    <h2 className="text-2xl font-normal mb-2">{notebookTitle}</h2>
                    {sources.length > 0 && (
                      <p className="text-gray-400 mb-6">{sources.length} source{sources.length !== 1 ? 's' : ''}</p>
                    )}
                    {sources.length === 0 && (
                      <p className="text-gray-400 mb-6">
                        Add sources to start chatting with your notebook
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className={message.role === 'user' ? 'text-right' : ''}>
                        {message.role === 'assistant' && (
                          <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-[#3851dd] flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="prose prose-invert prose-sm max-w-none">
                                <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button className="p-1.5 rounded hover:bg-[#2d2d2d] transition-colors" title="Copy">
                                  <Copy className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1.5 rounded hover:bg-[#2d2d2d] transition-colors" title="Save to note">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {message.role === 'user' && (
                          <div className="inline-block bg-[#3851dd] rounded-2xl px-4 py-2.5 text-white max-w-xl">
                            {message.content}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#3851dd] flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <div className="flex gap-2 items-center text-gray-400">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-[#3d3d3d] p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Start typing..."
                      disabled={isLoading || sources.length === 0}
                      rows={3}
                      className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#3851dd] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputMessage.trim() || isLoading || sources.length === 0}
                      className="absolute right-3 bottom-3 p-2 rounded-full bg-[#3851dd] hover:bg-[#4961ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {sources.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-normal mb-6 text-gray-200">Studio output will be saved here.</h2>
                <p className="text-gray-400 mb-8">
                  After adding sources, click to generate Flashcards or Quiz!
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {studioCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.id}
                        onClick={card.onClick}
                        disabled={sources.length === 0 || isLoading}
                        className={`p-6 rounded-xl bg-gradient-to-br ${card.color} border border-[#3d3d3d] hover:border-[#4d4d4d] transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#2d2d2d] flex items-center justify-center group-hover:scale-110 transition-transform">
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          <Edit3 className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        </div>
                        <h3 className="text-lg font-medium text-white">{card.title}</h3>
                      </button>
                    );
                  })}
                </div>

                <button className="w-full mt-6 px-6 py-4 rounded-xl bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-dashed border-[#4d4d4d] transition-colors flex items-center justify-center gap-2 text-gray-400">
                  <Plus className="w-5 h-5" />
                  Add note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
