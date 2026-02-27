import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create account | Groundtruth Labs",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
