import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterJobId = searchParams.get("jobId");
    const filterStatus = searchParams.get("status");
    const filterSearch = searchParams.get("search")?.toLowerCase();

    const companies = await db.getAllCompanies();
    const companyMap = new Map(companies.map((c) => [c.id, c]));

    if (session.role === "JOB_SEEKER") {
      // Return this seeker's applications
      const apps = await db.getApplicationsForApplicant(session.id);

      const enriched = await Promise.all(
        apps.map(async (app) => {
          const job = await db.getJobById(app.jobId);
          const history = await db.getStatusHistory(app.id);
          const company = job ? companyMap.get(job.companyId) : null;

          return {
            ...app,
            job: job
              ? {
                  ...job,
                  company,
                }
              : null,
            history,
          };
        })
      );

      return NextResponse.json({
        success: true,
        count: enriched.length,
        applications: enriched,
      });
    }

    if (session.role === "RECRUITER") {
      // Return applications for this recruiter's jobs only
      const myJobs = await db.getAllJobs({ recruiterId: session.id });
      const myJobIds = new Set(myJobs.map((j) => j.id));
      const jobMap = new Map(myJobs.map((j) => [j.id, j]));

      let allRecruiterApps: any[] = [];
      for (const job of myJobs) {
        if (filterJobId && filterJobId !== "all" && job.id !== filterJobId) {
          continue;
        }
        const apps = await db.getApplicationsForJob(job.id);
        allRecruiterApps.push(...apps);
      }

      if (filterStatus && filterStatus !== "all") {
        allRecruiterApps = allRecruiterApps.filter((a) => a.status === filterStatus);
      }

      const enriched = await Promise.all(
        allRecruiterApps.map(async (app) => {
          const applicant = await db.findUserById(app.applicantId);
          const profile = await db.getSeekerProfile(app.applicantId);
          const job = jobMap.get(app.jobId);
          const history = await db.getStatusHistory(app.id);

          return {
            ...app,
            applicant: applicant
              ? {
                  id: applicant.id,
                  name: applicant.name,
                  email: applicant.email,
                  phone: applicant.phone,
                  avatar: applicant.avatar,
                  headline: profile?.headline,
                  skills: profile?.skills,
                  location: profile?.location,
                  portfolioUrl: profile?.portfolioUrl,
                  linkedInUrl: profile?.linkedInUrl,
                  gitHubUrl: profile?.gitHubUrl,
                  education: profile?.education,
                  experience: profile?.experience,
                }
              : null,
            job: job
              ? {
                  id: job.id,
                  title: job.title,
                  category: job.category,
                  location: job.location,
                  employmentType: job.employmentType,
                }
              : null,
            history,
          };
        })
      );

      // Search filter on candidate name, skills, or job title
      let results = enriched;
      if (filterSearch) {
        results = results.filter(
          (a) =>
            a.applicant?.name?.toLowerCase().includes(filterSearch) ||
            a.applicant?.skills?.toLowerCase().includes(filterSearch) ||
            a.job?.title?.toLowerCase().includes(filterSearch)
        );
      }

      return NextResponse.json({
        success: true,
        count: results.length,
        applications: results,
      });
    }

    if (session.role === "ADMIN") {
      const allJobs = await db.getAllJobs();
      const jobMap = new Map(allJobs.map((j) => [j.id, j]));

      let allApps: any[] = [];
      for (const job of allJobs) {
        const apps = await db.getApplicationsForJob(job.id);
        allApps.push(...apps);
      }

      const enriched = await Promise.all(
        allApps.map(async (app) => {
          const applicant = await db.findUserById(app.applicantId);
          const job = jobMap.get(app.jobId);
          return {
            ...app,
            applicantName: applicant?.name || "Candidate",
            applicantEmail: applicant?.email || "",
            jobTitle: job?.title || "Role",
            companyName: job ? companyMap.get(job.companyId)?.name : "",
          };
        })
      );

      return NextResponse.json({
        success: true,
        count: enriched.length,
        applications: enriched,
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error: any) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}
