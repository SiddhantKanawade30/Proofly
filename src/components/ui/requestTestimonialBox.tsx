"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

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

interface Space {
  id: string
  name: string
  shareUrl: string
  description?: string
}

const spaces: Space[] = [
  {
    id: "1",
    name: "Project Alpha",
    shareUrl: "https://testimonials.app/space/project-alpha",
    description: "Main project workspace",
  },
  {
    id: "2",
    name: "Project Beta",
    shareUrl: "https://testimonials.app/space/project-beta",
    description: "Secondary workspace",
  },
  {
    id: "3",
    name: "Marketing Team",
    shareUrl: "https://testimonials.app/space/marketing-team",
    description: "Marketing campaigns space",
  },
  {
    id: "4",
    name: "Development",
    shareUrl: "https://testimonials.app/space/development",
    description: "Dev team workspace",
  },
]

export function RequestTestimonialBox() {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleSpaceClick = (space: Space) => {
    // Copy share URL to clipboard
    navigator.clipboard.writeText(space.shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setOpen(false)
      }, 1000)
    }).catch((err) => {
      console.error("Failed to copy:", err)
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
          <CommandInput placeholder="Search for space..." className="h-9" />
          <CommandList>
            <div className="px-3 py-2 text-sm text-text-secondary border-b border-zinc-200">
              Click on a space to copy the share URL
            </div>
            <CommandEmpty>No spaces found.</CommandEmpty>
            <CommandGroup>
              {spaces.map((space) => (
                <CommandItem
                  key={space.id}
                  value={space.name}
                  onSelect={() => handleSpaceClick(space)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-medium">{space.name}</span>
                    {space.description && (
                      <span className="text-sm text-text-secondary">{space.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
