import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { UserNav } from "@/components/workspace/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border/50">
              <img src="/images/log.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">Luminar AI</span>
          </div>
          <div className="flex items-center gap-4">
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
