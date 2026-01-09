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

interface CardViewProps {
  testimonials: Testimonial[];
  isLoading?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({ testimonials, isLoading }) => {
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
    <div
      className="
        columns-1 gap-6
        sm:columns-2 sm:gap-6
        lg:columns-3 lg:gap-6
        w-full
      "
    >
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="
            break-inside-avoid
            mb-6
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
          {/* Header: Name and Position */}
          <div className="mb-4">
            <h3 className="font-semibold text-neutral-900">{testimonial.name}</h3>
            {testimonial.position && (
              <p className="text-sm text-neutral-600">{testimonial.position}</p>
            )}
          </div>

          {/* Rating */}
          {testimonial.rating && testimonial.rating > 0 && (
            <div className="mb-4 flex items-center gap-1">
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
          <div className="mb-4">
            {testimonial.testimonialType === "video" && testimonial.playbackId ? (
              <div className="rounded-md bg-neutral-100 p-4 text-center">
                <p className="text-sm text-neutral-600 mb-2">Video Testimonial</p>
                {/* Video embedding would go here - using Mux playback ID */}
                <div className="bg-neutral-900 rounded aspect-video flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-500 mt-2">ID: {testimonial.playbackId}</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-neutral-700">
                {testimonial.message}
              </p>
            )}
          </div>

          {/* Type Badge */}
          {testimonial.testimonialType && (
            <div className="flex gap-2">
              <span
                className={`
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
