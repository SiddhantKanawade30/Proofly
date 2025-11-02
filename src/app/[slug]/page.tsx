"use client";

import React, { useState, useEffect, use } from "react";
import { MessageSquare, CheckCircle2, Star, User, Mail, Briefcase } from "lucide-react";
import axios from "axios";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    message: ""
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

    setSubmitting(true);
    
    try {
      await axios.post(`${BACKEND_URL}/testimonials/create`, {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        message: formData.message,
        campaignId: campaign.id
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", position: "", message: "" });
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
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-xl border shadow-sm p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Campaign Not Found</h1>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-xl border shadow-sm flex flex-col gap-6 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <CheckCircle2 className="h-10 w-10 text-gray-900" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Your feedback has been submitted successfully. We appreciate your input for {campaign.title}.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background bg-neutral-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl w-full h-full flex flex-col justify-center gap-4">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            
          </div>
          
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded px-3 py-1">
                <Star className="h-3 w-3 text-gray-900 fill-gray-900" />
                <span className="text-xs font-medium text-gray-900">This is a feedback form for: {campaign.title}</span>
              </div>
              {campaign.website && (
                <a 
                  href={campaign.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Visit website to checkout the product →
                </a>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {campaign.description || "We value your feedback. Please share your experience."}
          </p>
        </div>

        {/* Testimonial Form Card */}
        <div className="bg-card bg-white text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex-1 min-h-0">
          <div className="px-5 border-b pb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold leading-none mb-2">Your Feedback</h2>
            <p className="text-muted-foreground text-sm">
              All fields are required to submit your feedback.
            </p>
          </div>

          <div className="px-6 flex-1 flex flex-col min-h-0 overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 space-y-3">
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
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
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Full name"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
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
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="your@email.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="space-y-1.5 flex-shrink-0 pt-3">
                <label htmlFor="position" className="flex items-center gap-1.5 text-sm font-medium">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Your Position * <span> <p className="text-xs text-muted-foreground">( Enter your job title and company )</p></span>
                </label>
                <div className="relative">
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    placeholder="e.g., CEO at Apple"
                  />
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
               
              </div>

              {/* Message */}
              <div className="flex-1 flex flex-col pt-3 min-h-0 space-y-1.5 overflow-hidden">
                <label htmlFor="message" className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Your Feedback / Experience *
                </label>
                <div className="relative flex-1 min-h-0">
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full h-full max-h-[100px] rounded-md border border-input bg-transparent px-10 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Share your experience, feedback, or testimonial..."
                  />
                  <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex-shrink-0 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
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
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-foreground">Testimonials</span>
          </p>
        </div>
      </div>
    </div>
  );
}