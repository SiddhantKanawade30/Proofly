"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Heart, MessageCircle, List, Grid } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useFetchTestimonials, useTestimonialActions } from "@/hooks/useTestimonials";
import { GenericTestimonialCard, MemoGenericTestimonialCard, TestimonialData } from "@/components/TestimonialCardGeneric";

export default function FavouritesPage() {
  const [viewMode, setViewMode] = useState<"cards">("cards");
  const router = useRouter();
  const { data, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !data?.user) {
      router.push('/signin');
    }
  }, [authLoading, data?.user, router]);

  
  const { testimonials: hookTestimonials, favorites: hookFavorites, loading, refetch } = useFetchTestimonials({
    endpoint: "/testimonials/favourite",
    showSpace: true,
  });

  
  const [testimonials, setTestimonials] = useState<typeof hookTestimonials>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  
  useEffect(() => {
    setTestimonials(hookTestimonials);
    setFavorites(hookFavorites);
  }, [hookTestimonials, hookFavorites]);

  
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

  const handleArchive = useCallback(async (testimonialId: string) => {
    const testimonial = testimonials.find((t) => t.id === testimonialId);
    if (!testimonial) return;

    const success = await archiveTestimonial(testimonialId, testimonial.campaignId);
    if (success) {
      
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    }
  }, [testimonials, archiveTestimonial]);

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
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-bold text-text-primary">Favorites</h1>
            </div>
          </div>
          <p className="text-text-secondary">{testimonials.length} favorite testimonials</p>
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
                    onArchive={handleArchive}
                    showSpace={true}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 border border-zinc-200 text-center">
            <Heart className="size-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-1">No favorite testimonials yet</p>
            <p className="text-sm text-text-secondary">
              Heart testimonials you love to save them here
            </p>
          </div>
        )}
      </Topbar>
    </div>
  );
}

