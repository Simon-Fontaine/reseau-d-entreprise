import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";

export default function PrivacyPolicyPage() {
  return (
    <Page>
      <Container>
        <PageHeader className="mb-8">
          <PageHeaderHeading>Privacy Policy</PageHeaderHeading>
          <PageHeaderDescription>
            Last Updated: February 2026
          </PageHeaderDescription>
        </PageHeader>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              1. Introduction
            </h2>
            <p className="leading-7 text-muted-foreground">
              Welcome to our open-source eLearning platform ("the Application").
              We are committed to protecting your personal data and respecting
              your privacy in compliance with the General Data Protection
              Regulation (GDPR).
            </p>
            <p className="leading-7 text-muted-foreground">
              This Privacy Policy explains how we collect, use, and store your
              data. By using the Application, you agree to the collection and
              use of information in accordance with this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">2. Who We Are</h2>
            <p className="leading-7 text-muted-foreground">
              The Application is a non-commercial, open-source project hosted in
              Belgium (EU). For any privacy-related questions, you can contact
              the project maintainers via the repository or designated contact
              channel.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              3. Data We Collect
            </h2>
            <p className="leading-7 text-muted-foreground">
              We adhere to the principle of <strong>data minimization</strong>{" "}
              and only collect data strictly necessary for the Application's
              functionality.
            </p>

            <h3 className="text-xl font-semibold tracking-tight">
              3.1. Personal Data You Provide
            </h3>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Account Information:</strong> Full name, email address,
                password (stored securely as a hash), and account role
                (Student/Tutor).
              </li>
              <li>
                <strong>Profile Information:</strong> Bio (optional).
              </li>
              <li>
                <strong>User Content:</strong> Messages sent via the chat
                feature.
              </li>
            </ul>

            <h3 className="text-xl font-semibold tracking-tight">
              3.2. Data Collected Automatically
            </h3>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Learning Progress:</strong> Course enrollments, chapter
                completion status, quiz attempts, and scores.
              </li>
              <li>
                <strong>Technical Data:</strong> Essential cookies required for
                session management and security (see Cookie Policy).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              4. How We Use Your Data
            </h2>
            <p className="leading-7 text-muted-foreground">
              Your data is used solely to provide and improve the educational
              service:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Account Management:</strong> To create and manage your
                user account.
              </li>
              <li>
                <strong>Progress Tracking:</strong> To track and display your
                course progress and grades.
              </li>
              <li>
                <strong>Communication:</strong> To facilitate communication
                between students and tutors via the internal chat.
              </li>
              <li>
                <strong>Security:</strong> To protect user accounts and
                preventing abuse.
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground">
              <strong>We do NOT:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Sell, trade, or rent your personal data.</li>
              <li>Use your data for marketing or advertising purposes.</li>
              <li>Share your data with third parties.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              5. Data Storage and Transfers
            </h2>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Location:</strong> All data is stored on servers located
                in <strong>Belgium (European Union)</strong>.
              </li>
              <li>
                <strong>No International Transfers:</strong> Your data never
                leaves the European Economic Area (EEA).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              6. How Long We Keep Your Data
            </h2>
            <p className="leading-7 text-muted-foreground">
              We retain your personal data only as long as your account is
              active.
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Account Data:</strong> Retained until you request
                account deletion.
              </li>
              <li>
                <strong>Chat Messages:</strong> Stored to provide conversation
                history within the application.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">7. Security</h2>
            <p className="leading-7 text-muted-foreground">
              We implement robust technical measures to protect your data:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Password Security:</strong> Passwords are never stored
                in plain text. We use <strong>Argon2</strong>, a
                state-of-the-art hashing algorithm.
              </li>
              <li>
                <strong>Access Control:</strong> Data access is strictly
                restricted based on user roles (Student/Tutor/Admin).
              </li>
              <li>
                <strong>Network Security:</strong> All traffic is encrypted via
                standard web protocols (HTTPS).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              8. Your Rights (GDPR)
            </h2>
            <p className="leading-7 text-muted-foreground">
              Under the GDPR, you have the following rights:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Right of Access:</strong> You can request a copy of the
                personal data we hold about you.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You can update your
                profile information directly within the Application settings.
              </li>
              <li>
                <strong>Right to Erasure ("Right to be Forgotten"):</strong> You
                can request the deletion of your account and all associated
                data.
              </li>
              <li>
                <strong>Right to Restriction of Processing:</strong> You can ask
                us to suspend the processing of your personal data.
              </li>
            </ul>
            <p className="leading-7 text-muted-foreground">
              To exercise these rights, please contact the administrators.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              9. Changes to This Policy
            </h2>
            <p className="leading-7 text-muted-foreground">
              As this is an open-source project, this policy may be updated to
              reflect technical changes. We will notify users of any significant
              changes.
            </p>
          </section>
        </div>
      </Container>
    </Page>
  );
}
