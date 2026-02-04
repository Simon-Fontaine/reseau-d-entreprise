import { Pencil, Trash2, Users } from "lucide-react";
import { auth } from "@/auth";
import {
  DeleteUserDialog,
  EditUserDialog,
  UserRoleBadge,
} from "@/components/dashboard/admin/user-dialogs";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/schema";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const allUsers = await db.query.users.findMany({
    orderBy: (user, { asc }) => [asc(user.fullName)],
  });

  const studentCount = allUsers.filter((u) => u.role === "student").length;
  const tutorCount = allUsers.filter((u) => u.role === "tutor").length;
  const adminCount = allUsers.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="User Management"
        text="View and manage all users on the platform."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentCount}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tutorCount}</p>
              <p className="text-xs text-muted-foreground">Tutors</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminCount}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All users ({allUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No users found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => {
                  const isCurrentUser = user.id === currentUserId;

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.fullName}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <UserRoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <EditUserDialog user={user} disabled={isCurrentUser}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isCurrentUser}
                              title="Edit user"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </EditUserDialog>
                          <DeleteUserDialog
                            user={user}
                            disabled={isCurrentUser}
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isCurrentUser}
                              title="Delete user"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteUserDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
