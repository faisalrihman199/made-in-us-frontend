import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ChevronLeft, Calendar, User, Tag,
  Share2, MessageCircle, Clock, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUrl } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const BlogRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  try {
    // Handle potential double parsing if content was double stringified
    let data = typeof content === 'string' ? JSON.parse(content) : content;
    if (typeof data === 'string') data = JSON.parse(data);

    if (data && data.blocks) {
      return (
        <div className="space-y-12">
          {data.blocks.map((block: any) => {
            switch (block.type) {
              case "header":
                const Level = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
                return (
                  <Level
                    key={block.id}
                    className={cn(
                      "font-black text-[#0A2E1F] tracking-tight mt-16 mb-6",
                      block.data.level === 1 ? "text-4xl md:text-5xl" :
                        block.data.level === 2 ? "text-3xl md:text-4xl" :
                          "text-2xl md:text-3xl"
                    )}
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              case "paragraph":
                return (
                  <p
                    key={block.id}
                    className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              case "list":
                const ListTag = block.data.style === "ordered" ? "ol" : "ul";
                return (
                  <ListTag
                    key={block.id}
                    className={cn(
                      "space-y-4 pl-6 text-lg font-medium text-gray-600",
                      block.data.style === "ordered" ? "list-decimal" : "list-disc"
                    )}
                  >
                    {block.data.items.map((item: any, idx: number) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item.content }} />
                    ))}
                  </ListTag>
                );
              case "image":
                return (
                  <div key={block.id} className="my-12 space-y-4">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 group">
                      <img
                        src={formatUrl(block.data.file?.url || block.data.url)}
                        alt={block.data.caption || ""}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {block.data.caption && (
                      <p className="text-center text-sm font-black text-gray-400 italic">
                        {block.data.caption}
                      </p>
                    )}
                  </div>
                );
              case "quote":
                return (
                  <blockquote key={block.id} className="my-12 p-8 md:p-12 bg-gray-50 rounded-[2.5rem] border-l-[8px] border-[#60E677] relative overflow-hidden">
                    <div className="absolute top-4 right-8 text-[#60E677]/10 pointer-events-none">
                      <MessageCircle className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-2xl md:text-3xl font-black text-[#0A2E1F] italic leading-tight mb-4">
                        "{block.data.text}"
                      </p>
                      {block.data.caption && (
                        <cite className="text-sm font-black text-[#2F884D] uppercase tracking-widest not-italic flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-[#60E677]" />
                          {block.data.caption}
                        </cite>
                      )}
                    </div>
                  </blockquote>
                );
              case "delimiter":
                return <div key={block.id} className="py-16 flex justify-center"><div className="w-24 h-2 bg-gradient-to-r from-transparent via-[#60E677] to-transparent rounded-full opacity-40" /></div>;
              default:
                return null;
            }
          })}
        </div>
      );
    }
  } catch (e) {
    return (
      <div
        className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-[#0A2E1F] prose-p:font-medium prose-p:text-gray-600 prose-p:leading-relaxed prose-img:rounded-[2rem] prose-strong:text-[#0A2E1F]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return null;
};

export default function BlogDetail() {
  const { slug } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetcher(`/api/blogs/slug/${slug}`),
    enabled: !!slug
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const { data: relatedBlogsData } = useQuery({
    queryKey: ["related-blogs", blog?.categoryId],
    queryFn: () => fetcher(`/api/blogs?isPublished=true&categoryId=${blog?.categoryId}&limit=4`),
    enabled: !!blog?.categoryId
  });

  const relatedBlogs = relatedBlogsData?.data || [];

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#60E677] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 mx-auto">
            <Tag className="w-12 h-12 text-[#60E677]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A2E1F] mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-md text-lg font-medium">The article you are looking for might have been moved or deleted.</p>
          <Link to="/blog">
            <button className="px-10 py-4 bg-[#60E677] text-[#0A2E1F] font-black rounded-2xl hover:bg-[#52c967] transition-all shadow-xl shadow-green-100 active:scale-95">
              Back to Blog
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const publishDate = new Date(blog.createdAt);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white font-sans selection:bg-[#60E677] selection:text-[#0A2E1F]">

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-50">
          <div className="h-full bg-gradient-to-r from-[#60E677] to-[#2F884D] transition-all duration-300" style={{ width: '0%' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[70vh] md:h-[80vh] bg-[#0A2E1F] overflow-hidden">
          <img
            src={formatUrl(blog.imageUrl) || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&h=900&fit=crop&q=80"}
            alt={blog.title}
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F] via-[#0A2E1F]/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
            <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="flex items-center justify-center gap-4">
                <span className="px-5 py-2 bg-[#60E677] text-[#0A2E1F] text-xs font-black uppercase rounded-full tracking-widest shadow-xl shadow-green-500/20">
                  {blog.category?.name || "General"}
                </span>
                <div className="flex items-center gap-2 text-white/60 font-black text-xs uppercase tracking-widest">
                   <Clock className="w-4 h-4 text-[#60E677]" />
                   <span>{Math.ceil((blog.content?.length || 0) / 1000) + 2} min read</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                {blog.title}
              </h1>
            </div>
          </div>

          {/* Absolute Meta Section */}
          <div className="absolute bottom-24 left-0 w-full z-20">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 px-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <User className="w-6 h-6 text-[#60E677]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Published By</p>
                  <p className="text-white font-black">{blog.author || "Made in US Team"}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Calendar className="w-6 h-6 text-[#60E677]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Post Date</p>
                  <p className="text-white font-black">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1 h-2 bg-[#60E677] rounded-full" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex flex-col lg:flex-row gap-20 xl:gap-8">

            {/* Sidebar Left: Share & Back */}
            <aside className="lg:w-20 lg:sticky mt-5 lg:top-32 h-fit space-y-8 hidden lg:block">
              <Link to="/blog" className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0A2E1F] hover:bg-[#60E677] transition-all group shadow-sm">
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleShare}
                  className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0A2E1F] hover:bg-[#60E677] transition-all shadow-sm"
                  title="Share Article"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 bg-white rounded-[3rem] p-10 md:p-20 lg:p-24 -mt-16 relative z-10 shadow-2xl shadow-black/5 border border-gray-50">

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-16">
                  <p className="text-2xl md:text-3xl font-black text-gray-400 italic leading-relaxed pl-10 relative">
                    <span className="absolute left-0 top-0 text-7xl text-[#60E677]/30 font-serif leading-none">“</span>
                    {blog.excerpt}
                  </p>
                </div>
              )}

              {/* Dynamic Content Rendering */}
              <BlogRenderer content={blog.content} />

              {/* Tags & Share Footer */}
              <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-2.5 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-100 hover:border-[#60E677] transition-colors cursor-default">American Cars</span>
                  <span className="px-5 py-2.5 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-100 hover:border-[#60E677] transition-colors cursor-default">Import Guide</span>
                  <span className="px-5 py-2.5 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-100 hover:border-[#60E677] transition-colors cursor-default">Market Trends</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Share Article</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="w-12 h-12 rounded-xl bg-[#0A2E1F] text-white flex items-center justify-center hover:bg-[#60E677] hover:text-[#0A2E1F] transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Right Sidebar (Optional Desktop) */}
            <aside className="lg:w-80 h-fit space-y-8 mt-5 hidden xl:block">
              <div className="p-8 bg-[#0A2E1F] rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Want to import a car?</h3>
                  <p className="text-white/60 font-medium mb-8 text-sm">We handle everything from inspection to delivery at your doorstep.</p>
                  <Link to="/find-vehicle" className="block w-full py-4 bg-[#60E677] text-[#0A2E1F] text-center font-black rounded-2xl hover:bg-white transition-all">
                    Get Started
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-[#60E677]/10 transition-colors" />
              </div>

              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <h3 className="text-xl font-black text-[#0A2E1F] mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-[#60E677] rounded-full" />
                  Subscribe
                </h3>
                <p className="text-gray-500 font-medium mb-6 text-sm">Get the latest classic car news and import guides in your inbox.</p>
                <div className="space-y-3">
                  <input type="email" placeholder="Email Address" className="w-full h-14 bg-white border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-4 focus:ring-[#60E677]/5" />
                  <button className="w-full py-4 bg-[#0A2E1F] text-white font-black rounded-2xl hover:bg-[#1D4D3A] transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        <section className="bg-gray-50 py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-[#0A2E1F] tracking-tight">You might also like</h2>
                <p className="text-gray-500 font-medium text-lg">Continue reading our latest automotive insights.</p>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 text-[#0A2E1F] font-black rounded-2xl hover:border-[#60E677] transition-all group">
                All Articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {relatedBlogs.filter((b: any) => b.id !== blog.id).slice(0, 3).map((item: any) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={formatUrl(item.imageUrl) || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#0A2E1F] uppercase tracking-widest">
                      {item.category?.name || "General"}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-black text-[#0A2E1F] mb-4 line-clamp-2 leading-tight group-hover:text-[#2F884D] transition-colors">{item.title}</h3>
                    <p className="text-gray-500 font-medium line-clamp-3 text-sm leading-relaxed mb-6 flex-grow">{item.excerpt}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-[#60E677]" />
                        <span>{Math.ceil((item.content?.length || 0) / 1000) + 2} min read</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#60E677] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
