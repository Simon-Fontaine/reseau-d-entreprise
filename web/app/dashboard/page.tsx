import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-4">
      <p>Dashboard</p>
      <pre className="rounded-md border border-border bg-muted p-4 text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
