"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
const categories = [
  {
    value: "project",
    label: "Project",
  },
  {
    value: "product",
    label: "Product",
  },
  {
    value: "service",
    label: "Service",
  },
  {
    value: "campaign",
    label: "Campaign",
  },
  {
    value: "other",
    label: "Other",
  },
];

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSpaceCreated?: (space: any) => void;
}

export function CreateSpaceDialog({ open, onOpenChange, onSpaceCreated }: CreateSpaceDialogProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);
  
  // Refs must be declared at component level, not inside functions
  const spaceNameRef = useRef<HTMLInputElement>(null);
  const spaceDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const spaceWebsiteUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categoryOpen && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [categoryOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to create a space");
      return;
    }

    const formData = {
      title: spaceNameRef.current?.value || "",
      description: spaceDescriptionRef.current?.value || "",
      websiteUrl: spaceWebsiteUrlRef.current?.value || "",
      category: selectedCategory,
    };

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        // Backend returns { result }, so we extract the result
        const createdSpace = res.data?.result || res.data?.newCampaign || res.data;
        
        console.log("Full response data:", res.data);
        console.log("Extracted created space:", createdSpace);
        
        // Call the callback with the created space if provided
        if (onSpaceCreated && createdSpace) {
          console.log("Calling onSpaceCreated with:", createdSpace);
          onSpaceCreated(createdSpace);
        } else {
          console.warn("No space data in response or callback not provided:", {
            hasCallback: !!onSpaceCreated,
            responseData: res.data
          });
        }
        
        toast.success("Space created successfully");
        handleCancel();
      } else {
        toast.error("Failed to create space");
      }
    } catch (error: any) {
      console.error("Create space error:", error);
      rateLimitHandlers.protected.handleError(error, "Failed to create space");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (spaceNameRef.current) spaceNameRef.current.value = "";
    if (spaceDescriptionRef.current) spaceDescriptionRef.current.value = "";
    if (spaceWebsiteUrlRef.current) spaceWebsiteUrlRef.current.value = "";
    setSelectedCategory("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Set up a new space to collect and manage testimonials.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-900">
              Name of the Space <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              ref={spaceNameRef}
              placeholder="e.g., Project Alpha, Marketing Team"
              className="w-full h-9 px-3 rounded-md border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-900">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              ref={spaceDescriptionRef}
              placeholder="Brief description of what this space is for"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="websiteUrl" className="text-sm font-medium text-zinc-900">
              Website URL <span className="text-zinc-400 text-xs">(Optional)</span>
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="text"
              ref={spaceWebsiteUrlRef}
              placeholder="https://example.com"
              className="w-full h-9 px-3 rounded-md border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-zinc-900">
              Category
            </label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  ref={triggerRef}
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="w-full justify-between h-9"
                >
                  {selectedCategory
                    ? categories.find((category) => category.value === selectedCategory)?.label
                    : "Select a category (optional)"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="p-0" 
                align="start"
                style={popoverWidth ? { width: `${popoverWidth}px` } : undefined}
              >
                <Command>
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          value={category.value}
                          onSelect={(currentValue) => {
                            setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
                            setCategoryOpen(false);
                          }}
                        >
                          {category.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCategory === category.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="sm:mr-2"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Space"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


