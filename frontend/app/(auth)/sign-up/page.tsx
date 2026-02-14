import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/20">
      <SignUpForm />
      <div className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
