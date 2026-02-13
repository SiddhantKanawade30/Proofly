import React from 'react';

const SpaceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background-offset">
      {/* Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* URL Input Box */}
        <div className="mt-4 px-3 py-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Testimonials Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-6 w-64 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
              <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Testimonial Cards in Block View */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-lg bg-white border border-zinc-200 p-6 relative overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
              
              {/* Top Row: Icons */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Border */}
              <div className="border-t border-zinc-200 mb-4"></div>

              {/* Name and Position */}
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-36 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default SpaceDetailSkeleton;