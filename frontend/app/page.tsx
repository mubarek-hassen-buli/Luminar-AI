import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function Page() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session) {
    redirect("/workspaces");
  }

  // If not logged in, we'll eventually have a landing page here.
  // For now, redirect to sign-in to get the user into the flow.
  redirect("/sign-in");
}