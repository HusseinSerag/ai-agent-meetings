import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/HomeView";
import { caller } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const greeting = await caller.hello({
    text: "hussein",
  });
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  return <p>{greeting.greeting}</p>;
  return <HomeView />;
}
