import React, { useState } from 'react';
import { 
  ChevronUp, ChevronDown, Flag, ArrowDown, X,
  Edit2, Trash, Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCarComments, addCarComment, voteComment, type CommentResponse, updateModerationItem, deleteModerationItem } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";




export interface CommentItem {
  id: string;
  type: 'comment';
  content: string;
  user: {
    username: string;
    avatar: string;
    verified: boolean;
    score: number;
  };
  votes: number;
  timeAgo: string;
  isReply?: boolean;
  replyTo?: string;
  replies?: CommentItem[];
}

interface VehicleCommentsProps {
  carId?: string;
  carModel?: string;
}

const VehicleComments: React.FC<VehicleCommentsProps> = ({ carId, carModel = "Vehicle" }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'newest' | 'most-upvoted'>('newest');
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");


  const { data: commentsResponse, isLoading } = useQuery({
    queryKey: ["car-comments", carId],
    queryFn: () => fetchCarComments(carId!),
    enabled: !!carId
  });

  const mapToCommentItem = (c: CommentResponse): CommentItem => ({
    id: c.id,
    type: 'comment',
    content: c.content,
    user: {
      username: c.user.name || c.user.email.split("@")[0],
      avatar: "/favicon.png",
      verified: false,
      score: 0,
    },
    votes: c.votes,
    timeAgo: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
    isReply: !!c.parentId,
    replies: c.replies?.map(mapToCommentItem)
  });

  const commentsData = commentsResponse?.items.map(mapToCommentItem) || [];

  const voteMutation = useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) => voteComment(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-comments", carId] });
    },
    onError: () => {
      toast.error("Failed to vote. Are you logged in?");
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: string | null }) => 
      addCarComment(carId!, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-comments", carId] });
      setNewComment('');
      setReplyToId(null);
      toast.success("Comment posted!");
    },
    onError: () => {
      toast.error("Failed to post comment. Are you logged in?");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ type, id, content }: { type: string, id: string, content: string }) => 
      updateModerationItem(type, id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-comments", carId] });
      toast.success("Comment updated");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update comment")
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: string, id: string }) => 
      deleteModerationItem(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-comments", carId] });
      toast.success("Comment deleted");
    },
    onError: () => toast.error("Failed to delete comment")
  });


  const handleVote = (id: string, increment: boolean) => {
    voteMutation.mutate({ id, direction: increment ? "up" : "down" });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment.trim(), parentId: replyToId });
  };

  const getFilteredData = () => {
    let filtered = [...commentsData];
    
    switch (activeTab) {
      case 'most-upvoted':
        return filtered.sort((a, b) => b.votes - a.votes);
      default: // newest
        return filtered;
    }
  };

  const filteredData = getFilteredData();
  const displayData = showAll ? filteredData : filteredData.slice(0, 4);

  return (
    <section className="mb-8">
      {/* Header with responsive layout */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <h2 className="text-2xl font-semibold">Comments</h2>
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('newest')}
              className={`whitespace-nowrap font-medium ${
                activeTab === 'newest'
                  ? 'text-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setActiveTab('most-upvoted')}
              className={`whitespace-nowrap font-medium ${
                activeTab === 'most-upvoted'
                  ? 'text-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Most Upvoted
            </button>
          </div>
        </div>
      </div>

      {/* Add Comment Input */}
      <div id="comment-input" className="mb-6 border rounded-lg p-4">
        {replyToId && (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-1 mb-2 rounded text-sm text-gray-600">
            <span>Replying to a comment</span>
            <button onClick={() => setReplyToId(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-start gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyToId ? "Add a Reply..." : "Add a Comment..."}
            className="flex-1 min-h-[60px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {displayData.map((item) => (
          <div key={item.id} className="border-b border-gray-100 pb-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <img 
                src={item.user.avatar} 
                alt={item.user.username}
                className="w-10 h-10 rounded-full"
              />
              
              <div className="flex-1">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{item.user.username}</span>
                  {item.user.verified && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-green-600">↑{item.user.score}</span>
                  <span className="text-gray-500 text-sm">{item.timeAgo}</span>
                  {isAdmin && editingId !== item.id && (
                    <div className="flex gap-1 ml-auto">
                      <button 
                        onClick={() => {
                          setEditingId(item.id);
                          setEditContent(item.content);
                        }}
                        className="p-1 text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Delete this comment?")) {
                            deleteMutation.mutate({ type: 'comment', id: item.id });
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>


                {/* Content */}
                {item.isReply && item.replyTo && (
                  <div className="text-green-600 text-sm mb-1">
                    Re: {item.replyTo}
                  </div>
                )}
                {editingId === item.id ? (
                  <div className="space-y-2 mb-3">
                    <textarea 
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateMutation.mutate({ type: 'comment', id: item.id, content: editContent })}
                        className="bg-green-600 hover:bg-green-700 h-8 text-[10px] font-bold"
                      >
                        <Save className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingId(null)}
                        className="h-8 text-[10px] font-bold"
                      >
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 mb-3 leading-relaxed">{item.content}</p>
                )}
                
                {/* Actions */}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleVote(item.id, true)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">{item.votes}</span>
                    <button 
                      onClick={() => handleVote(item.id, false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setReplyToId(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to input
                      // Actually better to just scroll to the input area
                      document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Reply
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                    <Flag className="w-3 h-3" />
                    Flag as inappropriate
                  </button>
                  {isAdmin && editingId !== item.id && (
                    <div className="flex items-center gap-2 ml-auto">
                      <button 
                        onClick={() => {
                          setEditingId(item.id);
                          setEditContent(item.content);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this comment?")) {
                            deleteMutation.mutate({ type: 'comment', id: item.id });
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>


                {/* Nested Replies */}
                {item.replies && item.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-50 pl-4">
                    {item.replies.map(reply => (
                      <div key={reply.id} className="pt-2">
                        <div className="flex items-start gap-3">
                          <img 
                            src={reply.user.avatar} 
                            alt={reply.user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{reply.user.username}</span>
                              <span className="text-gray-500 text-xs">{reply.timeAgo}</span>
                            </div>
                            <p className="text-gray-900 text-sm leading-relaxed">{reply.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => handleVote(reply.id, true)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-medium">{reply.votes}</span>
                              <button 
                                onClick={() => handleVote(reply.id, false)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {!showAll && filteredData.length > 4 && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowAll(true)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View all
          </button>
        </div>
      )}
    </section>
  );
};

export default VehicleComments;