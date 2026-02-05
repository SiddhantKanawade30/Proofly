import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const ImportModal = ({ open, onOpenChange, campaignId } : { open: boolean; onOpenChange: (open: boolean) => void; campaignId: string }) => {
  const [url, setUrl] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleImport = async () => {
  if (!url) return alert("Paste link first!");

  try {
    const res = await axios.post(`${BACKEND_URL}/testimonials/import`, {
      campaignId,
      url,
      platform: "TWITTER"
    }, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });


    if (!res) {
      alert("Failed to import");
      return;
    }

    alert("Imported successfully!");

    setUrl("");
    onOpenChange(false);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when modal closes
      setUrl("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl">Import Testimonials from X</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm sm:text-base text-gray-600">
            Import testimonials from X (Twitter) posts
          </p>
          <Input
            placeholder="Paste X post URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-11 sm:h-12 text-base"
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 sm:h-12"
            >
              Cancel
            </Button>
            <Button onClick={handleImport} className="flex-1 h-11 sm:h-12">
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ImportModal };