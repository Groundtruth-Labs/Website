"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Upload, CheckCircle2, AlertCircle, FileJson, X } from "lucide-react";
import { uploadNdviStats } from "@/app/admin/projects/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ParsedPreview {
  count: number;
  mean: number;
  concern_zone_pct: number;
}

function SubmitButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !ready}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 text-white text-xs font-sans rounded hover:bg-cyan-800 disabled:opacity-60 transition-colors"
    >
      <Upload className="w-3 h-3" />
      {pending ? "Saving..." : "Upload stats"}
    </button>
  );
}

export function NdviUploadForm({
  projectId,
  hasExisting,
}: {
  projectId: string;
  hasExisting: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setJsonContent("");
    setFileName("");
    setPreview(null);
    setStatus("idle");
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const parsed = JSON.parse(text);
        setJsonContent(text);
        setPreview({
          count: parsed.count ?? 0,
          mean: parsed.mean ?? 0,
          concern_zone_pct: parsed.concern_zone_pct ?? 0,
        });
        setStatus("idle");
      } catch {
        setStatus("err");
        setErrMsg("Could not parse JSON — make sure this is ndvi_statistics.json");
        setJsonContent("");
        setPreview(null);
      }
    };
    reader.readAsText(file);
  }

  async function handleSubmit(formData: FormData) {
    const result = await uploadNdviStats(formData);
    if (result?.error) {
      setStatus("err");
      setErrMsg(result.error);
    } else {
      setStatus("ok");
      resetForm();
      setTimeout(() => setOpen(false), 1200);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <button
          className={`flex items-center gap-1 font-sans text-xs px-2.5 py-1 rounded border transition-colors ${
            hasExisting
              ? "border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Upload className="w-3 h-3" />
          {hasExisting ? "Update NDVI" : "Upload NDVI"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-semibold text-slate-900">
            {hasExisting ? "Update NDVI stats" : "Upload NDVI stats"}
          </DialogTitle>
        </DialogHeader>

        {status === "ok" && (
          <div className="flex items-center gap-2 text-green-700 text-xs font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            NDVI stats saved. Client Analytics tab is now live.
          </div>
        )}
        {status === "err" && (
          <div className="flex items-center gap-2 text-red-600 text-xs font-sans">
            <AlertCircle className="w-3.5 h-3.5" />
            {errMsg}
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="ndvi_json" value={jsonContent} />

          <div>
            <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
              Flight date (optional)
            </label>
            <input
              type="date"
              name="captured_at"
              className="font-sans text-xs border border-slate-200 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
              ndvi_statistics.json
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!fileName ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-cyan-300 hover:bg-cyan-50 transition-colors"
              >
                <FileJson className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="font-sans text-xs text-slate-500">Click to select file</p>
                <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                  data/processed/ndvi_statistics.json
                </p>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 bg-cyan-50 border border-cyan-100 rounded px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileJson className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    <span className="font-mono text-[11px] text-cyan-800 truncate">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-cyan-400 hover:text-red-400 flex-shrink-0 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {preview && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-center">
                      <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Pixels</p>
                      <p className="font-mono text-xs font-semibold text-slate-700 mt-0.5">
                        {preview.count.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-center">
                      <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Mean NDVI</p>
                      <p className="font-mono text-xs font-semibold text-slate-700 mt-0.5">
                        {preview.mean.toFixed(3)}
                      </p>
                    </div>
                    <div className={`border rounded px-2 py-1.5 text-center ${preview.concern_zone_pct > 10 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                      <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Concern</p>
                      <p className={`font-mono text-xs font-semibold mt-0.5 ${preview.concern_zone_pct > 10 ? "text-red-600" : "text-slate-700"}`}>
                        {preview.concern_zone_pct.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-sans text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <SubmitButton ready={!!jsonContent} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
