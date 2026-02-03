import Link from "next/link";
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

const courses = [
  {
    id: "english",
    name: "English",
    nameEnglish: "English",
    description:
      "Learn English, the most widely spoken international language in the world",
    level: "Beginner to Advanced",
    lessons: 120,
    tutors: 15,
    flag: "🇬🇧",
  },
  {
    id: "french",
    name: "French",
    nameEnglish: "French",
    description:
      "Master the language of Molière and discover Francophone culture",
    level: "Beginner to Advanced",
    lessons: 95,
    tutors: 12,
    flag: "🇫🇷",
  },
  {
    id: "german",
    name: "German",
    nameEnglish: "German",
    description: "Discover the German language and the richness of its culture",
    level: "Beginner to Intermediate",
    lessons: 80,
    tutors: 8,
    flag: "🇩🇪",
  },
  {
    id: "spanish",
    name: "Spanish",
    nameEnglish: "Spanish",
    description: "Learn Spanish and explore Hispanic culture",
    level: "Beginner to Advanced",
    lessons: 110,
    tutors: 14,
    flag: "🇪🇸",
  },
  {
    id: "italian",
    name: "Italian",
    nameEnglish: "Italian",
    description: "Dive into the Italian language and its fascinating culture",
    level: "Beginner to Intermediate",
    lessons: 75,
    tutors: 7,
    flag: "🇮🇹",
  },
  {
    id: "portuguese",
    name: "Portuguese",
    nameEnglish: "Portuguese",
    description: "Discover Portuguese and Lusophone and Brazilian cultures",
    level: "Beginner to Intermediate",
    lessons: 70,
    tutors: 6,
    flag: "🇵🇹",
  },
  {
    id: "chinese",
    name: "Chinese",
    nameEnglish: "Chinese",
    description: "Learn Mandarin and ancient Chinese culture",
    level: "Beginner",
    lessons: 90,
    tutors: 10,
    flag: "🇨🇳",
  },
  {
    id: "japanese",
    name: "Japanese",
    nameEnglish: "Japanese",
    description: "Learn Japanese and immerse yourself in Japanese culture",
    level: "Beginner to Intermediate",
    lessons: 85,
    tutors: 9,
    flag: "🇯🇵",
  },
  {
    id: "korean",
    name: "Korean",
    nameEnglish: "Korean",
    description: "Discover Korean and modern K-culture",
    level: "Beginner",
    lessons: 65,
    tutors: 8,
    flag: "🇰🇷",
  },
  {
    id: "arabic",
    name: "Arabic",
    nameEnglish: "Arabic",
    description: "Learn Arabic and explore the richness of Arab culture",
    level: "Beginner",
    lessons: 70,
    tutors: 6,
    flag: "🇸🇦",
  },
  {
    id: "russian",
    name: "Russian",
    nameEnglish: "Russian",
    description: "Master Russian and discover Slavic culture",
    level: "Beginner to Intermediate",
    lessons: 75,
    tutors: 7,
    flag: "🇷🇺",
  },
  {
    id: "dutch",
    name: "Dutch",
    nameEnglish: "Dutch",
    description: "Learn Dutch and the culture of the Netherlands",
    level: "Beginner",
    lessons: 55,
    tutors: 5,
    flag: "🇳🇱",
  },
  {
    id: "esperanto",
    name: "Esperanto",
    nameEnglish: "Esperanto",
    description: "Discover Esperanto, the international auxiliary language",
    level: "Beginner",
    lessons: 30,
    tutors: 2,
    flag: "🟢",
  },
  {
    id: "santali",
    name: "Santali",
    nameEnglish: "Santali",
    description: "Learn Santali, an indigenous language of Eastern India",
    level: "Beginner",
    lessons: 20,
    tutors: 1,
    flag: "🇮🇳",
  },
  {
    id: "filipino",
    name: "Filipino",
    nameEnglish: "Filipino",
    description: "Learn Filipino and discover Philippine culture",
    level: "Beginner to Intermediate",
    lessons: 60,
    tutors: 5,
    flag: "🇵🇭",
  },
  {
    id: "emoji",
    name: "Emoji",
    nameEnglish: "Emoji",
    description: "Master visual communication through emojis and pictograms",
    level: "Beginner",
    lessons: 15,
    tutors: 1,
    flag: "😀",
  },
  {
    id: "latin",
    name: "Latin",
    nameEnglish: "Latin",
    description: "Discover Latin, the ancient language of the Roman Empire",
    level: "Beginner to Intermediate",
    lessons: 50,
    tutors: 4,
    flag: "🏛️",
  },
  {
    id: "klingon",
    name: "Klingon",
    nameEnglish: "Klingon",
    description: "Learn Klingon, the constructed language from Star Trek",
    level: "Beginner",
    lessons: 25,
    tutors: 2,
    flag: "🖖",
  },
];

export default function CoursesPage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>Our Language Courses</PageHeaderHeading>
          <PageHeaderDescription>
            Choose from our selection of language courses and start your
            learning journey today. All our courses are designed to guide you
            from beginner to advanced level.
          </PageHeaderDescription>
        </Container>
      </PageHeader>

      <Container className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group transition-transform hover:scale-105"
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-5xl" aria-label={course.nameEnglish}>
                      {course.flag}
                    </span>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>📚 {course.lessons} lessons</span>
                    <span>👨‍🏫 {course.tutors} tutors</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Page>
  );
}
