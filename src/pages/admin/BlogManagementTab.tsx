import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Edit, Trash, FileText, User, Image as ImageIcon, Link as LinkIcon, AlignLeft, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

import BlogEditor from "@/components/BlogEditor";
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

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";


export default function BlogManagementTab() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(null);
  const [editorData, setEditorData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"blogs" | "categories">("blogs");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'blog' | 'category' } | null>(null);

  // Search, Filter, Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;



  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/blogs/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/blogs?limit=1000`); // Fetch all for admin management
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    }
  });

  const blogs = blogsData?.data || [];


  React.useEffect(() => {
    if (currentBlog) {
      setImageUrl(currentBlog.imageUrl || "");
    } else {
      setImageUrl("");
    }
  }, [currentBlog]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/api/blogs/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const filteredBlogs = React.useMemo(() => {
    if (!blogs) return [];
    return blogs.filter((blog: any) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : 
                           statusFilter === "published" ? blog.isPublished : !blog.isPublished;
      const matchesCategory = categoryFilter === "all" ? true : blog.categoryId === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);










  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog deleted successfully");
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (blogData: any) => {
      const method = blogData.id ? "PUT" : "POST";
      const url = blogData.id ? `${API_BASE}/api/blogs/${blogData.id}` : `${API_BASE}/api/blogs`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
      });
      if (!res.ok) throw new Error("Failed to save blog");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post saved successfully");
      setIsEditing(false);
      setCurrentBlog(null);
    }
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const method = categoryData.id ? "PUT" : "POST";
      const url = categoryData.id ? `${API_BASE}/api/blogs/categories/${categoryData.id}` : `${API_BASE}/api/blogs/categories`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) throw new Error("Failed to save category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Category saved successfully");
      setIsEditingCategory(false);
      setCurrentCategory(null);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/blogs/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Category deleted successfully");
    }
  });

  if (isEditing) {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
        <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">
                {currentBlog?.id ? "Edit Article" : "Write New Article"}
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Create engaging content for your audience.</CardDescription>
            </div>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full w-10 h-10 p-0 hover:bg-red-50 hover:text-red-500">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                id: currentBlog?.id,
                title: formData.get("title"),
                slug: formData.get("slug"),
                excerpt: formData.get("excerpt"),
                content: JSON.stringify(editorData),
                author: formData.get("author"),
                imageUrl: formData.get("imageUrl"),
                categoryId: formData.get("categoryId") || null,
                isPublished: formData.get("isPublished") === "on",
              };
              saveMutation.mutate(data);
            }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Article Title</label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="title" defaultValue={currentBlog?.title} required className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="slug" defaultValue={currentBlog?.slug} required className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="author" defaultValue={currentBlog?.author} className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Feature Image</label>
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                    <Input 
                      name="imageUrl" 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Image URL or upload below..."
                      className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" 
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={isUploading}
                      className="h-12 px-6 rounded-xl border-dashed border-2 border-gray-200 hover:border-[#60E677] hover:bg-green-50 transition-all font-bold text-gray-500"
                    >
                      {isUploading ? (
                        <div className="w-5 h-5 border-2 border-[#60E677] border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Plus className="w-5 h-5 mr-2" />
                      )}
                      {isUploading ? "Uploading..." : "Upload New Image"}
                    </Button>
                    <input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                    {imageUrl && (
                      <div className="relative group/img w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                        <img src={formatUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />

                        <button
                          type="button"

                          onClick={() => {
                            setImageUrl("");
                            const fileInput = document.getElementById("image-upload") as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                name="categoryId" 
                defaultValue={currentBlog?.categoryId || ""} 
                className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl font-bold text-[#0A2E1F] focus:ring-4 focus:ring-[#60E677]/5 px-4 appearance-none"
              >
                <option value="">Select a Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Excerpt</label>
              <Input name="excerpt" defaultValue={currentBlog?.excerpt} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Article Content</label>
              <BlogEditor 
                data={currentBlog?.content} 
                onChange={setEditorData} 
                holder="blog-editor" 
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="font-black text-[#0A2E1F]">Published Status</span>
                <span className="text-xs text-gray-400 font-medium">Is this article ready for the public?</span>
              </div>
              <input 
                type="checkbox" 
                name="isPublished" 
                id="isPublished" 
                defaultChecked={currentBlog?.isPublished} 
                className="w-6 h-6 rounded-lg accent-[#60E677]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white font-black text-base shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
              >
                {saveMutation.isPending ? "Saving..." : "Save Article"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
  if (isEditingCategory) {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
        <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">
                {currentCategory?.id ? "Edit Category" : "New Category"}
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Organize your blog posts with categories.</CardDescription>
            </div>
            <Button variant="ghost" onClick={() => setIsEditingCategory(false)} className="rounded-full w-10 h-10 p-0 hover:bg-red-50 hover:text-red-500">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                id: currentCategory?.id,
                name: formData.get("name"),
                slug: formData.get("slug"),
              };
              saveCategoryMutation.mutate(data);
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
              <Input name="name" defaultValue={currentCategory?.name} required className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug</label>
              <Input name="slug" defaultValue={currentCategory?.slug} required className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saveCategoryMutation.isPending}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white font-black text-base transition-all active:scale-[0.98]"
              >
                {saveCategoryMutation.isPending ? "Saving..." : "Save Category"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditingCategory(false)}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "categories") {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white pb-6 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col">
            <CardTitle className="text-2xl md:text-3xl font-black text-[#0A2E1F] tracking-tight">Blog Categories</CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Manage categories for your blog articles.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setViewMode("blogs")} className="h-12 rounded-xl md:rounded-2xl border-gray-200 text-gray-600 font-bold">
              Back to Articles
            </Button>
            <Button onClick={() => { setCurrentCategory(null); setIsEditingCategory(true); }} className="h-12 rounded-xl md:rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black">
              <Plus className="w-5 h-5 mr-2" /> Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          {isCategoriesLoading ? (
             <div className="flex flex-col items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#60E677] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid gap-4">
              {categories?.map((cat: any) => (
                <div key={cat.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-black text-xl text-[#0A2E1F]">{cat.name}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">Slug: /{cat.slug} <span className="mx-2">•</span> {cat._count?.blogs || 0} Articles</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => { setCurrentCategory(cat); setIsEditingCategory(true); }} className="w-10 h-10 p-0 rounded-xl">
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="outline" onClick={() => { setDeleteTarget({ id: cat.id, type: 'category' }); setIsDeleting(true); }} className="w-10 h-10 p-0 rounded-xl hover:bg-red-50 hover:border-red-100">
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white pb-6 md:pb-12">
      <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col">
          <CardTitle className="text-2xl md:text-3xl font-black text-[#0A2E1F] tracking-tight">Blog Articles</CardTitle>
          <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Manage your platform content and news updates.</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button 
            variant="outline"
            onClick={() => setViewMode("categories")}
            className="w-full sm:w-auto h-12 rounded-xl md:rounded-2xl border-gray-200 text-gray-600 font-bold"
          >
            Manage Categories
          </Button>
          <Button 
            onClick={() => { setCurrentBlog(null); setEditorData(null); setIsEditing(true); }}
            className="w-full sm:w-auto h-12 rounded-xl md:rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black shadow-xl shadow-green-100/50 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 mr-2" /> Write New Article
          </Button>
        </div>
      </CardHeader>

      {/* Advanced Filter Toolbar */}
      <div className="px-6 md:px-8 py-6 bg-gray-50/30 border-b border-gray-50 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#60E677] transition-colors" />
          <Input 
            placeholder="Search articles by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-gray-100 rounded-xl font-medium focus:ring-4 focus:ring-[#60E677]/5"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-12 bg-white border border-gray-100 rounded-xl px-4 font-bold text-[#0A2E1F] text-sm focus:ring-4 focus:ring-[#60E677]/5 outline-none min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-12 bg-white border border-gray-100 rounded-xl px-4 font-bold text-[#0A2E1F] text-sm focus:ring-4 focus:ring-[#60E677]/5 outline-none min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <CardContent className="p-4 md:p-8">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-[#60E677] border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Loading articles...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedBlogs.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-100">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[#0A2E1F] font-black">No articles match your filters</p>
                <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
            {paginatedBlogs.map((blog: any) => (

              <div key={blog.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border border-gray-50 rounded-2xl md:rounded-[28px] bg-white hover:border-[#60E677]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all gap-4">
                <div className="flex items-center gap-4 md:gap-6 w-full">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    {blog.imageUrl ? (
                      <img src={formatUrl(blog.imageUrl)} alt="" className="w-full h-full object-cover" />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                         {blog.category && (
                           <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-md">
                             {blog.category.name}
                           </span>
                         )}
                         <span className={cn("px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border", blog.isPublished ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>
                           {blog.isPublished ? "Published" : "Draft"}
                         </span>
                      </div>
                      <h3 className="font-black text-lg md:text-xl text-[#0A2E1F] leading-tight group-hover:text-green-600 transition-colors line-clamp-2">{blog.title}</h3>
                      {blog.excerpt && <p className="text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><User className="w-3.5 h-3.5" /> {blog.author || "Admin"}</div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" /> {new Date(blog.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0 border-gray-50 mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon" onClick={() => { 
                    setCurrentBlog(blog); 
                    try {
                      setEditorData(blog.content ? JSON.parse(blog.content) : null);
                    } catch (e) {
                      setEditorData(null);
                    }
                    setIsEditing(true); 
                  }} className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50">
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget({ id: blog.id, type: 'blog' }); setIsDeleting(true); }} className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Professional Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-gray-50">
            <p className="text-sm font-bold text-gray-400">
              Showing <span className="text-[#0A2E1F] font-black">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-[#0A2E1F] font-black">{Math.min(currentPage * pageSize, filteredBlogs.length)}</span> of <span className="text-[#0A2E1F] font-black">{filteredBlogs.length}</span> articles
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-500 disabled:opacity-30"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-10 h-10 p-0 rounded-xl font-black transition-all",
                      currentPage === i + 1 ? "bg-[#0A2E1F] text-white shadow-lg" : "border-gray-100 text-gray-400 hover:bg-gray-50"
                    )}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-500 disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>


      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#0A2E1F] tracking-tight">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-500 font-medium leading-relaxed">
              This action cannot be undone. This will permanently delete the {deleteTarget?.type === 'blog' ? 'article' : 'category'} and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="h-12 px-8 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteTarget?.type === 'blog') {
                  deleteMutation.mutate(deleteTarget.id);
                } else if (deleteTarget?.type === 'category') {
                  deleteCategoryMutation.mutate(deleteTarget.id);
                }
                setIsDeleting(false);
              }}
              className="h-12 px-8 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

