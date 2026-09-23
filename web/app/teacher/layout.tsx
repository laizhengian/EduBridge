import { TeacherShell } from "@/components/TeacherShell";

// The teacher app gets its own chrome (tab bar, header, no Hub) while staying
// one codebase and one deploy — see docs/design.md → Two apps, one design.
export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherShell>{children}</TeacherShell>;
}
