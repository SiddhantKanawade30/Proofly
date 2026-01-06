"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import Header from "./components/Header";
import Controls from "./components/Controls";
import { GenericTestimonialCard } from "@/components/TestimonialCardGeneric";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import SpaceDetailSkeleton from "@/components/loaders/testimonialLoader";
import { EmbedModal } from "@/components/ui/embedModal";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ViewMode = "list" | "block";

export default function SpaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [viewMode, setViewMode] = useState<ViewMode>("block");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [spaceData, setSpaceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string } | null>(null);
  const { data: userData, loading: authLoading } = useUser();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!authLoading && !userData?.user) {
      router.push('/signin');
    }
  }, [authLoading, userData?.user, router]);

  useEffect(() => {
    const fetchSpace = async () => {
      const token = localStorage.getItem("token");

      if (!token || !backendUrl) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/testimonials/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSpaceData(res.data);
        setTestimonials(res.data?.testimonials || []);
        
        const favIds = new Set<string>(
          (res.data?.testimonials || [])
            .filter((t: any) => t.favourite === true)
            .map((t: any) => t.id)
        );
        setFavorites(favIds);
      } catch (error: any) {
        rateLimitHandlers.protected.handleError(error, "Failed to load space details");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [id, backendUrl]);

  const handleToggleFavorite = useCallback(async (testimonialId: string) => {
    const token = localStorage.getItem("token");
    const testimonial = testimonials.find((t: any) => t.id === testimonialId);
    const isFavorite = favorites.has(testimonialId);

    if (!testimonial) return;

    try {
      const endpoint = isFavorite ? "/testimonials/remove-favorite" : "/testimonials/favourite";
      await axios.put(`${backendUrl}${endpoint}`, { testimonialId, campaignId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.delete(testimonialId);
          toast.info("Removed from favorites");
        } else {
          newFavorites.add(testimonialId);
          toast.success("Added to favorites");
        }
        return newFavorites;
      });
    } catch (error: any) {
      rateLimitHandlers.protected.handleError(error, "Failed to update favorite");
    }
  }, [favorites, backendUrl, id, testimonials]);

  const handleArchiveClick = (testimonialId: string) => {
    const testimonial = testimonials.find((t: any) => t.id === testimonialId);
    if (testimonial) {
      setTestimonialToArchive({ id: testimonialId, author: testimonial.author });
      setArchiveDialogOpen(true);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!testimonialToArchive) return;

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${backendUrl}/testimonials/archive`,
        { testimonialId: testimonialToArchive.id, campaignId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Testimonial archived successfully");
      setTestimonials(prev => prev.filter((t: any) => t.id !== testimonialToArchive.id));
      setArchiveDialogOpen(false);
      setTestimonialToArchive(null);
    } catch (error: any) {
      rateLimitHandlers.protected.handleError(error, "Failed to archive testimonial");
    }
  };

  const handleCopyUrl = (url?: string) => {
    if (!url) return;
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
        ) : !testimonials ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Testimonials not found</h1>
            <Link href="/spaces" className="text-text-primary hover:underline">
              ← Back to Spaces
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <Header
              title={spaceData?.title}
              description={spaceData?.description}
              shareLink={spaceData?.shareLink}
              onCopy={handleCopyUrl}
              onOpenEmbed={() => setEmbedModalOpen(true)}
            />

            {/* Testimonials Section */}
            <div className="mb-6">
              <Controls viewMode={viewMode} setViewMode={setViewMode} count={testimonials.length} />

              {testimonials.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-4">
                    {testimonials.map((testimonial: any) => (
                      <GenericTestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        viewMode="list"
                        isFavorite={favorites.has(testimonial.id)}
                        onToggleFavorite={() => handleToggleFavorite(testimonial.id)}
                        onArchive={() => handleArchiveClick(testimonial.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
                    {testimonials.map((testimonial: any) => (
                      <div key={testimonial.id} className="break-inside-avoid mb-6">
                        <GenericTestimonialCard
                          testimonial={testimonial}
                          viewMode="cards"
                          isFavorite={favorites.has(testimonial.id)}
                          onToggleFavorite={() => handleToggleFavorite(testimonial.id)}
                          onArchive={() => handleArchiveClick(testimonial.id)}
                        />
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="p-12 text-center rounded-lg bg-white border border-zinc-200">
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
        <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>Archive testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive the testimonial from {testimonialToArchive?.author}? You can unarchive it later.
            </AlertDialogDescription>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchiveConfirm} className="bg-red-600 hover:bg-red-700">
                Archive
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

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