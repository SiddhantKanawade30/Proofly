"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Archive, ArrowLeft, Copy, List, Grid, Code, Heart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import SpaceDetailSkeleton from "@/components/loaders/testimonialLoader";
import { EmbedModal } from "@/components/ui/embedModal";


type ViewMode = "list" | "block";

export default function SpaceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [viewMode, setViewMode] = useState<ViewMode>("block");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string } | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  


  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    
    const fetchSpace = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }


      if (!backendUrl) {
        console.log("No backend URL found");
        setLoading(false);
        return;
      }

      
      try {
        const res = await axios.get(`${backendUrl}/testimonials/get/${id}`, {
          headers : {
            "Authorization" : `Bearer ${token}`
          }
        });

        setData(res.data);
      } catch (error: any) {
       console.log(error);
      } finally {
        setLoading(false);
      }


    }
    fetchSpace();
  }, [id]);

  const toggleFavorite = async(testimonialId: string) => {

    const token = localStorage.getItem("token");

    const fav = async () =>{
      const res = await axios.put(`${backendUrl}/testimonials/favourite`,{testimonialId},{
        headers:{
          "Authorization": `bearer ${token}`
        }
      });
    }

    const unFav = async() =>{
      await axios.put(`${backendUrl}/testimonials/remove-favorite`,{testimonialId},{
        headers:{
          "Authorization" : `bearer ${token}`
        }
      })
    }


    setFavorites(prev => {
      const newFavorites = new Set(prev);
      const testimonial = data?.testimonials?.find((t: any) => t.id === testimonialId);
      if (newFavorites.has(testimonialId)) {
        newFavorites.delete(testimonialId);
        toast.info("Removed from favorites");
        unFav();
      } else {
        newFavorites.add(testimonialId);
        toast.success("Added to favorites");
        fav();
      }
      return newFavorites;
    });
  };

  const handleArchiveClick = (testimonialId: string) => {
    const testimonial = data?.testimonials?.find((t: any) => t.id === testimonialId);
    if (testimonial) {
      setTestimonialToArchive({ id: testimonialId, author: testimonial.name });
      setArchiveDialogOpen(true);
    }
  };

  const handleArchiveConfirm = () => {
    if (testimonialToArchive) {
      // Here you would handle the actual archiving logic
      toast.success("Testimonial archived successfully");
      setArchiveDialogOpen(false);
      setTestimonialToArchive(null);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        {loading ? (
          <SpaceDetailSkeleton />
        ) : !data?.testimonials ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Testimonials not found</h1>
            <Link href="/spaces" className="text-text-primary hover:underline">
              ← Back to Spaces
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <Link 
                href="/spaces" 
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Spaces</span>
              </Link>
              
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary mb-2 break-all mr-4">{data?.title}</h1>
                  <p className="text-text-secondary line-clamp-2 break-all leading-relaxed mr-4 ">{data?.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEmbedModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <Code className="size-4" />
                    Embed
                  </button>
                </div>
              </div>

              <div className="mt-4 px-3 py-1 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-2">
                <input
                  type="text"
                  value={data?.shareLink}
                  readOnly
                  className="flex-1 text-sm bg-transparent border-none outline-none text-text-secondary"
                />
                <button
                  onClick={() => handleCopyUrl(data?.shareLink)}
                  className="p-2 hover:bg-zinc-200 rounded transition-colors"
                  title="Copy URL"
                >
                  <Copy className="size-4 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-secondary">{data?.testimonials?.length} testimonials in this space</h2>
                  
                  <p className="text-sm text-red-600 mt-2 italic text-red-400">
                    Tip: Archive testimonials you don't want to embed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                    title="List View"
                  >
                    <List className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("block")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "block"
                        ? "bg-white shadow-sm text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                    title="Block View"
                  >
                    <Grid className="size-4" />
                  </button>
                  </div>
                </div>
              </div>
              
              {data?.testimonials?.length > 0 ? (
                viewMode === "list" ? (
                  // List View
                  <div className="space-y-4">
                    {data?.testimonials?.map((testimonial: any) => (
                      <div key={testimonial.id} className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-medium text-text-primary truncate">{testimonial.name}</h3>
                              {testimonial.position && (
                                <span className="text-sm text-text-secondary truncate">{testimonial.position}</span>
                              )}
                              {testimonial.email && (
                                <span className="text-xs text-text-secondary truncate">({testimonial.email})</span>
                              )}
                            </div>
                            
                            {/* Video or Text Content */}
                            {testimonial.testimonialType === "video" && testimonial.playbackId ? (
                              <div className="mb-2">
                                <iframe
                                  src={`https://player.mux.com/${testimonial.playbackId}`}
                                  style={{ width: "100%", maxWidth: "600px", border: "none", aspectRatio: "4/3" }}
                                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <p className="text-text-secondary mb-2 break-words whitespace-pre-wrap">{testimonial.message}</p>
                            )}
                            
                            <p className="text-xs text-text-secondary">
                              {new Date(testimonial.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button 
                              onClick={() => toggleFavorite(testimonial.id)}
                              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Add to favorites"
                            >
                              <Heart 
                                className={`size-4 transition-colors ${
                                  favorites.has(testimonial.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-zinc-400 hover:text-red-500"
                                }`} 
                              />
                            </button>
                            <button 
                              onClick={() => handleArchiveClick(testimonial.id)}
                              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Archive testimonial"
                            >
                              <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Block/Card View
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.testimonials?.map((testimonial: any) => (
                      <div
                        key={testimonial.id}
                        className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Video or Text Content */}
                        {testimonial.testimonialType === "video" && testimonial.playbackId ? (
                          <div className="mb-6 flex-1">
                            <iframe
                              src={`https://player.mux.com/${testimonial.playbackId}`}
                              style={{ width: "100%", border: "none", aspectRatio: "4/3", borderRadius: "8px" }}
                              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <p className="text-text-secondary mb-6 text-base leading-relaxed break-words flex-1 whitespace-pre-wrap">
                            "{testimonial.message}"
                          </p>
                        )}

                        {/* Border */}
                        <div className="border-t border-zinc-200 mb-4 flex-shrink-0"></div>

                        {/* Name and Position/Email */}
                        <div className="flex-shrink-0 flex items-center justify-between  min-w-0">
                          <div>
                          <h3 className="font-semibold text-text-primary mb-1 truncate">
                            {testimonial.name}
                          </h3>
                          {testimonial.position && (
                            <p className="text-sm text-text-secondary truncate">
                              {testimonial.position}
                            </p>
                          )}
                          {testimonial.email && (
                            <p className="text-xs text-text-secondary truncate">
                              {testimonial.email}
                            </p>
                          )}
                          </div>

                          <div className="flex items-center justify-between mb-4 flex-shrink-0">
                          
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => toggleFavorite(testimonial.id)}
                              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Add to favorites"
                            >
                              <Heart 
                                className={`size-4 transition-colors ${
                                  testimonial.favourite === true
                                    ? "fill-red-500 text-red-500"
                                    : "text-zinc-400 hover:text-red-500"
                                }`} 
                              />
                            </button>
                            <button 
                              onClick={() => handleArchiveClick(testimonial.id)}
                              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                              title="Archive testimonial"
                            >
                              <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
                            </button>
                          </div>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="p-12 text-center">
                  <p className="text-text-secondary mb-2">No testimonials yet</p>
                  <p className="text-sm text-text-secondary">
                    Share this space URL to start collecting testimonials
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Archive Confirmation Dialog */}
        <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive Testimonial</DialogTitle>
              <DialogDescription>
                Are you sure you want to archive this testimonial? Archived testimonials won't be included in embeds.
              </DialogDescription>
            </DialogHeader>
            {testimonialToArchive && (
              <div className="py-2">
                <p className="text-sm text-zinc-600">
                  <span className="font-medium">{testimonialToArchive.author}</span>'s testimonial will be archived.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setArchiveDialogOpen(false);
                  setTestimonialToArchive(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleArchiveConfirm}
                className="bg-zinc-900 hover:bg-zinc-800"
              >
                Archive
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Embed Modal */}
        <EmbedModal
          open={embedModalOpen}
          onOpenChange={setEmbedModalOpen}
          campaignId={id}
        />
      </Topbar>
    </div>
  );
}