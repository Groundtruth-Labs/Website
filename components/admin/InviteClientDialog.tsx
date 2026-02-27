"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, X, CheckCircle2 } from "lucide-react";
import { inviteNewClient } from "@/app/admin/clients/actions";
import { motion, AnimatePresence } from "motion/react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-cyan-700 text-white text-sm font-sans rounded hover:bg-cyan-800 disabled:opacity-60 transition-colors"
    >
      {pending ? "Sending invite..." : "Send invite"}
    </button>
  );
}

export function InviteClientDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const result = await inviteNewClient(formData);
    if (result?.error) {
      setStatus("err");
      setErrMsg(result.error);
    } else {
      setStatus("ok");
      setSentEmail(email);
      formRef.current?.reset();
    }
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setErrMsg("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-sans rounded hover:bg-slate-50 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Invite client
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="invite-backdrop"
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              key="invite-modal"
              className="bg-white rounded border border-slate-200 shadow-lg w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold text-slate-900">
                  Invite new client
                </h2>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-5">
                {status === "ok" ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-sans text-sm font-medium text-green-800">
                          Invite sent to {sentEmail}
                        </p>
                        <p className="font-sans text-xs text-green-700 mt-1">
                          They&apos;ll receive an email with a link to set up
                          their account and fill in their details. If they
                          already have an account, they&apos;ll get a magic
                          link instead.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStatus("idle")}
                        className="flex-1 px-3 py-2 border border-slate-200 text-sm font-sans rounded hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        Invite another
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 px-3 py-2 bg-cyan-700 text-white text-sm font-sans rounded hover:bg-cyan-800 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <form ref={formRef} action={handleSubmit} className="space-y-4">
                    {status === "err" && (
                      <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                        {errMsg}
                      </p>
                    )}

                    <div>
                      <label className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        autoFocus
                        placeholder="client@example.com"
                        className="font-sans text-sm border border-slate-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyan-700"
                      />
                    </div>

                    <p className="font-sans text-xs text-slate-400 leading-relaxed">
                      We&apos;ll send them an invite link to set up their
                      portal account. If they&apos;re already registered,
                      they&apos;ll get a sign-in link. They&apos;ll fill in
                      company name, industry, and location when they first log
                      in.
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="font-sans text-sm text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <SubmitButton />
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
