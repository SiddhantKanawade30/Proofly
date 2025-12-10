import { User, Briefcase, Mail, MessageSquare } from "lucide-react";
import { StarRating } from "@/components/ui/starRating";
import { InputStyle } from "./utils";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const TextSubmitButton = ({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex-shrink-0 pt-1">
      <button
        type="submit"
        disabled={submitting}
        onClick={onSubmit}
        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            <span>Submit Feedback</span>
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By submitting, you agree that your feedback may be used for testimonials and marketing purposes.
      </p>
    </div>
  );
};

export const TextTestimonial = ({
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
  onSubmit: () => void;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        {/* Name */}
        <div className="space-y-1.5">
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
        <div className="space-y-1.5">
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
      </div>

      {/* Position */}
      <div className="space-y-1.5 flex-shrink-0 pt-3">
        <label
          htmlFor="position"
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          Your Position *{" "}
          <span>
            {" "}
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

      {/* Message */}
      <div className="flex flex-col pt-3 space-y-1.5">
        <label
          htmlFor="message"
          className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
        >
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Your Feedback / Experience *
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full h-[120px] rounded-md border border-input bg-transparent px-10 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Share your experience, feedback, or testimonial..."
          />
          <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Star Rating */}
      <StarRating
        value={formData.rating}
        onChange={(rating) => setFormData({ ...formData, rating })}
        required
      />

      {/* Submit Button */}
      <TextSubmitButton submitting={submitting} onSubmit={onSubmit} />
    </>
  );
};
