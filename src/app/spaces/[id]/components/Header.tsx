"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Code, BrickWall } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { Import } from 'lucide-react';

export default function Header({
  title,
  description,
  shareLink,
  onCopy,
  onOpenEmbed,
  onOpenImport
}: {
  title?: string;
  description?: string;
  shareLink?: string;
  onCopy: (url?: string) => void;
  onOpenEmbed: () => void;
  onOpenImport: () => void;
}) {
  return (
    <div className="mb-6">
      {/* <Link
        href="/spaces"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="size-4" />
      </Link> */}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 break-all mr-4">{title}</h1>
          <p className="text-text-secondary line-clamp-2 break-all leading-relaxed mr-4 text-sm sm:text-base">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">

          <button
            onClick={onOpenImport}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm"
          >
            <Import size={16}/>  
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onOpenEmbed}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm"
          >
            <Code className="size-4" />
            <span className="hidden sm:inline">Embed</span>
          </button>

          <Link href={`/spaces/${shareLink?.split('/').pop()}/embed`} target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm"
            >
              <BrickWall size={16} /> 
              <span className="hidden sm:inline">Wall of Love</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-4 px-3 py-2 sm:py-1 bg-white rounded-lg border border-neutral-400 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
        <span className="text-xs sm:text-sm text-text-secondary font-medium">Request Testimonials by sharing form link:</span>
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={shareLink || ""}
            readOnly
            className="flex-1 text-xs sm:text-sm bg-transparent border-none outline-none text-text-secondary min-w-0"
          />
          <button
            onClick={() => onCopy(shareLink)}
            className="p-1.5 sm:p-2 hover:bg-zinc-200 rounded transition-colors flex-shrink-0"
            title="Copy URL"
          >
            <Copy className="size-3 sm:size-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
