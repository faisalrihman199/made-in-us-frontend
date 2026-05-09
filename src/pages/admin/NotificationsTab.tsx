import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, NotificationItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2, BellRing, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NotificationsTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => getNotifications(100),
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success("All notifications marked as read");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2F884D]" />
      </div>
    );
  }

  const notifications = data?.notifications || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#0A2E1F]">Notifications</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your system alerts and incoming requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending || notifications.every(n => n.isRead)}
            className="bg-[#2F884D] hover:bg-[#25733f] text-white rounded-xl shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark All as Read
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
            <Inbox className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">No notifications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif: NotificationItem) => (
              <div 
                key={notif.id} 
                className={`p-6 flex flex-col md:flex-row gap-4 items-start md:items-center transition-colors hover:bg-gray-50 ${!notif.isRead ? 'bg-[#f4fbf6]' : 'bg-white'}`}
              >
                <div className="p-3 bg-[#EAF5EE] text-[#2F884D] rounded-xl shrink-0">
                  <BellRing className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-[15px] ${!notif.isRead ? 'font-black text-[#0A2E1F]' : 'font-bold text-gray-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="bg-[#60E677]/20 text-[#2F884D] text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:ml-4">
                  {notif.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 text-[#0A2E1F] font-bold hover:bg-gray-100"
                      onClick={() => {
                        if (!notif.isRead) markAsReadMutation.mutate(notif.id);
                        navigate(notif.link as string);
                      }}
                    >
                      View
                    </Button>
                  )}
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-[#2F884D] hover:bg-[#2F884D]/10"
                      onClick={() => markAsReadMutation.mutate(notif.id)}
                      title="Mark as Read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-red-500 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(notif.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
