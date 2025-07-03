import React from "react";
import NavBar from "./_components/nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
