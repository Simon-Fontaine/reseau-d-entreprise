import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    id: 1,
    title: "Introduction to English",
    description:
      "Learn the basics: alphabet, pronunciation, and simple greetings",
    level: "Beginner",
    duration: "2 weeks",
    lessons: 8,
  },
  {
    id: 2,
    title: "Essential Grammar",
    description: "Master fundamental grammar rules and sentence structure",
    level: "Beginner",
    duration: "4 weeks",
    lessons: 16,
  },
  {
    id: 3,
    title: "Everyday Conversations",
    description: "Practice common phrases and daily communication scenarios",
    level: "Beginner",
    duration: "3 weeks",
    lessons: 12,
  },
  {
    id: 4,
    title: "Intermediate Grammar",
    description:
      "Explore complex tenses, conditionals, and advanced structures",
    level: "Intermediate",
    duration: "6 weeks",
    lessons: 20,
  },
  {
    id: 5,
    title: "Business English",
    description: "Professional vocabulary and workplace communication skills",
    level: "Intermediate",
    duration: "4 weeks",
    lessons: 16,
  },
  {
    id: 6,
    title: "Academic English",
    description: "Writing essays, research papers, and formal presentations",
    level: "Intermediate",
    duration: "5 weeks",
    lessons: 18,
  },
  {
    id: 7,
    title: "Advanced Conversation",
    description: "Debate, discuss abstract topics, and express complex ideas",
    level: "Advanced",
    duration: "4 weeks",
    lessons: 14,
  },
  {
    id: 8,
    title: "Literature & Culture",
    description: "Analyze English literature and explore Anglophone cultures",
    level: "Advanced",
    duration: "6 weeks",
    lessons: 16,
  },
];

const tutors = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialization: "Grammar & Writing",
    experience: "12 years",
    nationality: "🇺🇸",
  },
  {
    id: 2,
    name: "James Smith",
    specialization: "Business English",
    experience: "10 years",
    nationality: "🇬🇧",
  },
  {
    id: 3,
    name: "Emma Thompson",
    specialization: "Conversation & Pronunciation",
    experience: "8 years",
    nationality: "🇦🇺",
  },
  {
    id: 4,
    name: "Michael Brown",
    specialization: "TOEFL & IELTS Preparation",
    experience: "15 years",
    nationality: "🇨🇦",
  },
];

export default function EnglishCoursePage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🇬🇧</span>
            <div>
              <PageHeaderHeading>English Course</PageHeaderHeading>
              <PageHeaderDescription>
                Learn English, the most widely spoken international language in
                the world
              </PageHeaderDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline">📚 120 lessons</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">👨‍🏫 15 tutors</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">⏱️ 6-12 months</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">🎓 Beginner to Advanced</Badge>
            </div>
          </div>
        </Container>
      </PageHeader>

      <Container className="py-8">
        <div className="space-y-12">
          {/* Course Modules */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Course Modules</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">
                        Module {module.id}: {module.title}
                      </CardTitle>
                      <Badge variant="secondary">{module.level}</Badge>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⏱️ {module.duration}</span>
                      <span>📚 {module.lessons} lessons</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tutors */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Tutors</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tutors.map((tutor) => (
                <Card
                  key={tutor.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{tutor.nationality}</span>
                      <div>
                        <CardTitle className="text-base">
                          {tutor.name}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="font-medium text-foreground">
                        {tutor.specialization}
                      </div>
                      <div className="text-xs">
                        {tutor.experience} of experience
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Course Benefits */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Why Learn English?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    Global Communication
                  </CardTitle>
                  <CardDescription>
                    Communicate with over 1.5 billion English speakers worldwide
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    Career Opportunities
                  </CardTitle>
                  <CardDescription>
                    Open doors to international job markets and career
                    advancement
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    Academic Excellence
                  </CardTitle>
                  <CardDescription>
                    Access top universities and academic resources around the
                    world
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    Entertainment
                  </CardTitle>
                  <CardDescription>
                    Enjoy movies, books, music, and media in their original form
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">✈️</span>
                    Travel & Culture
                  </CardTitle>
                  <CardDescription>
                    Navigate the world with ease and connect with diverse
                    cultures
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💻</span>
                    Technology & Internet
                  </CardTitle>
                  <CardDescription>
                    Master the language of technology, programming, and the
                    internet
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </Container>
    </Page>
  );
}
