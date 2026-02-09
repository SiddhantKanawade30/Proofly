import React from 'react';

const SpacesSkeletonLoader = () => {
  return (
    <div className="p-8 bg-neutral-100">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
            
            {/* Card Content */}
            <div className="space-y-4">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              
              {/* Description */}
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              
              {/* Testimonials Label */}
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mt-6"></div>
              
              {/* URL Box */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Created Date */}
              <div className="h-3 bg-gray-200 rounded w-48 animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
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

export default SpacesSkeletonLoader;