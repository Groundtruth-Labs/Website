"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Shield, LogOut } from "lucide-react";
import Avatar from "boring-avatars";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const AVATAR_COLORS = ["#0e7490", "#0f172a", "#f59e0b", "#e2e8f0", "#f8fafc"];

export function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("clients")
          .select("contact_name, is_admin")
          .eq("user_id", user.id)
          .single();
        setDisplayName(data?.contact_name ?? user.email ?? "");
        setIsAdmin(data?.is_admin ?? false);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setDisplayName("");
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Not loaded yet — render placeholder to avoid layout shift
  if (loading) {
    return (
      <div className="hidden md:flex items-center justify-end gap-3">
        <div className="w-20 h-8 bg-slate-100 rounded animate-pulse" />
        <div className="w-24 h-8 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  // Logged out state — standard CTAs
  if (!user) {
    return (
      <div className="hidden md:flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/book">Book a call</Link>
        </Button>
      </div>
    );
  }

  // Logged in state — keep Book a call, swap Log in for avatar
  return (
    <div className="hidden md:flex items-center justify-end gap-3">
      <Button size="sm" variant="outline" asChild>
        <Link href="/book">Book a call</Link>
      </Button>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-cyan-300 transition-all"
          aria-label="Open account menu"
        >
          <Avatar
            name={displayName}
            variant="bauhaus"
            size={32}
            colors={AVATAR_COLORS}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded shadow-lg z-50 overflow-hidden">
            {/* Identity */}
            <div className="p-4 flex items-center gap-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Avatar
                  name={displayName}
                  variant="bauhaus"
                  size={40}
                  colors={AVATAR_COLORS}
                />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="font-sans text-xs text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="p-1.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm font-sans text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded text-sm font-sans text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Sign out */}
            <div className="p-1.5 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm font-sans text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
