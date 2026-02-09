import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300 relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
            
            <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Chart and Testimonials Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6 mb-8">
        {/* Graph Skeleton - Left Side */}
        <div className="rounded-lg bg-white border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
          
          {/* Header */}
          <div className="mb-4">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Chart Area */}
          <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse"></div>
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

export default DashboardSkeleton;

