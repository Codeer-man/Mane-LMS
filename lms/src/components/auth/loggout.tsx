"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import { Session, User } from "better-auth";

// type sessionProps = {
//   session: Session;
//   user: User;
// };

export default function Logout() {
  const router = useRouter();

  // const [session, getSession] = useState<sessionProps | null>(null);

  // useEffect(() => {
  //   async function fetchSession() {
  //     try {
  //       const { data } = await authClient.getSession();
  //       getSession(data);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Failed to get session");
  //     }
  //   }
  //   fetchSession();
  // }, []);

  async function handleLogout() {
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
  }

  return (
    <div>
      <Button variant={"ghost"} onClick={handleLogout}>
        Logout{" "}
      </Button>
    </div>
  );
}
