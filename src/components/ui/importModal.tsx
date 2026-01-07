import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const ImportModal = ({ open, onOpenChange, campaignId } : { open: boolean; onOpenChange: (open: boolean) => void; campaignId: string }) => {
  const [step, setStep] = useState<"select" | "input">("select");
  const [platform, setPlatform] = useState<"instagram" | "x" | null>(null);
  const [url, setUrl] = useState("");

  const handleSelect = (p: "instagram" | "x") => {
    setPlatform(p);
    setStep("input");
  };

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleImport = async () => {
  if (!url) return alert("Paste link first!");

  try {
    const res = await axios.post(`${BACKEND_URL}/testimonials/import`, {
      campaignId,
      url,
      platform: platform === "x" ? "TWITTER" : "INSTAGRAM"
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
    setStep("select");
    setPlatform(null);
    onOpenChange(false);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep("select");
      setPlatform(null);
      setUrl("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl">Import Testimonials</DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-6 py-4">
            <p className="text-sm sm:text-base text-gray-600">
              Choose a platform to import testimonials
            </p>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-16 sm:h-20 justify-start gap-4 text-base sm:text-lg hover:bg-gray-50 transition-all"
                onClick={() => handleSelect("instagram")}
              >
                <img src="/insta.svg" alt="Instagram" className="h-6 w-6 sm:h-8 sm:w-8" />
                Instagram
              </Button>
              <Button
                variant="outline"
                className="h-16 sm:h-20 justify-start gap-4 text-base sm:text-lg hover:bg-gray-50 transition-all"
                onClick={() => handleSelect("x")}
              >
                <img src="/X.svg" alt="X" className="h-6 w-6 sm:h-8 sm:w-8" />
                X (Twitter)
              </Button>
            </div>
          </div>
        )}

        {step === "input" && (
          <div className="space-y-6 py-4">
            <p className="text-sm sm:text-base text-gray-600">
              Importing from{" "}
              <span className="font-medium capitalize">{platform}</span>
            </p>
            <Input
              placeholder={`Paste ${platform} post URL`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 sm:h-12 text-base"
            />
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                className="flex-1 h-11 sm:h-12"
              >
                Back
              </Button>
              <Button onClick={handleImport} className="flex-1 h-11 sm:h-12">
                Import
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ImportModal };