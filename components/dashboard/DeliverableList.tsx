"use client";

import { useState, useEffect } from "react";
import { Download, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDeliverableStyle, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Deliverable {
  id: string;
  name: string;
  type: string | null;
  file_url: string | null;
  captured_at: string | null;
}

interface DeliverableListProps {
  deliverables: Deliverable[];
}

async function getSignedUrl(path: string): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("deliverables")
      .createSignedUrl(path, 3600);
    if (error) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

function FigureThumbnail({ storagePath }: { storagePath: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getSignedUrl(storagePath).then(setSrc);
  }, [storagePath]);

  if (!src) {
    return (
      <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
        <ImageIcon className="w-5 h-5 text-slate-300" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="w-full aspect-video object-cover bg-slate-50"
    />
  );
}

export function DeliverableList({ deliverables }: DeliverableListProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(deliverable: Deliverable) {
    if (!deliverable.file_url) return;
    setDownloading(deliverable.id);
    try {
      const url = await getSignedUrl(deliverable.file_url);
      if (!url) throw new Error("Failed to generate link");
      window.open(url, "_blank");
    } catch {
      alert("Could not generate download link. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  const figures = deliverables.filter((d) => d.type === "figure");
  const others = deliverables.filter((d) => d.type !== "figure");

  if (deliverables.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="font-mono text-sm text-slate-500">No deliverables yet.</p>
        <p className="font-sans text-xs text-slate-400 mt-1">
          Files will appear here once your first flight is processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {others.length > 0 && (
        <div className="space-y-2">
          {others.map((d) => {
            const style = getDeliverableStyle(d.type ?? "");
            const isDownloading = downloading === d.id;
            return (
              <div
                key={d.id}
                className="flex items-center justify-between gap-4 border border-slate-200 bg-white rounded px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium flex-shrink-0 ${style.color}`}>
                    {style.label}
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-medium text-slate-900 truncate">{d.name}</p>
                    {d.captured_at && (
                      <p className="font-mono text-xs text-slate-400">Captured {formatDate(d.captured_at)}</p>
                    )}
                  </div>
                </div>
                {d.file_url && (
                  <Button size="sm" variant="outline" onClick={() => handleDownload(d)} disabled={isDownloading} className="flex-shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    {isDownloading ? "Generating…" : "Download"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {figures.length > 0 && (
        <div>
          <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Figures ({figures.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {figures.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDownload(d)}
                disabled={downloading === d.id}
                className="group text-left border border-slate-200 bg-white rounded overflow-hidden hover:border-cyan-300 hover:shadow-sm transition-all disabled:opacity-60"
              >
                {d.file_url ? (
                  <FigureThumbnail storagePath={d.file_url} />
                ) : (
                  <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  </div>
                )}
                <div className="px-2 py-1.5">
                  <p className="font-sans text-xs font-medium text-slate-700 truncate group-hover:text-cyan-700 transition-colors">
                    {d.name}
                  </p>
                  {d.captured_at && (
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">{formatDate(d.captured_at)}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
