import { GraduationCapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container mx-auto flex flex-col items-center text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <GraduationCapIcon className="h-8 w-8" />
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to Start Yapping?
        </h2>
        <p className="mb-8 max-w-[42rem] text-muted-foreground md:text-xl">
          Join thousands of students who have transformed their communication
          skills. Your journey to mastery begins here.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="h-12 min-w-[160px] text-base" asChild>
            <Link href="/register">Join Now</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 min-w-[160px] text-base bg-background"
            asChild
          >
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
