'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/lib/store';
import { 
  Layers, 
  CheckSquare, 
  MessageSquare, 
  Users, 
  Mail, 
  ChevronRight,
} from 'lucide-react';

export type Color =
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "yellow"
  | "red"
  | "indigo";

const colorMap: Record<
  Color,
  {
    bg: string;
    hoverBg: string;
    text: string;
    border: string;
    activeBg: string;
    accentLine: string;
    iconText: string;
    bgText: string;
    hoverText: string;
  }
> = {
  orange: {
    bg: "bg-orange-100",
    hoverBg: "hover:bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-500",
    activeBg: "bg-orange-50/70 border-orange-500/10",
    accentLine: "bg-orange-500",
    iconText: "text-orange-600",
    bgText: "bg-orange-200/80",
    hoverText: "hover:bg-orange-100"
  },
  green: {
    bg: "bg-green-100",
    hoverBg: "hover:bg-green-50",
    text: "text-green-600",
    border: "border-green-500",
    activeBg: "bg-green-50/70 border-green-500/10",
    accentLine: "bg-green-500",
    iconText: "text-green-600",
    bgText: "bg-green-200/80",
    hoverText: "hover:bg-green-100"
  },
  blue: {
    bg: "bg-blue-100",
    hoverBg: "hover:bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-500",
    activeBg: "bg-blue-50/70 border-blue-500/10",
    accentLine: "bg-blue-500",
    iconText: "text-blue-600",
    bgText: "bg-blue-200/80",
    hoverText: "hover:bg-blue-100"
  },
  purple: {
    bg: "bg-purple-100",
    hoverBg: "hover:bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-500",
    activeBg: "bg-purple-50/70 border-purple-500/10",
    accentLine: "bg-purple-500",
    iconText: "text-purple-600",
    bgText: "bg-purple-200/80",
    hoverText: "hover:bg-purple-100"
  },
  yellow: {
    bg: "bg-yellow-100",
    hoverBg: "hover:bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-500",
    activeBg: "bg-yellow-50/70 border-yellow-500/10",
    accentLine: "bg-yellow-500",
    iconText: "text-yellow-600",
    bgText: "bg-yellow-200/80",
    hoverText: "hover:bg-yellow-100"
  },
  red: {
    bg: "bg-red-100",
    hoverBg: "hover:bg-red-50",
    text: "text-red-600",
    border: "border-red-500",
    activeBg: "bg-red-50/70 border-red-500/10",
    accentLine: "bg-red-500",
    iconText: "text-red-600",
    bgText: "bg-red-200/80",
    hoverText: "hover:bg-red-100"
  },
  indigo: {
    bg: "bg-indigo-100",
    hoverBg: "hover:bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-500",
    activeBg: "bg-indigo-50/70 border-indigo-500/10",
    accentLine: "bg-indigo-500",
    iconText: "text-indigo-600",
    bgText: "bg-indigo-200/80",
    hoverText: "hover:bg-indigo-100"
  },
};

// Exported type so you can type-check items in layout files or parent components
export interface SidebarItemData {
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  url: string;
  color: Color;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isExpanded: boolean;
  isActive: boolean;
  color: Color;
  url: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  description,
  isExpanded,
  isActive,
  color,
  url,
}) => {
  const c = colorMap[color];

  // 1. EXPANDED LAYOUT
  if (isExpanded) {
    return (
      <Link
        href={url}
        className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ease-in-out group relative border border-transparent select-none
          ${isActive 
            ? `${c.activeBg} border-slate-100 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.04)]` 
            : `text-slate-600 hover:text-slate-900 ${c.hoverText}`
          }`}
      >
        {/* Dynamic active leading line indicator */}
        {isActive && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${c.accentLine}`} />
        )}

        <div className={`p-2 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105
          ${isActive ? c.bg : "bg-slate-150 text-slate-500 group-hover:bg-slate-200/50 group-hover:text-slate-850"}`}
        >
          <span className={c.text}>{icon}</span>
        </div>

        <div className="text-left flex-1 min-w-0 transition-all duration-250">
          <p className={`font-bold text-xl tracking-tight transition-colors duration-200
            ${isActive ? "text-slate-900 font-extrabold" : "text-slate-700"}`}
          >
            {label}
          </p>
          <p className="text-[13px] text-slate-400 font-medium truncate mt-0.5">
            {description}
          </p>
        </div>

        <ChevronRight size={14} className={`text-slate-300 transition-all duration-350 group-hover:translate-x-0.5
          ${isActive ? "opacity-100 text-slate-400" : "opacity-0 group-hover:opacity-100"}`} 
        />
      </Link>
    );
  }

  // 2. COLLAPSED COMPACT LAYOUT
  return (
    <div className="relative group w-full flex justify-center py-0.5">
      {/* Dynamic active left line indicator */}
      {isActive && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${c.accentLine}`} />
      )}

      <Link
        href={url}
        className={`w-12 h-12 ${c.bgText} border-amber-400 rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out relative border
          ${isActive 
            ? `${c.activeBg} border-amber-400 shadow-sm` 
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
      >
        <span className={`transition-transform duration-300 group-hover:scale-110 
          ${isActive ? c.text : `${c.iconText} group-hover:text-slate-800`}`}
        >
          {icon}
        </span>
      </Link>

      {/* Modern 3D Horizontal Flyout Tooltip Ribbon */}
      <div className="absolute left-[4.5rem] top-1/2 -translate-y-1/2 opacity-0 translate-x-3 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-300 ease-out z-50">
        <div className="relative bg-[#1e293b] text-white py-3 pl-4 pr-5 rounded-xl shadow-xl flex items-center justify-between min-w-[200px] gap-4 border border-slate-700/50">
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#1e293b]" />
          <div className="text-left leading-tight">
            <span className={`block text-xs font-bold tracking-wide uppercase ${c.text}`}>
              {label}
            </span>
            <span className="block text-[10px] text-slate-300 font-medium mt-0.5">
              {description}
            </span>
          </div>
          <ChevronRight size={14} className="text-slate-500 shrink-0" />
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  items?: SidebarItemData[];
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();

  // Dynamically obtain current workspace active team
  const activeTeam = params?.team || 'it-team';
  const basePath = `/${activeTeam}`;

  // Default fallback items if no `items` prop is passed
  const defaultItems: SidebarItemData[] = [
    { 
      label: 'Dashboard', 
      subLabel: 'Overview Console', 
      icon: Layers, 
      url: `#`,
      color: 'orange'
    },
    { 
      label: 'PMS', 
      subLabel: 'Task & Performance', 
      icon: CheckSquare, 
      url: `/employee/dashboard`,
      color: 'green'
    },
    { 
      label: 'Communication', 
      subLabel: 'Chat & Forums', 
      icon: MessageSquare, 
      url: `#`,
      color: 'blue'
    },
    { 
      label: 'Meetings', 
      subLabel: 'Room Scheduling', 
      icon: Users, 
      url: `#`,
      color: 'purple'
    },
    { 
      label: 'Email', 
      subLabel: 'Outbox & Sync', 
      icon: Mail, 
      url: `#`,
      color: 'yellow'
    },
  ];

  // Pick provided items prop or default list
  const sidebarItems = items || defaultItems;

  const [isExpanded, setIsExpanded] = useState(false);
  const iconSize = isExpanded ? 22 : 20;

  return (
    <div 
      className="h-screen w-20 relative shrink-0 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        className="absolute top-0 left-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col justify-between select-none shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)]"
        style={{ width: isExpanded ? "280px" : "80px" }}
      >
        <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
          {/* Navigation Link Stack */}
          <div className={`flex-1 py-6 flex flex-col gap-1.5 transition-all duration-300 ${isExpanded ? "px-4" : "px-3" }`}>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.url || (item.url !== '/' && pathname?.startsWith(item.url));
              const IconComponent = item.icon;

              return (
                <SidebarItem
                  key={item.label}
                  icon={<IconComponent size={iconSize} />}
                  label={item.label}
                  description={item.subLabel}
                  isExpanded={isExpanded}
                  isActive={isActive}
                  color={item.color}
                  url={item.url}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}