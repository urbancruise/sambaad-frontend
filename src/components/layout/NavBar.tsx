'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/src/features/auth/hooks/useAuth'
import api from '@/src/lib/axios';
import NotificationBell from "@/src/features/notifications/components/NotificationBell";

interface NavItem {
  label: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const defaultNavItems: NavItem[] = [
  { label: 'IT Team',     icon: Layers, url: '#'  },
  { label: 'Sales Team',  icon: Layers, url: '#', },
  { label: 'HR Team',     icon: Layers, url: '#',  },
  { label: 'SEO Team',    icon: Layers, url: '#', },
];

export default function Navbar({ navItems = defaultNavItems }: { navItems?: NavItem[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  // Was hardcoded to "TL" (desktop) / "SJ" (mobile) regardless of who
  // was actually logged in — now derived from the real user.
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const handleLogout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-amber-500/80 border-b border-slate-100 pt-1">
      {/* ── Main bar ── */}
      <div className="flex items-center justify-between h-13">

        {/* Left: Brand */}
        <div className=" flex items-center transition-all duration-300 px-3">
          <div className="w-15 h-12 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-500 flex items-center justify-center font-black text-white text-lg">
            <img className="p-0.5 pt-0" src="/assets/SITE-ICON.png" alt="S" />
          </div>
          <div className="ml-4 transition-all duration-350 overflow-hidden opacity-100">
            <h2 className="font-black text-slate-100 text-x tracking-tight leading-none uppercase">Samvaad</h2>
            <span className="text-[14px] text-slate-100 font-bold tracking-wider block">
              Performance Network 
            </span>
          </div>
        </div>

        {/* 2. Desktop Navigation (Uses the prop data now) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, icon: Icon, url }) => {
            const isActive = pathname === url || pathname.startsWith(`${url}/`);
            return (
              <Link
                key={label}
                href={url}
                className={`flex items-center gap-2 px-1 border border-amber-300 rounded-xl bg-amber-500/60 py-1.5 font-medium text-l transition-all
                  ${isActive
                    ? 'bg-slate-800/60 text-white'
                    : 'text-slate-100 hover:bg-slate-800/30 hover:text-white'
                  }`}
              >
                <Icon size={15} className={isActive ? 'text-emerald-400 shrink-0' : 'text-slate-100 shrink-0'} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right: User + Dropdown Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[17px] font-semibold text-white leading-none">{user?.firstName}  {user?.lastName}</p>
                <span className="text-[13px] text-slate-200 font-medium mt-0.5 block">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              
              <ChevronDown 
                size={14} 
                className={`text-slate-100 group-hover:text-slate-300 transition-all hidden sm:block
                  ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} 
              />
            </div>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-xl z-40">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium rounded-lg transition-all text-left"
                  >
                    <LogOut size={14} className="shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── 3. Mobile dropdown (Uses the prop data now) ── */}
     {menuOpen && (
  <nav
    className="
      fixed
      top-16
      right-4
      z-50
      w-64
      rounded-xl
      border border-slate-800
      bg-black
      shadow-2xl
      px-3
      py-3
      flex
      flex-col
      gap-1
      md:hidden
    "
  >
    {navItems.map(({ label, icon: Icon, url }) => {
      const isActive = pathname === url || pathname.startsWith(`${url}/`);

      return (
        <Link
          key={label}
          href={url}
          onClick={() => setMenuOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
            ${
              isActive
                ? "bg-slate-800/60 text-white"
                : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
            }`}
        >
          <Icon
            size={16}
            className={
              isActive
                ? "text-emerald-400 shrink-0"
                : "text-slate-500 shrink-0"
            }
          />
          <span>{label}</span>
        </Link>
      );
    })}

    <div className="mt-2 border-t border-slate-800 pt-2 flex items-center gap-3 px-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-slate-700 text-xs font-bold text-white">
        {initials}
      </div>

      <div>
        <p className="text-[15px] font-semibold text-white">
          {user?.firstName} {user?.lastName}
        </p>
        <span className="block text-[13px] text-slate-300">
          {user?.role}
        </span>
      </div>
    </div>
  </nav>
)}
    </header>
  );
}
