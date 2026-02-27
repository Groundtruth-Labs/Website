"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Upload, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadNdviStats } from "@/app/admin/projects/actions";
import { motion, AnimatePresence } from "motion/react";

const SAMPLE_JSON = `{
  "count": 327680,
  "mean": 0.7385,
  "median": 0.7727,
  "std": 0.1879,
  "min": -1.0,
  "max": 1.0,
  "p10": 0.6572,
  "p25": 0.7194,
  "p75": 0.8225,
  "p90": 0.8665,
  "class_pct": {
    "Severely Stressed": 3.07,
    "Stressed": 1.42,
    "Moderate": 0.51,
    "Healthy": 13.63,
    "Very Healthy": 81.37
  },
  "concern_zone_pct": 3.07
}`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-sans rounded hover:bg-green-700 disabled:opacity-60 transition-colors"
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
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await uploadNdviStats(formData);
    if (result?.error) {
      setStatus("err");
      setErrMsg(result.error);
    } else {
      setStatus("ok");
      formRef.current?.reset();
      setTimeout(() => setOpen(false), 1200);
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setStatus("idle");
        }}
        className={`flex items-center gap-1 font-sans text-xs px-2.5 py-1 rounded border transition-colors ${
          hasExisting
            ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Upload className="w-3 h-3" />
        {hasExisting ? "Update NDVI" : "Upload NDVI"}
        {open ? (
          <ChevronUp className="w-3 h-3 ml-0.5" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-0.5" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="ndvi-panel"
            className="border border-slate-200 rounded bg-white p-4 space-y-3 shadow-sm overflow-hidden"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
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

            <form ref={formRef} action={handleSubmit} className="space-y-3">
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
                  NDVI stats JSON
                </label>
                <textarea
                  name="ndvi_json"
                  required
                  rows={10}
                  placeholder={SAMPLE_JSON}
                  className="font-mono text-[11px] border border-slate-200 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700 resize-y leading-relaxed text-slate-700"
                />
                <p className="font-sans text-[10px] text-slate-400 mt-1">
                  Paste the full{" "}
                  <code className="font-mono text-slate-500">
                    ndvi_statistics.json
                  </code>{" "}
                  output from the pipeline.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-sans text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <SubmitButton />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
