"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Settings, Mail, Bell, Moon, Sun, Lock, BadgeCheck, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const { data, loading } = useUser();

  useEffect(() => {
    if (!loading && !data?.user) {
      router.push('/signin');
    }
  }, [loading, data?.user, router]);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
  };

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? "enabled" : "disabled"}`);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? "enabled" : "disabled"}`);
  };

  const handleChangePassword = () => {
    toast.info("Change password functionality coming soon");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    // Add logout logic here
  };


  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          </div>
          <p className="text-text-secondary">Manage your account settings and preferences</p>
        </div>

        <div className="w-full">
          <div className="rounded-lg bg-white border border-zinc-200 px-6 py-4 shadow-sm">

            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  {theme === "dark" ? (
                    <Moon className="size-4 text-purple-600" />
                  ) : (
                    <Sun className="size-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary">Theme</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-blue-600" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Mail className="size-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary">Email Notifications</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Receive email notifications</p>
                </div>
              </div>
              <button
                onClick={handleEmailNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? "bg-blue-600" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Bell className="size-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary">Notifications</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Enable browser notifications</p>
                </div>
              </div>
              <button
                onClick={handleNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? "bg-blue-600" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Change Password Badge */}
            <div className="flex items-center justify-between py-4  border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <Lock className="size-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary">Change Password</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Update your account password</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
                onClick={handleChangePassword}
              >
                <BadgeCheck />
                Change Password
              </Badge>
            </div>

          </div>

          {/* Logout Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </Topbar>
    </div>
  );
}

