"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ImageIcon, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, X } from "lucide-react";
import { uploadFigures } from "@/app/admin/projects/actions";
import { motion, AnimatePresence } from "motion/react";

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || count === 0}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-sans rounded hover:bg-violet-700 disabled:opacity-60 transition-colors"
    >
      <ImageIcon className="w-3 h-3" />
      {pending ? "Uploading…" : `Upload ${count} figure${count !== 1 ? "s" : ""}`}
    </button>
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
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    // Re-attach files — formData from server action needs them injected
    selectedFiles.forEach((f) => formData.append("files", f));
    const result = await uploadFigures(formData);
    if (result?.error) {
      setStatus("err");
      setErrMsg(result.error);
    } else {
      setStatus("ok");
      setSelectedFiles([]);
      formRef.current?.reset();
      setTimeout(() => setOpen(false), 1500);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
    setStatus("idle");
  }

  function removeFile(idx: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  const hasExisting = figureCount > 0;

  return (
    <div>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setStatus("idle");
        }}
        className={`flex items-center gap-1 font-sans text-xs px-2.5 py-1 rounded border transition-colors ${
          hasExisting
            ? "border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <ImageIcon className="w-3 h-3" />
        {hasExisting ? `Figures (${figureCount})` : "Upload Figures"}
        {open ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="figures-panel"
            className="border border-slate-200 rounded bg-white p-4 space-y-3 shadow-sm overflow-hidden"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
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

            <form ref={formRef} action={handleSubmit} className="space-y-3">
              <input type="hidden" name="project_id" value={projectId} />

              <div>
                <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                  Flight date (optional)
                </label>
                <input
                  type="date"
                  name="captured_at"
                  className="font-sans text-xs border border-slate-200 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                  PNG figures from pipeline
                </label>
                {/* Hidden native file input */}
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
                  className="w-full border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-violet-300 hover:bg-violet-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                  <p className="font-sans text-xs text-slate-500">
                    Click to select files
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                    data/processed/figures/*.png
                  </p>
                </button>

                {/* Selected files list */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                    {selectedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded px-2 py-1"
                      >
                        <span className="font-mono text-[10px] text-slate-600 truncate">
                          {f.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                          {(f.size / 1024).toFixed(0)}kb
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-slate-300 hover:text-red-400 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
