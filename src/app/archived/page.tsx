"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Archive, Star, MessageCircle, List, Grid } from "lucide-react";
import { useState } from "react";

// Mock data - replace with actual API calls
const mockArchivedTestimonials = [
  {
    id: "3",
    author: "Mike Davis",
    text: "Great experience overall. The product meets my needs and the support was helpful.",
    date: "2024-02-01",
    rating: 4,
    space: "Project Alpha",
    archivedDate: "2024-02-15",
  },
  {
    id: "5",
    author: "David Wilson",
    text: "Good product with room for improvement. Would recommend with some reservations.",
    date: "2024-02-05",
    rating: 3,
    space: "Marketing Campaign",
    archivedDate: "2024-02-18",
  },
];

type ViewMode = "list" | "cards";

export default function ArchivedPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <Topbar>
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
          <p className="text-text-secondary">{mockArchivedTestimonials.length} archived testimonials</p>
        </div>

        {mockArchivedTestimonials.length > 0 ? (
          <div className="rounded-lg bg-white shadow-sm border border-zinc-200">
            {viewMode === "list" ? (
              <div className="divide-y divide-zinc-200">
            {mockArchivedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-6 hover:bg-zinc-50 transition-colors opacity-75">
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
                      <span className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                        {testimonial.space}
                      </span>
                      <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1">
                        <Archive className="size-3" />
                        Archived
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{testimonial.text}</p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>Received: {testimonial.date}</span>
                      <span>Archived: {testimonial.archivedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Restore">
                      <Archive className="size-4 text-zinc-400" />
                    </button>
                    <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Favorite">
                      <Star className="size-4 text-zinc-400 hover:text-yellow-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
            ) : (
              // Cards View - Variable heights based on content
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                  {mockArchivedTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow bg-white flex flex-col opacity-75"
                    >
                      {/* Top Row: Badges and Actions */}
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                            {testimonial.space}
                          </span>
                          <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1">
                            <Archive className="size-3" />
                            Archived
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Restore">
                            <Archive className="size-4 text-zinc-400" />
                          </button>
                          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" title="Favorite">
                            <Star className="size-4 text-zinc-400 hover:text-yellow-400" />
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

                      {/* Author and Dates */}
                      <div className="mt-auto">
                        <h3 className="font-semibold text-text-primary mb-2">
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
      </Topbar>
    </div>
  );
}

