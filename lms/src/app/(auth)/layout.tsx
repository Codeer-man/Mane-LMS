import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login to your account",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user) {
    return redirect("/");
  }

  return (
    <div>
      <Image
        src={"/images/auth/img-lg.jpg"}
        alt="bg-image"
        fill
        className="relative  inset-0 object-cover"
      />

      <div className="bg-black/50 absolute z-10 inset-0" />

      <div className="flex items-center lg:flex-row flex-col-reverse  gap-5 justify-center lg:justify-around  w-ful h-screen  ">
        <div className="relative z-20 ">
          <div className="px-3">{children} </div>
        </div>
        <div className=" transition-all text-3xl flex items-center justify-center relative z-10">
          Logo <span className="hover:text-gray-300"> Mane LMS</span>
        </div>
      </div>
      <Link
        href={"/"}
        className="absolute z-20 top-6 right-10 flex  gap-2 border border-black bg-black px-2 py-2 rounded-sm
            hover:bg-black/60 hover:text-slate
          "
      >
        <ArrowLeft /> Go Back
      </Link>
    </div>
  );
}
