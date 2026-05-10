import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { 
  FileText, Lightbulb, Star, GitCompare, 
  BookOpen, Newspaper, List, Search, 
  ChevronRight, ChevronLeft, Calendar, Clock
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tips")) return <Lightbulb className="w-4 h-4" />;
  if (n.includes("spotlight")) return <Star className="w-4 h-4" />;
  if (n.includes("comparison")) return <GitCompare className="w-4 h-4" />;
  if (n.includes("guide")) return <BookOpen className="w-4 h-4" />;
  if (n.includes("news")) return <Newspaper className="w-4 h-4" />;
  if (n.includes("list")) return <List className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show 9 per page for a nice 3x3 grid

  const { data: blogsData, isLoading: isBlogsLoading } = useQuery({
    queryKey: ["blogs", currentPage, selectedCategory, searchTerm, sortBy],
    queryFn: () => {
      const params = new URLSearchParams({
        isPublished: "true",
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy
      });
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      return fetcher(`/api/blogs?${params.toString()}`);
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => fetcher("/api/blogs/categories")
  });

  const blogs = blogsData?.data || [];
  const totalBlogs = blogsData?.total || 0;
  const totalPages = blogsData?.totalPages || 1;

  const featured = blogs[0]; // Simplified for now


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden flex items-center"
        style={{ minHeight: 440, background: "#0A2E1F" }}
      >
        {/* Full-width background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/blog_hero.png"
            alt="Classic cars at a garage"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
          {/* Dark green gradient: solid on left → fully transparent right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0A2E1F 0%, #0A2E1F 20%, rgba(10,46,31,0.88) 30%, rgba(10,46,31,0.55) 42%, rgba(10,46,31,0.15) 58%, transparent 70%)"
            }}
          />
        </div>

        {/* Text content */}
        <div className="relative z-10 w-full px-8 md:px-14 lg:px-20" style={{ paddingTop: 40, paddingBottom: 88 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)" }} className="hover:text-white transition-colors">Home</a>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>Blog</span>
          </div>

          {/* Heading */}
          <h1
            className="text-white font-black leading-none tracking-tight mb-4"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", maxWidth: 540 }}
          >
            Made in <span style={{ color: "#60E677" }}>US</span> Blog
          </h1>

          {/* Subtitle */}
          <p
            className="font-medium leading-relaxed mb-7"
            style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", maxWidth: 380 }}
          >
            News, guides and tips about American classic cars,<br />
            imports and the automotive world.
          </p>

          {featured && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
               <span className="px-2 py-0.5 bg-[#60E677] text-[#0A2E1F] text-[10px] font-black uppercase rounded-md mb-3 inline-block">Featured Post</span>
               <h2 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">{featured.title}</h2>
               <p className="text-white/70 text-sm font-medium line-clamp-2 mb-4">{featured.excerpt}</p>
               <Link 
                 to={`/blog/${featured.slug}`}
                 className="inline-flex items-center gap-2 text-[#60E677] font-black text-sm hover:underline"
               >
                 Read Full Article
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
               </Link>
            </div>
          )}
        </div>

        {/* Concave (smile) curve to match the screenshot */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="block w-full"
            style={{ height: 60 }}
          >
            <path
              d="M0,100 L0,40 Q720,100 1440,40 L1440,100 Z"
              fill="#f9fafb"
            />
          </svg>
        </div>


      </section>

      {/* ── Main Content ── */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col lg:flex-row gap-10">

        {/* Left: Articles Grid */}
        <div className="w-full lg:w-3/4">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="flex flex-col gap-1 mb-4 sm:mb-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl text-white" style={{ background: "#0A2E1F" }}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="font-black text-3xl" style={{ color: "#0A2E1F" }}>Latest Articles</h2>
              </div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-14">
                Showing {blogs.length} of {totalBlogs} results
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-lg pl-4 pr-8 py-2 font-bold focus:outline-none appearance-none cursor-pointer"
                  style={{ color: "#0A2E1F" }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {isBlogsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm" />
               ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-bold text-lg">No articles found.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog: any) => {
                  const date = new Date(blog.publishedAt || blog.createdAt);
                  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  const day = date.getDate().toString().padStart(2, '0');
                  const year = date.getFullYear();

                  return (
                    <Link
                      key={blog.id}
                      to={`/blog/${blog.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                      style={{ textDecoration: "none" }}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gray-100" style={{ height: 210 }}>
                        <img
                          src={formatUrl(blog.imageUrl) || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80"}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Date Badge */}
                        <div
                          className="absolute top-4 left-4 text-white flex flex-col items-center justify-center rounded-xl shadow-lg"
                          style={{ background: "#0A2E1F", padding: "8px 10px", minWidth: 48 }}
                        >
                          <span className="font-black tracking-widest" style={{ fontSize: 9 }}>{month}</span>
                          <span className="font-black leading-none my-0.5" style={{ fontSize: 22 }}>{day}</span>
                          <span className="font-black" style={{ fontSize: 9, color: "#60E677" }}>{year}</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="font-black uppercase tracking-widest text-gray-400 mb-2 block" style={{ fontSize: 10 }}>
                          {blog.category?.name || "General"}
                        </span>
                        <h3
                          className="font-black leading-tight mb-3 transition-colors line-clamp-2"
                          style={{ fontSize: "1.1rem", color: "#0A2E1F" }}
                        >
                          {blog.title}
                        </h3>
                        <p className="font-medium text-gray-500 line-clamp-3 mb-5 flex-grow" style={{ fontSize: "0.875rem" }}>
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-1 font-black text-sm mt-auto transition-colors" style={{ color: "#0A2E1F" }}>
                          Read More
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16 pb-8">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => prev - 1);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0A2E1F] hover:bg-[#60E677] hover:border-[#60E677] disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-gray-100 transition-all shadow-sm group"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={cn(
                              "w-12 h-12 rounded-2xl font-black text-sm transition-all shadow-sm",
                              currentPage === pageNum 
                                ? "bg-[#0A2E1F] text-white scale-110 shadow-lg" 
                                : "bg-white border border-gray-100 text-gray-400 hover:border-[#60E677] hover:text-[#0A2E1F]"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} className="text-gray-300 font-black">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => prev + 1);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0A2E1F] hover:bg-[#60E677] hover:border-[#60E677] disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-gray-100 transition-all shadow-sm group"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-7">

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 bg-white border border-gray-200 rounded-2xl font-bold focus:outline-none shadow-sm transition-shadow"
              style={{ height: 52, color: "#0A2E1F" }}
              onFocus={e => e.target.style.boxShadow = "0 0 0 2px #60E677"}
              onBlur={e => e.target.style.boxShadow = ""}
            />
          </div>

          {/* Categories */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-lg mb-4 pb-4 border-b border-gray-100" style={{ color: "#0A2E1F" }}>Categories</h3>
            <div className="flex flex-col gap-0.5">
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                    setCurrentPage(1);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-colors font-bold text-sm"
                  style={{
                    background: selectedCategory === cat.id ? "rgba(96,230,119,0.1)" : "transparent",
                    color: selectedCategory === cat.id ? "#0A2E1F" : "#4b5563"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ 
                      background: selectedCategory === cat.id ? "#60E677" : "rgba(10,46,31,0.05)",
                      color: selectedCategory === cat.id ? "#0A2E1F" : "#0A2E1F"
                    }}>
                       {getCategoryIcon(cat.name)}
                    </div>
                    <span>{cat.name}</span>
                  </div>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md" style={{ fontSize: 10, fontWeight: 700 }}>{cat._count?.blogs || 0}</span>
                </button>
              ))}
            </div>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
                className="w-full mt-4 border font-bold rounded-xl text-sm transition-colors"
                style={{ height: 40, borderColor: "#60E677", color: "#0A2E1F" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(96,230,119,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Featured Article */}
          {featured && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-lg mb-4 pb-4 border-b border-gray-100" style={{ color: "#0A2E1F" }}>Latest Post</h3>
              <Link to={`/blog/${featured.slug}`} className="group block" style={{ textDecoration: "none" }}>
                <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100" style={{ height: 150 }}>
                  <img
                    src={formatUrl(featured.imageUrl) || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80"}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span className="font-black uppercase tracking-widest block mb-1.5" style={{ fontSize: 10, color: "#60E677" }}>
                  {featured.category?.name || "General"}
                </span>
                <h4 className="font-black leading-tight mb-2 line-clamp-2 transition-colors" style={{ fontSize: "0.95rem", color: "#0A2E1F" }}>
                  {featured.title}
                </h4>
                <p className="text-gray-500 font-medium line-clamp-3 mb-3" style={{ fontSize: "0.8rem" }}>
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-1 font-black text-gray-400 transition-colors" style={{ fontSize: "0.75rem" }}>
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ── Newsletter Footer ── */}
      <section style={{ background: "#0A2E1F", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "auto" }}>
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-2xl"
              style={{ width: 48, height: 48, border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60E677" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h4 className="text-white font-black text-lg md:text-xl">Don't Miss Any Updates!</h4>
              <p className="font-medium" style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                Subscribe to our newsletter and get the latest articles and tips straight to your inbox.
              </p>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2" style={{ maxWidth: 420 }}>
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-grow rounded-xl font-medium focus:outline-none transition-colors"
              style={{
                height: 52, padding: "0 1.25rem",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white"
              }}
              onFocus={e => e.target.style.borderColor = "#60E677"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            />
            <button
              className="font-black rounded-xl transition-all whitespace-nowrap active:scale-95"
              style={{ height: 52, padding: "0 1.75rem", background: "#60E677", color: "#0A2E1F" }}
              onMouseEnter={e => e.currentTarget.style.background = "#52c967"}
              onMouseLeave={e => e.currentTarget.style.background = "#60E677"}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      </div>
      <Footer />
    </>
  );
}