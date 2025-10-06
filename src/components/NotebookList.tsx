import { Plus, Grid3x3, List, Check } from 'lucide-react';
import { Notebook } from '../types';

interface NotebookListProps {
  notebooks: Notebook[];
  onCreateNotebook: () => void;
  onSelectNotebook: (id: string) => void;
}

export default function NotebookList({ notebooks, onCreateNotebook, onSelectNotebook }: NotebookListProps) {
  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-6">
            <button className="px-4 py-2 rounded-full bg-[#2d2d2d] text-white font-medium hover:bg-[#3d3d3d] transition-colors">
              All
            </button>
            <button className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-[#2d2d2d] transition-colors">
              My notebooks
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors">
              <Check className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-lg bg-[#3851dd] hover:bg-[#4961ed] transition-colors">
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-normal mb-8 text-gray-200">Recent notebooks</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={onCreateNotebook}
            className="aspect-[4/3] rounded-xl bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-all duration-200 flex flex-col items-center justify-center gap-4 border border-[#3d3d3d] hover:border-[#4d4d4d] group"
          >
            <div className="w-16 h-16 rounded-full bg-[#3851dd] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <span className="text-lg font-light text-gray-300">Create new notebook</span>
          </button>

          {notebooks.map((notebook) => (
            <button
              key={notebook.id}
              onClick={() => onSelectNotebook(notebook.id)}
              className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#4a3a3f] to-[#2d2d2d] hover:from-[#5a4a4f] hover:to-[#3d3d3d] transition-all duration-200 flex flex-col items-start justify-between p-6 border border-[#3d3d3d] hover:border-[#4d4d4d] group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button className="p-1.5 rounded-lg bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              <div className="text-5xl mb-auto">{notebook.emoji}</div>

              <div className="w-full">
                <h3 className="text-lg font-normal text-white text-left mb-2 line-clamp-2">
                  {notebook.title}
                </h3>
                <p className="text-sm text-gray-400 text-left">
                  {new Date(notebook.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} · {notebook.sources_count} source{notebook.sources_count !== 1 ? 's' : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
