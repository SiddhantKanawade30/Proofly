"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Star, Archive } from "lucide-react";
import { MessageCircleMore, Airplay, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { DottedLineChart } from "@/components/ui/dotted-line";
import DashboardSkeleton from "@/components/loaders/DashboardSkeleton";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, loading } = useUser();

  useEffect(() => {
    if (!loading && !data?.user) {
      router.push("/signin");
    }
  }, [loading, data?.user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans">
        <Sidebar user={data?.user} />
        <Topbar campaigns={data?.user?.campaigns || []}>
          <DashboardSkeleton />
        </Topbar>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar user={data?.user} />
      <Topbar campaigns={data?.user?.campaigns || []}>
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300  ">
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary ">
              <MessageCircleMore className="size-4" /> Total Testimonials
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {data?.totalTestimonials}
            </p>
            <div className=" text-md">
              {" "}
              <span className="text-green-600 font-semibold">
                {data?.totalTestimonials}
              </span>{" "}
              testimonials added in total
            </div>
          </div>
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300">
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary">
              <Airplay className="size-4" /> Total Spaces
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {data?.totalCampaigns}
            </p>
            <div className="text-md">
              {data?.totalCampaigns} out of 5 spaces created
            </div>
          </div>

          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300">
  <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary">
    <Box className="size-4" /> Space Remaining
  </h3>
  <p className="text-xl font-bold text-zinc-900">
    {data?.user?.plan === "PREMIUM" ? "Unlimited" : data?.remainingSpace}
  </p>
  <div className="text-md">
    {data?.user?.plan === "PREMIUM" ? (
      <span className="cursor-pointer ">
        You're on<span className="py-0.5 rounded-sm px-2 text-violet-600 hover:underline">Premium</span>plan
      </span>
    ) : (
      <span className="cursor-pointer">
        Upgrade to <Link href="/plans"><span className="text-violet-500 hover:underline">Premium</span></Link>
      </span>
    )}
  </div>
</div>
        
        </div>

        {/* Chart and Testimonials Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6 mb-8">
          {/* Graph - Left Side */}
          <div>
            <DottedLineChart testimonials={data?.sortTestimonial || []} />
          </div>

          {/* Best Testimonials List - Right Side */}
          <div className="rounded-lg bg-white shadow-sm border border-zinc-200">
            <div className="p-4 border-b border-zinc-200">
              <h2 className="text-base font-semibold text-zinc-900">
                Best Testimonials
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Your top 5-star testimonials
              </p>
            </div>

            <div className="divide-y divide-zinc-200 max-h-[400px] overflow-y-auto">
              {data?.sortTestimonial.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm py-2 text-zinc-600 mb-1 leading-relaxed">
                        {testimonial.content}
                      </p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-medium text-zinc-900">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="size-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400">
                        {testimonial.createdAt.split("T")[0]}
                      </p>
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
