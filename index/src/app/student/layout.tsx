import { StudentLayoutContent } from "@/components/student/student-layout";
import { UserNav } from "@/components/user-nav";

export default function LayoutForStudent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentLayoutContent userNav={<UserNav />}>
      {children}
    </StudentLayoutContent>
  );
}
