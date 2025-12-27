"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/ui/topbar";
import Sidebar from "@/components/Sidebar";
import { Mail, User, Calendar, Zap, Copy, LogOut, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading } = useUser();
  const user = data?.user;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Remove token from localStorage
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      // Redirect to signin page
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast or notification logic here if needed
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans">
        <Sidebar user={user} />
        <Topbar>
          <div className="flex items-center justify-center h-96">
            <p className="text-zinc-500">Loading...</p>
          </div>
        </Topbar>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans">
        <Sidebar user={undefined} />
        <Topbar>
          <div className="flex items-center justify-center h-96">
            <p className="text-zinc-500">Failed to load profile</p>
          </div>
        </Topbar>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar user={user} />
      <Topbar>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">Profile Settings</h1>
            <p className="text-zinc-500 mt-2">Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8 mb-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-200">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">{user.name}</h2>
                <p className="text-zinc-500">{user.email}</p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Mail className="size-4" />
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-zinc-600 bg-zinc-50 px-4 py-2 rounded border border-zinc-200 flex-1">
                    {user.email}
                  </p>
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className="p-2 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors"
                    title="Copy email"
                  >
                    <Copy className="size-4 text-zinc-600" />
                  </button>
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <User className="size-4" />
                  User ID
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-zinc-600 bg-zinc-50 px-4 py-2 rounded border border-zinc-200 flex-1 truncate">
                    {user.id}
                  </p>
                  <button
                    onClick={() => copyToClipboard(user.id)}
                    className="p-2 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors"
                    title="Copy ID"
                  >
                    <Copy className="size-4 text-zinc-600" />
                  </button>
                </div>
              </div>

              {/* Plan */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Zap className="size-4" />
                  Current Plan
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded border font-medium ${
                    user.plan === "PREMIUM"
                      ? "bg-violet-50 border-violet-200 text-violet-700"
                      : "bg-zinc-50 border-zinc-200 text-zinc-700"
                  }`}>
                    {user.plan}
                  </span>
                </div>
              </div>

              {/* Video Count */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Zap className="size-4" />
                  Videos Used
                </label>
                <p className="text-zinc-600 bg-zinc-50 px-4 py-2 rounded border border-zinc-200">
                  {user.videoCount} video(s)
                </p>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Calendar className="size-4" />
                  Member Since
                </label>
                <p className="text-zinc-600 bg-zinc-50 px-4 py-2 rounded border border-zinc-200">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              {/* Plan Expires */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Calendar className="size-4" />
                  Plan Expires
                </label>
                <p className="text-zinc-600 bg-zinc-50 px-4 py-2 rounded border border-zinc-200">
                  {user.planExpiresAt ? formatDate(user.planExpiresAt) : "No expiration"}
                </p>
              </div>
            </div>

            {/* Copy Confirmation */}
            {/* Removed copy feedback as it's not needed */}
          </div>

          {/* Upgrade CTA */}
          {user.plan === "FREE" && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-violet-900 mb-2">Upgrade to Premium</h3>
              <p className="text-violet-700 mb-4">
                Get unlimited videos, advanced features, and priority support
              </p>
              <a href="/plans" className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                View Plans
              </a>
            </div>
          )}

          {/* Logout Button */}
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </Topbar>
    </div>
  );
}
