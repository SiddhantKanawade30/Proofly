import { Video, User, Mail, Briefcase } from "lucide-react";
import { StarRating } from "@/components/ui/starRating";
import { InputStyle } from "./utils";
import { VideoLogic } from "./video";
import { useState } from "react";
import axios from "axios";

export const VideoSubmitButton = ({
  submitting,
  onSubmit,
  blob,
}: {
  submitting: boolean;
  onSubmit: (uploadId: string, playbackId: string) => void;
  blob: Blob | null;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!blob) {
      alert("Please record a video before submitting.");
      return;
    }

    try {
      setUploading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Get upload URL from backend
      const { data } = await axios.get(
        `${BACKEND_URL}/testimonials/create-video-upload`
      );

      const uploadUrl = data.url;
      const uploadId = data.id;

      // Upload video to Mux
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/webm" },
        body: blob,
      });

      // Get playback ID (might need to poll for asset creation)
      const assetId = data.asset_id || uploadId;

      // Call the original onSubmit with video info
      onSubmit(uploadId, assetId);

      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload error:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const isDisabled = submitting || uploading || !blob;

  return (
    <div className="flex-shrink-0 pt-1">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {uploading || submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>{uploading ? "Uploading..." : "Submitting..."}</span>
          </>
        ) : (
          <>
            <Video className="h-4 w-4" />
            <span>Submit Video</span>
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By submitting, you agree that your feedback may be used for testimonials
        and marketing purposes.
      </p>
    </div>
  );
};

export const VideoSpace = ({
  formData,
  setFormData,
  handleChange,
  submitting,
  onSubmit,
}: {
  formData: any;
  setFormData: any;
  handleChange: any;
  submitting: boolean;
  onSubmit: (uploadId: string, playbackId: string) => void;
}) => {
  const [blob, setBlob] = useState<Blob | null>(null);

  return (
    <div>
      {/* Large Video Recording Area */}
      <div className="space-y-1.5 flex-shrink-0">
        <label className="flex items-center gap-1.5 text-sm font-medium">
          <Video className="h-4 w-4 text-muted-foreground" />
          Record Video Testimonial *
        </label>
        <div className="w-full h-[550px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <VideoLogic blob={blob} setBlob={setBlob} />
        </div>
      </div>

      <div className="py-5">
        {/* Name */}
        <div className="space-y-1.5 flex-shrink-0 py-3">
          <label
            htmlFor="name"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Your Name *
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={InputStyle}
              placeholder="Full name"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5 flex-shrink-0 py-3">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Address *
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={InputStyle}
              placeholder="your@email.com"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Position */}
        <div className="space-y-1.5 flex-shrink-0 py-3">
          <label
            htmlFor="position"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            Your Position *{" "}
            <span>
              <p className="text-xs text-muted-foreground">
                ( Enter your job title and company )
              </p>
            </span>
          </label>
          <div className="relative">
            <input
              id="position"
              name="position"
              type="text"
              required
              value={formData.position}
              onChange={handleChange}
              className={InputStyle}
              placeholder="e.g., CEO at Apple"
            />
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Star Rating */}
        <StarRating
          value={formData.rating}
          onChange={(rating) => setFormData({ ...formData, rating })}
          required
        />
      </div>

      {/* Submit Button */}
      <VideoSubmitButton
        submitting={submitting}
        onSubmit={onSubmit}
        blob={blob}
      />
    </div>
  );
};
