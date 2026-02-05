"use client";

import { usePathname, useParams } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  LayoutGrid,
  Airplay,
  Archive,
  Heart,
  Settings,
  ChevronDown,
  User,
  CreditCard,
  LogOut,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RequestTestimonialBox } from "./requestTestimonialBox";

interface Campaign {
  id: string
  title: string
  shareLink: string
  description?: string
  _count?: {
    testimonials: number
  }
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/", icon: <LayoutGrid className="size-4" /> },
  { name: "Spaces", href: "/spaces", icon: <Airplay className="size-4" /> },
  { name: "All Testimonials", href: "/all-testimonials", icon: <MessageCircle className="size-4" /> },
  { name: "Archived", href: "/archived", icon: <Archive className="size-4" /> },
  { name: "Favourites", href: "/favourites", icon: <Heart className="size-4" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="size-4" /> }
];

// Mock data - in real app, this would come from API/context
const mockSpaces = [
  { slug: "project-alpha", name: "Project Alpha" },
  { slug: "marketing", name: "Marketing Team" },
  { slug: "beta-testing", name: "Beta Testing" },
];

function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const userMenuOptions = [
    { value: "profile", label: "Profile", icon: <User className="size-4" />, href: "/profile" },
    { value: "settings", label: "Settings", icon: <Settings className="size-4" />, href: "/settings" },
    { value: "plans", label: "Plans", icon: <CreditCard className="size-4" />, href: "/plans" },
    { value: "logout", label: "Logout", icon: <LogOut className="size-4" />, onClick: () => console.log("Logout clicked") },
  ];

  const handleOptionClick = (option: typeof userMenuOptions[0]) => {
    if (option.onClick) {
      option.onClick();
    } else if (option.href) {
      router.push(option.href);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <ChevronDown className={cn("size-4 text-zinc-600 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
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
  );
}

export default function Topbar({ children, campaigns = [] }: { children: React.ReactNode; campaigns?: Campaign[] }) {
  const pathname = usePathname();
  const params = useParams();

  // Handle dynamic routes and breadcrumbs
  const getPageTitle = () => {
    // Check if we're on a space detail page
    if (pathname?.startsWith("/spaces/") && pathname !== "/spaces") {
      const slug = params?.slug as string;
      const space = mockSpaces.find(s => s.slug === slug);
      return space ? (
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">Spaces</span>
          <ChevronRight className="size-4 text-zinc-400" />
          <span className="text-base font-semibold">{space.name}</span>
        </div>
      ) : "Spaces";
    }

    // Find exact match or return default
    const currentPage = navItems.find(item => item.href === pathname) || navItems[0];
    return currentPage.name;
  };

  return (
    <div className="flex-1 lg:ml-[248px]">
      {/* Topbar Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-4 py-2 gap-4">
          {/* Left: Current Page */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center text-md gap-1 text-text-primary">
              <h2 className="text-base font-semibold whitespace-nowrap">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RequestTestimonialBox campaigns={campaigns} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
