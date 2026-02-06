import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ShowcaseSection() {
  return (
    <section className="container mx-auto py-16 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="outline">Interactive Dashboard</Badge>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything you need to <span className="text-primary">succeed</span>
        </h2>
        <p className="max-w-[42rem] text-muted-foreground md:text-xl">
          Track your progress, manage your courses, and connect with expert
          tutors—all in one place.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="group relative aspect-video overflow-hidden rounded-xl border bg-card shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
          <div className="absolute bottom-4 left-4 z-20">
            <Badge className="mb-2">Student View</Badge>
            <h3 className="font-semibold">Track Your Progress</h3>
          </div>
          <Image
            src="/image/student-overview-light.png"
            alt="Student Dashboard Light"
            fill
            className="object-cover object-top dark:hidden transition-transform duration-500 group-hover:scale-105"
          />
          <Image
            src="/image/student-overview-dark.png"
            alt="Student Dashboard Dark"
            fill
            className="hidden object-cover object-top dark:block transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="group relative aspect-video overflow-hidden rounded-xl border bg-card shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
          <div className="absolute bottom-4 left-4 z-20">
            <Badge variant="secondary" className="mb-2">
              Tutor View
            </Badge>
            <h3 className="font-semibold">Manage Your Courses</h3>
          </div>
          <Image
            src="/image/tutor-overview-light.png"
            alt="Tutor Dashboard Light"
            fill
            className="object-cover object-top dark:hidden transition-transform duration-500 group-hover:scale-105"
          />
          <Image
            src="/image/tutor-overview-dark.png"
            alt="Tutor Dashboard Dark"
            fill
            className="hidden object-cover object-top dark:block transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
