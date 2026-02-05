"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import Header from "./components/Header";
import Controls from "./components/Controls";
import { GenericTestimonialCard, MemoGenericTestimonialCard } from "@/components/TestimonialCardGeneric";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import SpaceDetailSkeleton from "@/components/loaders/testimonialLoader";
import { EmbedModal } from "@/components/ui/embedModal";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import { ImportModal } from "@/components/ui/importModal";
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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string } | null>(null);
  const { data: userData, loading: authLoading } = useUser();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const testimonialMapRef = useRef<Map<string, string>>(new Map());

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
        const testi = res.data?.testimonials || [];
        setTestimonials(testi);
        
        // Update the map of testimonial IDs to authors
        const map = new Map<string, string>();
        testi.forEach((t: any) => {
          map.set(t.id, t.author || t.name || "Unknown");
        });
        testimonialMapRef.current = map;
        
        const favIds = new Set<string>(
          testi
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
    
    // Check current state to determine action
    setFavorites(prev => {
      const isFavorite = prev.has(testimonialId);
      const endpoint = isFavorite ? "/testimonials/remove-favorite" : "/testimonials/favourite";
      
      axios.put(`${backendUrl}${endpoint}`, { testimonialId, campaignId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(error => {
        rateLimitHandlers.protected.handleError(error, "Failed to update favorite");
        // Revert optimistic update on error
        setFavorites(prev2 => {
          const newFavorites = new Set(prev2);
          if (isFavorite) {
            newFavorites.add(testimonialId);
          } else {
            newFavorites.delete(testimonialId);
          }
          return newFavorites;
        });
      });
      
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.delete(testimonialId);
      } else {
        newFavorites.add(testimonialId);
      }
      return newFavorites;
    });
  }, [backendUrl, id]);

  const handleArchiveClick = useCallback((testimonialId: string) => {
    const author = testimonialMapRef.current.get(testimonialId) || "Unknown";
    setTestimonialToArchive({ id: testimonialId, author });
    setArchiveDialogOpen(true);
  }, []);

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
            <Header
              title={spaceData?.title}
              description={spaceData?.description}
              shareLink={spaceData?.shareLink}
              onCopy={handleCopyUrl}
              onOpenEmbed={() => setEmbedModalOpen(true)}
              onOpenImport={() => setImportModalOpen(true)}
            />

            <div className="mb-6">
              <Controls viewMode={viewMode} setViewMode={setViewMode} count={testimonials.length} />

              {testimonials.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-4">
                    {testimonials.map((testimonial: any) => (
                      <MemoGenericTestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        viewMode="list"
                        isFavorite={favorites.has(testimonial.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onArchive={handleArchiveClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
                    {testimonials.map((testimonial: any) => (
                      <div key={testimonial.id} className="break-inside-avoid mb-6">
                        <MemoGenericTestimonialCard
                          testimonial={testimonial}
                          viewMode="cards"
                          isFavorite={favorites.has(testimonial.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onArchive={handleArchiveClick}
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

        {/* Import Modal */}
        <ImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          campaignId={id}
        />
        
      
      </Topbar>
    </div>
  );
}