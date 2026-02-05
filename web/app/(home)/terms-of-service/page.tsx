import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";

export default function TermsOfServicePage() {
  return (
    <Page>
      <Container>
        <PageHeader className="mb-8">
          <PageHeaderHeading>Terms of Service</PageHeaderHeading>
          <PageHeaderDescription>
            Last Updated: February 2026
          </PageHeaderDescription>
        </PageHeader>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p className="leading-7 text-muted-foreground">
              By accessing or using this open-source eLearning platform ("the
              Application"), you agree to be bound by these Terms of Service. If
              you disagree with any part of these terms, you may not use the
              Application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              2. Description of Service
            </h2>
            <p className="leading-7 text-muted-foreground">
              The Application is a non-commercial, educational platform designed
              to facilitate learning and tutoring. It is provided on an "as is"
              and "as available" basis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              3. Account Responsibility
            </h2>
            <p className="leading-7 text-muted-foreground">
              To access certain features, you must create an account. You agree
              to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                Provide accurate and complete information during registration.
              </li>
              <li>Maintain the confidentiality of your account credentials.</li>
              <li>
                Notify the administrators immediately of any unauthorized use of
                your account.
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground">
              You are solely responsible for all activities that occur under
              your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              4. Acceptable Use
            </h2>
            <p className="leading-7 text-muted-foreground">
              You agree to use the Application only for lawful purposes and in a
              way that does not infringe the rights of others.
            </p>
            <p className="leading-7 text-muted-foreground">
              <strong>Prohibited activities include:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Harassing, abusing, or threatening other users.</li>
              <li>Posting content that is hateful, offensive, or illegal.</li>
              <li>
                Attempting to compromise the security or integrity of the
                Application.
              </li>
              <li>
                Using the Application for any commercial solicitation or spam.
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground">
              The administrators reserve the right to suspend or terminate
              accounts that violate these rules without prior notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              5. Intellectual Property
            </h2>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Open Source License:</strong> The source code of this
                Application is open source. Please refer to the project's
                license file (e.g., MIT, GNU GPL) for usage rights regarding the
                code.
              </li>
              <li>
                <strong>User Content:</strong> You retain ownership of the
                content (messages, course materials) you create. By posting
                content, you grant the Application a license to display and
                store it solely for the purpose of providing the service.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              6. Disclaimer of Warranties
            </h2>
            <p className="leading-7 text-muted-foreground">
              This Application is provided <strong>free of charge</strong> for
              educational purposes.
            </p>
            <div className="rounded-md border bg-muted p-4 text-muted-foreground">
              TO THE EXTENT PERMITTED BY LAW, THE APPLICATION IS PROVIDED
              WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY
              OR FITNESS FOR A PARTICULAR PURPOSE.
            </div>
            <p className="leading-7 text-muted-foreground">
              We do not guarantee that the Application will be error-free,
              secure, or invariably available.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              7. Limitation of Liability
            </h2>
            <p className="leading-7 text-muted-foreground">
              In no event shall the project maintainers, contributors, or host
              be liable for any direct, indirect, incidental, special, or
              consequential damages arising out of:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Your use or inability to use the Application.</li>
              <li>Unauthorized access to or alteration of your data.</li>
              <li>Any other matter relating to the service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              8. Governing Law
            </h2>
            <p className="leading-7 text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of <strong>Belgium</strong>. Any disputes relating to
              these Terms shall be subject to the exclusive jurisdiction of the
              courts of Belgium.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              9. Changes to Terms
            </h2>
            <p className="leading-7 text-muted-foreground">
              We reserve the right to modify these terms at any time. Your
              continued use of the Application after any such changes
              constitutes your acceptance of the new Terms of Service.
            </p>
          </section>
        </div>
      </Container>
    </Page>
  );
}
