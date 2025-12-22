"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import Header from "./components/Header";
import Controls from "./components/Controls";
import TestimonialList from "./components/TestimonialList";
import ArchiveDialog from "./components/ArchiveDialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
// Dialog is handled by ArchiveDialog component
import axios from "axios";
import SpaceDetailSkeleton from "@/components/loaders/testimonialLoader";
import { EmbedModal } from "@/components/ui/embedModal";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";


type ViewMode = "list" | "block";

export default function SpaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [viewMode, setViewMode] = useState<ViewMode>("block");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testimonialToArchive, setTestimonialToArchive] = useState<{ id: string; author: string } | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
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
        // Initialize favorites set from fetched testimonials
        const favIds = new Set<string>(
          (res.data?.testimonials || [])
            .filter((t: any) => t.favourite === true)
            .map((t: any) => t.id)
        );
        setFavorites(favIds);
      } catch (error: any) {
       console.log(error);
       rateLimitHandlers.protected.handleError(error, "Failed to load space details");
      } finally {
        setLoading(false);
      }


    }
    fetchSpace();
  }, [id]);

  const toggleFavorite = async(testimonialId: string) => {

    const token = localStorage.getItem("token");

    const fav = async () => {
      try {
        const res = await axios.put(`${backendUrl}/testimonials/favourite`, { testimonialId }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (error: any) {
        rateLimitHandlers.protected.handleError(error, "Failed to add to favorites");
      }
    }

    const unFav = async() => {
      try {
        await axios.put(`${backendUrl}/testimonials/remove-favorite`, { testimonialId }, {
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        });
      } catch (error: any) {
        rateLimitHandlers.protected.handleError(error, "Failed to remove from favorites");
      }
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
            <Header
              title={data?.title}
              description={data?.description}
              shareLink={data?.shareLink}
              onCopy={handleCopyUrl}
              onOpenEmbed={() => setEmbedModalOpen(true)}
            />

            {/* Testimonials Section */}
              <div className="mb-6">
                <Controls viewMode={viewMode} setViewMode={setViewMode} count={data?.testimonials?.length} />

                <TestimonialList
                  testimonials={data?.testimonials || []}
                  viewMode={viewMode}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  onArchiveClick={handleArchiveClick}
                />
              </div>
          </>
        )}

        {/* Archive Confirmation Dialog */}
        <ArchiveDialog
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
          testimonialToArchive={testimonialToArchive}
          onConfirm={handleArchiveConfirm}
        />

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