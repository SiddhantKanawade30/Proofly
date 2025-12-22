"use client";

import { Star } from "lucide-react";

interface StarDisplayProps {
  value: number;
}

/**
 * StarDisplay Component - Read-only star rating display
 * Shows only the stars without any "Rate the product" label
 * Used for displaying testimonial ratings
 */
export function StarDisplay({ value }: StarDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = star <= value;
        return (
          <Star
            key={star}
            className={`h-5 w-5 ${
              isSelected
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
