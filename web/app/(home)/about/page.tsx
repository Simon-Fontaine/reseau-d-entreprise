import {
  Container,
  Page,
  PageHeader,
  PageHeaderHeading,
} from "@/components/layouts/page";

export default function AboutPage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>Welcome to the About Page</PageHeaderHeading>
        </Container>
      </PageHeader>
    </Page>
  );
}
