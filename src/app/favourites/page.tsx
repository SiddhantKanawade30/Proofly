"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Star, Archive, MessageCircle, List, Grid } from "lucide-react";
import { useState } from "react";

// Mock data - replace with actual API calls
const mockFavoriteTestimonials = [
  {
    id: "1",
    author: "John Smith",
    text: "This product changed my life! Absolutely amazing experience from start to finish.This product changed my life! Absolutely amazing experience from start to finish.This product changed my life! Absolutely amazing experience from start to finish.",
    date: "2024-01-15",
    rating: 5,
    space: "Project Alpha",
  },
  {
    id: "2",
    author: "Sarah Johnson",
    text: "Amazing service, highly recommend! The team was so helpful throughout the process.",
    date: "2024-01-20",
    rating: 5,
    space: "Marketing Campaign",
  },
  {
    id: "4",
    author: "Emily Chen",
    text: "Exceeded my expectations! The quality and attention to detail is outstanding.",
    date: "2024-02-10",
    rating: 5,
    space: "Beta Testing",
  },
];

type ViewMode = "list" | "cards";

export default function FavouritesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="size-6 text-yellow-400 fill-yellow-400" />
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
          <p className="text-text-secondary">{mockFavoriteTestimonials.length} favorite testimonials</p>
        </div>

        {mockFavoriteTestimonials.length > 0 ? (
          <div>
            {viewMode === "list" ? (
              <div className="rounded-lg bg-white shadow-sm border border-zinc-200">
                <div className="divide-y divide-zinc-200">
                  {mockFavoriteTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-6 hover:bg-zinc-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text-primary">{testimonial.author}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded">
                        {testimonial.space}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{testimonial.text}</p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>{testimonial.date}</span>
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span>Favorited</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Unfavorite">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    </button>
                    <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Archive">
                      <Archive className="size-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>
                  ))}
                </div>
              </div>
            ) : (
              // Cards View - Variable heights based on content
              <div className="">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 items-start">
                  {mockFavoriteTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow bg-white flex flex-col"
                    >
                      {/* Top Row: Space badge and Actions */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded">
                          {testimonial.space}
                        </span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Unfavorite">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          </button>
                          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Archive">
                            <Archive className="size-4 text-zinc-400" />
                          </button>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Testimonial Text - Variable height based on content */}
                      <p className="text-text-secondary mb-4 text-base leading-relaxed flex-1">
                        {testimonial.text}
                      </p>

                      {/* Border */}
                      <div className="border-t border-zinc-200 mb-4"></div>

                      {/* Author and Date */}
                      <div className="mt-auto">
                        <h3 className="font-semibold text-text-primary mb-1">
                          {testimonial.author}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                          <span>{testimonial.date}</span>
                          <div className="flex items-center gap-1">
                            <Star className="size-3 fill-yellow-400 text-yellow-400" />
                            <span>Favorited</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 shadow-sm border border-zinc-200 text-center">
            <MessageCircle className="size-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-1">No favorite testimonials yet</p>
            <p className="text-sm text-text-secondary">
              Star testimonials you love to save them here
            </p>
          </div>
        )}
      </Topbar>
    </div>
  );
}

