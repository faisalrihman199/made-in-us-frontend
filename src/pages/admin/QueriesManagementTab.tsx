import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  FileText, Truck, Search, Calendar, CreditCard, 
  MessageCircle, ChevronRight, User, ArrowUpRight, 
  Clock, Trash, Filter, Mail, Phone, MapPin, 
  Car, ExternalLink, MoreHorizontal, X, ChevronDown, Check, Edit2, Save
} from "lucide-react";


import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { markNotificationsByTypeAsRead, markNotificationsByLinkAsRead } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

type ViewMode = "dashboard" | "all-shipping" | "all-inspections" | "all-reservations" | "all-find" | "all-subscriptions" | "all-inquiries";


const QuerySection = ({ title, data, icon: Icon, getLink, color, mode, unreadCount = 0, notifications = [], markLinkRead, changeView }: any) => (
  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
    <CardHeader className="p-6 md:p-8 pb-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0">
      <div className="flex items-center gap-4 relative">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-lg md:text-xl font-black text-[#0A2E1F] tracking-tight">{title}</CardTitle>
          <CardDescription className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
            {data?.length || 0} Total Requests
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 md:p-8 pt-4 md:pt-6">
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.slice(0, 4).map((item: any) => {
            const hasUnread = notifications.some((n: any) => !n.isRead && n.link?.includes(item.id));
            return (
              <div key={item.id} className="group flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-gray-50/30 hover:bg-white hover:border-[#60E677]/30 transition-all relative">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 text-[#0A2E1F] font-black text-xs flex-shrink-0 group-hover:bg-[#60E677]/10 group-hover:border-[#60E677]/20 transition-all relative">
                    {(item.firstName || item.name || item.fullName || 'U')[0]}
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-sm text-[#0A2E1F] truncate group-hover:text-[#2F884D] transition-colors">
                      {item.firstName || item.name || item.fullName} {item.lastName || ""}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <Clock className="w-2.5 h-2.5" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()} 
                        <span className="ml-1 text-gray-300">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {getLink ? (
                  <Link to={getLink(item.id)} onClick={() => markLinkRead(getLink(item.id))}>
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#60E677] hover:border-[#60E677]/20 group-hover:scale-110 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="ghost" size="icon" 
                    onClick={() => changeView(mode)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#60E677] hover:border-[#60E677]/20 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button 
            variant="ghost" 
            onClick={() => changeView(mode)}
            className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2F884D] hover:bg-[#60E677]/5 mt-2"
          >
            View All {data.length} Entries
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">No data available</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const ListView = ({ title, data, icon: Icon, endpoint, color, columns, actionLink, changeView, search, setSearch, notifications = [], markLinkRead, setConfirmDelete }: any) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    const isExpanding = !expandedIds.includes(id);
    setExpandedIds(prev => 
      isExpanding ? [...prev, id] : prev.filter(i => i !== id)
    );

    if (isExpanding && actionLink) {
      markLinkRead(actionLink(id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" size="icon" 
            onClick={() => changeView("dashboard")}
            className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0A2E1F]"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0A2E1F] tracking-tight">{title}</h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{data?.length || 0} Total Entries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search inquiries..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 w-full sm:w-[300px] rounded-xl border-gray-100 focus:ring-[#60E677]/20"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data && data.length > 0 ? (
          data.map((item: any) => {
            const hasUnread = notifications.some((n: any) => !n.isRead && n.link?.includes(item.id));
            return (
              <Card key={item.id} className={cn("border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden bg-white relative", hasUnread && "ring-1 ring-red-100")}>
                {hasUnread && (
                  <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-10 animate-pulse" />
                )}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-1 gap-6 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[#0A2E1F] font-black text-xl flex-shrink-0 relative">
                      {(item.firstName || item.name || item.fullName || 'U')[0]}
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black text-[#0A2E1F]">{item.firstName || item.name || item.fullName} {item.lastName || ""}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {item.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <Mail className="w-3.5 h-3.5" /> {item.email}
                            </div>
                          )}
                          {item.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <Phone className="w-3.5 h-3.5" /> {item.phone}
                            </div>
                          )}
                          {(item.country || item.destination) && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <MapPin className="w-3.5 h-3.5" /> {item.country || item.destination}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest inline-block">
                           {new Date(item.createdAt).toLocaleDateString()} — {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>
                    </div>

                    {columns(item)}
                    
                    {item.message && (
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{item.message}"</p>
                      </div>
                    )}

                    {/* Expanded Content */}
                    {expandedIds.includes(item.id) && (
                      <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Detailed Technical Information</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(item).map(([key, value]) => {
                              if (typeof value === 'object' || key === 'id' || key === 'createdAt' || key === 'updatedAt') return null;
                              return (
                                <div key={key} className="flex flex-col gap-1">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className="text-sm font-bold text-[#0A2E1F] truncate">{String(value)}</span>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto relative z-20">
                  {actionLink && (
                    <Link to={actionLink(item.id)} className="flex-1 md:flex-none" onClick={() => markLinkRead(actionLink(item.id))}>
                      <Button 
                        className="w-full h-11 rounded-xl bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white font-bold"
                      >
                        Take Action
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none h-11 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <ChevronDown className={cn("w-4 h-4 mr-2 transition-transform duration-300", expandedIds.includes(item.id) && "rotate-180")} /> 
                    {expandedIds.includes(item.id) ? "Less" : "Details"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none h-11 rounded-xl border-red-50 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold"
                    onClick={() => setConfirmDelete({ id: item.id, type: endpoint })}
                  >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
            );
          })
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
             <MessageCircle className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400 font-bold uppercase tracking-widest">No entries found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default function QueriesManagementTab({ initialView, unreadByType = {}, notifications = [] }: { initialView?: string, unreadByType?: Record<string, number>, notifications?: any[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>((initialView as ViewMode) || "dashboard");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: string } | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, type: string, content: string } | null>(null);


  // Sync state with URL when initialView changes (e.g. browser back/forward)
  useEffect(() => {
    if (initialView && initialView !== viewMode) {
      const mode = initialView as ViewMode;
      setViewMode(mode);
      
      const typeMap: Record<string, string> = {
        "all-shipping": "SHIPPING_QUOTE",
        "all-inspections": "INSPECTION",
        "all-reservations": "RESERVATION",
        "all-find": "FIND_REQUEST",
        "all-subscriptions": "SUBSCRIPTION",
        "all-inquiries": "INQUIRY"
      };

      if (typeMap[mode]) {
        markTypeRead(typeMap[mode]);
      }
    } else if (!initialView) {
      setViewMode("dashboard");
    }
  }, [initialView]);

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

  const changeView = (mode: ViewMode) => {
    setViewMode(mode);
    
    // Mark notifications as read based on mode
    const typeMap: Record<string, string> = {
      "all-shipping": "SHIPPING_QUOTE",
      "all-inspections": "INSPECTION",
      "all-reservations": "RESERVATION",
      "all-find": "FIND_REQUEST",
      "all-subscriptions": "SUBSCRIPTION",
      "all-inquiries": "INQUIRY"
    };

    if (typeMap[mode]) {
      markTypeRead(typeMap[mode]);
    }

    if (mode === "dashboard") {
      navigate("/admin/queries");
    } else {
      navigate(`/admin/queries/${mode}`);
    }
  };

  // Queries for all data types
  const { data: quotes, isLoading: l1 } = useQuery({ queryKey: ["shipping-quotes"], queryFn: () => fetcher("/api/shipping-quotes") });
  const { data: inspections, isLoading: l2 } = useQuery({ queryKey: ["inspections"], queryFn: () => fetcher("/api/vehicle-inspections") });
  const { data: reservations, isLoading: l3 } = useQuery({ queryKey: ["reservations"], queryFn: () => fetcher("/api/vehicle-reservations") });
  const { data: findRequests, isLoading: l4 } = useQuery({ queryKey: ["find-requests"], queryFn: () => fetcher("/api/vehicle-find-requests") });
  const { data: subscriptions, isLoading: l5 } = useQuery({ queryKey: ["subscriptions"], queryFn: () => fetcher("/api/subscriptions") });
  const { data: inquiries, isLoading: l6 } = useQuery({ 
    queryKey: ["inquiries", search], 
    queryFn: () => fetcher(`/api/inquiries?search=${search}`) 
  });



  const deleteMutation = useMutation({
    mutationFn: async ({ id, endpoint }: { id: string, endpoint: string }) => {
      const res = await fetch(`${API_BASE}/api/${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.endpoint] });
      toast.success("Query deleted successfully");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Failed to delete")
  });










  if (viewMode === "all-shipping") {
    return (
      <ListView 
        title="Shipping Quotes"
        data={quotes}
        icon={Truck}
        endpoint="shipping-quotes"
        color="bg-blue-50 text-blue-600"
        actionLink={(id: string) => `/admin/shipping-quote/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block mb-1">Vehicle</span>
              <span className="text-sm font-bold text-blue-900">{item.vehicleYear} {item.vehicleMake} {item.vehicleModel}</span>
            </div>
            <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block mb-1">Destination</span>
              <span className="text-sm font-bold text-indigo-900">{item.destination}</span>
            </div>
            <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">Status</span>
              <span className={cn("text-sm font-black", item.status === "PENDING" ? "text-amber-500" : "text-emerald-500")}>
                {item.status}
              </span>
            </div>
          </div>
        )}
      />
    );
  }

  if (viewMode === "all-inspections") {
    return (
      <ListView 
        title="Vehicle Inspections"
        data={inspections}
        icon={Search}
        endpoint="vehicle-inspections"
        color="bg-emerald-50 text-emerald-600"
        actionLink={(id: string) => `/admin/inspection/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">Vehicle & VIN</span>
              <span className="text-sm font-bold text-emerald-900">{item.make} • {item.vin}</span>
            </div>
            <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Seller</span>
              <span className="text-sm font-bold text-slate-900">{item.sellerName} ({item.sellerPhone})</span>
            </div>
            <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block mb-1">Payment</span>
              <span className="text-sm font-black text-blue-600">{item.status}</span>
            </div>
          </div>
        )}
      />
    );
  }

  if (viewMode === "all-reservations") {
    return (
      <ListView 
        title="Vehicle Reservations"
        data={reservations}
        icon={Calendar}
        endpoint="vehicle-reservations"
        color="bg-[#60E677]/10 text-[#2F884D]"
        actionLink={(id: string) => `/admin/reservation/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-green-50/30 rounded-xl border border-green-100/50">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-wider block mb-1">Vehicle Interest</span>
              <span className="text-sm font-bold text-green-900">{item.vehicleYear} {item.vehicleMake} {item.vehicleModel}</span>
            </div>
            <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-100/50">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1">Budget</span>
              <span className="text-sm font-bold text-amber-900">{item.budget}</span>
            </div>
            <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Notes</span>
              <span className="text-sm font-medium text-slate-600 truncate block">{item.notes || "No notes"}</span>
            </div>
          </div>
        )}
      />
    );
  }

  if (viewMode === "all-find") {
    return (
      <ListView 
        title="Find Vehicle Requests"
        data={findRequests}
        icon={FileText}
        endpoint="vehicle-find-requests"
        color="bg-violet-50 text-violet-600"
        actionLink={(id: string) => `/admin/find-vehicle/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-violet-50/30 rounded-xl border border-violet-100/50">
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-wider block mb-1">Requested Vehicle</span>
              <span className="text-sm font-bold text-violet-900">{item.year} {item.make} ({item.title})</span>
            </div>
            <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Listing URL</span>
              <a href={item.listingUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-500 truncate block hover:underline">
                {item.listingUrl}
              </a>
            </div>
          </div>
        )}
      />
    );
  }

  if (viewMode === "all-subscriptions") {
    return (
      <ListView 
        title="Membership Subscriptions"
        data={subscriptions}
        icon={CreditCard}
        endpoint="subscriptions"
        color="bg-amber-50 text-amber-600"
        actionLink={(id: string) => `/admin/subscription/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-100/50">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1">Plan</span>
              <span className="text-sm font-bold text-amber-900">{item.planName}</span>
            </div>
            <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Price</span>
              <span className="text-sm font-bold text-slate-900">{item.price}</span>
            </div>
            <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block mb-1">Method</span>
              <span className="text-sm font-black text-blue-600 uppercase">{item.paymentMethod}</span>
            </div>
          </div>
        )}
      />
    );
  }

  if (viewMode === "all-inquiries") {
    return (
      <ListView 
        title="Direct Inquiries"
        data={inquiries}
        icon={MessageCircle}
        endpoint="inquiries"
        color="bg-indigo-50 text-indigo-600"
        actionLink={(id: string) => `/admin/inquiry/${id}`}
        changeView={changeView}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        markLinkRead={markLinkRead}
        setConfirmDelete={setConfirmDelete}
        columns={(item: any) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block mb-1">Inquiry Type</span>
              <span className="text-sm font-bold text-indigo-900">{item.type}</span>
            </div>
            {item.listing && (
              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-1">Related Vehicle</span>
                <span className="text-sm font-bold text-emerald-900 truncate block">{item.listing.details?.title}</span>
              </div>
            )}
          </div>
        )}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
        <QuerySection 
          title="Shipping Quotes" 
          data={quotes} 
          icon={Truck} 
          mode="all-shipping"
          unreadCount={unreadByType.SHIPPING_QUOTE || 0}
          color="bg-blue-50 text-blue-600 border-blue-100"
          getLink={(id: string) => `/admin/shipping-quote/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
        <QuerySection 
          title="Vehicle Inspections" 
          data={inspections} 
          icon={Search} 
          mode="all-inspections"
          unreadCount={unreadByType.INSPECTION || 0}
          color="bg-emerald-50 text-emerald-600 border-emerald-100"
          getLink={(id: string) => `/admin/inspection/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
        <QuerySection 
          title="Reservations" 
          data={reservations} 
          icon={Calendar} 
          mode="all-reservations"
          unreadCount={unreadByType.RESERVATION || 0}
          color="bg-[#60E677]/10 text-[#2F884D] border-[#60E677]/20"
          getLink={(id: string) => `/admin/reservation/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
        <QuerySection 
          title="Find Requests" 
          data={findRequests} 
          icon={FileText} 
          mode="all-find"
          unreadCount={unreadByType.FIND_REQUEST || 0}
          color="bg-violet-50 text-violet-600 border-violet-100"
          getLink={(id: string) => `/admin/find-vehicle/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
        <QuerySection 
          title="Subscriptions" 
          data={subscriptions} 
          icon={CreditCard} 
          mode="all-subscriptions"
          unreadCount={unreadByType.SUBSCRIPTION || 0}
          color="bg-amber-50 text-amber-600 border-amber-100"
          getLink={(id: string) => `/admin/subscription/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
        <QuerySection 
          title="Direct Inquiries" 
          data={inquiries} 
          icon={MessageCircle} 
          mode="all-inquiries"
          unreadCount={unreadByType.INQUIRY || 0}
          color="bg-indigo-50 text-indigo-600 border-indigo-100"
          getLink={(id: string) => `/admin/inquiry/${id}`} 
          notifications={notifications}
          markLinkRead={markLinkRead}
          changeView={changeView}
        />
      </div>


      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#0A2E1F]">Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-medium">
              This action cannot be undone. This will permanently delete the query from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDelete && deleteMutation.mutate({ id: confirmDelete.id, endpoint: confirmDelete.type })}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
