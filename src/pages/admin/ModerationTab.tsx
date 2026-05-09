import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { 
  MessageCircle, ChevronRight, User, Clock, 
  Check, Edit2, Save, Trash2, Car, X, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { markNotificationsByTypeAsRead, markNotificationsByLinkAsRead } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ModerationTab({ notifications = [] }: { notifications?: any[] }) {
  const { subtab } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"pending" | "published">(subtab === "published" ? "published" : "pending");
  const [editingItem, setEditingItem] = useState<{ id: string, type: string, content: string } | null>(null);

  useEffect(() => {
    if (subtab === "published") {
      setViewMode("published");
    } else {
      setViewMode("pending");
      // Mark as read when viewing pending
      markTypeRead("QA");
      markTypeRead("COMMENT");
    }
  }, [subtab]);

  const { mutate: markTypeRead } = useMutation({
    mutationFn: markNotificationsByTypeAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    }
  });

  const { mutate: markLinkRead } = useMutation({
    mutationFn: markNotificationsByLinkAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    }
  });

  const { data: moderation, isLoading: isModerationLoading } = useQuery({ 
    queryKey: ["moderation-pending"], 
    queryFn: () => fetcher("/api/moderation/pending") 
  });

  const { data: approvedContent, isLoading: isApprovedLoading } = useQuery({ 
    queryKey: ["moderation-approved"], 
    queryFn: () => fetcher("/api/moderation/approved") 
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: string }) => {
      const res = await fetch(`${API_BASE}/api/moderation/${type}/${id}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Approval failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-pending"] });
      queryClient.invalidateQueries({ queryKey: ["moderation-approved"] });
      toast.success("Item approved");
    },
    onError: () => toast.error("Failed to approve")
  });

  const deleteModerationMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: string }) => {
      const res = await fetch(`${API_BASE}/api/moderation/${type}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-pending"] });
      queryClient.invalidateQueries({ queryKey: ["moderation-approved"] });
      toast.success("Item deleted");
    },
    onError: () => toast.error("Failed to delete")
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, type, content }: { id: string, type: string, content: string }) => {
      const res = await fetch(`${API_BASE}/api/moderation/${type}/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-pending"] });
      queryClient.invalidateQueries({ queryKey: ["moderation-approved"] });
      toast.success("Content updated successfully");
      setEditingItem(null);
    },
    onError: () => toast.error("Failed to update content")
  });

  const isModeration = viewMode === "pending";
  const sourceData = isModeration ? moderation : approvedContent;

  const allItems = [
    ...(sourceData?.questions?.map((q: any) => ({ ...q, type: 'question', label: 'Question' })) || []),
    ...(sourceData?.answers?.map((a: any) => ({ ...a, type: 'answer', label: 'Answer' })) || []),
    ...(sourceData?.comments?.map((c: any) => ({ ...c, type: 'comment', label: 'Comment' })) || [])
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const changeView = (mode: "pending" | "published") => {
    setViewMode(mode);
    if (mode === "pending") {
      navigate("/admin/moderation");
      markTypeRead("QA");
      markTypeRead("COMMENT");
    } else {
      navigate("/admin/moderation/published");
    }
  };

  if (isModerationLoading || isApprovedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60E677]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0A2E1F] tracking-tight">
              {isModeration ? "Content Moderation" : "Published Content Manager"}
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {allItems.length} {isModeration ? "Items Pending Approval" : "Approved Items"}
            </p>
          </div>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl">
           <button 
             onClick={() => changeView("pending")}
             className={cn(
               "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
               isModeration ? "bg-white text-[#2F884D] shadow-sm" : "text-gray-400 hover:text-gray-600"
             )}
           >
             Pending Approval
           </button>
           <button 
             onClick={() => changeView("published")}
             className={cn(
               "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
               !isModeration ? "bg-white text-[#2F884D] shadow-sm" : "text-gray-400 hover:text-gray-600"
             )}
           >
             Live Content
           </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {allItems.length > 0 ? (
          allItems.map((item: any) => {
            const hasUnread = notifications.some(n => !n.isRead && n.link?.includes(item.id));
            return (
              <Card key={`${item.type}-${item.id}`} className={cn("border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden bg-white relative", hasUnread && "ring-1 ring-red-100")}>
                {hasUnread && (
                  <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-10 animate-pulse" />
                )}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-1 gap-6 min-w-0 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[#0A2E1F] font-black text-xl flex-shrink-0 relative">
                      {(item.user?.name || 'U')[0]}
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-md tracking-tighter">{item.label}</span>
                          <h3 className="text-sm font-black text-[#0A2E1F]">{item.user?.name}</h3>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        {editingItem?.id === item.id ? (
                          <textarea 
                            className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm text-gray-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[100px]"
                            value={editingItem.content}
                            onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm text-gray-600 font-medium leading-relaxed italic">"{item.content}"</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                          <Car className="w-3 h-3" />
                          <span>Source: {item.listing?.details?.title || item.question?.content || 'General Content'}</span>
                        </div>
                        {editingItem?.id !== item.id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setEditingItem({ id: item.id, type: item.type, content: item.content });
                              markLinkRead(`/admin/moderation#${item.type}-${item.id}`);
                            }}
                            className="h-8 px-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase">Edit</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                    {editingItem?.id === item.id ? (
                      <>
                        <Button 
                          onClick={() => updateMutation.mutate({ id: item.id, type: item.type, content: editingItem.content })}
                          disabled={updateMutation.isPending}
                          className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black active:scale-[0.98]"
                        >
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingItem(null)}
                          className="flex-1 md:flex-none h-11 px-6 rounded-xl border-gray-200 text-gray-500 font-bold"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        {isModeration && (
                          <Button 
                            onClick={() => {
                              approveMutation.mutate({ id: item.id, type: item.type });
                              markLinkRead(`/admin/moderation#${item.type}-${item.id}`);
                            }}
                            disabled={approveMutation.isPending}
                            className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black shadow-lg shadow-green-100/50 active:scale-[0.98]"
                          >
                            Approve
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            deleteModerationMutation.mutate({ id: item.id, type: item.type });
                            markLinkRead(`/admin/moderation#${item.type}-${item.id}`);
                          }}
                          disabled={deleteModerationMutation.isPending}
                          className="flex-1 md:flex-none h-11 px-6 rounded-xl border-red-50 text-red-500 hover:bg-red-50 font-bold"
                        >
                          {isModeration ? "Reject" : "Delete"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
             {isModeration ? (
               <Check className="w-16 h-16 text-green-100 mx-auto mb-4" />
             ) : (
               <MessageCircle className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             )}
             <p className="text-gray-400 font-bold uppercase tracking-widest">
               {isModeration ? "No pending content to moderate." : "No published content found."}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
