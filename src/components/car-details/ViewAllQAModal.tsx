import React from 'react';
import { X, ChevronUp } from 'lucide-react';
import { QAItem } from './QandA';

interface ViewAllQAModalProps {
  qaData: QAItem[];
  carModel: string;
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string, increment: boolean) => void;
}

const ViewAllQAModal: React.FC<ViewAllQAModalProps> = ({ 
  qaData, 
  carModel, 
  isOpen, 
  onClose, 
  onVote 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Q&A – {carModel}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {qaData.map((qa, index) => (
            <div key={qa.id}>
              {/* Question */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={qa.askedBy.avatar} 
                    alt={qa.askedBy.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{qa.askedBy.username}</span>
                      {qa.askedBy.verified && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-green-600">↑{qa.askedBy.score}</span>
                      <span className="text-gray-500 text-sm">{qa.timeAgo}</span>
                      <button className="ml-auto text-gray-400 hover:text-gray-600">
                        <span className="text-xs">⋯</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-gray-900 leading-relaxed mb-3">
                  <span className="font-semibold">Q:</span> {qa.question}
                </p>
              </div>

              {/* Answer */}
              {qa.hasAnswer && qa.answer && qa.answeredBy ? (
                <div className="ml-0 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img 
                      src={qa.answeredBy.avatar} 
                      alt={qa.answeredBy.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{qa.answeredBy.username}</span>
                        {qa.answeredBy.verified && (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <span className="text-green-600">↑{qa.answeredBy.score}</span>
                        <span className="text-gray-500 text-sm">{qa.timeAgo}</span>
                        <button className="ml-auto text-gray-400 hover:text-gray-600">
                          <span className="text-xs">⋯</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-900 leading-relaxed mb-3">
                    <span className="font-semibold">A:</span> {qa.answer}
                  </p>
                </div>
              ) : (
                <div className="ml-0 mb-4 p-3 bg-gray-50 rounded text-center">
                  <p className="text-sm text-gray-600">This question hasn't been answered yet.</p>
                </div>
              )}

              {/* Vote button */}
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={() => onVote(qa.id, true)}
                  className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded border"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">{qa.votes}</span>
                </button>
              </div>

              {/* Separator line - only show if not the last item */}
              {index < qaData.length - 1 && (
                <hr className="border-gray-200 my-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllQAModal;
