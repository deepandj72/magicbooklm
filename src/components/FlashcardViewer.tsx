import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw, ExternalLink } from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardViewerProps {
  title: string;
  sourceCount: number;
  flashcards: Flashcard[];
  onClose: () => void;
}

export default function FlashcardViewer({ title, sourceCount, flashcards, onClose }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      handleFlip();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  useState(() => {
    window.addEventListener('keydown', handleKeyPress as any);
    return () => window.removeEventListener('keydown', handleKeyPress as any);
  });

  return (
    <div className="fixed inset-0 bg-[#1f1f1f] text-white flex flex-col z-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d3d3d]">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
            Studio <ChevronRight className="w-4 h-4" /> App
          </button>
        </div>
        <button className="p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-normal mb-2">{title}</h1>
            <p className="text-gray-400 text-sm">Based on {sourceCount} source{sourceCount !== 1 ? 's' : ''}</p>
          </div>

          <p className="text-center text-gray-400 text-sm mb-6">
            Press "Space" to flip, "←/→" to navigate
          </p>

          <div className="relative mb-8">
            <div
              className="relative min-h-[400px] bg-gradient-to-br from-[#2d3d2d] to-[#1f2f2f] rounded-3xl border border-[#3d4d3d] p-12 flex items-center justify-center cursor-pointer perspective-1000"
              onClick={handleFlip}
            >
              <div className={`transition-all duration-500 transform ${isFlipped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isFlipped ? 'hidden' : 'block'}`}>
                <p className="text-2xl font-light leading-relaxed text-center">
                  {currentCard.question}
                </p>
              </div>

              <div className={`absolute inset-0 p-12 flex flex-col items-center justify-center transition-all duration-500 transform ${isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${!isFlipped ? 'hidden' : 'block'}`}>
                <p className="text-xl font-light leading-relaxed text-center mb-6">
                  {currentCard.answer}
                </p>
                <button className="px-4 py-2 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Explain
                </button>
              </div>

              {!isFlipped && (
                <button className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm hover:text-white transition-colors">
                  See answer
                </button>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#2d2d2d] hover:bg-[#3d3d3d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex === flashcards.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#3851dd] hover:bg-[#4961ed] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button className="p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex-1 mx-6">
              <div className="relative h-1 bg-[#2d2d2d] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[#3851dd] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <span className="text-sm text-gray-400 min-w-[80px] text-right">
              {currentIndex + 1} / {flashcards.length} cards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
