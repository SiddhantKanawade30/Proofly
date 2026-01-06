"use client";

import React from "react";
import { Archive, Heart } from "lucide-react";
import { StarRating } from "./starRating";

export default function TestimonialCard({
  testimonial,
  favorites,
  toggleFavorite,
  onArchiveClick,
}: {
  testimonial: any;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  onArchiveClick: (id: string) => void;
}) {
  return (
    <div className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-medium text-text-primary truncate">{testimonial.name}</h3>
            {testimonial.position && (
              <span className="text-sm text-text-secondary truncate">{testimonial.position}</span>
            )}
            {testimonial.email && (
              <span className="text-xs text-text-secondary truncate">({testimonial.email})</span>
            )}
          </div>

          {testimonial.testimonialType === "video" && testimonial.playbackId ? (
            <div className="mb-2">
              <iframe
                src={`https://player.mux.com/${testimonial.playbackId}`}
                style={{ width: "100%", maxWidth: "600px", border: "none", aspectRatio: "4/3" }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <>
              <p className="text-text-secondary mt-2 mb-2 break-words whitespace-pre-wrap">{testimonial.message}</p>
              <div>
                <StarRating value={testimonial.rating || 0} onChange={() => {}} />
              </div>
            </>
          )}

          <p className="text-xs text-text-secondary">{new Date(testimonial.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => toggleFavorite(testimonial.id)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Add to favorites"
          >
            <Heart
              className={`size-4 transition-colors ${
                favorites.has(testimonial.id) ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-500"
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
  );
}
