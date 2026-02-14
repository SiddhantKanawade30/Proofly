"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import axios from "axios";
import { MessageCircle, Code } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFetchTestimonials, useTestimonialActions } from "@/hooks/useTestimonials";
import { MemoGenericTestimonialCard, TestimonialData } from "@/components/TestimonialCardGeneric";

export default function AllTestimonialsPage() {
  const router = useRouter();
  const { data: userData, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !userData?.user) {
      router.push('/signin');
    }
  }, [authLoading, userData?.user, router]);

  const [viewMode, setViewMode] = useState<"cards">("cards");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string; campaignId: string } | null>(null);

  
  const { testimonials: hookTestimonials, favorites: hookFavorites, loading, refetch } = useFetchTestimonials({
    endpoint: "/testimonials/get/all",
    showSpace: true,
  });

  
  const [testimonials, setTestimonials] = useState<typeof hookTestimonials>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  
  useEffect(() => {
    setTestimonials(hookTestimonials);
    setFavorites(hookFavorites);
    
    const map = new Map<string, { author: string; campaignId: string }>();
    hookTestimonials.forEach(t => {
      map.set(t.id, { author: t.name, campaignId: t.campaignId });
    });
    testimonialMapRef.current = map;
  }, [hookTestimonials, hookFavorites]);

  const testimonialMapRef = useRef<Map<string, { author: string; campaignId: string }>>(new Map());

  
  const { toggleFavorite, archiveTestimonial } = useTestimonialActions();

  const handleToggleFavorite = useCallback(async (testimonialId: string) => {
    setFavorites(prev => {
      const isFavorite = prev.has(testimonialId);
      const testimonial = testimonials.find(t => t.id === testimonialId);
      if (!testimonial) return prev;
      
      toggleFavorite(testimonialId, isFavorite, testimonial.campaignId);
      
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.delete(testimonialId);
      } else {
        newFavorites.add(testimonialId);
      }
      return newFavorites;
    });
  }, [toggleFavorite, testimonials]);

  const handleArchiveClick = useCallback((testimonialId: string) => {
    const data = testimonialMapRef.current.get(testimonialId);
    if (data) {
      setTestimonialToArchive({
        id: testimonialId,
        author: data.author,
        campaignId: data.campaignId,
      });
      setArchiveDialogOpen(true);
    }
  }, []);

  const handleArchiveConfirm = async () => {
    if (!testimonialToArchive) return;

    const success = await archiveTestimonial(
      testimonialToArchive.id,
      testimonialToArchive.campaignId
    );
    
    if (success) {
      setTestimonials(prev => prev.filter(t => t.id !== testimonialToArchive.id));
      setArchiveDialogOpen(false);
      setTestimonialToArchive(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-offset font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-6 text-text-primary" />
              <h1 className="text-2xl font-bold text-text-primary">All Testimonials</h1>
            </div>
          </div>
          <p className="text-text-secondary">{testimonials.length} testimonials</p>
        </div>

        {loading ? (
          <SpacesSkeletonLoader />
        ) : testimonials.length > 0 ? (
          <div>
              <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="break-inside-avoid mb-6">
                    <MemoGenericTestimonialCard
                      testimonial={testimonial as TestimonialData & { space?: string }}
                      viewMode="cards"
                      isFavorite={favorites.has(testimonial.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onArchive={handleArchiveClick}
                      showSpace={true}
                    />
                  </div>
                ))}
              </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 border border-zinc-200 text-center">
            <MessageCircle className="size-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-1">No testimonials</p>
            <p className="text-sm text-text-secondary">
              Testimonials will appear here
            </p>
          </div>
        )}

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