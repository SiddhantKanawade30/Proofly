/**
 * EXAMPLE USAGE - Testimonials Space Page
 * 
 * This example shows how to integrate CardView and ListView components
 * into your spaces page with a view toggle.
 */

import React, { useState } from "react";
import { CardView } from "@/components/CardView";
import { ListView } from "@/components/ListView";

// Example testimonials data structure
const EXAMPLE_TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Marketing Manager at TechCorp",
    message: "This product has completely transformed how we manage our testimonials. The interface is intuitive and the features are exactly what we needed.",
    rating: 5,
    testimonialType: "text" as const,
  },
  {
    id: "2",
    name: "Mike Chen",
    position: "CEO, StartupX",
    message: "Outstanding service! The team went above and beyond to ensure everything was perfect.",
    rating: 5,
    testimonialType: "text" as const,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    position: "Product Designer",
    message: "I was impressed by the attention to detail and the seamless integration with our existing tools.",
    rating: 4,
    testimonialType: "video" as const,
    playbackId: "mux-playback-id-123",
  },
  {
    id: "4",
    name: "David Park",
    position: "Engineering Lead",
    message: "The documentation is clear and comprehensive. Implementation was straightforward.",
    rating: 5,
    testimonialType: "text" as const,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    message: "This is exactly what we were looking for. Highly recommend to anyone in this space.",
    rating: 5,
    testimonialType: "text" as const,
  },
  {
    id: "6",
    name: "James Wilson",
    position: "VP Sales",
    message: "Great experience from start to finish. The support team was responsive and helpful throughout the entire process. Looking forward to a long partnership.",
    rating: 5,
    testimonialType: "text" as const,
  },
];

interface TestimonialSpacePageProps {
  spaceId: string;
  spaceName: string;
  testimonials: typeof EXAMPLE_TESTIMONIALS;
  isLoading?: boolean;
}

/**
 * Example: Testimonial Space Page with View Toggle
 * 
 * Usage:
 * <TestimonialSpacePage 
 *   spaceId="space-123"
 *   spaceName="My Campaign"
 *   testimonials={fetchedTestimonials}
 *   isLoading={isLoading}
 * />
 */
export function TestimonialSpacePage({
  spaceId,
  spaceName,
  testimonials,
  isLoading = false,
}: TestimonialSpacePageProps) {
  const [view, setView] = useState<"card" | "list">("card");

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {spaceName}
          </h1>
          <p className="text-neutral-600">
            Total testimonials: {testimonials.length}
          </p>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center gap-2 border-b border-neutral-200 pb-4">
          <button
            onClick={() => setView("card")}
            className={`
              px-4 py-2 rounded-md font-medium text-sm transition-colors
              ${
                view === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }
            `}
          >
            🗂️ Card View
          </button>
          <button
            onClick={() => setView("list")}
            className={`
              px-4 py-2 rounded-md font-medium text-sm transition-colors
              ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }
            `}
          >
            📋 List View
          </button>
        </div>

        {/* Conditional Rendering */}
        {view === "card" ? (
          <CardView testimonials={testimonials} isLoading={isLoading} />
        ) : (
          <ListView testimonials={testimonials} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

/**
 * MINIMAL INTEGRATION EXAMPLE
 * 
 * If you already have a page component, just add this:
 * 
 * import { CardView } from "@/components/CardView";
 * import { ListView } from "@/components/ListView";
 * 
 * const [view, setView] = useState<"card" | "list">("card");
 * 
 * return (
 *   <div>
 *     <button onClick={() => setView("card")}>Card View</button>
 *     <button onClick={() => setView("list")}>List View</button>
 *     
 *     {view === "card" ? (
 *       <CardView testimonials={testimonials} isLoading={isLoading} />
 *     ) : (
 *       <ListView testimonials={testimonials} isLoading={isLoading} />
 *     )}
 *   </div>
 * );
 */
