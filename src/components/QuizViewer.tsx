import { useState } from 'react';
import { ChevronRight, Maximize2, ChevronUp, ChevronDown } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correctAnswer: string;
}

interface QuizViewerProps {
  title: string;
  sourceCount: number;
  questions: QuizQuestion[];
  onClose: () => void;
}

export default function QuizViewer({ title, sourceCount, questions, onClose }: QuizViewerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

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

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-normal mb-2">{title}</h1>
              <p className="text-gray-400 text-sm">Based on {sourceCount} source{sourceCount !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b border-[#3d3d3d] pb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-gray-400 text-sm mt-1">{index + 1} / {questions.length}</span>
                    <p className="text-lg font-light flex-1">{question.question}</p>
                  </div>

                  <div className="space-y-3 ml-12">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswers[question.id] === option.label;
                      return (
                        <button
                          key={option.label}
                          onClick={() => handleSelectAnswer(question.id, option.label)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#3851dd]/20 border-2 border-[#3851dd]'
                              : 'bg-[#2d2d2d] border-2 border-transparent hover:border-[#3d3d3d]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-medium text-gray-300 flex-shrink-0">{option.label}.</span>
                            <span className="flex-1 text-gray-200">{option.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="px-8 py-3 rounded-xl bg-[#3851dd] hover:bg-[#4961ed] transition-colors text-white font-medium">
                Submit Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="w-12 border-l border-[#3d3d3d] flex flex-col items-center py-4 gap-2">
          <button className="p-2 hover:bg-[#2d2d2d] rounded transition-colors">
            <ChevronUp className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 w-1 bg-[#2d2d2d] rounded-full relative">
            <div className="absolute top-0 left-0 w-full bg-[#3851dd] rounded-full transition-all" style={{ height: '20%' }} />
          </div>
          <button className="p-2 hover:bg-[#2d2d2d] rounded transition-colors">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
