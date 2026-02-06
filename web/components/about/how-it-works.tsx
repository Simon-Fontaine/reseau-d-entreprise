import { BookOpen, CheckCircle, Search, UserPlus } from "lucide-react";

const steps = [
  {
    title: "Register",
    description:
      "Join the academy. Set up your profile to access the student or tutor dashboard.",
    icon: UserPlus,
  },
  {
    title: "Browse Courses",
    description:
      "Explore our catalog of language courses designed by expert tutors.",
    icon: Search,
  },
  {
    title: "Start Learning",
    description:
      "Access course chapters, complete assignments, and master new skills at your own pace.",
    icon: BookOpen,
  },
  {
    title: "Track Progress",
    description:
      "Monitor your advancement through the dashboard and keep track of completed courses.",
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
          How it Works
        </h2>
        <p className="mt-2 text-muted-foreground md:text-lg max-w-2xl">
          Your journey to fluency is simple. Here is how you can get started in
          just a few steps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative flex flex-col items-start text-left"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
              <step.icon className="h-7 w-7" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold tracking-tight">
                  {step.title}
                </h3>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
