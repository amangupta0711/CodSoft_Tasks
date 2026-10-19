import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (session.role === "TEACHER") {
    redirect("/dashboard/teacher");
  } else {
    redirect("/dashboard/student");
  }
}
