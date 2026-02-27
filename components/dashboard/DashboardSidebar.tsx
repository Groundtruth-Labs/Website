"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboardStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
}

interface SidebarProps {
  projects: Project[];
  companyName?: string | null;
}

export function DashboardSidebar({ projects, companyName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-200 bg-white transition-all duration-200 flex-shrink-0",
        sidebarCollapsed ? "w-14" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-slate-100",
          sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.png"
              alt="Groundtruth Labs logo"
              width={24}
              height={24}
              className="rounded flex-shrink-0"
            />
            <span className="font-mono text-xs font-semibold text-slate-900 leading-tight">
              Groundtruth Labs
            </span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 flex-shrink-0"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Company name */}
      {!sidebarCollapsed && companyName && (
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Client
          </p>
          <p className="font-sans text-sm font-medium text-slate-900 mt-0.5 truncate">
            {companyName}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {/* Projects */}
        {!sidebarCollapsed && (
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest px-2 mb-2">
            Projects
          </p>
        )}
        {projects.length === 0 ? (
          !sidebarCollapsed && (
            <p className="font-sans text-xs text-slate-400 px-2 py-2">
              No projects yet.
            </p>
          )
        ) : (
          <ul className="space-y-0.5">
            {projects.map((project) => {
              const isActive = pathname.startsWith(
                `/dashboard/projects/${project.id}`
              );
              return (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    title={sidebarCollapsed ? project.name : undefined}
                  >
                    <FolderOpen className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="font-sans truncate">{project.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-2">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full rounded px-2 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          title={sidebarCollapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="font-sans">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
