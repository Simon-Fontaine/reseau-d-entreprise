import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";

export default async function AdminDashboardPage() {
  return (
    <DashboardPageHeader
      heading="Admin Dashboard"
      text="Manage users and system settings."
    />
  );
}
