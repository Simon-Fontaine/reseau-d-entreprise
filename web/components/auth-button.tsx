"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Button variant="outline" onClick={() => signOut()}>
        Logout
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button variant="outline">Login</Button>
    </Link>
  );
}
