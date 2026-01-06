"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Heart, MessageCircle, List, Grid } from "lucide-react";
import { useState, useEffect } from "react";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useFetchTestimonials, useTestimonialActions } from "@/hooks/useTestimonials";
import { GenericTestimonialCard, TestimonialData } from "@/components/TestimonialCardGeneric";

type ViewMode = "list" | "cards";

export default function FavouritesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const router = useRouter();
  const { data, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !data?.user) {
      router.push('/signin');
    }
  }, [authLoading, data?.user, router]);

  // Fetch favorite testimonials
  const { testimonials: hookTestimonials, favorites: hookFavorites, loading, refetch } = useFetchTestimonials({
    endpoint: "/testimonials/favourite",
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
  const { toggleFavorite, archiveTestimonial } = useTestimonialActions();

  const handleToggleFavorite = async (testimonialId: string) => {
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (!testimonial) return;
    
    const isFavorite = favorites.has(testimonialId);
    
    // Update UI immediately
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.delete(testimonialId);
      } else {
        newFavorites.add(testimonialId);
      }
      return newFavorites;
    });

    // Call API in background
    const success = await toggleFavorite(testimonialId, isFavorite, testimonial.campaignId);
    
    // If API fails, revert the state
    if (!success) {
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.add(testimonialId);
        } else {
          newFavorites.delete(testimonialId);
        }
        return newFavorites;
      });
    }
  };

  const handleArchive = async (testimonialId: string) => {
    const testimonial = testimonials.find((t) => t.id === testimonialId);
    if (!testimonial) return;

    const success = await archiveTestimonial(testimonialId, testimonial.campaignId);
    if (success) {
      // Remove archived testimonial from local state
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    }
  };

  if (authLoading || loading) {
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
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-bold text-text-primary">Favorites</h1>
            </div>
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
          <p className="text-text-secondary">{testimonials.length} favorite testimonials</p>
        </div>

        {testimonials.length > 0 ? (
          <div>
            {viewMode === "list" ? (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <GenericTestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial as TestimonialData & { space?: string }}
                    viewMode="list"
                    isFavorite={favorites.has(testimonial.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onArchive={handleArchive}
                    showSpace={true}
                  />
                ))}
              </div>
            ) : (
              <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="break-inside-avoid mb-6">
                    <GenericTestimonialCard
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
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 shadow-sm border border-zinc-200 text-center">
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

