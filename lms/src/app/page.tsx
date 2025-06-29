import Logout from "@/components/auth/loggout";

import { ThemeToggle } from "@/components/ui/Toggle-Theme";

export default async function Home() {
  return (
    <div>
      Home page
      <ThemeToggle />
      <Logout />
    </div>
  );
}
