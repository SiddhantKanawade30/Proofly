"use client";

import React from "react";
import { Archive, Heart } from "lucide-react";
import { StarDisplay } from "@/components/ui/starDisplay";

export interface TestimonialData {
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
  campaignId: string;
  space?: string; // For pages that show space name
}

interface GenericTestimonialCardProps {
  testimonial: TestimonialData;
  viewMode: "list" | "cards";
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  showSpace?: boolean;
  isArchived?: boolean;
}

export const GenericTestimonialCard: React.FC<GenericTestimonialCardProps> = ({
  testimonial,
  viewMode,
  isFavorite,
  onToggleFavorite,
  onArchive,
  onUnarchive,
  showSpace = false,
  isArchived = false,
}) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const VideoContent = () => (
    <div className="mb-3 md:mb-6">
      <iframe
        src={`https://player.mux.com/${testimonial.playbackId}`}
        style={{
          width: "100%",
          maxWidth: viewMode === "list" ? "600px" : "100%",
          border: "none",
          aspectRatio: "4/3",
          borderRadius: viewMode === "list" ? "0" : "8px",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      ></iframe>
    </div>
  );

  const TextContent = () => (
    <>
      <p className={`text-text-secondary ${viewMode === "list" ? "mb-3 break-words whitespace-pre-wrap" : "mb-4 md:mb-6 text-base leading-relaxed flex-1 break-words whitespace-pre-wrap"}`}>
        {testimonial.message}
      </p>
      {testimonial.rating && testimonial.rating > 0 && (
        <div className={viewMode === "list" ? "mb-3" : "mb-4 md:mb-6"}>
          <StarDisplay value={testimonial.rating} />
        </div>
      )}
    </>
  );

  if (viewMode === "list") {
    return (
      <div className={`rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow ${isArchived ? "" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-medium text-text-primary truncate">{testimonial.name}</h3>
                {testimonial.position && (
                  <span className="text-sm text-text-secondary truncate">{testimonial.position}</span>
                )}
              </div>
              {showSpace && testimonial.space && (
                <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded truncate max-w-[200px]">
                  {testimonial.space}
                </span>
              )}
              {isArchived && (
                <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1 flex-shrink-0">
                  <Archive className="size-3" />
                  Archived
                </span>
              )}
            </div>

            {/* Content */}
            {testimonial.testimonialType === "video" && testimonial.playbackId ? (
              <VideoContent />
            ) : (
              <TextContent />
            )}

            {/* Footer */}
            <p className="text-xs text-text-secondary">
              {formatDate(testimonial.createdAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onToggleFavorite(testimonial.id)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`size-4 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-500"
                }`}
              />
            </button>
            <button
              onClick={() => (isArchived && onUnarchive ? onUnarchive(testimonial.id) : onArchive(testimonial.id))}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              title={isArchived ? "Unarchive" : "Archive"}
            >
              <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cards view
  return (
    <div className="rounded-lg bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full break-inside-avoid">
      {/* Top Row: Badges and Actions */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {showSpace && testimonial.space && (
            <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded truncate max-w-[150px]">
              {testimonial.space}
            </span>
          )}
          {isArchived && (
            <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-600 rounded flex items-center gap-1 flex-shrink-0">
              <Archive className="size-3" />
              Archived
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(testimonial.id)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`size-4 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-500"
              }`}
            />
          </button>
          <button
            onClick={() => (isArchived && onUnarchive ? onUnarchive(testimonial.id) : onArchive(testimonial.id))}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            title={isArchived ? "Unarchive" : "Archive"}
          >
            <Archive className="size-4 text-zinc-400 hover:text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      {testimonial.testimonialType === "video" && testimonial.playbackId ? (
        <VideoContent />
      ) : (
        <TextContent />
      )}

      {/* Border */}
      <div className="border-t border-zinc-200 mb-4 flex-shrink-0"></div>

      {/* Footer */}
      <div className="mt-auto flex-shrink-0 min-w-0">
        <h3 className="font-semibold text-text-primary mb-1 truncate">
          {testimonial.name}
        </h3>
        {testimonial.position && (
          <p className="text-sm text-text-secondary truncate mb-2">
            {testimonial.position}
          </p>
        )}
        {testimonial.email && (
          <p className="text-xs text-text-secondary truncate mb-2">
            {testimonial.email}
          </p>
        )}
        <p className="text-xs text-text-secondary">{formatDate(testimonial.createdAt)}</p>
      </div>
    </div>
  );
};
