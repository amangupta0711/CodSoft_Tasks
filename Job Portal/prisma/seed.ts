import { PrismaClient, Role, UserStatus, EmploymentType, ExperienceLevel, WorkArrangement, JobStatus, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CareerHub PostgreSQL Database...");

  const passwordAdmin = await bcrypt.hash("Admin@123", 10);
  const passwordRecruiter = await bcrypt.hash("Recruiter@123", 10);
  const passwordSeeker = await bcrypt.hash("Seeker@123", 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@careerhub.com" },
    update: {},
    create: {
      email: "admin@careerhub.com",
      password: passwordAdmin,
      name: "Eleanor Vance",
      role: Role.ADMIN,
      phone: "+91 99000 11223",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      status: UserStatus.ACTIVE,
    },
  });

  // 2. Companies
  const techcorp = await prisma.company.upsert({
    where: { slug: "techcorp-global" },
    update: {},
    create: {
      name: "TechCorp Global",
      slug: "techcorp-global",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80",
      description: "Leading enterprise cloud infrastructure and developer automation systems empowering Fortune 500 tech teams.",
      industry: "Information Technology & Cloud Computing",
      website: "https://techcorp-sample.io",
      location: "Bengaluru, India (Global Offices: SF, London)",
      size: "1,000 - 5,000 employees",
      foundedYear: 2014,
    },
  });

  const innovatelabs = await prisma.company.upsert({
    where: { slug: "innovatelabs-ai" },
    update: {},
    create: {
      name: "InnovateLabs AI",
      slug: "innovatelabs-ai",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
      description: "Fast-scaling AI product studio architecting multimodal enterprise copilot applications and consumer platforms.",
      industry: "Artificial Intelligence & SaaS",
      website: "https://innovatelabs-sample.io",
      location: "Mumbai, India",
      size: "100 - 250 employees",
      foundedYear: 2020,
    },
  });

  // 3. Recruiters
  const recruiter1 = await prisma.user.upsert({
    where: { email: "recruiter@techcorp.com" },
    update: {},
    create: {
      email: "recruiter@techcorp.com",
      password: passwordRecruiter,
      name: "Marcus Thorne",
      role: Role.RECRUITER,
      phone: "+91 98111 22334",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      status: UserStatus.ACTIVE,
      recruiterProfile: {
        create: {
          companyId: techcorp.id,
          title: "Lead Technical Recruiter",
        },
      },
    },
  });

  const recruiter2 = await prisma.user.upsert({
    where: { email: "hr@innovatelabs.io" },
    update: {},
    create: {
      email: "hr@innovatelabs.io",
      password: passwordRecruiter,
      name: "Priya Sharma",
      role: Role.RECRUITER,
      phone: "+91 98222 33445",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
      status: UserStatus.ACTIVE,
      recruiterProfile: {
        create: {
          companyId: innovatelabs.id,
          title: "Head of People & Talent Acquisition",
        },
      },
    },
  });

  // 4. Job Seekers
  const seeker1 = await prisma.user.upsert({
    where: { email: "alex.rivera@example.com" },
    update: {},
    create: {
      email: "alex.rivera@example.com",
      password: passwordSeeker,
      name: "Alex Rivera",
      role: Role.JOB_SEEKER,
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: UserStatus.ACTIVE,
      jobSeekerProfile: {
        create: {
          headline: "Senior Full-Stack Engineer | Next.js, Node.js, TypeScript & PostgreSQL",
          bio: "Results-driven software engineer with 5+ years building scalable cloud web applications and reactive user interfaces.",
          location: "Bengaluru, Karnataka, India",
          skills: "Next.js, React, TypeScript, Node.js, PostgreSQL, Docker, Redis, Tailwind CSS",
          portfolioUrl: "https://alexrivera.dev",
          linkedInUrl: "https://linkedin.com/in/alex-rivera-demo",
          gitHubUrl: "https://github.com/alexrivera-demo",
          resumePath: "alex_rivera_resume.pdf",
          resumeOriginalName: "Alex_Rivera_FullStack_Resume.pdf",
          education: {
            create: [
              {
                institution: "National Institute of Technology, Karnataka",
                degree: "Bachelor of Technology (B.Tech)",
                fieldOfStudy: "Computer Science & Engineering",
                startDate: new Date("2017-08-01"),
                endDate: new Date("2021-05-30"),
                current: false,
                grade: "8.9 / 10 CGPA",
              },
            ],
          },
          experience: {
            create: [
              {
                company: "HyperCloud Systems",
                title: "Full-Stack Engineer",
                location: "Bengaluru, India",
                startDate: new Date("2021-06-01"),
                current: true,
                description: "Architected modern dashboard platforms using Next.js 14, Node.js, and PostgreSQL.",
              },
            ],
          },
        },
      },
    },
  });

  // 5. Jobs
  const job1 = await prisma.job.create({
    data: {
      title: "Lead Full-Stack Engineer (Next.js & Cloud)",
      slug: "lead-full-stack-engineer-nextjs-cloud",
      companyId: techcorp.id,
      recruiterId: recruiter1.id,
      description: "TechCorp is looking for an experienced Lead Full-Stack Engineer to guide the architecture of enterprise platforms.",
      responsibilities: "- Architect resilient web applications using Next.js App Router and Node.js.\n- Partner with architects on microservices and PostgreSQL schemas.\n- Champion code quality and mentoring.",
      requirements: "- 5+ years with TypeScript, React/Next.js, and Node.js.\n- Strong expertise with PostgreSQL and Prisma.\n- Docker and cloud services knowledge.",
      skills: "Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Docker, AWS",
      employmentType: EmploymentType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR,
      workArrangement: WorkArrangement.HYBRID,
      location: "Bengaluru, Karnataka, India",
      salaryMin: 2800000,
      salaryMax: 3800000,
      salaryCurrency: "INR",
      deadline: new Date("2026-12-31"),
      status: JobStatus.PUBLISHED,
      featured: true,
      category: "Engineering",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
