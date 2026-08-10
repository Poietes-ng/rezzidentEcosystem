import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";

export const Route = createFileRoute("/app/login")({
  component: LoginScreen,
});

function LoginScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <Link to="/app/welcome" className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
          <span className="material-symbols-outlined text-[20px] text-actionDark">arrow_back</span>
        </Link>
        <h1 className="mb-2 font-dmsans text-heading-1 text-actionDark">Welcome back</h1>
        <p className="font-dmsans text-body-base text-gray-500">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-4">
        <div className="mb-6">
          <label className="mb-2 block font-dmsans text-label text-actionDark">Email Address</label>
          <Input type="email" placeholder="e.g. name@example.com" />
        </div>

        <div className="mb-8">
          <label className="mb-2 block font-dmsans text-label text-actionDark">Password</label>
          <Input type="password" placeholder="••••••••" />
          <div className="mt-4 text-right">
            <Link to="/app/forgot-password" className="font-dmsans text-body-small font-medium text-actionDark hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 pb-8">
        <Button variant="default" className="mb-4 w-full">
          Sign In
        </Button>
        <p className="text-center font-dmsans text-body-small text-gray-500">
          Don't have an account?{" "}
          <Link to="/app/welcome" className="font-medium text-actionDark underline decoration-gray-300 underline-offset-4 hover:decoration-actionDark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
