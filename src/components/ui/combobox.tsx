"use client"

import * as React from "react"
import { ChevronDown, User, Settings, CreditCard, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface UserMenuOption {
  value: string
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

const userMenuOptions: UserMenuOption[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <User className="size-4" />,
    href: "/profile",
  },
  {
    value: "settings",
    label: "Settings",
    icon: <Settings className="size-4" />,
    href: "/settings",
  },
  {
    value: "plans",
    label: "Plans",
    icon: <CreditCard className="size-4" />,
    href: "/plans",
  },
  {
    value: "logout",
    label: "Logout",
    icon: <LogOut className="size-4" />,
    onClick: () => {
      // Handle logout logic here
      console.log("Logout clicked")
    },
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const userName = "John Doe" // You can replace this with actual user data
  const userEmail = "user@example.com"
  const handleOptionClick = (option: UserMenuOption) => {
    if (option.onClick) {
      option.onClick()
    } else if (option.href) {
      router.push(option.href)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto border hover:bg-zinc-100"
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0">
              <span className="text-lg rounded-3xl "><img src="/woman.png" className="rounded-sm -ml-1" alt="" /></span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-md font-medium text-text-primary truncate">
                {userName}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {userEmail}
              </p>
            </div>
          </div>
          <ChevronDown className={cn("size-4 opacity-50 flex-shrink-0 transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {userMenuOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleOptionClick(option)}
                  className="cursor-pointer"
                >
                  <span className="text-muted-foreground">{option.icon}</span>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
