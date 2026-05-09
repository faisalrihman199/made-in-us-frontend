import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { 
  Database, FileText, Star, MessageSquare, 
  ChevronLeft, LayoutGrid, Home, LogOut,
  Settings, Bell, Search, User, Menu,
  Clock, RefreshCcw, ShieldCheck
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getNotifications } from "@/lib/api";

import ManageDataTab from "./admin/ManageDataTab";
import BlogManagementTab from "./admin/BlogManagementTab";
import ReviewManagementTab from "./admin/ReviewManagementTab";
import QueriesManagementTab from "./admin/QueriesManagementTab";
import ModerationTab from "./admin/ModerationTab";


const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const AdminDashboard = () => {
  const { user, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const { tab, subtab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default to 'data' if no tab is provided in URL
  const activeTab = tab || "data";

  // Live Stats for Notifications
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/data/stats`);
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: notifData } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => getNotifications(100),
    refetchInterval: 30000,
  });
  const unreadNotifications = notifData?.unreadCount || 0;


  const totalPending = (stats?.pendingQuotes || 0) + 
                       (stats?.pendingInspections || 0) + 
                       (stats?.pendingReservations || 0) + 
                       (stats?.pendingFindRequests || 0) + 
                       (stats?.pendingSubscriptions || 0);

  // Track previous count to show notification on increase
  const [prevTotal, setPrevTotal] = useState<number | null>(null);

  useEffect(() => {
    if (prevTotal !== null && totalPending > prevTotal) {
      toast.info("New Query Received", {
        description: `You have ${totalPending} pending requests to review.`,
        action: {
          label: "View",
          onClick: () => navigate("/admin/queries")
        },
        duration: 5000,
      });
    }
    setPrevTotal(totalPending);
  }, [totalPending, navigate, prevTotal]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isLoading) return null;

  const isAdmin = user?.role === "admin";
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { id: "data", label: "Data Management", icon: Database },
    { id: "blogs", label: "Blog Management", icon: FileText },
    { id: "reviews", label: "Reviews Management", icon: Star },
    { id: "queries", label: "User Queries", icon: MessageSquare },
    { id: "moderation", label: "Moderation", icon: ShieldCheck },
  ];

  const getUnreadForTab = (tabId: string) => {
    if (!notifData?.unreadByType) return 0;
    const ub = notifData.unreadByType;
    
    switch(tabId) {
      case 'queries':
        return (ub.INQUIRY || 0) + (ub.RESERVATION || 0) + (ub.INSPECTION || 0) + 
               (ub.FIND_REQUEST || 0) + (ub.SUBSCRIPTION || 0) + (ub.SHIPPING_QUOTE || 0);
      case 'moderation':
        return (ub.COMMENT || 0) + (ub.QA || 0);
      case 'blogs':
        return 0; // Blogs themselves don't have unread items yet
      case 'reviews':
        return (ub.REVIEW || 0);
      default:
        return 0;
    }
  };


  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0A2E1F] text-white transition-all duration-300 ease-in-out flex flex-col z-50 fixed md:relative h-full",
          isSidebarOpen ? "w-[280px]" : "w-[80px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-[#1D4D3A] p-2 rounded-xl">
            <Home className="w-6 h-6 text-[#60E677]" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight">MADE-IN-US</span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4 scrollbar-hide">
          {menuItems.map((item) => {
            const unread = getUnreadForTab(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/admin/${item.id}`);
                  if (window.innerWidth < 768) setIsMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative",
                  activeTab === item.id 
                    ? "bg-[#1D4D3A] text-[#60E677] shadow-lg shadow-black/10" 
                    : "hover:bg-white/5 text-white/70 hover:text-white"
                )}
              >
                <div className="relative">
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform group-active:scale-90",
                    activeTab === item.id ? "text-[#60E677]" : "text-white/40 group-hover:text-white"
                  )} />
                  {unread > 0 && !isSidebarOpen && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#0A2E1F] shadow-sm animate-in zoom-in duration-300">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
                {isSidebarOpen && (
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                )}
                {unread > 0 && isSidebarOpen && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#60E677] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5 text-white/40" />
              {isSidebarOpen && <span className="font-bold text-sm">Return to Home</span>}
            </button>
          </Link>
          <div className="p-4 bg-[#1D4D3A]/50 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1D4D3A] flex items-center justify-center text-[#60E677] font-black border border-[#60E677]/20">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate">{user.name || 'Admin'}</span>
                <span className="text-[10px] text-white/40 truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 shadow-sm">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen(!isMobileOpen);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
              className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-[#0A2E1F] transition-all"
            >
              <Menu className="w-6 h-6 md:w-6 md:h-6" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-black text-[#0A2E1F] tracking-tight capitalize truncate max-w-[150px] md:max-w-none">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-[#2F884D]">{activeTab}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar Removed as requested */}
            <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 transition-all relative group">
              <Bell className={cn("w-5 h-5", totalPending > 0 && "text-red-500 animate-pulse")} />
              {totalPending > 0 && (
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
              
              {/* Tooltip for total pending */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending Tasks</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#0A2E1F]">
                       <span>User Queries</span>
                       <span className={totalPending > 0 ? "text-red-500" : ""}>{totalPending}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-[#0A2E1F]">
                       <span>Unread Notifications</span>
                       <span className={unreadNotifications > 0 ? "text-red-500" : ""}>{unreadNotifications}</span>
                    </div>
                 </div>
              </div>
            </button>

            <div className="hidden sm:block w-px h-8 bg-gray-100 mx-1 md:mx-2" />
            <Button 
              variant="ghost" 
              className="font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl px-2 md:px-4"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide bg-[#F4F7F6]">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {activeTab === "data" && <ManageDataTab />}
            {activeTab === "blogs" && <BlogManagementTab />}
            {activeTab === "reviews" && <ReviewManagementTab notifications={notifData?.notifications} />}
            {activeTab === "queries" && <QueriesManagementTab initialView={subtab} unreadByType={notifData?.unreadByType} notifications={notifData?.notifications} />}
            {activeTab === "moderation" && <ModerationTab notifications={notifData?.notifications} />}

            {/* Global Refresh Button */}

            <div className="fixed bottom-8 right-8 z-50">
              <Button
                onClick={() => {
                  queryClient.invalidateQueries();
                  toast.success("Dashboard data refreshed");
                }}
                className="w-14 h-14 rounded-full bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white shadow-2xl shadow-black/20 group transition-all"
              >
                <RefreshCcw className="w-6 h-6 group-active:rotate-180 transition-transform duration-500" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
