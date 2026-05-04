import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import QandAModal from './QandAModal';
import AddQuestionModal from './AddQuestionModal';
import ViewAllQAModal from './ViewAllQAModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCarQA, addCarQuestion, voteQuestion, type QuestionResponse } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface QAItem {
  id: string;
  question: string;
  answer?: string;
  askedBy: {
    username: string;
    avatar: string;
    verified: boolean;
    score: number;
  };
  answeredBy?: {
    username: string;
    avatar: string;
    verified: boolean;
    score: number;
  };
  votes: number;
  timeAgo: string;
  hasAnswer: boolean;
}

interface QandAProps {
  carId?: string;
  carModel?: string;
}

const QandA: React.FC<QandAProps> = ({ carId, carModel = "Vehicle" }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  const [showQAModal, setShowQAModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);

  const { data: qaResponse, isLoading } = useQuery({
    queryKey: ["car-qa", carId],
    queryFn: () => fetchCarQA(carId!),
    enabled: !!carId
  });

  const mapToQAItem = (q: QuestionResponse): QAItem => ({
    id: q.id,
    question: q.content,
    answer: q.answers[0]?.content || "",
    askedBy: {
      username: q.user.name || q.user.email.split("@")[0],
      avatar: "/favicon.png",
      verified: false,
      score: 0,
    },
    answeredBy: q.answers[0] ? {
      username: q.answers[0].user.name || q.answers[0].user.email.split("@")[0],
      avatar: "/favicon.png",
      verified: true,
      score: 0,
    } : undefined,
    votes: q.votes,
    timeAgo: formatDistanceToNow(new Date(q.createdAt), { addSuffix: true }),
    hasAnswer: q.answers.length > 0
  });

  const qaData = qaResponse?.items.map(mapToQAItem) || [];

  const voteMutation = useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) => voteQuestion(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-qa", carId] });
    },
    onError: () => {
      toast.error("Failed to vote. Are you logged in?");
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: (content: string) => addCarQuestion(carId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-qa", carId] });
      navigate("/confirmation");
    },
    onError: () => {
      toast.error("Failed to post question. Are you logged in?");
    }
  });

  const handleVote = (id: string, increment: boolean) => {
    voteMutation.mutate({ id, direction: increment ? "up" : "down" });
  };

  const handleViewAnswer = (qa: QAItem) => {
    setSelectedQA(qa);
    setShowQAModal(true);
  };

  const handleAddQuestion = (question: string) => {
    addQuestionMutation.mutate(question);
  };

  return (
    <section className="mb-8 md:w-[70vw]" >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Vehicle Q&A ({qaData.length})
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Ask a question
          </button>
          {qaData.length > 0 && (
            <button 
              onClick={() => setShowViewAllModal(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View all
            </button>
          )}
        </div>
      </div>

      {qaData.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-8 py-3 rounded-lg"
          >
            Ask a question
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {qaData.map((qa) => (
            <div key={qa.id} className="flex-none w-80 border rounded-lg p-4 bg-white">
              {/* Question */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <img 
                    src={qa.askedBy.avatar} 
                    alt={qa.askedBy.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{qa.askedBy.username}</span>
                      {qa.askedBy.verified && (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-green-600 text-sm">↑{qa.askedBy.score}</span>
                      <span className="text-gray-500 text-sm">{qa.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium mb-2">
                  <span className="font-semibold">Q:</span> {qa.question}
                </p>
              </div>

              {/* Answer */}
              {qa.hasAnswer && qa.answer && qa.answeredBy ? (
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <img 
                      src={qa.answeredBy.avatar} 
                      alt={qa.answeredBy.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{qa.answeredBy.username}</span>
                        {qa.answeredBy.verified && (
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <span className="text-green-600 text-sm">↑{qa.answeredBy.score}</span>
                        <span className="text-gray-500 text-sm">{qa.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">A:</span> {qa.answer.length > 80 ? `${qa.answer.substring(0, 80)}...` : qa.answer}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded text-center">
                  <p className="text-sm text-gray-600">No answer yet</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleVote(qa.id, true)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium">{qa.votes}</span>
                  <button 
                    onClick={() => handleVote(qa.id, false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                {qa.hasAnswer && qa.answer && (
                  <button 
                    onClick={() => handleViewAnswer(qa)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View answer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <QandAModal
        qa={selectedQA}
        carModel={carModel}
        isOpen={showQAModal}
        onClose={() => setShowQAModal(false)}
      />
      
      <AddQuestionModal
        carModel={carModel}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddQuestion}
      />

      <ViewAllQAModal
        qaData={qaData}
        carModel={carModel}
        isOpen={showViewAllModal}
        onClose={() => setShowViewAllModal(false)}
        onVote={handleVote}
      />
    </section>
  );
};

export default QandA;