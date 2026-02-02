import Link from "next/link";
import {
  Container,
  Page,
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>Welcome to the Home Page</PageHeaderHeading>
          <PageHeaderDescription>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem
            similique fuga placeat aliquam obcaecati officia perferendis,
            corporis quaerat amet ex, sed, vel eaque minima suscipit nostrum id
            doloribus ipsum dolorem?
          </PageHeaderDescription>
          <PageActions>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </PageActions>
        </Container>
      </PageHeader>
    </Page>
  );
}
