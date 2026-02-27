"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  Users,
  BarChart3,
  Folder,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Avatar from "boring-avatars";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#0e7490", "#0f172a", "#f59e0b", "#e2e8f0", "#f8fafc"];

const navGroups = [
  {
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/support", label: "Contacts", icon: MessageSquare, exact: false },
      { href: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
      { href: "/admin/clients", label: "Clients", icon: Users, exact: false },
      { href: "/admin/projects", label: "Projects", icon: Folder, exact: false },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
    ],
  },
];

interface AdminSidebarProps {
  userName: string;
  userEmail: string;
  unreadContacts?: number;
}

export function AdminSidebar({ userName, userEmail, unreadContacts = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/favicon.png"
            alt="Groundtruth Labs logo"
            width={28}
            height={28}
            className="rounded flex-shrink-0"
          />
          <div>
            <div className="font-mono text-xs font-bold text-slate-900 leading-tight tracking-tight">
              Groundtruth Labs
            </div>
            <div className="flex items-center gap-1">
              <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
              <span className="font-mono text-xs text-cyan-700 font-semibold">
                Admin
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded text-sm font-sans mb-0.5 transition-all duration-150",
                    isActive
                      ? "bg-cyan-50 text-cyan-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-cyan-700" : "text-slate-400"
                    )}
                  />
                  {item.label}
                  {item.href === "/admin/support" && unreadContacts > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold leading-none">
                      {unreadContacts > 99 ? "99+" : unreadContacts}
                    </span>
                  )}
                  {isActive && item.href !== "/admin/support" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-700" />
                  )}
                  {isActive && item.href === "/admin/support" && unreadContacts === 0 && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-700" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Avatar
              name={userName}
              variant="bauhaus"
              size={32}
              colors={AVATAR_COLORS}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs font-semibold text-slate-900 truncate">
              {userName}
            </p>
            <p className="font-sans text-xs text-slate-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded font-semibold uppercase tracking-wide">
            admin
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
