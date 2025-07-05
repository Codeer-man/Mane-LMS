"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Session, User } from "better-auth";
import { useEffect, useState } from "react";
import DropDownBtn from "./dropdownbtn";
import { useRouter } from "next/navigation";

type sessionProps = {
  user: User;
  session: Session;
};

export default function AuthBtn() {
  const router = useRouter();
  const [session, setSession] = useState<sessionProps | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSession();
  }, []);

  return (
    <div>
      {session && session.user ? (
        <>
          <DropDownBtn user={session?.user} />
        </>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </div>
  );
}
