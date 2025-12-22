"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { MessageSquare, CheckCircle2, Star, User, Mail, Briefcase, Video, FileText, X } from "lucide-react";
import axios from "axios";
import { StarRating } from "@/components/ui/starRating";
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
  const [testimonialType, setTestimonialType] = useState<"text" | "video">("text");
  
  // Video recording states
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  
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

    // Validate video recording if video type is selected
    if (testimonialType === "video" && !videoRecorded) {
      toast.error("Please record a video before submitting.");
      return;
    }

    // Validate text message if text type is selected
    if (testimonialType === "text" && !formData.message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setSubmitting(true);
    
    try {
      const rating = Number(formData.rating);
      
      if (testimonialType === "video") {
        // Handle video submission
        const blob = new Blob(chunksRef.current.length > 0 ? chunksRef.current : chunks, { type: "video/webm" });
        const file = new File([blob], "user-video.webm");

        setUploading(true);

        // Step 1: Get upload URL
        const { data } = await axios.post(`${BACKEND_URL}/testimonials/create-video-upload`);
        const uploadUrl = data.data.url;

        // Step 2: Upload video to Mux
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": "video/webm" },
          onUploadProgress: (p) =>
            console.log(`Upload progress: ${(p.loaded / (p.total || 1) * 100).toFixed(2)}%`),
        });

        // Step 3: Create testimonial with video metadata
        await axios.post(`${BACKEND_URL}/testimonials/create`, {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          message: formData.message || "Video testimonial",
          rating: rating,
          campaignId: campaign.id,
          videoUrl: uploadUrl,
          tags: tags
        });

        setUploading(false);
      } else {
        // Handle text submission
        await axios.post(`${BACKEND_URL}/testimonials/create`, {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          message: formData.message,
          rating: rating,
          campaignId: campaign.id
        });
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", position: "", message: "", rating: 0 });
      resetVideo();
      toast.success("Testimonial submitted successfully!");
    } catch (error: any) {
      console.log("Error submitting testimonial:", error);
      rateLimitHandlers.public.handleError(error, "Failed to submit testimonial");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Video recording functions
  const startRecording = async () => {
    try {
      // Use existing stream if available, otherwise get new one
      let stream: MediaStream;
      if (videoRef.current?.srcObject) {
        stream = videoRef.current.srcObject as MediaStream;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }

      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      setChunks([]);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          setChunks([...chunksRef.current]);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setVideoRecorded(true);
        
        // Stop live preview stream and switch to recorded video
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };

      setRecorder(mediaRecorder);
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (recorder && recording) {
      recorder.stop();
      setRecording(false);
      // The onstop handler will handle stopping the stream and creating the recorded video preview
    }
  };

  const resetVideo = () => {
    setVideoRecorded(false);
    setVideoUrl(null);
    chunksRef.current = [];
    setChunks([]);
    setRecorder(null);
    setTags([]);
    setCurrentTag("");
    setRecording(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  // Start camera preview when video mode is selected
  useEffect(() => {
    if (testimonialType === "video" && !videoRecorded && !recording && !recorder) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error("Error accessing media devices:", error);
        });
    }

    // Cleanup when switching away from video mode
    return () => {
      if (testimonialType !== "video" && videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };
  }, [testimonialType, videoRecorded, recording, recorder]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
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
          
          {/* Toggle between Text and Video */}
          <div className="px-6 flex-shrink-0">
            <div className="flex items-center justify-center gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setTestimonialType("text");
                  resetVideo();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  testimonialType === "text"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="h-4 w-4" />
                Text Testimonial
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestimonialType("video");
                  setFormData({ ...formData, message: "" });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  testimonialType === "video"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Video className="h-4 w-4" />
                Video Testimonial
              </button>
            </div>
          </div>

          <div className="px-6 flex-1 flex flex-col min-h-0 overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 space-y-3">
              {/* Video Recording Section - Show first when video mode is selected */}
              {testimonialType === "video" && !videoRecorded && (
                <div className="flex-1 flex flex-col pt-3 min-h-0 space-y-3 overflow-hidden">
                  <label className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    Record Your Video Testimonial *
                  </label>
                  
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <div className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef as React.RefObject<HTMLVideoElement>}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      {!recording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 py-2 bg-red-600 text-white hover:bg-red-700"
                        >
                          <Video className="h-4 w-4" />
                          Start Recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 py-2 bg-gray-900 text-white hover:bg-gray-800"
                        >
                          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                          Stop Recording
                        </button>
                      )}
                    </div>
                    
                    {recording && (
                      <p className="text-xs text-muted-foreground text-center">
                        Recording in progress... Click "Stop Recording" when done.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Form Fields - Show for text mode OR after video is recorded */}
              {(testimonialType === "text" || (testimonialType === "video" && videoRecorded)) && (
                <>
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

                  {/* Message - Only show for text testimonial */}
                  {testimonialType === "text" && (
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
                  )}

                  {/* Video Preview and Tags - Show after video is recorded */}
                  {testimonialType === "video" && videoRecorded && (
                    <div className="flex-1 flex flex-col space-y-4 pt-3">
                      {/* Video Preview */}
                      <div className="w-full max-w-md mx-auto aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          src={videoUrl || undefined}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Tags Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Add Tags (Optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter a tag and press Enter"
                            className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Tags Display */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:bg-primary/20 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={resetVideo}
                        className="text-sm text-muted-foreground hover:text-foreground underline"
                      >
                        Record Again
                      </button>
                    </div>
                  )}

                  {/* Star Rating */}
                  <StarRating
                    value={formData.rating}
                    onChange={(rating) => setFormData({ ...formData, rating })}
                    required
                  />
                </>
              )}

              {/* Submit Button - Only show for text mode OR after video is recorded */}
              {(testimonialType === "text" || (testimonialType === "video" && videoRecorded)) && (
                <div className="flex-shrink-0 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || uploading || (testimonialType === "video" && recording)}
                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting || uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>{uploading ? "Uploading video..." : "Submitting..."}</span>
                      </>
                    ) : (
                      <>
                        {testimonialType === "video" ? (
                          <>
                            <Video className="h-4 w-4" />
                            <span>Submit Video Testimonial</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4" />
                            <span>Submit Feedback</span>
                          </>
                        )}
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    By submitting, you agree that your feedback may be used for testimonials and marketing purposes.
                  </p>
                </div>
              )}
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