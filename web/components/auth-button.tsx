"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Button variant="outline" onClick={() => signOut()}>
        <LogOut className="size-4" />
        Logout
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button variant="outline">
        <LogIn className="size-4" />
        Login
      </Button>
    </Link>
  );
}
