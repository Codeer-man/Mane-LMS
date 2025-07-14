import { buttonVariants } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotAdmin() {
  return (
    <div className="w-auto h-screen  flex items-center justify-center">
      <div className=" border-2 rounded-md  py-10 px-64 flex flex-col items-center gap-5">
        <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
          <ShieldX className=" size-16 text-destructive" />{" "}
        </div>
        <h1>Restricted Area</h1>

        <Link className={buttonVariants()} href={"/"}>
          Go to home
        </Link>
      </div>
    </div>
  );
}
