import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/HomeView";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }

  return <HomeView />;
}
