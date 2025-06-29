import UserLogin from "@/app/(auth)/login/_components/login";

import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <div className=" w-full h-auto  rounded-md p-3">
      <Suspense fallback="Loading... On update">
        <UserLogin />
      </Suspense>
    </div>
  );
}
