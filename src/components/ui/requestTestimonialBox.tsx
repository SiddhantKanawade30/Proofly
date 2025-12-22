"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Campaign {
  id: string
  title: string
  shareLink: string
  description?: string
  _count?: {
    testimonials: number
  }
}

interface RequestTestimonialBoxProps {
  campaigns?: Campaign[]
}

export function RequestTestimonialBox({ campaigns = [] }: RequestTestimonialBoxProps) {
  const [open, setOpen] = React.useState(false)

  console.log("RequestTestimonialBox received campaigns:", campaigns)

  const handleCampaignClick = (campaign: Campaign) => {
    // Construct proper share URL
    let fullShareUrl = campaign.shareLink
    
    // Add protocol if missing
    if (!fullShareUrl.startsWith("http")) {
      fullShareUrl = `http://${fullShareUrl}`
    }
    
    navigator.clipboard.writeText(fullShareUrl).then(() => {
      toast.success("Share link copied to clipboard")
      setTimeout(() => {
        setOpen(false)
      }, 1500)
    }).catch((err) => {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy link")
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between h-auto border hover:bg-zinc-100"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 -py-1 text-left">
              Request Testimonial
            </div>
          </div>
          <ChevronDown className={cn("size-4 opacity-50 flex-shrink-0 transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search for campaign..." className="h-9" />
          <CommandList>
            <div className="px-3 py-2 text-sm text-text-secondary border-b border-zinc-200">
              Click on a campaign to copy the share URL
            </div>
            {campaigns.length === 0 && (
              <CommandEmpty>No campaigns found. Create one to get started!</CommandEmpty>
            )}
            {campaigns.length > 0 && (
              <CommandGroup>
                {campaigns.map((campaign) => (
                  <CommandItem
                    key={campaign.id}
                    value={campaign.title}
                    onSelect={() => handleCampaignClick(campaign)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="text-base font-medium truncate">{campaign.title}</span>
                      {campaign.description && (
                        <span className="text-sm text-text-secondary truncate">{campaign.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
