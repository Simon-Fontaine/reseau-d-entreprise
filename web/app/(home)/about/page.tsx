import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const teamMembers = [
  {
    name: "Hippolyte",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Hippolyte",
  },
  {
    name: "Thibault",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thibault",
  },
  {
    name: "Simon",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Simon",
  },
  {
    name: "Thomas",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas",
  },
  {
    name: "Pierre-Alexandre",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Pierre-Alexandre",
  },
  {
    name: "Guillaume",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Guillaume",
  },
  {
    name: "Théo",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Theo",
  },
  {
    name: "Akbar",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Akbar",
  },
  {
    name: "Bastien",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Bastien",
  },
  {
    name: "Thomas",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas-2",
  },
  {
    name: "Arnaud",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Arnaud",
  },
  {
    name: "Denis",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Denis",
  },
  {
    name: "Tristan",
    role: "Team Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Tristan",
  },
];
export default function AboutPage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>About Us</PageHeaderHeading>
          <PageHeaderDescription>
            We are a team of passionate language teachers and developers who
            have come together to help motivated people improve their ability to
            speak, read, and write foreign languages.
          </PageHeaderDescription>
        </Container>
      </PageHeader>
      <Container>
        <section className="py-10">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card
                key={`${member.name}-${index}`}
                className="h-full border border-border/60 bg-card/90 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader className="items-center text-center py-6">
                  <div className="flex w-full justify-center">
                    <Avatar className="size-24 shadow-sm sm:size-28 md:size-32">
                      <AvatarImage
                        src={member.avatar}
                        alt={`Avatar of ${member.name}`}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-4 space-y-1">
                    <CardTitle className="text-lg sm:text-xl">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {member.role}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </Page>
  );
}
