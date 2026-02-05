"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";

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
      <Link
        href="/spaces"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Spaces</span>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 break-all mr-4">{title}</h1>
          <p className="text-text-secondary line-clamp-2 break-all leading-relaxed mr-4 ">{description}</p>
        </div>
        <div className="flex items-center gap-3">

          <div>
            <button
              onClick={onOpenImport}
              className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div>
                Import from
              </div>
              <img src="/X-light.svg" alt="x icon" />

            </button>
          </div>

          <button
            onClick={onOpenEmbed}
            className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Code className="size-4" />
            Embed
          </button>
        </div>
      </div>

      <div className="mt-4 px-3 py-1 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-2">
        <input
          type="text"
          value={shareLink || ""}
          readOnly
          className="flex-1 text-sm bg-transparent border-none outline-none text-text-secondary"
        />
        <button
          onClick={() => onCopy(shareLink)}
          className="p-2 hover:bg-zinc-200 rounded transition-colors"
          title="Copy URL"
        >
          <Copy className="size-4 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}
