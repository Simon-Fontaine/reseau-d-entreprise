import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TeamMember = {
  name: string;
  role: string;
  avatar: string;
};

type TeamSectionProps = {
  members: TeamMember[];
};

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter">Meet the Team</h2>
        <p className="text-muted-foreground">The people behind the platform.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => (
          <Card
            key={`${member.name}-${index}`}
            className="overflow-hidden transition-all hover:bg-muted/50 text-left"
          >
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={member.avatar}
                  alt={`Avatar of ${member.name}`}
                  className="object-cover"
                />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium">
                  {member.role}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
