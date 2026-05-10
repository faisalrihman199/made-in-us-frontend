import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInquiry, formatUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { MessageCircle, Mail, Phone, MapPin, Car, ExternalLink, ChevronLeft, Calendar, User, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLoading from '@/components/AdminLoading';

const AdminInquiry = () => {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getInquiry(id)
        .then(setInquiry)
        .catch(err => {
          console.error(err);
          toast.error("Failed to load inquiry details");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <AdminLoading message="Loading inquiry details..." />;
  if (!inquiry) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
         <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 mx-auto">
           <MessageCircle className="w-10 h-10 text-gray-200" />
         </div>
         <h1 className="text-3xl font-black text-[#0A2E1F] mb-2">Inquiry Not Found</h1>
         <p className="text-gray-400 mb-8 max-w-sm font-medium">The inquiry you are looking for might have been deleted.</p>
         <Link to="/admin/queries">
           <Button className="px-8 h-12 bg-[#60E677] text-[#0A2E1F] font-black rounded-xl hover:bg-[#52c967]">
             Back to Queries
           </Button>
         </Link>
      </div>
      <Footer />
    </div>
  );

  const createdAt = new Date(inquiry.createdAt);

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-12 px-4 md:py-20">
        <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <Link to="/admin/queries/all-inquiries">
              <Button variant="ghost" className="rounded-xl hover:bg-white text-gray-500 font-bold group">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to All Inquiries
              </Button>
            </Link>
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
               <Clock className="w-4 h-4 text-[#60E677]" />
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Received: {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A2E1F] to-[#1D4D3A] p-10 md:p-12 text-white relative">
               <div className="absolute top-0 right-0 p-12 opacity-5 hidden md:block">
                  <MessageCircle className="w-64 h-64 rotate-12" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-[#60E677] text-[#0A2E1F] rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/20">
                           {inquiry.type} INQUIRY
                        </span>
                     </div>
                     <h1 className="text-4xl md:text-5xl font-black tracking-tight">{inquiry.firstName} {inquiry.lastName}</h1>
                     <div className="flex flex-wrap gap-6 text-white/70 text-sm font-medium">
                        <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-[#60E677]" />
                           <a href={`mailto:${inquiry.email}`} className="hover:text-white transition-colors">{inquiry.email}</a>
                        </div>
                        {inquiry.phone && (
                           <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#60E677]" />
                              <a href={`tel:${inquiry.phone}`} className="hover:text-white transition-colors">{inquiry.phone}</a>
                           </div>
                        )}
                        {inquiry.country && (
                           <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#60E677]" />
                              <span>{inquiry.country}</span>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <a href={`mailto:${inquiry.email}`}>
                        <Button className="h-14 px-8 bg-[#60E677] text-[#0A2E1F] hover:bg-[#52c967] rounded-2xl font-black shadow-xl shadow-green-500/10">
                           Reply via Email
                        </Button>
                     </a>
                  </div>
               </div>
            </div>

            <div className="p-8 md:p-16">
               <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
                  {/* Message Content */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#0A2E1F] border border-gray-100">
                           <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-[#0A2E1F] tracking-tight">Customer Message</h3>
                     </div>
                     <div className="bg-[#F8FAF9] p-8 md:p-12 rounded-[2rem] border border-gray-100 relative group">
                        <span className="absolute top-6 left-8 text-6xl text-[#60E677]/20 font-serif pointer-events-none">“</span>
                        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed relative z-10">
                           {inquiry.message || "No message content provided."}
                        </p>
                     </div>
                  </div>

                  {/* Related Vehicle if any */}
                  {inquiry.listing && (
                     <div className="space-y-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#0A2E1F] border border-gray-100">
                              <Car className="w-5 h-5" />
                           </div>
                           <h3 className="text-xl font-black text-[#0A2E1F] tracking-tight">Inquired Vehicle</h3>
                        </div>
                        
                        <div className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:border-[#60E677]/20 transition-all">
                           <div className="w-full md:w-64 h-44 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-50 shadow-sm">
                              <img 
                                 src={formatUrl(inquiry.listing.details?.firstImage)} 
                                 alt={inquiry.listing.details?.title}
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                           </div>
                           <div className="flex-1 flex flex-col justify-center space-y-4">
                              <div className="space-y-1">
                                 <h4 className="text-2xl font-black text-[#0A2E1F] tracking-tight group-hover:text-[#2F884D] transition-colors line-clamp-2">
                                    {inquiry.listing.details?.title}
                                 </h4>
                                 <p className="text-2xl font-black text-[#60E677]">{inquiry.listing.details?.priceText}</p>
                              </div>
                              <div className="flex flex-wrap gap-4 pt-2">
                                 <Link to={`/cars/${inquiry.listing.id}/view`} className="flex-1 md:flex-none">
                                    <Button className="w-full md:w-auto h-12 px-8 bg-[#0A2E1F] text-white hover:bg-[#1D4D3A] rounded-xl font-bold flex items-center gap-2">
                                       View Vehicle <ExternalLink className="w-4 h-4" />
                                    </Button>
                                 </Link>
                                 <a href={inquiry.listing.url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none">
                                    <Button variant="outline" className="w-full md:w-auto h-12 px-8 border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50">
                                       Source Site
                                    </Button>
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Technical Meta Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-100">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry ID</p>
                        <p className="text-xs font-bold text-gray-600 truncate">{inquiry.id}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                        <p className="text-xs font-bold text-gray-600">{inquiry.type}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zip Code</p>
                        <p className="text-xs font-bold text-gray-600">{inquiry.zipCode || 'N/A'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Country Code</p>
                        <p className="text-xs font-bold text-gray-600">{inquiry.countryCode || 'N/A'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminInquiry;
