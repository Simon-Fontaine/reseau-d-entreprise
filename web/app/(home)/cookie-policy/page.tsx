import {
  Container,
  Page,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/page";

export default function CookiePolicyPage() {
  return (
    <Page>
      <Container>
        <PageHeader className="mb-8">
          <PageHeaderHeading>Cookie Policy</PageHeaderHeading>
          <PageHeaderDescription>
            Last Updated: February 2026
          </PageHeaderDescription>
        </PageHeader>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              1. What Are Cookies?
            </h2>
            <p className="leading-7 text-muted-foreground">
              Cookies are small text files that are stored on your device
              (computer or mobile) when you visit a website. They help the
              website function properly and recognize you when you return.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              2. Types of Cookies We Use
            </h2>
            <p className="leading-7 text-muted-foreground">
              We use <strong>Strictly Necessary Cookies</strong> only. These
              cookies are essential for the operation of the Application
              securely and correctly. Without them, you would not be able to log
              in or use the core features.
            </p>
            <p className="leading-7 text-muted-foreground">
              <strong>We do NOT use:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Analytics cookies (e.g., Google Analytics).</li>
              <li>Marketing or tracking cookies.</li>
              <li>Third-party advertising cookies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              3. List of Cookies
            </h2>
            <p className="leading-7 text-muted-foreground">
              Below is a list of the cookies set by our Application:
            </p>
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="m-0 border-t p-0 even:bg-muted">
                    <th className="border px-4 py-2 font-bold">Cookie Name</th>
                    <th className="border px-4 py-2 font-bold">Purpose</th>
                    <th className="border px-4 py-2 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="m-0 border-t p-0 even:bg-muted">
                    <td className="border px-4 py-2 font-mono">
                      authjs.session-token <br />
                      <span className="text-xs text-muted-foreground">
                        (__Secure-authjs.session-token)
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <strong>Authentication:</strong> Stores your secure
                      session token to keep you logged in.
                    </td>
                    <td className="border px-4 py-2">
                      Session (or until logout)
                    </td>
                  </tr>
                  <tr className="m-0 border-t p-0 even:bg-muted">
                    <td className="border px-4 py-2 font-mono">
                      authjs.csrf-token <br />
                      <span className="text-xs text-muted-foreground">
                        (__Host-authjs.csrf-token)
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <strong>Security:</strong> Prevents Cross-Site Request
                      Forgery (CSRF) attacks to protect your data.
                    </td>
                    <td className="border px-4 py-2">Session</td>
                  </tr>
                  <tr className="m-0 border-t p-0 even:bg-muted">
                    <td className="border px-4 py-2 font-mono">
                      authjs.callback-url <br />
                      <span className="text-xs text-muted-foreground">
                        (__Secure-authjs.callback-url)
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <strong>Functionality:</strong> Remembers the URL you were
                      trying to access before logging in, to redirect you
                      correctly.
                    </td>
                    <td className="border px-4 py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-muted-foreground">
              *Note: The <code>__Secure-</code> and <code>__Host-</code>{" "}
              prefixes appear when the site is accessed via a secure (HTTPS)
              connection.*
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              4. Managing Cookies
            </h2>
            <p className="leading-7 text-muted-foreground">
              Most web browsers allow you to control cookies through their
              settings preferences. However, please note that because we only
              use strictly necessary cookies,{" "}
              <strong>
                blocking them will prevent you from logging in and using the
                Application
              </strong>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              5. Updates to This Policy
            </h2>
            <p className="leading-7 text-muted-foreground">
              We may update this Cookie Policy to reflect changes in the cookies
              we use for operational, legal, or regulatory reasons. Please
              revisit this page regularly to stay informed.
            </p>
          </section>
        </div>
      </Container>
    </Page>
  );
}
