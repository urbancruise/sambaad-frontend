'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Target, 
  CheckSquare, 
  Activity as ActivityIcon, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import api from '@/src/lib/axios';
import NotificationBell from "@/src/features/notifications/components/NotificationBell";
import ThemeToggle from "@/src/components/theme/ThemeToggle";

export interface NavItem {
  label: string;
  url: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface WorkspaceItem {
  label: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc?: string;
}

const defaultNavItems: NavItem[] = [
  { label: 'IT Team',     icon: Layers, url: '#'  },
  { label: 'Sales Team',  icon: Layers, url: '#', },
  { label: 'HR Team',     icon: Layers, url: '#',  },
  { label: 'SEO Team',    icon: Layers, url: '#', },
];

interface NavbarProps {
  navItems?: NavItem[];
  workspaceItems?: WorkspaceItem[];
}

export default function Navbar({ 
  navItems = defaultNavItems,
  workspaceItems
}: NavbarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.replace("/");
    }
  };

  // Check if workspace items exist and are not empty
  const hasWorkspaceItems = Boolean(workspaceItems && workspaceItems.length > 0);

  const isWorkspaceActive = hasWorkspaceItems && workspaceItems!.some(
    item => pathname === item.url || pathname.startsWith(`${item.url}/`)
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#064121fd] backdrop-blur-md border-b border-slate-800/80 font-sans transition-all">
      <div className="w-ful px-4 sm:px-3 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* 1. Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-18 p-[1px] pb-2 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              <div className="w-full h-full rounded-[6px] flex items-center justify-center overflow-hidden">
                <img className="w-18 object-contain" src="/assets/SITE-ICON.png" alt="SAMVAAD" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-wide leading-none group-hover:text-[#F7C431] transition-colors">
                SAMVAAD
              </span>
              <span className="text-[11px] text-slate-400 tracking-wider uppercase font-semibold mt-0.5">
                Performance Network
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Render Workspace Dropdown ONLY if workspaceItems are provided */}
            {hasWorkspaceItems && (
              <div 
                className="relative"
                onMouseEnter={() => setIsWorkspaceOpen(true)}
                onMouseLeave={() => setIsWorkspaceOpen(false)}
              >
                <button
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${
                    isWorkspaceActive || isWorkspaceOpen ? 'text-[#03C35E]' : 'text-slate-100 hover:text-white'
                  }`}
                >
                  <span>Workspace</span>
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 ${isWorkspaceOpen ? 'rotate-180 text-[#03C35E]' : ''}`} 
                  />
                </button>

                {isWorkspaceOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#121824] border border-slate-800 rounded-xl shadow-2xl p-2 gap-1 flex flex-col">
                      {workspaceItems!.map(({ label, url, icon: Icon, desc }) => {
                        const active = pathname === url || pathname.startsWith(`${url}/`);
                        return (
                          <Link
                            key={label}
                            href={url}
                            className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                              active 
                                ? 'bg-[#03C35E]/10 text-[#03C35E]' 
                                : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                            }`}
                          >
                            {Icon && <Icon size={18} className={`mt-0.5 ${active ? 'text-[#03C35E]' : 'text-[#F7C431]'}`} />}
                            <div>
                              <p className="text-sm font-semibold leading-none">{label}</p>
                              {desc && <p className="text-[11px] text-slate-400 mt-1 leading-tight">{desc}</p>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Standard Nav Items */}
            {navItems.map(({ label, url }) => {
              const isActive = pathname === url || pathname.startsWith(`${url}/`);
              return (
                <Link
                  key={label}
                  href={url}
                  className={`text-m font-medium transition-colors ${
                    isActive ? 'text-[#03C35E]' : 'text-slate-100 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Side Controls */}
          <div className="flex items-center gap-4 shrink-0">
             <ThemeToggle />
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#03C35E]/40 group-hover:border-[#03C35E] flex items-center justify-center text-xs font-bold text-[#F7C431] transition-colors">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{user?.role}</span>
                </div>
                <ChevronDown 
                  size={12} 
                  className={`hidden sm:block text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-[#03C35E]' : ''}`} 
                />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#121824] border border-slate-800 rounded-xl p-1.5 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-medium rounded-lg transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F17] border-b border-slate-800 px-4 pt-3 pb-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Workspace Links - ONLY rendered if workspaceItems are provided */}
          {hasWorkspaceItems && (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-bold text-[#F7C431] uppercase tracking-wider px-2 mb-1">Workspace</p>
                {workspaceItems!.map(({ label, url, icon: Icon }) => (
                  <Link
                    key={label}
                    href={url}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    {Icon && <Icon size={16} className="text-[#03C35E]" />}
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-800 my-1" />
            </>
          )}

          {/* Mobile Standard Navigation */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">Navigation</p>
            {navItems.map(({ label, url, icon: Icon }) => (
              <Link
                key={label}
                href={url}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white"
              >
                {Icon && <Icon size={16} className="text-slate-400" />}
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}