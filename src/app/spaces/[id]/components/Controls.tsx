"use client";

import React from "react";

export default function Controls({
  count,
}: {
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-text-secondary">{count ?? 0} testimonials in this space</h2>
        <p className="text-sm text-red-600 mt-2 italic text-red-400">Tip: Archive testimonials you don't want to embed</p>
      </div>
    </div>
  );
}
