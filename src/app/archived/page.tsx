"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Archive, Star, MessageCircle, List, Grid } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";

type ViewMode = "list" | "cards";

interface Campaign {
  id: string;
  title: string;
  description: string;
  shareLink: string;
  userId: string;
  createdAt: string;
  testimonials: Testimonial[];
}

interface Testimonial {
  id: string;
  favourite: boolean;
  archived: boolean;
  campaignId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface DisplayTestimonial {
  id: string;
  author: string;
  email: string;
  text: string;
  date: string;
  space: string;
  archivedDate: string;
  favourite: boolean;
  campaignId: string;
}

export default function ArchivedPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [archivedTestimonials, setArchivedTestimonials] = useState<DisplayTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !data?.user) {
      router.push('/signin');
    }
  }, [authLoading, data?.user, router]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchArchivedTestimonials = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const response = await axios.get(`${backendUrl}/testimonials/archived`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform the nested campaign structure into flat testimonial array
        const campaigns: Campaign[] = response.data;
        const flattenedTestimonials: DisplayTestimonial[] = [];

        campaigns.forEach((campaign) => {
          campaign.testimonials.forEach((testimonial) => {
            flattenedTestimonials.push({
              id: testimonial.id,
              author: testimonial.name,
              email: testimonial.email,
              text: testimonial.message,
              date: new Date(testimonial.createdAt).toLocaleDateString(),
              space: campaign.title,
              archivedDate: new Date(testimonial.createdAt).toLocaleDateString(),
              favourite: testimonial.favourite,
              campaignId: testimonial.campaignId,
            });
          });
        });

        setArchivedTestimonials(flattenedTestimonials);
      } catch (error: any) {
        console.error("Error fetching archived testimonials:", error);
        rateLimitHandlers.protected.handleError(error, "Failed to load archived testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedTestimonials();
  }, [backendUrl]);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <Topbar>
        {loading ? (
          <SpacesSkeletonLoader />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Archive className="size-6 text-text-primary" />
                  <h1 className="text-2xl font-bold text-text-primary">Archived</h1>
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
              <p className="text-text-secondary">{archivedTestimonials.length} archived testimonials</p>
            </div>

            {archivedTestimonials.length > 0 ? (
          <div>
            {viewMode === "list" ? (
              <div className="space-y-4">
                {archivedTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow opacity-75">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-medium text-text-primary truncate">{testimonial.author}</h3>
                            {testimonial.favourite && (
                              <Star className="size-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded truncate max-w-[200px]">
                            {testimonial.space}
                          </span>
                          <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1 flex-shrink-0">
                            <Archive className="size-3" />
                            Archived
                          </span>
                        </div>
                        <p className="text-text-secondary mb-3 break-words whitespace-pre-wrap">{testimonial.text}</p>
                        <div className="flex items-center gap-4 text-xs text-text-secondary flex-wrap">
                          <span>Received: {testimonial.date}</span>
                          <span>Archived: {testimonial.archivedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Restore">
                          <Archive className="size-4 text-zinc-400" />
                        </button>
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Favorite">
                          <Star className={`size-4 ${testimonial.favourite ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-400 hover:text-yellow-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Cards View - Variable heights based on content
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                {archivedTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow flex flex-col opacity-75"
                  >
                    {/* Top Row: Badges and Actions */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded truncate max-w-[150px]">
                          {testimonial.space}
                        </span>
                        <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1 flex-shrink-0">
                          <Archive className="size-3" />
                          Archived
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Restore">
                          <Archive className="size-4 text-zinc-400" />
                        </button>
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Favorite">
                          <Star className={`size-4 ${testimonial.favourite ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-400 hover:text-yellow-400'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Favorite indicator */}
                    {testimonial.favourite && (
                      <div className="flex items-center gap-1 mb-4 flex-shrink-0">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-text-secondary">Favourite</span>
                      </div>
                    )}

                    {/* Testimonial Text - Variable height based on content */}
                    <p className="text-text-secondary mb-4 text-base leading-relaxed flex-1 break-words whitespace-pre-wrap">
                      {testimonial.text}
                    </p>

                    {/* Border */}
                    <div className="border-t border-zinc-200 mb-4 flex-shrink-0"></div>

                    {/* Author and Dates */}
                    <div className="mt-auto flex-shrink-0 min-w-0">
                      <h3 className="font-semibold text-text-primary mb-2 truncate">
                        {testimonial.author}
                      </h3>
                      <div className="flex flex-col gap-1 text-xs text-text-secondary">
                        <span>Received: {testimonial.date}</span>
                        <span>Archived: {testimonial.archivedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          </>
        )}
      </Topbar>
    </div>
  );
}

