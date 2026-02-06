import {
  BookOpen,
  Globe,
  MessageSquare,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Expert Tutors",
    description:
      "Learn from the best. Our tutors are certified professionals in the art of yapping.",
    icon: Users,
  },
  {
    name: "Interactive Courses",
    description:
      "Engage with dynamic content, quizzes, and real-time feedback to master every topic.",
    icon: BookOpen,
  },
  {
    name: "Real-time Chat",
    description:
      "Connect instantly with tutors and peers. Practice your skills in real conversations.",
    icon: MessageSquare,
  },
  {
    name: "Global Community",
    description:
      "Join students from around the world. Exchange cultural insights and make new friends.",
    icon: Globe,
  },
  {
    name: "Progress Tracking",
    description:
      "Visualize your journey. Earn badges and certificates as you complete courses.",
    icon: Trophy,
  },
  {
    name: "Instant Access",
    description:
      "Start learning immediately. No waiting lists, no complex enrollment forms.",
    icon: Zap,
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose the Academy?
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            We provide the tools you need to become a master conversationalist.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, _i) => (
            <div
              key={feature.name}
              className="group relative rounded-2xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
