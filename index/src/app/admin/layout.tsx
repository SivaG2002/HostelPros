import { AdminLayoutContent } from "@/components/admin/admin-layout";
import { UserNav } from "@/components/user-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutContent userNav={<UserNav />}>
      {children}
    </AdminLayoutContent>
  );
}
