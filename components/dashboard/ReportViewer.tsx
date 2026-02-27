import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  summary: string | null;
  recommendations: string | null;
  created_at: string;
}

interface ReportViewerProps {
  reports: Report[];
}

export function ReportViewer({ reports }: ReportViewerProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="font-mono text-sm text-slate-500">No reports yet.</p>
        <p className="font-sans text-xs text-slate-400 mt-1">
          Analysis reports will appear here after each flight is processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="border border-slate-200 bg-white rounded overflow-hidden"
        >
          {/* Report header */}
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-mono text-sm font-semibold text-slate-900">
                {report.title}
              </h3>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {formatDate(report.created_at)}
              </p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Summary */}
            {report.summary && (
              <div>
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Summary
                </p>
                <p className="font-sans text-sm text-slate-700 leading-relaxed">
                  {report.summary}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && (
              <div>
                <p className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Recommendations
                </p>
                <ul className="space-y-2">
                  {report.recommendations
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs text-cyan-600 font-bold mt-0.5 flex-shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-sans text-sm text-slate-700 leading-relaxed">
                          {line.replace(/^[-•*]\s*/, "")}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
