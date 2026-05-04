import React from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { QAItem } from './QandA';

interface QandAModalProps {
  qa: QAItem | null;
  carModel: string;
  isOpen: boolean;
  onClose: () => void;
}

const QandAModal: React.FC<QandAModalProps> = ({ qa, carModel, isOpen, onClose }) => {
  if (!isOpen || !qa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
          {/* Question */}
          <div className="mb-6">
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
                </div>
              </div>
            </div>
            <p className="text-gray-900 leading-relaxed">
              <span className="font-semibold">Q:</span> {qa.question}
            </p>
            
            {/* Vote buttons for question */}
            <div className="flex items-center gap-2 mt-3">
              <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded">
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm">{qa.votes}</span>
              </button>
            </div>
          </div>

          {/* Answer */}
          {qa.hasAnswer && qa.answer && qa.answeredBy ? (
            <div className="bg-gray-50 rounded-lg p-4">
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
                  </div>
                </div>
              </div>
              <p className="text-gray-900 leading-relaxed">
                <span className="font-semibold">A:</span> {qa.answer}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">This question hasn't been answered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QandAModal;