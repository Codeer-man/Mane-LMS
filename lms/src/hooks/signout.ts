"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();
  const logout = async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("User Successfully LogOut");
          router.push("/login");
        },
        onError: (error) => {
          toast.error("Invalid server error");
          console.log(error.error.message);
        },
      },
    });
  };
  return logout;
}
