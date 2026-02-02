"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (session?.user) {
    return (
      <Button variant="ghost" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button variant="ghost">
        <LogIn className="size-4" />
        Login
      </Button>
    </Link>
  );
}
