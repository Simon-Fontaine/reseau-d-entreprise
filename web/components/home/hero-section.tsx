import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center px-4 md:px-6">
        <Badge variant="secondary" className="mb-6 backdrop-blur-sm">
          <Sparkles className="mr-2 h-3.5 w-3.5 fill-primary text-primary" />
          New courses available
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Master the Art of <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Advanced Yapping
          </span>
        </h1>

        <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          Join the world&apos;s most prestigious academy for professional
          conversationalists. Learn from expert tutors and level up your social
          skills today.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button size="lg" className="h-12 min-w-[160px] text-base" asChild>
            <Link href="/courses">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 min-w-[160px] text-base"
            asChild
          >
            <Link href="/about">How it works</Link>
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute left-[20%] top-0 -z-10 h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute right-[20%] top-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500/20 blur-[100px]" />
    </section>
  );
}
