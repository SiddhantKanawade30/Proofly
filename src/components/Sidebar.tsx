"use client";
import { LayoutGrid, Settings , Airplay , MessageCircle , Heart , Gift, Archive   } from 'lucide-react';


import { useState } from "react";
import Link from "next/link";
import { ComboboxDemo } from "./ui/combobox";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/", icon: <LayoutGrid className="size-5" /> },
  { name: "Spaces", href: "/spaces", icon: <Airplay className="size-5" /> },
  { name: "All Testimonials", href: "/all-testimonials", icon: <MessageCircle className="size-5" /> },
  { name: "Archived", href: "/archived", icon: <Archive className="size-5" /> },
  { name: "Favourites", href: "/favourites", icon: <Heart className="size-5" /> },
  { name: "Settings", href: "/settings", icon: <Settings /> }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full px-3 bg-white border-r border-zinc-200 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-62`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between pt-5 ">
            <h1 className=" flex items-center gap-1 text-xl font-bold text-text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <MessageCircle className="size-5" />  Testimonials
            </h1>
            
          </div>

          <div className="py-4 border-b  px-1  border-zinc-200">
            <ComboboxDemo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    <span className="size-5">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border items-center justify-center mb-2 p-4 bg-neutral-100 rounded-lg">
            <div className="flex items-center gap-1 mb-2">
              <Gift className="size-5 text-primary" />
              <div className="text-sm font-medium">Upgrade to <span className="bg-gradient-to-b from-violet-700 to-violet-400 py-0.5 rounded-sm px-2 text-white">Premium</span></div>
            </div>
            <div className="text-xs text-text-secondary">Upgrade to premium to get access to more features.</div>
            <Link href="/plans"><button className="cursor-pointer bg-primary text-white w-full px-4 py-2 rounded-md mt-4">Click here</button></Link>
            
          </div>


        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-30 lg:hidden rounded-lg bg-white p-2 shadow-md border border-zinc-200"
      >
        <svg
          className="h-6 w-6 text-zinc-900"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
