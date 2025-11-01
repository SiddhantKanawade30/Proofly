"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Star, Archive } from "lucide-react";
import { ValueLineBarChart } from "@/components/ui/value-line-bar-chart";
import { MessageCircleMore, Airplay, Box } from 'lucide-react';

// Mock data - replace with actual API calls
const mockTestimonials = [
  { id: "1", author: "John Smith", text: "This product changed my life! Absolutely amazing experience from start to finish.", date: "2024-01-15", rating: 5 },
  { id: "2", author: "Sarah Johnson", text: "Amazing service, highly recommend! The team was so helpful throughout the process.", date: "2024-01-20", rating: 5 },
  { id: "3", author: "Mike Davis", text: "Great experience overall.", date: "2024-02-01", rating: 4 },
  { id: "4", author: "Emily Chen", text: "Exceeded my expectations! The quality and attention to detail is outstanding.", date: "2024-02-10", rating: 5 },
  { id: "5", author: "David Wilson", text: "Outstanding service and incredible results. Couldn't be happier with the outcome!", date: "2024-02-15", rating: 5 },
  { id: "6", author: "Lisa Anderson", text: "Simply the best! Professional, reliable, and exceeded all expectations.", date: "2024-02-20", rating: 5 },
  { id: "7", author: "Robert Taylor", text: "Fantastic experience! Everything was handled with such care and professionalism.", date: "2024-03-01", rating: 5 },
  { id: "8", author: "Jennifer Brown", text: "Perfect from start to finish. I'm extremely satisfied and would recommend to anyone.", date: "2024-03-05", rating: 5 },
];

// Get best testimonials (5-star only, limit to 6)
const bestTestimonials = mockTestimonials
  .filter(testimonial => testimonial.rating === 5)
  .slice(0, 6);

const mockStats = {
  totalTestimonials: 24100,
  totalSpaces: 3,
  spacesCreated: 2,
  maxSpaces: 4,
  spacesRemaining: 2, // maxSpaces - spacesCreated
};

// Chart data showing testimonials gathered over months
const testimonialsChartData = [
  { month: "Jan", desktop: 12 },
  { month: "Feb", desktop: 18 },
  { month: "Mar", desktop: 15 },
  { month: "Apr", desktop: 22 },
  { month: "May", desktop: 19 },
  { month: "Jun", desktop: 24 },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <Topbar>
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300  ">
            
            
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary ">
               <MessageCircleMore className="size-4" /> Total Testimonials 
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {mockStats.totalTestimonials}
            </p>
              <div className=" text-md"> <span className="text-green-600 font-semibold">+2</span> testimonials added today</div>
            
          </div>
          
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300">
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary">
              <Airplay className="size-4" /> Total Spaces
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {mockStats.totalSpaces}
            </p>
            <div className="text-md">
              {mockStats.spacesCreated} out of {mockStats.maxSpaces} spaces created
            </div>
          </div>
          
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300">
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary">
              <Box className="size-4" /> Space Remaining
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {mockStats.spacesRemaining}
            </p>
            <div className="text-md">
              <span className=" font-semibold cursor-pointer ">Upgrade to <span className="text-violet-500 hover:underline">Premium</span> </span>  
            </div>
          </div>
        </div>

        {/* Chart and Testimonials Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6 mb-8">
          {/* Graph - Left Side */}
          <div>
            <ValueLineBarChart />
          </div>

          {/* Best Testimonials List - Right Side */}
          <div className="rounded-lg bg-white shadow-sm border border-zinc-200">
            <div className="p-4 border-b border-zinc-200">
              <h2 className="text-base font-semibold text-zinc-900">Best Testimonials</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Your top 5-star testimonials
              </p>
            </div>
            
            <div className="divide-y divide-zinc-200 max-h-[400px] overflow-y-auto">
              {bestTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-medium text-zinc-900">{testimonial.author}</h3>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 mb-1 leading-relaxed">{testimonial.text}</p>
                      <p className="text-xs text-zinc-400">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </Topbar>
    </div>
  );
}
