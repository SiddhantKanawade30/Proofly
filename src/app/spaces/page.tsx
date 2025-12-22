"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/ui/topbar";
import { Plus } from "lucide-react";
import { CreateSpaceDialog } from "@/components/ui/create-space-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import SpacesSkeletonLoader from "@/components/loaders/loader";
import { Toaster, toast } from "sonner";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import { DeleteSpaceDialog } from "@/components/spaces/DeleteSpaceDialog";
import { useUser } from "@/context/UserContext";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";



interface Space {
  id: string;
  title: string;
  description: string;
  shareLink: string;
  createdAt: string;
  _count?: {
    testimonials: number;
  };
}

export default function SpacesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<{ id: string; title: string } | null>(null);
  const router = useRouter();
  const { data, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !data?.user) {
      router.push('/signin');
    }
  }, [authLoading, data?.user, router]);

  const handleDeleteClick = (space: Space, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSpaceToDelete({ id: space.id, title: space.title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;

    const token = localStorage.getItem("token");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!token || !backendUrl) {
      toast.error("Authentication error. Please try again.");
      return;
    }

    try {
      const res = await axios.delete(`${backendUrl}/campaigns/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          campaignId: spaceToDelete.id,
        },
      });

      if (res.status === 200) {
        toast.success("Space deleted successfully");
        setDeleteDialogOpen(false);
        setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== spaceToDelete.id));
        setSpaceToDelete(null);
      }
    } catch (error: any) {
      rateLimitHandlers.protected.handleError(error, "Failed to delete space");
    }
  };

  const handleSpaceCreated = (newSpace: any) => {
 
    if (!newSpace || !newSpace.id) {
      return;
    }

    // Ensure the new space has the correct structure
    const spaceToAdd: Space = {
      id: newSpace.id,
      title: newSpace.title,
      description: newSpace.description,
      shareLink: newSpace.shareLink,
      createdAt: newSpace.createdAt,
      _count: newSpace._count || { testimonials: 0 }
    };
    
    console.log("Adding space to list:", spaceToAdd);
    
    // Add the new space to the beginning of the array
    setSpaces((prevSpaces) => {
      // Check if space already exists to avoid duplicates
      const exists = prevSpaces.some(space => space.id === spaceToAdd.id);
      if (exists) {
        console.warn("Space already exists in list, skipping add");
        return prevSpaces;
      }
      return [spaceToAdd, ...prevSpaces];
    });
  };

  useEffect(()=>{
    const fetchSpaces = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        router.push("/signin");
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.log("No backend URL found");
        router.push("/signin");
      }

      try {
        const res = await axios.get(`${backendUrl}/campaigns/get`, {
          headers : {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          }
        });
        setSpaces(res.data);
        console.log(res.data);
      } catch (error: any) {
        console.log(error);
        rateLimitHandlers.protected.handleError(error, "Failed to load spaces");
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Toaster position="bottom-right" />
      <Sidebar />
      <Topbar>
        {loading ? (
          <SpacesSkeletonLoader />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">All Spaces</h1>
                <p className="text-text-secondary mt-1">{spaces?.length} spaces created</p>
              </div>
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Plus className="size-4" />
                Create New Space
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {spaces?.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>

            {spaces?.length === 0 && (
              <div className="rounded-lg bg-white p-12 shadow-sm border border-zinc-200 text-center">
                <p className="text-text-secondary mb-4">No spaces created yet</p>
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-zinc-800 transition-colors mx-auto"
                >
                  <Plus className="size-4" />
                  Create Your First Space
                </button>
              </div>
            )}
          </>
        )}

        {/* Create Space Dialog */}
        <CreateSpaceDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onSpaceCreated={handleSpaceCreated}
        /> 

        {/* Delete Confirmation Dialog */}
        <DeleteSpaceDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) {
              setSpaceToDelete(null);
            }
          }}
          spaceTitle={spaceToDelete?.title}
          onConfirm={handleDeleteConfirm}
        />
      </Topbar>
    </div>
  );
}

