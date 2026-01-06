"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import axios from "axios";
import { MessageCircle, List, Grid, Code } from "lucide-react";
import { useEffect, useState } from "react";
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
import { GenericTestimonialCard, TestimonialData } from "@/components/TestimonialCardGeneric";

type ViewMode = "list" | "cards";

export default function AllTestimonialsPage() {
  const router = useRouter();
  const { data: userData, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !userData?.user) {
      router.push('/signin');
    }
  }, [authLoading, userData?.user, router]);

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string; campaignId: string } | null>(null);

  // Fetch all testimonials
  const { testimonials: hookTestimonials, favorites: hookFavorites, loading, refetch } = useFetchTestimonials({
    endpoint: "/testimonials/get/all",
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

  const handleArchiveClick = (testimonial: TestimonialData & { space?: string }) => {
    setTestimonialToArchive({
      id: testimonial.id,
      author: testimonial.name,
      campaignId: testimonial.campaignId,
    });
    setArchiveDialogOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!testimonialToArchive) return;

    const success = await archiveTestimonial(
      testimonialToArchive.id,
      testimonialToArchive.campaignId
    );
    
    if (success) {
      // Remove archived testimonial from local state
      setTestimonials(prev => prev.filter(t => t.id !== testimonialToArchive.id));
      setArchiveDialogOpen(false);
      setTestimonialToArchive(null);
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
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
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
          <p className="text-text-secondary">{testimonials.length} testimonials</p>
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
                    onArchive={(id) => {
                      const t = testimonials.find((test) => test.id === id);
                      if (t) handleArchiveClick(t as TestimonialData & { space?: string });
                    }}
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
                      onArchive={(id) => {
                        const t = testimonials.find((test) => test.id === id);
                        if (t) handleArchiveClick(t as TestimonialData & { space?: string });
                      }}
                      showSpace={true}
                    />
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