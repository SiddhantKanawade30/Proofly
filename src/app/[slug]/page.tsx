"use client";

import React, { useState, useEffect, use } from "react";
import { MessageSquare, CheckCircle2, Star, User, Mail, Briefcase, Video } from "lucide-react";
import axios from "axios";
import { StarRating } from "@/components/ui/starRating";
import { VideoSpace }  from "./components/videoTestimonial";
import { Footer, HeaderSection, Loader, NotCampaign, SubmitedForm, ToggleButton } from "./components/utils";
import { TextTestimonial } from "./components/textTestimonial";
import { VideoSubmitButton } from "./components/videoTestimonial";

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
    try{
      const res = await axios.get(`${BACKEND_URL}/campaigns/get/${campaignId}`);
      
        setCampaign(res.data as Campaign);
      
    }
    catch(error){
      console.log("Error fetching campaign:", error);
    }
    finally{
      setLoading(false);
    }
   
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaign) return;

    // Validate rating
    if (!formData.rating || formData.rating === 0) {
      alert("Please select a rating (1-5 stars) before submitting.");
      return;
    }

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
        message: formData.message,
        rating: rating,
        campaignId: campaign.id
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", position: "", message: "", rating: 0 });

    } catch (error) {
      console.log("Error submitting testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
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