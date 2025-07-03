"use client";
import { ThemeToggle } from "@/components/ui/Toggle-Theme";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import DropDownBtn from "./dropdownbtn";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Session, User } from "better-auth";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navlink = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/course",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];
type sessionProps = {
  session: Session;
  user: User;
};
export default function Navbar() {
  const [session, getSession] = useState<sessionProps | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.getSession();
        getSession(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get session");
      }
    }
    fetchSession();
  }, []);

  return (
    <nav>
      <section className="flex justify-between items-center px-4 py-6 border-b border-gray-600/50 shadow-lg ">
        {/* header  */}
        <div className="font-medium text-md">GROWTH ACCELERATION AGENCY</div>
        {/* nav linkd  */}
        <div className="flex justify-between w-[40%]  items-center">
          <div className="flex space-x-4 relative">
            {navlink.map((link) => (
              <div
                className={`${pathname === link.href ? " text-gray-400 underline" : ""}  font-medium text-xl hover:underline `}
                key={link.name}
              >
                <Link href={link.href}>{link.name} </Link>
              </div>
            ))}
          </div>
          {/* theme and logo */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <>
                <DropDownBtn user={session?.user} />
                <Loader2 className="animate-spin" size={24} />
              </>
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </div>
        </div>
      </section>
    </nav>
  );
}
