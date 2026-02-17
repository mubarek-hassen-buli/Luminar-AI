import { SignInForm } from "@/components/auth/sign-in-form";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left Side: Image & Testimonial */}
      <div className="relative hidden md:flex flex-col justify-between p-10 text-white dark:border-r overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/login.jpg"
            alt="Authentication Background"
            fill
            className="object-cover transition-all hover:scale-110 duration-1000"
            priority
          />
        </div>
        
        {/* Logo/Brand */}
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20">
            <Image src="/images/log.jpg" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-bold tracking-tight">Luminar AI</span>
        </div>

        {/* Testimonial */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4 max-w-lg">
            <p className="text-2xl font-medium leading-relaxed italic text-white/90">
              &ldquo;This tool transformed how I handle academic pressure. Generating mind maps from my complex notes feels like magic.&rdquo;
            </p>
            <footer className="text-sm">
              <div className="font-semibold text-primary">Sarah Jenkins</div>
              <div className="text-white/60">Molecular Biology Student</div>
            </footer>
          </blockquote>
        </div>

        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10" />
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-background relative overflow-hidden">
        {/* Subtle background abstract shape */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
