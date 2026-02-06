"use client";

import { useRouter } from "next/navigation";
import { Container, Page } from "@/components/layouts/page";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <Page className="items-center justify-center">
      <Container className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="bg-gradient-to-b from-primary/80 to-primary/20 bg-clip-text text-[8rem] font-extrabold leading-none text-transparent md:text-[10rem]">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Something&apos;s missing
          </h2>
          <p className="text-muted-foreground">
            Sorry, the page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => router.back()} size="lg">
            Go back
          </Button>
          <Button onClick={() => router.push("/")} size="lg" variant="ghost">
            Back to Home
          </Button>
        </div>
      </Container>
    </Page>
  );
}
