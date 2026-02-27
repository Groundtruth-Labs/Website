"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { createProject } from "@/app/admin/projects/actions";
import { motion, AnimatePresence } from "motion/react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-cyan-700 text-white text-sm font-sans rounded hover:bg-cyan-800 disabled:opacity-60 transition-colors"
    >
      {pending ? "Creating..." : "Create project"}
    </button>
  );
}

export function CreateProjectForm({
  clients,
}: {
  clients: { id: string; company_name: string | null; contact_name: string | null; is_admin?: boolean | null }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createProject(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
      formRef.current?.reset();
      setError("");
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-cyan-700 text-white text-sm font-sans rounded hover:bg-cyan-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New project
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="bg-white rounded border border-slate-200 shadow-lg w-full max-w-md"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold text-slate-900">
                  New project
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form ref={formRef} action={handleSubmit} className="px-6 py-5 space-y-4">
                {error && (
                  <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {error}
                  </p>
                )}

                <div>
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                    Client *
                  </label>
                  <select
                    name="client_id"
                    required
                    className="font-sans text-sm border border-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700 bg-white"
                  >
                    <option value="">Select a client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name ?? c.contact_name ?? "Unnamed client"}
                        {c.is_admin ? " (admin)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                    Project name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. North Field NDVI, Spring 2026"
                    className="font-sans text-sm border border-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    required
                    className="font-sans text-sm border border-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700 bg-white"
                  >
                    <option value="">Select type...</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="construction">Construction</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Maui, HI"
                    className="font-sans text-sm border border-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="font-sans text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <SubmitButton />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
