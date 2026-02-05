"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmbedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
}

export function EmbedModal({ open, onOpenChange, campaignId }: EmbedModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const embedUrl = `${backendUrl}/testimonials/embed/${campaignId}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" title="Testimonials"></iframe>`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Embed Testimonials
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Copy the iframe code below to embed testimonials on your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">

          {/* Iframe Code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Iframe Code</label>
            <div className="relative">
              <textarea
                value={iframeCode}
                readOnly
                rows={5}
                className="w-full px-3 py-2.5 text-sm font-mono bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-gray-700 pr-24"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyCode}
                className="absolute top-2.5 right-2.5 flex items-center gap-2"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can adjust the width and height attributes to fit your layout
            </p>
          </div>

          {/* Preview Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Live Preview</label>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <iframe
                src={embedUrl}
                width="100%"
                height="500"
                frameBorder="0"
                title="Testimonials Preview"
                className="w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              How to use:
            </h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside ml-2">
              <li>Copy the iframe code from above</li>
              <li>Paste it into your website&apos;s HTML where you want testimonials to appear</li>
              <li>Customize the width and height attributes to match your design</li>
              <li>The testimonials will be displayed automatically and update in real-time</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

