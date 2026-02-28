"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ImageIcon, CheckCircle2, AlertCircle, X } from "lucide-react";
import { uploadFigures } from "@/app/admin/projects/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || count === 0}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 text-white text-xs font-sans rounded hover:bg-cyan-800 disabled:opacity-60 transition-colors"
    >
      <ImageIcon className="w-3 h-3" />
      {pending ? "Uploading…" : `Upload ${count} figure${count !== 1 ? "s" : ""}`}
    </button>
  );
}

function labelFromFilename(name: string) {
  return (
    name
      .replace(/\.(png|jpg|jpeg|webp)$/i, "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || "Figure"
  );
}

export function FiguresUploadForm({
  projectId,
  figureCount,
}: {
  projectId: string;
  figureCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [labels, setLabels] = useState<Record<number, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setSelectedFiles([]);
    setLabels({});
    setStatus("idle");
    formRef.current?.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(formData: FormData) {
    selectedFiles.forEach((f, i) => {
      formData.append("files", f);
      formData.append("labels", labels[i] ?? labelFromFilename(f.name));
    });
    const result = await uploadFigures(formData);
    if (result?.error) {
      setStatus("err");
      setErrMsg(result.error);
    } else {
      setStatus("ok");
      resetForm();
      setTimeout(() => setOpen(false), 1200);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
    const initLabels: Record<number, string> = {};
    files.forEach((f, i) => {
      initLabels[i] = labelFromFilename(f.name);
    });
    setLabels(initLabels);
    setStatus("idle");
  }

  function removeFile(idx: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setLabels((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < idx) next[ki] = v;
        else if (ki > idx) next[ki - 1] = v;
      });
      return next;
    });
  }

  const hasExisting = figureCount > 0;

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
          <ImageIcon className="w-3 h-3" />
          {hasExisting ? `Figures (${figureCount})` : "Upload Figures"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-semibold text-slate-900">
            Upload figures
          </DialogTitle>
        </DialogHeader>

        {status === "ok" && (
          <div className="flex items-center gap-2 text-green-700 text-xs font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Figures uploaded. Client Deliverables tab is now updated.
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
              PNG figures from pipeline
            </label>
            <input
              ref={inputRef}
              type="file"
              name="files_native"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-cyan-300 hover:bg-cyan-50 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-slate-300 mx-auto mb-1" />
              <p className="font-sans text-xs text-slate-500">Click to select files</p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                data/processed/figures/*.png
              </p>
            </button>

            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                {selectedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded px-2 py-1.5"
                  >
                    <ImageIcon className="w-3 h-3 text-slate-300 flex-shrink-0" />
                    <input
                      type="text"
                      value={labels[i] ?? ""}
                      onChange={(e) =>
                        setLabels((prev) => ({ ...prev, [i]: e.target.value }))
                      }
                      placeholder="Label"
                      className="font-sans text-xs text-slate-700 bg-transparent border-none outline-none flex-1 min-w-0"
                    />
                    <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                      {(f.size / 1024).toFixed(0)}kb
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-slate-300 hover:text-red-400 flex-shrink-0 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
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
            <SubmitButton count={selectedFiles.length} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
