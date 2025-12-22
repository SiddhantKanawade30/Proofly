import React from "react";

interface Testimonial {
  id: string;
  name: string;
  position?: string;
  message: string;
  rating?: number;
  testimonialType?: "text" | "video";
  playbackId?: string;
}

interface ListViewProps {
  testimonials: Testimonial[];
  isLoading?: boolean;
}

/**
 * ListView Component - Traditional list layout for testimonials
 * 
 * Features:
 * - Clean, readable list format
 * - Full-width items
 * - Consistent spacing
 * - Supports text and video testimonials
 */
export const ListView: React.FC<ListViewProps> = ({ testimonials, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500">Loading testimonials...</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500">No testimonials yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="
            rounded-lg
            border border-neutral-200
            bg-white
            p-5
            shadow-sm
            hover:shadow-md
            transition-shadow
            duration-200
          "
        >
          {/* Top Row: Name, Position, and Type Badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">{testimonial.name}</h3>
              {testimonial.position && (
                <p className="text-sm text-neutral-600">{testimonial.position}</p>
              )}
            </div>
            {testimonial.testimonialType && (
              <span
                className={`
                  flex-shrink-0
                  inline-block
                  text-xs
                  font-medium
                  px-2.5
                  py-1
                  rounded
                  ${
                    testimonial.testimonialType === "video"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {testimonial.testimonialType === "video" ? "📹 Video" : "📝 Text"}
              </span>
            )}
          </div>

          {/* Rating */}
          {testimonial.rating && testimonial.rating > 0 && (
            <div className="mb-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < testimonial.rating!
                      ? "text-yellow-400"
                      : "text-neutral-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Message Content */}
          <div>
            {testimonial.testimonialType === "video" && testimonial.playbackId ? (
              <div className="rounded-md bg-neutral-100 p-6 text-center">
                <p className="text-sm text-neutral-600 mb-4">Video Testimonial</p>
                {/* Video embedding would go here - using Mux playback ID */}
                <div className="bg-neutral-900 rounded aspect-video flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-500">Playback ID: {testimonial.playbackId}</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-neutral-700">
                {testimonial.message}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
