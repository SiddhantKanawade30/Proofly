"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Archive, MessageCircle, List, Grid } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { useUser } from "@/context/UserContext";
import { useFetchTestimonials, useTestimonialActions } from "@/hooks/useTestimonials";
import { MemoGenericTestimonialCard, TestimonialData } from "@/components/TestimonialCardGeneric";


export default function ArchivedPage() {
  const [viewMode, setViewMode] = useState<"cards">("cards");
  const router = useRouter();
  const { data, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !data?.user) {
      router.push('/signin');
    }
  }, [authLoading, data?.user, router]);

  // Fetch archived testimonials
  const { testimonials: hookTestimonials, favorites: hookFavorites, loading, refetch } = useFetchTestimonials({
    endpoint: "/testimonials/archived",
    showSpace: true,
  });

  // Local state for UI updates without page refresh
  const [testimonials, setTestimonials] = useState<typeof hookTestimonials>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Sync with hook data when it changes
  useEffect(() => {
    setTestimonials(hookTestimonials);
    setFavorites(hookFavorites);
  }, [hookTestimonials, hookFavorites]);

  // Get action handlers
  const { toggleFavorite, unarchiveTestimonial } = useTestimonialActions();

  const handleToggleFavorite = useCallback(async (testimonialId: string) => {
    setFavorites(prev => {
      const isFavorite = prev.has(testimonialId);
      const testimonial = testimonials.find(t => t.id === testimonialId);
      if (!testimonial) return prev;
      
      // Call API
      toggleFavorite(testimonialId, isFavorite, testimonial.campaignId);
      
      // Update UI optimistically
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.delete(testimonialId);
      } else {
        newFavorites.add(testimonialId);
      }
      return newFavorites;
    });
  }, [toggleFavorite, testimonials]);

  const handleUnarchive = useCallback(async (testimonialId: string) => {
    const testimonial = testimonials.find((t) => t.id === testimonialId);
    if (!testimonial) return;

    const success = await unarchiveTestimonial(testimonialId, testimonial.campaignId);
    if (success) {
      // Remove unarchived testimonial from local state
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    }
  }, [testimonials, unarchiveTestimonial]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-zinc-50 font-sans">
        <Sidebar />
        <Topbar>
          <SpacesSkeletonLoader />
        </Topbar>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-offset font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Archive className="size-6 text-text-primary" />
              <h1 className="text-2xl font-bold text-text-primary">Archived</h1>
            </div>
          </div>
          <p className="text-text-secondary">{testimonials.length} archived testimonials</p>
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
                    onArchive={handleUnarchive}
                    onUnarchive={handleUnarchive}
                    showSpace={true}
                    isArchived={true}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 shadow-sm border border-zinc-200 text-center">
            <Archive className="size-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-1">No archived testimonials</p>
            <p className="text-sm text-text-secondary">
              Archived testimonials will appear here
            </p>
          </div>
        )}
      </Topbar>
    </div>
  );
}

