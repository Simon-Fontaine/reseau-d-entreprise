import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { SettingsBioForm } from "@/components/dashboard/settings/bio-form";
import { SettingsPasswordForm } from "@/components/dashboard/settings/password-form";
import { SettingsProfileForm } from "@/components/dashboard/settings/profile-form";
import { db, users } from "@/db/schema";

export default async function DashboardSettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Settings"
        text="Manage your account settings."
      />
      <div className="grid gap-10">
        <SettingsProfileForm
          defaultValues={{
            fullName: user.fullName,
            email: user.email,
          }}
        />
        <SettingsBioForm
          defaultValues={{
            bio: user.bio,
          }}
        />
        <SettingsPasswordForm />
      </div>
    </div>
  );
}
