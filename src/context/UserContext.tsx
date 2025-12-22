"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";

export interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  videoCount: number;
  createdAt: string;
  planExpiresAt: string | null;
  campaigns: any[];
}

export interface AppData {
  user: UserData;
  totalCampaigns: number;
  totalTestimonials: number;
  remainingSpace: number;
  sortTestimonial: any[];
}

interface UserContextType {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const backenUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${backenUrl}/user/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setData(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      rateLimitHandlers.protected.handleError(err, "Failed to fetch user data");
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider value={{ data, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
