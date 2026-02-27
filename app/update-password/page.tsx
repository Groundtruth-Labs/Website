import { Suspense } from "react";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded shadow-sm p-8">
        <Suspense>
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
