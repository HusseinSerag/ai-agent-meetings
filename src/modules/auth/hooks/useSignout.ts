import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function useSignout() {
  const router = useRouter();
  function signout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess() {
          router.push("/auth/sign-in");
        },
      },
    });
  }
  return signout;
}
