import { useState } from "react";

const BLOGS = [
  {
    id: 1, slug: "how-to-import-classic-car",
    title: "How to Import a Classic Car from the USA to Europe",
    category: "GUIDES", categoryIcon: "guides",
    excerpt: "Step-by-step guide to import your American classic car safely and legally to Europe.",
    month: "MAY", day: "15", year: "2025",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f4?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 2, slug: "top-10-american-classic-cars",
    title: "Top 10 American Classic Cars to Buy in 2025",
    category: "TOP LISTS", categoryIcon: "lists",
    excerpt: "Discover our selection of the 10 most popular and valuable classic cars in 2025.",
    month: "MAY", day: "12", year: "2025",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 3, slug: "mustang-vs-camaro",
    title: "Ford Mustang vs Chevrolet Camaro: Which One to Choose?",
    category: "COMPARISONS", categoryIcon: "compare",
    excerpt: "Compare performance, style, price and history of these two iconic American muscle cars.",
    month: "MAY", day: "08", year: "2025",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 4, slug: "1957-chevrolet-bel-air",
    title: "1957 Chevrolet Bel Air: The Timeless Icon",
    category: "CLASSIC SPOTLIGHT", categoryIcon: "spotlight",
    excerpt: "The history, features and value of one of the most iconic classic cars of all time.",
    month: "MAY", day: "05", year: "2025",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 5, slug: "what-to-check-before-buying",
    title: "What to Check Before Buying a Classic Car in the USA",
    category: "BUYING TIPS", categoryIcon: "tips",
    excerpt: "Essential checklist to avoid costly mistakes and buy with confidence.",
    month: "MAY", day: "01", year: "2025",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 6, slug: "classic-car-market-trends",
    title: "Classic Car Market Trends: What to Expect in 2025",
    category: "MARKET NEWS", categoryIcon: "market",
    excerpt: "Analysis of the classic car market and our predictions for the upcoming year.",
    month: "APR", day: "28", year: "2025",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80"
  }
];

const CATEGORIES = [
  { id: "guides", name: "Guides", count: 12 },
  { id: "lists", name: "Top Lists", count: 8 },
  { id: "comparisons", name: "Comparisons", count: 6 },
  { id: "spotlight", name: "Classic Spotlight", count: 10 },
  { id: "tips", name: "Buying Tips", count: 9 },
  { id: "market", name: "Market News", count: 7 },
];

const FEATURED = {
  slug: "shelby-gt500-legend",
  title: "The Shelby GT500: A Legend That Lives On",
  category: "CLASSIC SPOTLIGHT",
  excerpt: "The story of the Shelby GT500, one of the most legendary American muscle cars of all time.",
  image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&q=80"
};

function GuidesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function ListsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}
function CompareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" />
    </svg>
  );
}
function SpotlightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function TipsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function MarketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

const categoryIcons = {
  guides: <GuidesIcon />, lists: <ListsIcon />, comparisons: <CompareIcon />,
  spotlight: <SpotlightIcon />, tips: <TipsIcon />, market: <MarketIcon />,
};

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const filtered = BLOGS
    .filter(b => {
      const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory ? b.categoryIcon === selectedCategory : true;
      return matchSearch && matchCat;
    })
    .sort((a, b) => sortBy === "newest"
      ? new Date(`${b.month} ${b.day} ${b.year}`).getTime() - new Date(`${a.month} ${a.day} ${a.year}`).getTime()
      : new Date(`${a.month} ${a.day} ${a.year}`).getTime() - new Date(`${b.month} ${b.day} ${b.year}`).getTime()
    );


  return (
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

          {/* CTA Button */}
          <button
            className="flex items-center gap-2.5 font-black text-white rounded-xl transition-all active:scale-95"
            style={{ height: 48, padding: "0 1.75rem", background: "#2a7a44", fontSize: "0.9rem" }}
            onMouseEnter={e => e.currentTarget.style.background = "#225f36"}
            onMouseLeave={e => e.currentTarget.style.background = "#2a7a44"}
          >
            Explore Articles
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
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
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="p-2.5 rounded-xl text-white" style={{ background: "#0A2E1F" }}>
                <FileTextIcon />
              </div>
              <h2 className="font-black text-3xl" style={{ color: "#0A2E1F" }}>Latest Articles</h2>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg pl-4 pr-8 py-2 font-bold focus:outline-none appearance-none cursor-pointer"
                  style={{ color: "#0A2E1F" }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-bold text-lg">No articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(blog => (
                <a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  style={{ textDecoration: "none" }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100" style={{ height: 210 }}>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Date Badge */}
                    <div
                      className="absolute top-4 left-4 text-white flex flex-col items-center justify-center rounded-xl shadow-lg"
                      style={{ background: "#0A2E1F", padding: "8px 10px", minWidth: 48 }}
                    >
                      <span className="font-black tracking-widest" style={{ fontSize: 9 }}>{blog.month}</span>
                      <span className="font-black leading-none my-0.5" style={{ fontSize: 22 }}>{blog.day}</span>
                      <span className="font-black" style={{ fontSize: 9, color: "#60E677" }}>{blog.year}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="font-black uppercase tracking-widest text-gray-400 mb-2 block" style={{ fontSize: 10 }}>
                      {blog.category}
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
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
              onChange={e => setSearchTerm(e.target.value)}
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
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-colors font-bold text-sm"
                  style={{
                    background: selectedCategory === cat.id ? "rgba(96,230,119,0.1)" : "transparent",
                    color: selectedCategory === cat.id ? "#0A2E1F" : "#4b5563"
                  }}
                >
                  <div className="flex items-center gap-3">
                    {categoryIcons[cat.id]}
                    <span>{cat.name}</span>
                  </div>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md" style={{ fontSize: 10, fontWeight: 700 }}>{cat.count}</span>
                </button>
              ))}
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full mt-4 border font-bold rounded-xl text-sm transition-colors"
                style={{ height: 40, borderColor: "#60E677", color: "#0A2E1F" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(96,230,119,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                View All Categories
              </button>
            )}
            {!selectedCategory && (
              <button
                className="w-full mt-4 border font-bold rounded-xl text-sm transition-colors"
                style={{ height: 40, borderColor: "#d1d5db", color: "#0A2E1F" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                View All Categories
              </button>
            )}
          </div>

          {/* Featured Article */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-lg mb-4 pb-4 border-b border-gray-100" style={{ color: "#0A2E1F" }}>Featured Article</h3>
            <a href={`/blog/${FEATURED.slug}`} className="group block" style={{ textDecoration: "none" }}>
              <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100" style={{ height: 150 }}>
                <img
                  src={FEATURED.image}
                  alt={FEATURED.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="font-black uppercase tracking-widest block mb-1.5" style={{ fontSize: 10, color: "#60E677" }}>
                {FEATURED.category}
              </span>
              <h4 className="font-black leading-tight mb-2 line-clamp-2 transition-colors" style={{ fontSize: "0.95rem", color: "#0A2E1F" }}>
                {FEATURED.title}
              </h4>
              <p className="text-gray-500 font-medium line-clamp-3 mb-3" style={{ fontSize: "0.8rem" }}>
                {FEATURED.excerpt}
              </p>
              <div className="flex items-center gap-1 font-black text-gray-400 transition-colors" style={{ fontSize: "0.75rem" }}>
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </a>
          </div>

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
  );
}