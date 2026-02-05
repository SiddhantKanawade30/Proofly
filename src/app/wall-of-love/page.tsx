"use client";

import { Plus } from 'lucide-react';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function wallOfLove(){
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
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
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
                <div className="container mx-auto px-0">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Wall of Love</h1>
                        <Button>
                            <Plus className="w-4 h-4" />
                            Create New
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder for wall of love cards */}
                        <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
                            <p>No walls of love created yet</p>
                        </div>
                    </div>
                </div>
            </Topbar>
        </div>
    )
}