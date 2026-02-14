import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Luminar AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">
              {session.user.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center overflow-hidden">
               {session.user.image ? (
                 <img src={session.user.image} alt={session.user.name} />
               ) : (
                 <span className="text-xs uppercase">{session.user.name.charAt(0)}</span>
               )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
