"use client";

import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { VideoSpace }  from "./components/videoTestimonial";
import { Footer, HeaderSection, Loader, NotCampaign, SubmitedForm, ToggleButton } from "./components/utils";
import { TextTestimonial } from "./components/textTestimonial";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Campaign {
  id: string;
  title: string;
  website: string;
  description: string;
  createdAt: string;
}

export default function PublicTestimonialPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testimonialType, setTestimonialType] = useState<'text' | 'video'>('text');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    message: "",
    rating: 0
  });

  useEffect(() => {
    fetchCampaign(resolvedParams.slug);
    console.log(resolvedParams.slug);
  }, [resolvedParams.slug]);

  const fetchCampaign = async (campaignId: any) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/campaigns/get/${campaignId}`);
      setCampaign(res.data as Campaign);
    } catch (error: any) {
      console.log("Error fetching campaign:", error);
      rateLimitHandlers.public.handleError(error, "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaign) return;

    // Validate rating
    if (!formData.rating || formData.rating === 0) {
      toast.error("Please select a rating (1-5 stars) before submitting.");
      return;
    }

    // Clear previous errors
    setErrorMessage(null);
    setSubmitting(true);
    
    try {
      // Ensure rating is a number
      const rating = Number(formData.rating);
      
      console.log("Submitting testimonial with rating:", rating);
      
      // Use different endpoints based on testimonial type
      const endpoint = testimonialType === 'text' 
        ? `${BACKEND_URL}/testimonials/create`
        : `${BACKEND_URL}/testimonials/create-video-upload`;
      
      await axios.post(endpoint, {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        testimonialType: testimonialType,
        message: formData.message,
        rating: rating,
        campaignId: campaign.id
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", position: "",  message: "", rating: 0 });
      toast.success("Testimonial submitted successfully!");

    } catch (error: any) {
      console.log("Error submitting testimonial:", error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error || "";

      // If backend returns 403 for quota limits, show a friendly quota message
      if (status === 403 && /only allows|Free plan|Fair usage|exceeded/i.test(serverMessage)) {
        setErrorMessage(
          "Quota reached: Sorry, this campaign has reached its testimonial limit on the current plan. Your testimonial was not submitted."
        );
      } else {
        // Use rate limit handler for other errors
        rateLimitHandlers.public.handleError(error, "Failed to submit testimonial");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  if (loading) {
    return (
      <Loader />
    );
  }

  if (!campaign) {
    return (
      <NotCampaign />
    );
  }

  if (submitted) {
    return (
      <SubmitedForm setSubmitted={setSubmitted} campaign={campaign}/>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-neutral-100 flex items-center justify-center p-4 py-8">
      <div className="max-w-4xl w-full flex flex-col gap-4">
        {/* Header Section */}
        <HeaderSection campaign={campaign} />

        {/* Testimonial Form Card */}
        <div className="bg-card bg-white text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          
          {/* Toggle Button */}
          <ToggleButton testimonialType={testimonialType} setTestimonialType={setTestimonialType} />

          <div className="px-6">
            {errorMessage && (
              <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-4 text-amber-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm leading-relaxed">{errorMessage}</div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="flex-shrink-0 text-amber-700 hover:text-amber-900 font-semibold text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              {testimonialType === 'text' ? (
                // TEXT TESTIMONIAL LAYOUT
                <TextTestimonial 
                  formData={formData} 
                  setFormData={setFormData} 
                  handleChange={handleChange}
                  submitting={submitting}
                  onSubmit={() => {}}
                />
              ) : (
                // VIDEO TESTIMONIAL LAYOUT
                <VideoSpace 
                campaign={campaign}
                  testimonialType={testimonialType}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  submitting={submitting}
                  onSubmit={() => {}}
                />
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
            <Footer />
      </div>
    </div>
  );
}