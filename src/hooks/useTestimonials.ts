import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import { useRouter } from "next/navigation";

export interface TestimonialFetchData {
  id: string;
  name: string;
  email?: string;
  position?: string;
  message?: string;
  rating?: number;
  testimonialType?: "text" | "video";
  playbackId?: string;
  createdAt: string;
  favourite: boolean;
  archived: boolean;
  campaignId: string;
  campaign?: {
    id: string;
    title: string;
  };
}

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  shareLink?: string;
  userId?: string;
  createdAt?: string;
  testimonials: TestimonialFetchData[];
}

interface UseFetchTestimonialsOptions {
  endpoint: string;
  showSpace?: boolean;
  includeArchived?: boolean;
}

interface FetchedData {
  testimonials: Array<TestimonialFetchData & { space?: string }>;
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching testimonials with modern patterns
 * Handles API calls, state management, and error handling
 */
export function useFetchTestimonials({
  endpoint,
  showSpace = false,
}: UseFetchTestimonialsOptions): FetchedData {
  const [testimonials, setTestimonials] = useState<Array<TestimonialFetchData & { space?: string }>>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        router.push("/signin");
        return;
      }

      if (!backendUrl) {
        setError("Backend URL not configured");
        return;
      }

      const response = await axios.get(`${backendUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let flattenedTestimonials: Array<TestimonialFetchData & { space?: string }> = [];
      const favIds = new Set<string>();

      if (Array.isArray(response.data)) {
        // If response is a campaign array (getFavourite, getArchived)
        const campaigns: Campaign[] = response.data;
        
        campaigns.forEach((campaign) => {
          campaign.testimonials.forEach((testimonial) => {
            const item: TestimonialFetchData & { space?: string } = {
              ...testimonial,
              campaignId: campaign.id, // Ensure campaignId is set
            };
            
            if (showSpace) {
              item.space = campaign.title;
            }
            
            flattenedTestimonials.push(item);
            
            if (testimonial.favourite) {
              favIds.add(testimonial.id);
            }
          });
        });
      } else if (response.data?.testimonials) {
        // If response has testimonials array directly (getTestimonialsByCampaign)
        flattenedTestimonials = response.data.testimonials;
        flattenedTestimonials.forEach((testimonial) => {
          if (testimonial.favourite) {
            favIds.add(testimonial.id);
          }
        });
      } else if (response.data?.data) {
        // If response has data array (getAllUserTestimonials)
        flattenedTestimonials = response.data.data;
        flattenedTestimonials.forEach((testimonial) => {
          if (testimonial.favourite) {
            favIds.add(testimonial.id);
          }
          
          // If campaign object exists but space not set, add space from campaign
          if (showSpace && !testimonial.space && testimonial.campaign?.title) {
            testimonial.space = testimonial.campaign.title;
          }
        });
      }

      setTestimonials(flattenedTestimonials);
      setFavorites(favIds);
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      const message = error?.response?.data?.message || "Failed to load testimonials";
      setError(message);
      rateLimitHandlers.protected.handleError(error, message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token, backendUrl, router, showSpace]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    testimonials,
    favorites,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for managing testimonial actions (favorite, archive, unarchive)
 */
export function useTestimonialActions() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const toggleFavorite = useCallback(
    async (testimonialId: string, isFavorite: boolean, campaignId: string) => {
      if (!token) return;

      try {
        const endpoint = isFavorite ? "/testimonials/remove-favorite" : "/testimonials/favourite";
        
        await axios.put(
          `${backendUrl}${endpoint}`,
          { testimonialId, campaignId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
        return true;
      } catch (error: any) {
        console.error("Error toggling favorite:", error);
        rateLimitHandlers.protected.handleError(error, "Failed to update favorite status");
        return false;
      }
    },
    [token, backendUrl]
  );

  const archiveTestimonial = useCallback(
    async (testimonialId: string, campaignId: string) => {
      if (!token) return;

      try {
        await axios.put(
          `${backendUrl}/testimonials/archive`,
          { testimonialId, campaignId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success("Testimonial archived successfully");
        return true;
      } catch (error: any) {
        console.error("Error archiving testimonial:", error);
        rateLimitHandlers.protected.handleError(error, "Failed to archive testimonial");
        return false;
      }
    },
    [token, backendUrl]
  );

  const unarchiveTestimonial = useCallback(
    async (testimonialId: string, campaignId: string) => {
      if (!token) return;

      try {
        await axios.put(
          `${backendUrl}/testimonials/unarchive`,
          { testimonialId, campaignId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success("Testimonial unarchived successfully");
        return true;
      } catch (error: any) {
        console.error("Error unarchiving testimonial:", error);
        rateLimitHandlers.protected.handleError(error, "Failed to unarchive testimonial");
        return false;
      }
    },
    [token, backendUrl]
  );

  return {
    toggleFavorite,
    archiveTestimonial,
    unarchiveTestimonial,
  };
}
