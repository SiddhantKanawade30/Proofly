import { Video, User, Mail, Briefcase } from "lucide-react";
import { StarRating } from "@/components/ui/starRating";
import { InputStyle } from "./utils";
import { VideoLogic } from "./video";
import { useState } from "react";
import axios from "axios";
import { VideoSubmitButton } from "./videoSubmit";


export const VideoSpace = ({
  campaign,
  testimonialType,
  formData,
  setFormData,
  handleChange,
  submitting,
  onSubmit,
}: {
  campaign: any;
  testimonialType: string;
  formData: any;
  setFormData: any;
  handleChange: any;
  submitting: boolean;
  onSubmit: (uploadId: string, playbackId: string) => void;
}) => {
  const [blob, setBlob] = useState<Blob | null>(null);

  return (
    <div>
      <div className="space-y-1.5 shrink-0">
        <label className="flex items-center gap-1.5 text-sm font-medium">
          <Video className="h-4 w-4 text-muted-foreground" />
          Record Video Testimonial *
        </label>
        <div className="w-full h-[550px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <VideoLogic blob={blob} setBlob={setBlob} />
        </div>
      </div>

      <div className="py-5">
        <div className="space-y-1.5 shrink-0 py-3">
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

        <div className="space-y-1.5 shrink-0 py-3">
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

        <div className="space-y-1.5 shrink-0 py-3">
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

        <StarRating
          value={formData.rating}
          onChange={(rating) => setFormData({ ...formData, rating })}
          required
        />
      </div>

      <VideoSubmitButton
        campaign={campaign}
        testimonialType={testimonialType}
        formData={formData}
        submitting={submitting}
        onSubmit={onSubmit}
        blob={blob}
      />
    </div>
  );
};
