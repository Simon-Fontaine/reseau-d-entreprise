import { HowItWorks } from "@/components/about/how-it-works";
import { TeamSection } from "@/components/about/team-section";
import { ValuesSection } from "@/components/about/values-section";
import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";

const teamMembers = [
  {
    name: "Hippolyte",
    role: "Report Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Hippolyte",
  },
  {
    name: "Thibault",
    role: "Time & Task Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thibault",
  },
  {
    name: "Simon",
    role: "Web Services Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Simon",
  },
  {
    name: "Thomas",
    role: "Project Coordinator",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas",
  },
  {
    name: "Pierre-Alexandre",
    role: "IT Resources Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Pierre-Alexandre",
  },
  {
    name: "Guillaume",
    role: "Security Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Guillaume",
  },
  {
    name: "Théo",
    role: "Report Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Theo",
  },
  {
    name: "Akbar",
    role: "Monitoring Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Akbar",
  },
  {
    name: "Bastien",
    role: "Web Services Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Bastien",
  },
  {
    name: "Thomas",
    role: "Inter-group Communication Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Thomas-2",
  },
  {
    name: "Arnaud",
    role: "Infrastructure Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Arnaud",
  },
  {
    name: "Denis",
    role: "Infrastructure Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Denis",
  },
  {
    name: "Tristan",
    role: "Photo & Documentation Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/png?seed=Tristan",
  },
];

export default function AboutPage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>About</PageHeaderHeading>
          <PageHeaderDescription>
            Learn more about our mission, our values, and the team dedicated to
            helping you master a new language.
          </PageHeaderDescription>
        </Container>
      </PageHeader>

      <Container className="space-y-16 py-8">
        <HowItWorks />
        <ValuesSection />
        <TeamSection members={teamMembers} />
      </Container>
    </Page>
  );
}
