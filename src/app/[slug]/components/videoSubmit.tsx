import { useState } from "react";
import axios from "axios";
import { Video } from "lucide-react";

export const VideoSubmitButton = ({
  campaign,
  testimonialType,
  formData,
  submitting,
  onSubmit,
  blob,
}: {
  campaign: any;
  testimonialType: string;
  formData: any;
  submitting: boolean;
  onSubmit: (uploadId: string, playbackId: string) => void;
  blob: Blob | null;
}) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Function to poll for asset creation
  const pollForAsset = async (uploadId: string, maxAttempts = 30): Promise<string> => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/testimonials/get-asset-from-upload/${uploadId}`
        );

        if (data.playbackId && data.status === 'ready') {
          return data.playbackId;
        }

        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        if (error.response?.status === 202) {
          // Still processing, continue polling
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }

    throw new Error("Video processing timeout. Please try again later.");
  };

  const handleSubmit = async () => {
    if (!blob) {
      alert("Please record a video before submitting.");
      return;
    }

    try {
      setUploading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Step 1: Get upload URL from backend
      const { data } = await axios.post(
        `${BACKEND_URL}/testimonials/create-video-upload`,{
          campaignId: campaign.id
        }
      );

      const uploadUrl = data.url;
      const uploadId = data.id;

      // Step 2: Upload video to Mux
      await axios.put(uploadUrl, blob, {
        headers: {
          "Content-Type": "video/webm",
        },
      });

      setUploading(false);
      setProcessing(true);

      // Step 3: Poll for asset creation and get playback ID
      const playbackId = await pollForAsset(uploadId);

      // Step 4: Create testimonial with correct playback ID
      await axios.post(`${BACKEND_URL}/testimonials/create`, {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        testimonialType: testimonialType,
        playbackId: playbackId,
        rating: formData.rating,
        campaignId: campaign.id,
      });

      onSubmit(uploadId, playbackId);
      
    } catch (error) {
      console.error("Video upload error:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const isDisabled = submitting || uploading || processing || !blob;

  return (
    <div className="flex-shrink-0 pt-1">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {uploading || processing || submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>
              {uploading ? "Uploading..." : processing ? "Processing..." : "Submitting..."}
            </span>
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