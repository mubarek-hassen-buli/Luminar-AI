import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { LandingPage } from "@/components/landing-page";

export default async function Page() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session) {
    redirect("/workspaces");
  }

  return <LandingPage />;
}