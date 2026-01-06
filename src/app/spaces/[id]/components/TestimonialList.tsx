"use client";

import React from "react";
import TestimonialCard from "./TestimonialCard";
import { Heart, Archive } from "lucide-react";
import { StarDisplay } from "@/components/ui/starDisplay";

export default function TestimonialList({
  testimonials,
  viewMode,
  favorites,
  toggleFavorite,
  onArchiveClick,
}: {
  testimonials: any[];
  viewMode: "list" | "block";
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  onArchiveClick: (id: string) => void;
}) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-text-secondary mb-2">No testimonials yet</p>
        <p className="text-sm text-text-secondary">
          Share this space URL to start collecting testimonials
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {testimonials.map((testimonial: any) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onArchiveClick={onArchiveClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="columns-1 gap-6 md:columns-2 lg:columns-3 w-full">
      {testimonials.map((testimonial: any) => (
        <div
          key={testimonial.id}
          className="break-inside-avoid mb-6 rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Video or Text Content */}
          {testimonial.testimonialType === "video" && testimonial.playbackId ? (
            <div className="mb-6">
              <iframe
                src={`https://player.mux.com/${testimonial.playbackId}`}
                style={{
                  width: "100%",
                  border: "none",
                  aspectRatio: "4/3",
                  borderRadius: "8px",
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              ></iframe>
              <div className="mb-6 text-text-secondary text-base leading-relaxed">
                <p className="break-words whitespace-pre-wrap">
                  {testimonial.message && `"${testimonial.message}"`}
                </p>
                {/* Rating */}
                {testimonial.rating && testimonial.rating > 0 && (
                  <div className="my-4">
                    <StarDisplay value={testimonial.rating} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 text-text-secondary text-base leading-relaxed">
              <p className="break-words whitespace-pre-wrap">
                {testimonial.message && `"${testimonial.message}"`}
              </p>
              {/* Rating */}
              {testimonial.rating && testimonial.rating > 0 && (
                <div className="my-4">
                  <StarDisplay value={testimonial.rating} />
                </div>
              )}
            </div>
          )}

          {/* Border */}
          <div className="border-t border-zinc-200 mb-4"></div>

          {/* Name and Position/Email */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-text-primary mb-1 truncate">
                {testimonial.name}
              </h3>
              {testimonial.position && (
                <p className="text-sm text-text-secondary truncate">
                  {testimonial.position}
                </p>
              )}
              {testimonial.email && (
                <p className="text-xs text-text-secondary truncate">
                  {testimonial.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => toggleFavorite(testimonial.id)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Add to favorites"
              >
                <Heart
                  className={`size-4 transition-colors ${
                    favorites.has(testimonial.id)
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-400 hover:text-red-500"
                  }`}
                />
              </button>
              <button
                onClick={() => onArchiveClick(testimonial.id)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Archive testimonial"
              >
                <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
