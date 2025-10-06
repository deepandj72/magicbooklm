import { X, Upload, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AddSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: { title: string; type: string; content: string }) => void;
  notebookTitle: string;
}

export default function AddSourcesModal({ isOpen, onClose, onAddSource, notebookTitle }: AddSourcesModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');

  if (!isOpen) return null;

  const handleTextSubmit = () => {
    if (textContent.trim() && textTitle.trim()) {
      onAddSource({
        title: textTitle,
        type: 'text',
        content: textContent
      });
      setTextContent('');
      setTextTitle('');
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onAddSource({
          title: file.name,
          type: 'file',
          content: content
        });
        onClose();
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-12 z-50 overflow-y-auto">
      <div className="bg-[#1f1f1f] rounded-2xl w-full max-w-4xl mx-4 mb-12 border border-[#3d3d3d]">
        <div className="flex items-center justify-between p-6 border-b border-[#3d3d3d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3851dd] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-normal text-white">{notebookTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-white">Add sources</h3>
            <button className="px-4 py-2 rounded-lg bg-[#3851dd] hover:bg-[#4961ed] text-white text-sm font-medium transition-colors flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover sources
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Sources let NotebookLM base its responses on the information that matters most to you.
            <br />
            (Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)
          </p>

          <div className="bg-[#2d2d2d] rounded-xl border-2 border-dashed border-[#4d4d4d] p-12 mb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#3851dd] flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-white font-medium mb-2">Upload sources</h4>
              <p className="text-gray-400 text-sm mb-4">
                Drag & drop or{' '}
                <label className="text-[#6b8afd] cursor-pointer hover:underline">
                  choose file
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>
                {' '}to upload
              </p>
              <p className="text-gray-500 text-xs">
                Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <button className="p-4 rounded-xl bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors border border-[#3d3d3d] flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#3d3d3d] flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <div className="text-white text-sm font-medium">Google Workspace</div>
              </div>
            </button>

            <button className="p-4 rounded-xl bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors border border-[#3d3d3d] flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#3d3d3d] flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                </svg>
              </div>
              <div>
                <div className="text-white text-sm font-medium">Google Drive</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className="p-4 rounded-xl bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors border border-[#3d3d3d] flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#3d3d3d] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-white text-sm font-medium">Paste text</div>
              </div>
            </button>
          </div>

          {activeTab === 'text' && (
            <div className="bg-[#2d2d2d] rounded-xl p-6 border border-[#3d3d3d]">
              <input
                type="text"
                placeholder="Source title"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-[#3851dd]"
              />
              <textarea
                placeholder="Paste your text here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                className="w-full bg-[#1f1f1f] border border-[#3d3d3d] rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#3851dd]"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 rounded-lg hover:bg-[#3d3d3d] text-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTextSubmit}
                  className="px-4 py-2 rounded-lg bg-[#3851dd] hover:bg-[#4961ed] text-white transition-colors"
                >
                  Add source
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
