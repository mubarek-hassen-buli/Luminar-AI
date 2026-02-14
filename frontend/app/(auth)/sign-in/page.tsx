import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/20">
      <SignInForm />
      <div className="mt-4 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
