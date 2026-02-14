"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileText,
  Sparkles,
  Search,
  Shield,
  Zap,
  ArrowRight,
  Upload,
  Lightbulb,
  CheckCircle2,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import localFont from "next/font/local";

const cuteMelody = localFont({
  src: "../public/fonts/Cute Melody.otf",
  variable: "--font-cute-melody",
});

/* ────────────────────────── Navbar ────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">Luminar AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 pb-6 space-y-4">
          <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">How It Works</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          <div className="flex gap-3 pt-2">
            <Link href="/sign-in" className="flex-1"><Button variant="outline" className="w-full" size="sm">Sign In</Button></Link>
            <Link href="/sign-up" className="flex-1"><Button className="w-full" size="sm">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ────────────────────────── Hero ────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid pattern only (no glows) */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
       

        <h1 className={`${cuteMelody.className} text-6xl sm:text-7xl lg:text-8xl font-normal tracking-normal leading-[1.1] text-black`}>
          Study Smarter, <br />
          Not Harder
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload your study materials, generate interactive mind maps,
          and get AI-powered explanations — all in one beautiful workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/sign-up">
            <Button size="lg" className="text-base px-8 py-6 rounded-xl gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl">
              See Features
            </Button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          No credit card required · Free forever · Set up in 2 minutes
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── Features ────────────────────────── */
const FEATURES = [
  {
    icon: FileText,
    title: "Smart Document Upload",
    description: "Upload PDFs and DOCX files. We extract the text automatically so AI can understand your materials.",
  },
  {
    icon: Brain,
    title: "AI Mind Maps",
    description: "Generate beautiful, interactive mind maps from your study materials with a single click.",
  },
  {
    icon: Lightbulb,
    title: "Smart Explanations",
    description: "Click any concept and get AI explanations — funny, real-world, or movie analogies. Pick your style!",
  },
  {
    icon: Search,
    title: "RAG-Powered Context",
    description: "Explanations are grounded in YOUR materials using vector search, not generic AI responses.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Powered by Gemini 2.5 Flash for instant mind maps and explanations. No waiting around.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your study materials are encrypted and private. We never share or train AI on your documents.",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-primary">ace your studies</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From document upload to AI-powered visual learning — Luminar AI covers your entire study workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── How It Works ────────────────────────── */
const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Materials",
    description: "Drop your PDF or DOCX study materials into your workspace. Luminar extracts text instantly.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Generate Mind Map",
    description: "Hit 'Generate' and watch as AI transforms your documents into an interactive visual study graph.",
  },
  {
    step: "03",
    icon: Lightbulb,
    title: "Learn with AI",
    description: "Click any concept node for personalized explanations — funny, practical, or cinematic. Your choice!",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps to{" "}
            <span className="text-primary">visual learning</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <div key={step.step} className="relative text-center space-y-4 group">
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Pricing ────────────────────────── */
const FREE_FEATURES = [
  "3 workspaces",
  "1 material upload per workspace",
  "10 AI requests per day",
  "Interactive mind maps",
  "3 explanation styles",
  "Full canvas experience",
];

function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Free to start,{" "}
            <span className="text-primary">free forever</span>
          </h2>
          <p className="text-muted-foreground">
            No hidden fees. No credit card. Just start learning.
          </p>
        </div>

        <Card className="relative overflow-hidden border-primary/30 bg-card/50 backdrop-blur-sm max-w-md mx-auto">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />

          <CardHeader className="text-center pb-2">
            <Badge className="w-fit mx-auto mb-3 bg-primary/10 text-primary border-primary/20">
              <Star className="w-3 h-3 mr-1" />
              Forever Free
            </Badge>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <CardDescription className="pt-2">
              Everything you need to supercharge your studies.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/sign-up" className="block">
              <Button className="w-full py-6 text-base rounded-xl shadow-lg shadow-primary/20">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ────────────────────────── CTA ────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to transform how you study?
        </h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Join students who are already learning smarter with AI-powered mind maps and personalized explanations.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="text-base px-10 py-6 rounded-xl gap-2 shadow-lg shadow-primary/25">
            Start Learning Now <Sparkles className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────────── Footer ────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Luminar AI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Luminar AI. Built for students, by students.
        </p>
        <div className="flex gap-6">
          <Link href="/sign-in" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/sign-up" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────── Main Export ────────────────────────── */
export function LandingPage() {
  return (
    <div className={`${cuteMelody.variable} min-h-screen text-foreground dark relative`}>
      {/* Global Background Image (Clear) */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
        <img 
          src="/images/bg-t.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-100"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
