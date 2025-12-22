"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import axios from "axios";
import { Star, Archive, MessageCircle, List, Grid, Heart, Code } from "lucide-react";
import router from "next/router";
import { useEffect, useState } from "react";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { StarDisplay } from "@/components/ui/starDisplay";
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


type ViewMode = "list" | "cards";

interface TestimonialData {
  success: boolean;
  count: number;
  data: [
    {
      id: string;
      name: string;
      email: string;
      position: string;
      message: string | null;
      favourite: boolean;
      archived: boolean;
      createdAt: string;
      campaignId: string;
      testimonialType: "text" | "video";
      playbackId: string | null;
      rating: number;
      campaign: {
        id: string;
        title: string;
      }
    }
  ]
}

export default function AllTestimonialsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [data, setData] = useState<TestimonialData>();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [archived, setArchived] = useState<Set<string>>(new Set());
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string } | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/testimonials/get/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
        // Initialize favorites and archived sets
        const favIds = new Set<string>(
          (res.data?.data || [])
            .filter((t: any) => t.favourite === true)
            .map((t: any) => t.id)
        );
        const archIds = new Set<string>(
          (res.data?.data || [])
            .filter((t: any) => t.archived === true)
            .map((t: any) => t.id)
        );
        setFavorites(favIds);
        setArchived(archIds);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleFavorite = async (testimonialId: string) => {
    const token = localStorage.getItem("token");

    try {
      if (favorites.has(testimonialId)) {
        await axios.put(
          `${backendUrl}/testimonials/remove-favorite`,
          { testimonialId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.info("Removed from favorites");
      } else {
        await axios.put(
          `${backendUrl}/testimonials/favourite`,
          { testimonialId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to favorites");
      }
      setFavorites((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(testimonialId)) {
          newSet.delete(testimonialId);
        } else {
          newSet.add(testimonialId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleArchiveClick = (testimonialId: string) => {
    const testimonial = data?.data.find((t) => t.id === testimonialId);
    if (testimonial) {
      setTestimonialToArchive({ id: testimonialId, author: testimonial.name });
      setArchiveDialogOpen(true);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!testimonialToArchive) return;

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${backendUrl}/testimonials/archive`,
        { testimonialId: testimonialToArchive.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Testimonial archived successfully");
      setArchived((prev) => new Set(prev).add(testimonialToArchive.id));
      setArchiveDialogOpen(false);
      setTestimonialToArchive(null);
    } catch (error) {
      console.error("Error archiving testimonial:", error);
      toast.error("Failed to archive testimonial");
    }
  }
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        {loading ? (
          <SpacesSkeletonLoader />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-6 text-text-primary" />
                  <h1 className="text-2xl font-bold text-text-primary">All Testimonials</h1>
                </div>
                <div className="flex items-center gap-3">
                  {/* Embed Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors">
                    <Code className="size-4" />
                    Embed
                  </button>
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
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "cards"
                        ? "bg-white shadow-sm text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                    title="Cards View"
                  >
                    <Grid className="size-4" />
                  </button>
                  </div>
                </div>
              </div>
              <p className="text-text-secondary">{data?.count} testimonials</p>
            </div>

            {data?.success && data?.count && data?.count > 0 ? (
          <div>
            {viewMode === "list" ? (
              // List View
              <div className="space-y-4">
                {data?.data.map((testimonial) => (
                  <div key={testimonial.id} className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-medium text-text-primary truncate">{testimonial.name}</h3>
                            {testimonial.position && (
                              <span className="text-sm text-text-secondary truncate">{testimonial.position}</span>
                            )}
                          </div>
                          <span className="text-xs px-2 bg-violet-100 text-violet-700 py-1  rounded truncate max-w-[200px]">
                            {testimonial.campaign.title}
                          </span>
                        </div>
                        
                        {/* Video or Text Content */}
                        {testimonial.testimonialType === "video" && testimonial.playbackId ? (
                          <div className="mb-3">
                            <iframe
                              src={`https://player.mux.com/${testimonial.playbackId}`}
                              style={{ width: "100%", maxWidth: "600px", border: "none", aspectRatio: "4/3" }}
                              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : testimonial.message ? (
                          <p className="text-text-secondary mb-3 break-words whitespace-pre-wrap">{testimonial.message}</p>
                        ) : (
                          <p className="text-text-secondary mb-3 italic">No message available</p>
                        )}
                        
                        {/* Rating and Date */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-secondary">{new Date(testimonial.createdAt).toLocaleDateString()}</p>
                          <StarDisplay value={testimonial.rating || 0} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button 
                          onClick={() => toggleFavorite(testimonial.id)}
                          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" 
                          title="Add to favorites"
                        >
                          <Heart className={`size-4 transition-colors ${
                            favorites.has(testimonial.id)
                              ? "fill-red-500 text-red-500" 
                              : "text-zinc-400 hover:text-red-500"
                          }`} />
                        </button>
                        <button 
                          onClick={() => handleArchiveClick(testimonial.id)}
                          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" 
                          title="Archive"
                        >
                          <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Cards View
              <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
                {data?.data.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="break-inside-avoid mb-6 rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Space Badge */}
                    <div className="mb-4">
                      <span className="text-xs px-2 bg-violet-100 text-violet-700 py-1  rounded truncate max-w-[150px] inline-block">
                        {testimonial.campaign.title}
                      </span>
                    </div>

                    {/* Video or Text Content */}
                    {testimonial.testimonialType === "video" && testimonial.playbackId ? (
                      <div className="mb-6">
                        <iframe
                          src={`https://player.mux.com/${testimonial.playbackId}`}
                          style={{ width: "100%", border: "none", aspectRatio: "4/3", borderRadius: "8px" }}
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : testimonial.message ? (
                      <p className="text-text-secondary mb-6 text-base leading-relaxed break-words whitespace-pre-wrap">
                        "{testimonial.message}"
                      </p>
                    ) : (
                      <p className="text-text-secondary mb-6 text-base leading-relaxed break-words italic">
                        No message available
                      </p>
                    )}

                    {/* Rating */}
                    {testimonial.rating && testimonial.rating > 0 && (
                      <div className="mb-6">
                        <StarDisplay value={testimonial.rating} />
                      </div>
                    )}

                    {/* Border */}
                    <div className="border-t border-zinc-200 mb-4"></div>

                    {/* Name and Position */}
                    <div className="min-w-0 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1 truncate">
                          {testimonial.name}
                        </h3>
                        {testimonial.position && (
                          <p className="text-sm text-text-secondary truncate">
                            {testimonial.position}
                          </p>
                        )}
                        <p className="text-xs text-text-secondary mt-1">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Favorite & Archive Buttons */}
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toggleFavorite(testimonial.id)}
                          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" 
                          title="Add to favorites"
                        >
                          <Heart className={`size-4 transition-colors ${
                            favorites.has(testimonial.id)
                              ? "fill-red-500 text-red-500" 
                              : "text-zinc-400 hover:text-red-500"
                          }`} />
                        </button>
                        <button 
                          onClick={() => handleArchiveClick(testimonial.id)}
                          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" 
                          title="Archive"
                        >
                          <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            ) : (
              <div className="rounded-lg bg-white p-12 shadow-sm border border-zinc-200 text-center">
                <MessageCircle className="size-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-text-secondary mb-1">No testimonials</p>
                <p className="text-sm text-text-secondary">
                  Testimonials will appear here
                </p>
              </div>
            )}
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
      </Topbar>
    </div>
  );
}