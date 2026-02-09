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
        <div className="grid gap-6 md:grid-cols-3 mb-12 mt-4">
          <div className="rounded-md bg-white px-6 space-y-2 py-3 border border-gray-300">
            <h3 className="text-base flex items-center gap-1 mb-2 font-medium text-text-secondary">
              <MessageCircleMore className="size-4" /> Total Testimonials
            </h3>
            <p className="text-2xl font-bold text-zinc-900">
              {data?.totalTestimonials}
            </p>
            <div className="text-md">
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
                <span className="cursor-pointer">
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

        {/* Chart - Full Width Below */}
        <div className="h-100 overflow-hidden">
          <DottedLineChart testimonials={data?.sortTestimonial || []} />
        </div>
      </Topbar>
    </div>
  );
}
