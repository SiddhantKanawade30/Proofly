"use client"

import * as React from "react"
import { ChevronDown, User, Settings, CreditCard, LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
  onClick?: () => void | Promise<void>
}

interface ComboboxDemoProps {
  userName?: string
  userEmail?: string
}

export function ComboboxDemo({ userName = "User", userEmail = "user@example.com" }: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Remove token from localStorage
      localStorage.removeItem("token")
      toast.success("Logged out successfully")
      // Redirect to signin page
      setTimeout(() => {
        router.push("/signin")
      }, 1000)
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
      setIsLoggingOut(false)
    }
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
      label: isLoggingOut ? "Logging out..." : "Logout",
      icon: isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />,
      onClick: handleLogout,
    },
  ]

  const handleOptionClick = (option: UserMenuOption) => {
    if (option.value === "logout") {
      handleLogout()
    } else if (option.onClick) {
      option.onClick()
    } else if (option.href) {
      router.push(option.href)
      setOpen(false)
    }
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
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
