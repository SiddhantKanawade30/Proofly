"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
}

export function StarRating({value, onChange, required = false }: StarRatingProps) {
  const handleClick = (rating: number) => {
    onChange(rating);
  };

  return (
    <div className="flex items-center gap-3 pt-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= value;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  isSelected
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}