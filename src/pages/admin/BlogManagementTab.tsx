import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Edit, Trash, FileText, User, Image as ImageIcon, Link as LinkIcon, AlignLeft, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export default function BlogManagementTab() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/blogs`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    }
  });

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
                content: formData.get("content"),
                author: formData.get("author"),
                imageUrl: formData.get("imageUrl"),
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
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Feature Image URL</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="imageUrl" defaultValue={currentBlog?.imageUrl} type="url" className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Excerpt</label>
              <Input name="excerpt" defaultValue={currentBlog?.excerpt} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Content</label>
              <textarea
                name="content"
                defaultValue={currentBlog?.content}
                required
                className="w-full bg-gray-50/50 border border-gray-100 p-6 rounded-[32px] h-[300px] font-medium text-[#0A2E1F] focus:ring-4 focus:ring-[#60E677]/5 transition-all outline-none"
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

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white pb-6 md:pb-12">
      <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col">
          <CardTitle className="text-2xl md:text-3xl font-black text-[#0A2E1F] tracking-tight">Blog Articles</CardTitle>
          <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Manage your platform content and news updates.</CardDescription>
        </div>
        <Button 
          onClick={() => { setCurrentBlog(null); setIsEditing(true); }}
          className="w-full sm:w-auto h-12 rounded-xl md:rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black shadow-xl shadow-green-100/50 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 mr-2" /> Write New Article
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-[#60E677] border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Loading articles...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {blogs?.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-100">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[#0A2E1F] font-black">No articles found</p>
                <p className="text-gray-400 text-sm font-medium mt-1">Start by writing your first blog post.</p>
              </div>
            )}
            {blogs?.map((blog: any) => (
              <div key={blog.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border border-gray-50 rounded-2xl md:rounded-[28px] bg-white hover:border-[#60E677]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all gap-4">
                <div className="flex items-center gap-4 md:gap-6 w-full">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden w-full">
                    <h3 className="font-black text-[#0A2E1F] text-base md:text-lg tracking-tight group-hover:text-[#2F884D] transition-colors truncate">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400">
                        <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="truncate max-w-[100px] sm:max-w-none">{blog.author || "System Admin"}</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                        blog.isPublished ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {blog.isPublished ? <Check className="w-2.5 h-2.5 md:w-3 md:h-3" /> : <AlignLeft className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                        <span>{blog.isPublished ? "Published" : "Draft"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0 border-gray-50 mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon" onClick={() => { setCurrentBlog(blog); setIsEditing(true); }} className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50">
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if(window.confirm("Delete this article?")) deleteMutation.mutate(blog.id); }} className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash className="w-4 h-4 md:w-5 md:h-5" />
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
