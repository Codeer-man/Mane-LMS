import { ThemeToggle } from "@/components/ui/Toggle-Theme";
import Link from "next/link";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import AuthBtn from "./authbtn";

const navlink = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/admin/courses",
  },
  {
    name: "Dashboard",
    href: "/admin",
  },
];

export default function Navbar() {
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
                className={`  font-medium text-xl hover:underline `}
                key={link.name}
              >
                <Link href={link.href}>{link.name} </Link>
              </div>
            ))}
          </div>
          {/* theme and logo */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Suspense fallback={<Loader2 className="animate-spin" size={24} />}>
              <AuthBtn />
            </Suspense>
          </div>
        </div>
      </section>
    </nav>
  );
}
