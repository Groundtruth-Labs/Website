import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  CircleDashed,
  Eye,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  markAsHandled,
  markAsUnhandled,
  markAllAsRead,
  inviteContact,
} from "./actions";

export const metadata: Metadata = { title: "Contacts" };

const bestTimeLabel: Record<string, string> = {
  morning: "Morning (8am\u201312pm)",
  afternoon: "Afternoon (12pm\u20135pm)",
  flexible: "Flexible",
};

const industryLabel: Record<string, { label: string; color: string }> = {
  agriculture: { label: "Agriculture", color: "bg-green-100 text-green-700" },
  construction: { label: "Construction", color: "bg-cyan-100 text-cyan-700" },
  solar: { label: "Solar", color: "bg-amber-100 text-amber-700" },
  golf: { label: "Golf", color: "bg-emerald-100 text-emerald-700" },
  other: { label: "Other", color: "bg-slate-100 text-slate-600" },
};

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  // Mark all unread submissions as read on page visit
  const unreadIds = submissions?.filter((s) => !s.is_read).map((s) => s.id) ?? [];
  if (unreadIds.length > 0) {
    await supabase
      .from("contact_submissions")
      .update({ is_read: true })
      .in("id", unreadIds);
  }

  const unhandled = submissions?.filter((s) => !s.handled_by) ?? [];
  const handled = submissions?.filter((s) => s.handled_by) ?? [];

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-slate-900">Contacts</h1>
          <p className="font-sans text-sm text-slate-500 mt-0.5">
            Discovery call requests from the /book form.
          </p>
        </div>
        {unreadIds.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded">
            <Eye className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-sans text-xs text-cyan-700 font-medium">
              Marked {unreadIds.length} new as read
            </span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {!submissions || submissions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded px-6 py-16 text-center">
            <p className="font-sans text-slate-400">No contact submissions yet.</p>
          </div>
        ) : (
          <>
            {/* Unhandled section */}
            {unhandled.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CircleDashed className="w-4 h-4 text-amber-500" />
                  <h2 className="font-mono text-sm font-semibold text-slate-900">
                    Needs attention
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded font-semibold">
                    {unhandled.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {unhandled.map((s) => (
                    <ContactCard key={s.id} submission={s} isHandled={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Handled section */}
            {handled.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h2 className="font-mono text-sm font-semibold text-slate-900">
                    Handled
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded font-semibold">
                    {handled.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {handled.map((s) => (
                    <ContactCard key={s.id} submission={s} isHandled={true} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ContactCard({
  submission: s,
  isHandled,
}: {
  submission: Record<string, string | boolean | null>;
  isHandled: boolean;
}) {
  const ind = s.industry ? industryLabel[s.industry as string] : null;
  const invitedAt = s.invited_at as string | null;

  return (
    <div
      className={`bg-white border rounded hover:shadow-sm transition-shadow ${
        isHandled ? "border-slate-200" : "border-l-2 border-l-amber-400 border-slate-200"
      }`}
    >
      {/* Header row */}
      <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-slate-50">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-sans text-sm font-semibold text-slate-900">
              {s.full_name as string}
            </span>
            {ind && (
              <span className={`font-mono text-xs px-2 py-0.5 rounded ${ind.color}`}>
                {ind.label}
              </span>
            )}
            {invitedAt && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                Invited
              </span>
            )}
            {!s.is_read && (
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-1 font-sans text-xs text-cyan-700 hover:underline"
            >
              <Mail className="w-3 h-3" />
              {s.email as string}
            </a>
            {s.phone && (
              <span className="flex items-center gap-1 font-sans text-xs text-slate-500">
                <Phone className="w-3 h-3" />
                {s.phone as string}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">{formatDate(s.created_at as string)}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
        {s.company && (
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            <span className="font-sans text-xs text-slate-600">{s.company as string}</span>
          </div>
        )}
        {s.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            <span className="font-sans text-xs text-slate-600">{s.location as string}</span>
          </div>
        )}
        {s.best_time && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            <span className="font-sans text-xs text-slate-600">
              {bestTimeLabel[s.best_time as string] ?? (s.best_time as string)}
            </span>
          </div>
        )}
      </div>

      {s.message && (
        <div className="px-6 pb-3">
          <p className="font-sans text-xs text-slate-500 bg-slate-50 rounded p-3 leading-relaxed">
            &ldquo;{s.message as string}&rdquo;
          </p>
        </div>
      )}

      {/* Primary action footer */}
      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
        {isHandled ? (
          <>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="font-sans text-xs text-slate-500">
                Handled by{" "}
                <span className="font-mono text-xs font-semibold text-slate-700">
                  {s.handled_by as string}
                </span>
                {s.handled_at && <> on {formatDateTime(s.handled_at as string)}</>}
              </span>
            </div>
            <form action={markAsUnhandled}>
              <input type="hidden" name="id" value={s.id as string} />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded text-xs font-sans text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <CircleDashed className="w-3 h-3" />
                Mark unhandled
              </button>
            </form>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2">
              <CircleDashed className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-sans text-xs text-amber-600 font-medium">
                Not yet handled
              </span>
            </span>
            <form action={markAsHandled}>
              <input type="hidden" name="id" value={s.id as string} />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 rounded text-xs font-sans text-white hover:bg-cyan-800 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" />
                Mark as handled
              </button>
            </form>
          </>
        )}
      </div>

      {/* Invite row — only shown for handled contacts */}
      {isHandled && (
        <div className="px-6 py-3 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
          {invitedAt ? (
            /* Already invited — show date and resend option */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="font-sans text-xs text-slate-500">
                  Portal invite sent{" "}
                  <span className="font-mono text-xs text-slate-600">
                    {formatDate(invitedAt)}
                  </span>
                </span>
              </div>
              <form action={inviteContact}>
                <input type="hidden" name="id" value={s.id as string} />
                <input type="hidden" name="email" value={s.email as string} />
                <button
                  type="submit"
                  className="flex items-center gap-1 font-sans text-xs text-slate-400 hover:text-cyan-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Resend
                </button>
              </form>
            </div>
          ) : (
            /* Not yet invited */
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-slate-400">
                Client not yet in the portal
              </span>
              <form action={inviteContact}>
                <input type="hidden" name="id" value={s.id as string} />
                <input type="hidden" name="email" value={s.email as string} />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 rounded text-xs font-sans text-white hover:bg-green-700 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  Invite to portal
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
