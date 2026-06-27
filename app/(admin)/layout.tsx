import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";
import { isAdminAuthenticated } from "@/lib/admin-session";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <UnsavedChangesProvider>
      <div className="min-h-screen bg-[#f3f5f8]">
        <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
          <AdminSidebar />

          <div>{children}</div>
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
