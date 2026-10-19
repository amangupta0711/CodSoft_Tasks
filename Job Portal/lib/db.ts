import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// Types matching Prisma models
export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "JOB_SEEKER" | "RECRUITER" | "ADMIN";
  phone?: string | null;
  avatar?: string | null;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface JobSeekerProfileRecord {
  id: string;
  userId: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  skills?: string | null;
  portfolioUrl?: string | null;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  resumePath?: string | null;
  resumeOriginalName?: string | null;
  resumeUploadedAt?: string | null;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    current: boolean;
    grade?: string | null;
  }>;
  experience?: Array<{
    id: string;
    company: string;
    title: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    current: boolean;
    description?: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRecord {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  industry?: string | null;
  website?: string | null;
  location?: string | null;
  size?: string | null;
  foundedYear?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterProfileRecord {
  id: string;
  userId: string;
  companyId: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobRecord {
  id: string;
  title: string;
  slug: string;
  companyId: string;
  recruiterId: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT";
  experienceLevel: "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR" | "LEAD_EXECUTIVE";
  workArrangement: "REMOTE" | "HYBRID" | "ON_SITE";
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  deadline?: string | null;
  status: "PUBLISHED" | "CLOSED" | "ARCHIVED" | "DRAFT";
  featured: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string | null;
  resumePath: string;
  resumeOriginalName: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "HIRED" | "REJECTED" | "WITHDRAWN";
  notes?: string | null;
  interviewDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStatusHistoryRecord {
  id: string;
  applicationId: string;
  fromStatus?: string | null;
  toStatus: string;
  changedById: string;
  note?: string | null;
  createdAt: string;
}

export interface SavedJobRecord {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
}

interface DatabaseState {
  users: UserRecord[];
  seekerProfiles: JobSeekerProfileRecord[];
  companies: CompanyRecord[];
  recruiterProfiles: RecruiterProfileRecord[];
  jobs: JobRecord[];
  applications: JobApplicationRecord[];
  statusHistory: ApplicationStatusHistoryRecord[];
  savedJobs: SavedJobRecord[];
}

const SNAPSHOT_PATH = path.join(process.cwd(), "storage", "db_snapshot.json");

function getDefaultInitialData(): DatabaseState {
  const passwordAdmin = bcrypt.hashSync("Admin@123", 10);
  const passwordRecruiter = bcrypt.hashSync("Recruiter@123", 10);
  const passwordSeeker = bcrypt.hashSync("Seeker@123", 10);

  const now = new Date().toISOString();

  const users: UserRecord[] = [
    {
      id: "usr-admin-1",
      email: "admin@careerhub.com",
      password: passwordAdmin,
      name: "Eleanor Vance",
      role: "ADMIN",
      phone: "+91 99000 11223",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-recruiter-1",
      email: "recruiter@techcorp.com",
      password: passwordRecruiter,
      name: "Marcus Thorne",
      role: "RECRUITER",
      phone: "+91 98111 22334",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-recruiter-2",
      email: "hr@innovatelabs.io",
      password: passwordRecruiter,
      name: "Priya Sharma",
      role: "RECRUITER",
      phone: "+91 98222 33445",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-seeker-1",
      email: "alex.rivera@example.com",
      password: passwordSeeker,
      name: "Alex Rivera",
      role: "JOB_SEEKER",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-seeker-2",
      email: "sarah.chen@example.com",
      password: passwordSeeker,
      name: "Sarah Chen",
      role: "JOB_SEEKER",
      phone: "+91 98450 67890",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const companies: CompanyRecord[] = [
    {
      id: "comp-techcorp",
      name: "TechCorp Global",
      slug: "techcorp-global",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80",
      description: "Leading enterprise cloud infrastructure and developer automation systems empowering Fortune 500 tech teams.",
      industry: "Information Technology & Cloud Computing",
      website: "https://techcorp-sample.io",
      location: "Bengaluru, India (Global Offices: SF, London)",
      size: "1,000 - 5,000 employees",
      foundedYear: 2014,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "comp-innovatelabs",
      name: "InnovateLabs AI",
      slug: "innovatelabs-ai",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
      description: "Fast-scaling AI product studio architecting multimodal enterprise copilot applications and consumer platforms.",
      industry: "Artificial Intelligence & SaaS",
      website: "https://innovatelabs-sample.io",
      location: "Mumbai, India",
      size: "100 - 250 employees",
      foundedYear: 2020,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "comp-cloudscale",
      name: "CloudScale Systems",
      slug: "cloudscale-systems",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
      description: "Distributed Kubernetes observability, site reliability tooling, and high-performance serverless mesh network.",
      industry: "DevOps & Cloud Infrastructure",
      website: "https://cloudscale-sample.net",
      location: "Hyderabad, India",
      size: "250 - 500 employees",
      foundedYear: 2018,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "comp-nexafin",
      name: "NexaFin Solutions",
      slug: "nexafin-solutions",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
      description: "Next-generation fintech engine delivering micro-second settlement rails, unified lending APIs, and fraud prevention.",
      industry: "Fintech & Financial Services",
      website: "https://nexafin-sample.com",
      location: "Bengaluru, India",
      size: "500 - 1,000 employees",
      foundedYear: 2017,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "comp-apexhealth",
      name: "Apex HealthTech",
      slug: "apex-healthtech",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
      description: "Pioneering digital healthcare diagnostics, clinical workflows, and high-security patient management software.",
      industry: "HealthTech & Biotechnology",
      website: "https://apexhealth-sample.org",
      location: "Pune, India",
      size: "200 - 500 employees",
      foundedYear: 2019,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const recruiterProfiles: RecruiterProfileRecord[] = [
    {
      id: "rec-1",
      userId: "usr-recruiter-1",
      companyId: "comp-techcorp",
      title: "Lead Technical Recruiter",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "rec-2",
      userId: "usr-recruiter-2",
      companyId: "comp-innovatelabs",
      title: "Head of People & Talent Acquisition",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const seekerProfiles: JobSeekerProfileRecord[] = [
    {
      id: "profile-alex",
      userId: "usr-seeker-1",
      headline: "Senior Full-Stack Engineer | Next.js, Node.js, TypeScript & PostgreSQL",
      bio: "Results-driven software engineer with 5+ years building scalable cloud web applications, microservices, and reactive user interfaces. Passionate about clean code, performance optimization, and developer experience.",
      location: "Bengaluru, Karnataka, India",
      skills: "Next.js, React, TypeScript, Node.js, PostgreSQL, Docker, Redis, Tailwind CSS, REST & GraphQL APIs",
      portfolioUrl: "https://alexrivera.dev",
      linkedInUrl: "https://linkedin.com/in/alex-rivera-demo",
      gitHubUrl: "https://github.com/alexrivera-demo",
      resumePath: "alex_rivera_resume.pdf",
      resumeOriginalName: "Alex_Rivera_FullStack_Resume.pdf",
      resumeUploadedAt: now,
      education: [
        {
          id: "edu-1",
          institution: "National Institute of Technology, Karnataka",
          degree: "Bachelor of Technology (B.Tech)",
          fieldOfStudy: "Computer Science & Engineering",
          startDate: "2017-08-01",
          endDate: "2021-05-30",
          current: false,
          grade: "8.9 / 10 CGPA",
        },
      ],
      experience: [
        {
          id: "exp-1",
          company: "HyperCloud Systems",
          title: "Full-Stack Engineer",
          location: "Bengaluru, India",
          startDate: "2021-06-01",
          endDate: null,
          current: true,
          description: "Architected modern dashboard platforms using Next.js 14, Node.js, and PostgreSQL. Reduced latency by 45% through query indexing and Redis caching.",
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "profile-sarah",
      userId: "usr-seeker-2",
      headline: "Lead UX Architect & Design Systems Lead | B2B SaaS & Design Ops",
      bio: "Product designer and design technologist creating human-centered interfaces for complex enterprise software. Specializing in component design systems, accessibility WCAG 2.1, and rapid interactive prototypes.",
      location: "Pune / Remote, India",
      skills: "Figma, Design Systems, UX Research, Interaction Design, Wireframing, Tailwind CSS, Accessibility",
      portfolioUrl: "https://sarahchen.design",
      linkedInUrl: "https://linkedin.com/in/sarah-chen-demo",
      gitHubUrl: "https://github.com/sarahchen-demo",
      resumePath: "sarah_chen_resume.pdf",
      resumeOriginalName: "Sarah_Chen_Design_Resume.pdf",
      resumeUploadedAt: now,
      education: [
        {
          id: "edu-2",
          institution: "National Institute of Design (NID)",
          degree: "Master of Design (M.Des)",
          fieldOfStudy: "Interaction & Digital Product Design",
          startDate: "2018-07-01",
          endDate: "2020-05-30",
          current: false,
          grade: "First Class Distinction",
        },
      ],
      experience: [
        {
          id: "exp-2",
          company: "Prism Creative Studios",
          title: "Senior Product Designer",
          location: "Pune, India",
          startDate: "2020-06-01",
          endDate: null,
          current: true,
          description: "Led the design system redesign across 4 core SaaS product suites, serving 250k+ daily enterprise users.",
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const jobs: JobRecord[] = [
    {
      id: "job-1",
      title: "Lead Full-Stack Engineer (Next.js & Cloud)",
      slug: "lead-full-stack-engineer-nextjs-cloud",
      companyId: "comp-techcorp",
      recruiterId: "usr-recruiter-1",
      description: "TechCorp is looking for an experienced Lead Full-Stack Engineer to guide the architecture and implementation of our next-generation enterprise recruitment and workforce management platforms.",
      responsibilities: "- Architect resilient and high-throughput web applications using Next.js App Router, TypeScript, and Node.js.\n- Partner with product managers and cloud architects to design scalable microservices and relational PostgreSQL schemas.\n- Champion code quality, unit/integration testing, CI/CD automation, and accessibility.\n- Mentor senior and junior developers on technical best practices and architectural decisions.",
      requirements: "- 5+ years of production experience with TypeScript, React/Next.js, and Node.js.\n- Strong expertise in SQL, PostgreSQL, indexing, and ORMs such as Prisma.\n- Solid understanding of Docker, cloud services (AWS/GCP), and distributed systems.\n- Excellent communication skills and leadership mindset.",
      skills: "Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Docker, AWS",
      employmentType: "FULL_TIME",
      experienceLevel: "SENIOR",
      workArrangement: "HYBRID",
      location: "Bengaluru, Karnataka, India",
      salaryMin: 2800000,
      salaryMax: 3800000,
      salaryCurrency: "INR",
      deadline: "2026-12-31T23:59:59Z",
      status: "PUBLISHED",
      featured: true,
      category: "Engineering",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-2",
      title: "Senior Product Designer (Design Systems & UX)",
      slug: "senior-product-designer-ux",
      companyId: "comp-innovatelabs",
      recruiterId: "usr-recruiter-2",
      description: "InnovateLabs is seeking a Senior Product Designer to establish our comprehensive cross-platform design system and craft elegant, intuitive interfaces for our flagship enterprise AI workflow tools.",
      responsibilities: "- Own the end-to-end design lifecycle from discovery, user research, wireframes to high-fidelity Figma components.\n- Maintain and scale our unified multi-brand design tokens and typography hierarchies.\n- Conduct qualitative and quantitative usability tests with enterprise stakeholders.\n- Collaborate closely with frontend engineers to ensure pixel-perfect implementation.",
      requirements: "- 4+ years designing high-impact web and mobile SaaS products.\n- Mastery of Figma, auto-layout, interactive prototyping, and design systems.\n- Strong portfolio demonstrating complex workflow simplification and UX problem solving.\n- Familiarity with Tailwind CSS and modern web UI component frameworks.",
      skills: "Figma, UI/UX Design, Design Systems, User Research, Prototyping, Accessibility",
      employmentType: "FULL_TIME",
      experienceLevel: "SENIOR",
      workArrangement: "HYBRID",
      location: "Mumbai, Maharashtra, India",
      salaryMin: 2200000,
      salaryMax: 3000000,
      salaryCurrency: "INR",
      deadline: "2026-11-30T23:59:59Z",
      status: "PUBLISHED",
      featured: true,
      category: "Design",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-3",
      title: "DevOps & Cloud Platform Engineer",
      slug: "devops-cloud-platform-engineer",
      companyId: "comp-cloudscale",
      recruiterId: "usr-recruiter-1",
      description: "Join CloudScale Systems to design, maintain, and scale our high-availability multi-region Kubernetes clusters, automated zero-downtime deployment pipelines, and observability telemetry.",
      responsibilities: "- Architect and maintain Kubernetes clusters, Helm charts, and Terraform infrastructure as code.\n- Implement robust Prometheus, Grafana, and OpenTelemetry monitoring dashboards.\n- Automate zero-trust network policies, secrets management, and TLS rotation.\n- Optimize cloud compute efficiency and reduce infrastructure spend.",
      requirements: "- 3+ years managing production Linux/Kubernetes environments.\n- Proficient with Terraform, GitHub Actions, Docker, and AWS or GCP.\n- Experience with PostgreSQL replication, database backup strategies, and disaster recovery.",
      skills: "Kubernetes, Docker, Terraform, AWS, CI/CD, Prometheus, Grafana, PostgreSQL",
      employmentType: "FULL_TIME",
      experienceLevel: "MID_LEVEL",
      workArrangement: "REMOTE",
      location: "Hyderabad, Telangana, India / Remote",
      salaryMin: 2000000,
      salaryMax: 2800000,
      salaryCurrency: "INR",
      deadline: "2026-12-15T23:59:59Z",
      status: "PUBLISHED",
      featured: false,
      category: "DevOps",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-4",
      title: "Full-Stack Web Development Intern",
      slug: "full-stack-web-development-intern",
      companyId: "comp-techcorp",
      recruiterId: "usr-recruiter-1",
      description: "Exciting opportunity for passionate college students and recent graduates to work on real-world web applications alongside veteran software engineers at TechCorp. Fast-track your engineering career!",
      responsibilities: "- Build responsive React and Next.js user interfaces with clean styling.\n- Write backend API endpoints and integrate relational database models using Prisma.\n- Participate in agile sprint planning, code reviews, and pair programming.\n- Troubleshoot bugs, write automated tests, and document application features.",
      requirements: "- Strong foundational knowledge of JavaScript/TypeScript, HTML5, and CSS3.\n- Hands-on project experience with React, Node.js, and SQL databases.\n- High curiosity, eagerness to learn, and passion for software craftsmanship.\n- Currently pursuing or recently graduated with a degree in CS, IT, or related discipline.",
      skills: "TypeScript, React, Next.js, Node.js, SQL, Git, Tailwind CSS",
      employmentType: "INTERNSHIP",
      experienceLevel: "ENTRY_LEVEL",
      workArrangement: "REMOTE",
      location: "Remote (All India)",
      salaryMin: 35000,
      salaryMax: 50000,
      salaryCurrency: "INR",
      deadline: "2026-12-31T23:59:59Z",
      status: "PUBLISHED",
      featured: true,
      category: "Engineering",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-5",
      title: "Backend Distributed Systems Engineer",
      slug: "backend-distributed-systems-engineer",
      companyId: "comp-nexafin",
      recruiterId: "usr-recruiter-2",
      description: "NexaFin is hiring an experienced backend engineer to power high-frequency transactional pipelines, transaction reconciliation, and enterprise payment gateways processing millions of queries per second.",
      responsibilities: "- Build high-throughput microservices using Node.js/Go and PostgreSQL.\n- Design fault-tolerant message brokers (Kafka/RabbitMQ) and event-driven architectures.\n- Enforce strict ACID compliance, data encryption, and regulatory audit compliance.\n- Benchmark and tune query execution plans and database connection pools.",
      requirements: "- 4+ years backend engineering in distributed fintech or high-volume systems.\n- Deep understanding of database internals, concurrency, locking, and distributed caching.\n- Proven track record writing reliable, maintainable, and well-tested services.",
      skills: "Node.js, PostgreSQL, Redis, Kafka, Distributed Systems, Microservices, Security",
      employmentType: "FULL_TIME",
      experienceLevel: "SENIOR",
      workArrangement: "REMOTE",
      location: "Bengaluru, Karnataka, India",
      salaryMin: 2600000,
      salaryMax: 3600000,
      salaryCurrency: "INR",
      deadline: "2026-12-20T23:59:59Z",
      status: "PUBLISHED",
      featured: false,
      category: "Engineering",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-6",
      title: "Technical Product Manager (Developer Platform)",
      slug: "technical-product-manager-platform",
      companyId: "comp-cloudscale",
      recruiterId: "usr-recruiter-1",
      description: "Drive the strategic roadmap for CloudScale's developer platform, CLI, and APIs. Bridge engineering capabilities with enterprise customer needs.",
      responsibilities: "- Define product vision, technical roadmaps, and detailed user stories.\n- Interview enterprise engineering leads to unearth friction points and growth opportunities.\n- Track telemetry KPIs, adoption funnels, and feature velocity.\n- Align cross-functional engineering, marketing, and customer success teams.",
      requirements: "- 3+ years experience as a technical PM or software engineer transitioned to product.\n- Intimate familiarity with developer tooling, APIs, and cloud services.\n- Outstanding stakeholder presentation and written communication abilities.",
      skills: "Product Management, Technical Strategy, Agile, Developer Tools, Analytics",
      employmentType: "FULL_TIME",
      experienceLevel: "MID_LEVEL",
      workArrangement: "REMOTE",
      location: "Bengaluru / Remote",
      salaryMin: 2400000,
      salaryMax: 3200000,
      salaryCurrency: "INR",
      deadline: "2026-11-25T23:59:59Z",
      status: "PUBLISHED",
      featured: false,
      category: "Product",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-7",
      title: "Senior QA Automation Engineer",
      slug: "senior-qa-automation-engineer",
      companyId: "comp-apexhealth",
      recruiterId: "usr-recruiter-2",
      description: "Apex HealthTech is expanding its Quality Engineering squad. Lead end-to-end automation frameworks across clinical portals, patient apps, and HIPAA-compliant data pipelines.",
      responsibilities: "- Design maintainable end-to-end test suites using Playwright, Cypress, and Jest.\n- Integrate automated regression suites into GitHub Actions CI pipelines.\n- Perform security, penetration, and performance stress testing.\n- Work with developers to catch regression defects before production rollout.",
      requirements: "- 3+ years in software quality assurance and test automation.\n- Strong programming skills in TypeScript or Python.\n- Experience with healthcare compliance or data security standards is a plus.",
      skills: "Playwright, Cypress, Jest, TypeScript, CI/CD, API Testing, Performance Testing",
      employmentType: "FULL_TIME",
      experienceLevel: "MID_LEVEL",
      workArrangement: "ON_SITE",
      location: "Pune, Maharashtra, India",
      salaryMin: 1400000,
      salaryMax: 2000000,
      salaryCurrency: "INR",
      deadline: "2026-12-10T23:59:59Z",
      status: "PUBLISHED",
      featured: false,
      category: "Engineering",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "job-8",
      title: "AI & Machine Learning Solutions Architect",
      slug: "ai-machine-learning-solutions-architect",
      companyId: "comp-innovatelabs",
      recruiterId: "usr-recruiter-2",
      description: "Lead the design and deployment of enterprise Generative AI copilots, retrieval-augmented generation (RAG) pipelines, and fine-tuned open-source LLMs.",
      responsibilities: "- Architect enterprise-grade LLM orchestration using LangChain, LlamaIndex, and vector databases (pgvector/Pinecone).\n- Optimize inference latency, token economics, and hallucination guardrails.\n- Advise executive leadership on AI roadmap feasibility and risk mitigation.\n- Mentor engineering teams on best practices for machine learning deployment.",
      requirements: "- 5+ years experience in applied ML, NLP, and distributed systems.\n- Proven deployment of production LLM / RAG architectures at scale.\n- Deep familiarity with Python, PyTorch, HuggingFace, and cloud AI infrastructure.",
      skills: "Python, PyTorch, LangChain, RAG, Vector DBs, LLM Fine-Tuning, AWS Bedrock",
      employmentType: "FULL_TIME",
      experienceLevel: "LEAD_EXECUTIVE",
      workArrangement: "HYBRID",
      location: "Mumbai, Maharashtra, India",
      salaryMin: 3500000,
      salaryMax: 4800000,
      salaryCurrency: "INR",
      deadline: "2026-12-31T23:59:59Z",
      status: "PUBLISHED",
      featured: true,
      category: "Data & AI",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const applications: JobApplicationRecord[] = [
    {
      id: "app-1",
      jobId: "job-1",
      applicantId: "usr-seeker-1",
      coverLetter: "Dear Marcus,\n\nI am thrilled to apply for the Lead Full-Stack Engineer role at TechCorp. With 5 years building scalable web architectures using Next.js, Node.js, and PostgreSQL, I believe my technical background aligns seamlessly with TechCorp's mission.",
      resumePath: "alex_rivera_resume.pdf",
      resumeOriginalName: "Alex_Rivera_FullStack_Resume.pdf",
      status: "SHORTLISTED",
      notes: "Strong candidate. Excellent background in Next.js App Router and PostgreSQL architecture. Ready for technical round.",
      interviewDate: "2026-10-25T14:30:00Z",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "app-2",
      jobId: "job-5",
      applicantId: "usr-seeker-1",
      coverLetter: "Hello NexaFin team,\n\nI have extensive experience designing fault-tolerant backend microservices and database connection pooling. I would love to contribute to NexaFin's settlement engines.",
      resumePath: "alex_rivera_resume.pdf",
      resumeOriginalName: "Alex_Rivera_FullStack_Resume.pdf",
      status: "INTERVIEW",
      notes: "Passed recruiter screen with flying colors. Panel interview scheduled with Principal Systems Architect.",
      interviewDate: "2026-10-22T10:00:00Z",
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: "app-3",
      jobId: "job-2",
      applicantId: "usr-seeker-2",
      coverLetter: "Dear Priya,\n\nAs a lead UX architect with a passion for multi-brand design systems and enterprise SaaS, the Senior Product Designer role at InnovateLabs AI is an ideal match. My portfolio includes comprehensive design system transformations.",
      resumePath: "sarah_chen_resume.pdf",
      resumeOriginalName: "Sarah_Chen_Design_Resume.pdf",
      status: "UNDER_REVIEW",
      notes: "Portfolio reviewed. Impressive work on design system tokenization and B2B SaaS simplification.",
      interviewDate: null,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "app-4",
      jobId: "job-1",
      applicantId: "usr-seeker-2",
      coverLetter: "Hello Marcus,\n\nI am applying for the Lead role bringing a hybrid design-technologist perspective with strong frontend architecture knowledge.",
      resumePath: "sarah_chen_resume.pdf",
      resumeOriginalName: "Sarah_Chen_Design_Resume.pdf",
      status: "APPLIED",
      notes: null,
      interviewDate: null,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  const statusHistory: ApplicationStatusHistoryRecord[] = [
    {
      id: "hist-1",
      applicationId: "app-1",
      fromStatus: null,
      toStatus: "APPLIED",
      changedById: "usr-seeker-1",
      note: "Application submitted online.",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: "hist-2",
      applicationId: "app-1",
      fromStatus: "APPLIED",
      toStatus: "UNDER_REVIEW",
      changedById: "usr-recruiter-1",
      note: "Profile and resume passed initial recruiter screening.",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "hist-3",
      applicationId: "app-1",
      fromStatus: "UNDER_REVIEW",
      toStatus: "SHORTLISTED",
      changedById: "usr-recruiter-1",
      note: "Candidate shortlisted for technical engineering interview.",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "hist-4",
      applicationId: "app-2",
      fromStatus: null,
      toStatus: "APPLIED",
      changedById: "usr-seeker-1",
      note: "Application submitted.",
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: "hist-5",
      applicationId: "app-2",
      fromStatus: "APPLIED",
      toStatus: "INTERVIEW",
      changedById: "usr-recruiter-2",
      note: "Fast-tracked to system design panel interview.",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  const savedJobs: SavedJobRecord[] = [
    {
      id: "save-1",
      jobId: "job-3",
      userId: "usr-seeker-1",
      createdAt: now,
    },
    {
      id: "save-2",
      jobId: "job-8",
      userId: "usr-seeker-1",
      createdAt: now,
    },
    {
      id: "save-3",
      jobId: "job-2",
      userId: "usr-seeker-2",
      createdAt: now,
    },
  ];

  return {
    users,
    seekerProfiles,
    companies,
    recruiterProfiles,
    jobs,
    applications,
    statusHistory,
    savedJobs,
  };
}

class DatabaseManager {
  private state: DatabaseState;
  private isPostgresConnected: boolean | null = null;

  constructor() {
    this.state = this.loadSnapshot();
  }

  private loadSnapshot(): DatabaseState {
    try {
      if (fs.existsSync(SNAPSHOT_PATH)) {
        const raw = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not load snapshot, initializing fresh seed data:", e);
    }
    const fresh = getDefaultInitialData();
    this.saveSnapshot(fresh);
    return fresh;
  }

  private saveSnapshot(state: DatabaseState) {
    try {
      const dir = path.dirname(SNAPSHOT_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(state, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save snapshot to disk:", e);
    }
  }

  public async checkPostgresConnection(): Promise<boolean> {
    if (this.isPostgresConnected !== null) return this.isPostgresConnected;
    try {
      await prisma.$queryRaw`SELECT 1`;
      this.isPostgresConnected = true;
      return true;
    } catch {
      this.isPostgresConnected = false;
      return false;
    }
  }

  // --- USER OPERATIONS ---
  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    const norm = email.trim().toLowerCase();
    const user = this.state.users.find((u) => u.email.toLowerCase() === norm);
    return user || null;
  }

  public async findUserById(id: string): Promise<UserRecord | null> {
    const user = this.state.users.find((u) => u.id === id);
    return user || null;
  }

  public async createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): Promise<UserRecord> {
    const newUser: UserRecord = {
      ...data,
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.saveSnapshot(this.state);
    return newUser;
  }

  public async getAllUsers(): Promise<UserRecord[]> {
    return [...this.state.users];
  }

  public async updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED"): Promise<UserRecord | null> {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return null;
    user.status = status;
    user.updatedAt = new Date().toISOString();
    this.saveSnapshot(this.state);
    return user;
  }

  // --- CANDIDATE PROFILES ---
  public async getSeekerProfile(userId: string): Promise<JobSeekerProfileRecord | null> {
    const profile = this.state.seekerProfiles.find((p) => p.userId === userId);
    return profile || null;
  }

  public async upsertSeekerProfile(
    userId: string,
    data: Partial<JobSeekerProfileRecord>
  ): Promise<JobSeekerProfileRecord> {
    let profile = this.state.seekerProfiles.find((p) => p.userId === userId);
    const now = new Date().toISOString();

    if (!profile) {
      profile = {
        id: "prof-" + Math.random().toString(36).substring(2, 9),
        userId,
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        skills: data.skills || "",
        portfolioUrl: data.portfolioUrl || "",
        linkedInUrl: data.linkedInUrl || "",
        gitHubUrl: data.gitHubUrl || "",
        resumePath: data.resumePath || null,
        resumeOriginalName: data.resumeOriginalName || null,
        resumeUploadedAt: data.resumeUploadedAt || null,
        education: data.education || [],
        experience: data.experience || [],
        createdAt: now,
        updatedAt: now,
      };
      this.state.seekerProfiles.push(profile);
    } else {
      Object.assign(profile, data, { updatedAt: now });
    }

    this.saveSnapshot(this.state);
    return profile;
  }

  // --- COMPANIES ---
  public async getAllCompanies(): Promise<CompanyRecord[]> {
    return [...this.state.companies];
  }

  public async getCompanyById(id: string): Promise<CompanyRecord | null> {
    return this.state.companies.find((c) => c.id === id) || null;
  }

  public async updateCompany(id: string, data: Partial<CompanyRecord>): Promise<CompanyRecord | null> {
    const comp = this.state.companies.find((c) => c.id === id);
    if (!comp) return null;
    Object.assign(comp, data, { updatedAt: new Date().toISOString() });
    this.saveSnapshot(this.state);
    return comp;
  }

  public async createCompany(data: Omit<CompanyRecord, "id" | "createdAt" | "updatedAt">): Promise<CompanyRecord> {
    const newComp: CompanyRecord = {
      ...data,
      id: "comp-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.companies.push(newComp);
    this.saveSnapshot(this.state);
    return newComp;
  }

  // --- RECRUITER PROFILES ---
  public async getRecruiterProfile(userId: string): Promise<RecruiterProfileRecord | null> {
    return this.state.recruiterProfiles.find((r) => r.userId === userId) || null;
  }

  public async upsertRecruiterProfile(
    userId: string,
    companyId: string,
    title?: string
  ): Promise<RecruiterProfileRecord> {
    let rec = this.state.recruiterProfiles.find((r) => r.userId === userId);
    const now = new Date().toISOString();
    if (!rec) {
      rec = {
        id: "rec-" + Math.random().toString(36).substring(2, 9),
        userId,
        companyId,
        title: title || "Recruitment Lead",
        createdAt: now,
        updatedAt: now,
      };
      this.state.recruiterProfiles.push(rec);
    } else {
      rec.companyId = companyId;
      if (title) rec.title = title;
      rec.updatedAt = now;
    }
    this.saveSnapshot(this.state);
    return rec;
  }

  // --- JOBS ---
  public async getAllJobs(filters?: {
    query?: string;
    category?: string;
    employmentType?: string;
    workArrangement?: string;
    experienceLevel?: string;
    location?: string;
    status?: string;
    recruiterId?: string;
    companyId?: string;
    sort?: string;
  }): Promise<JobRecord[]> {
    let list = [...this.state.jobs];

    if (filters?.status) {
      list = list.filter((j) => j.status === filters.status);
    } else if (!filters?.recruiterId) {
      // By default public sees only PUBLISHED jobs
      list = list.filter((j) => j.status === "PUBLISHED");
    }

    if (filters?.recruiterId) {
      list = list.filter((j) => j.recruiterId === filters.recruiterId);
    }

    if (filters?.companyId) {
      list = list.filter((j) => j.companyId === filters.companyId);
    }

    if (filters?.category && filters.category !== "all") {
      list = list.filter((j) => j.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.employmentType && filters.employmentType !== "all") {
      list = list.filter((j) => j.employmentType === filters.employmentType);
    }

    if (filters?.workArrangement && filters.workArrangement !== "all") {
      list = list.filter((j) => j.workArrangement === filters.workArrangement);
    }

    if (filters?.experienceLevel && filters.experienceLevel !== "all") {
      list = list.filter((j) => j.experienceLevel === filters.experienceLevel);
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      list = list.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.skills.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          this.getCompanyNameSync(j.companyId).toLowerCase().includes(q)
      );
    }

    if (filters?.sort === "salary_high") {
      list.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (filters?.sort === "oldest") {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // Newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }

  private getCompanyNameSync(companyId: string): string {
    const comp = this.state.companies.find((c) => c.id === companyId);
    return comp ? comp.name : "";
  }

  public async getJobById(id: string): Promise<JobRecord | null> {
    return this.state.jobs.find((j) => j.id === id) || null;
  }

  public async createJob(data: Omit<JobRecord, "id" | "createdAt" | "updatedAt">): Promise<JobRecord> {
    const newJob: JobRecord = {
      ...data,
      id: "job-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.jobs.unshift(newJob);
    this.saveSnapshot(this.state);
    return newJob;
  }

  public async updateJob(id: string, data: Partial<JobRecord>): Promise<JobRecord | null> {
    const job = this.state.jobs.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, data, { updatedAt: new Date().toISOString() });
    this.saveSnapshot(this.state);
    return job;
  }

  public async deleteJob(id: string): Promise<boolean> {
    const idx = this.state.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    this.state.jobs.splice(idx, 1);
    this.saveSnapshot(this.state);
    return true;
  }

  // --- APPLICATIONS ---
  public async getApplicationsForJob(jobId: string): Promise<JobApplicationRecord[]> {
    return this.state.applications.filter((a) => a.jobId === jobId);
  }

  public async getApplicationsForApplicant(applicantId: string): Promise<JobApplicationRecord[]> {
    return this.state.applications.filter((a) => a.applicantId === applicantId);
  }

  public async getApplicationById(id: string): Promise<JobApplicationRecord | null> {
    return this.state.applications.find((a) => a.id === id) || null;
  }

  public async findApplication(jobId: string, applicantId: string): Promise<JobApplicationRecord | null> {
    return (
      this.state.applications.find((a) => a.jobId === jobId && a.applicantId === applicantId) || null
    );
  }

  public async createApplication(data: {
    jobId: string;
    applicantId: string;
    coverLetter?: string;
    resumePath: string;
    resumeOriginalName: string;
  }): Promise<JobApplicationRecord> {
    const existing = await this.findApplication(data.jobId, data.applicantId);
    if (existing) {
      throw new Error("You have already applied for this job listing.");
    }

    const now = new Date().toISOString();
    const newApp: JobApplicationRecord = {
      id: "app-" + Math.random().toString(36).substring(2, 9),
      jobId: data.jobId,
      applicantId: data.applicantId,
      coverLetter: data.coverLetter || "",
      resumePath: data.resumePath,
      resumeOriginalName: data.resumeOriginalName,
      status: "APPLIED",
      notes: "",
      interviewDate: null,
      createdAt: now,
      updatedAt: now,
    };

    this.state.applications.unshift(newApp);

    // Record status history
    this.state.statusHistory.push({
      id: "hist-" + Math.random().toString(36).substring(2, 9),
      applicationId: newApp.id,
      fromStatus: null,
      toStatus: "APPLIED",
      changedById: data.applicantId,
      note: "Application submitted.",
      createdAt: now,
    });

    this.saveSnapshot(this.state);
    return newApp;
  }

  public async updateApplicationStatus(
    applicationId: string,
    newStatus: JobApplicationRecord["status"],
    changedById: string,
    note?: string,
    interviewDate?: string
  ): Promise<JobApplicationRecord | null> {
    const app = this.state.applications.find((a) => a.id === applicationId);
    if (!app) return null;

    const fromStatus = app.status;
    app.status = newStatus;
    if (note) app.notes = note;
    if (interviewDate !== undefined) app.interviewDate = interviewDate;
    app.updatedAt = new Date().toISOString();

    // Log history
    this.state.statusHistory.push({
      id: "hist-" + Math.random().toString(36).substring(2, 9),
      applicationId: app.id,
      fromStatus,
      toStatus: newStatus,
      changedById,
      note: note || `Status updated to ${newStatus}`,
      createdAt: new Date().toISOString(),
    });

    this.saveSnapshot(this.state);
    return app;
  }

  public async getStatusHistory(applicationId: string): Promise<ApplicationStatusHistoryRecord[]> {
    return this.state.statusHistory.filter((h) => h.applicationId === applicationId);
  }

  // --- SAVED JOBS ---
  public async getSavedJobs(userId: string): Promise<SavedJobRecord[]> {
    return this.state.savedJobs.filter((s) => s.userId === userId);
  }

  public async toggleSaveJob(jobId: string, userId: string): Promise<boolean> {
    const idx = this.state.savedJobs.findIndex((s) => s.jobId === jobId && s.userId === userId);
    if (idx !== -1) {
      this.state.savedJobs.splice(idx, 1);
      this.saveSnapshot(this.state);
      return false; // Removed
    } else {
      this.state.savedJobs.push({
        id: "save-" + Math.random().toString(36).substring(2, 9),
        jobId,
        userId,
        createdAt: new Date().toISOString(),
      });
      this.saveSnapshot(this.state);
      return true; // Added
    }
  }

  // --- STATS ---
  public async getPlatformStats() {
    return {
      totalUsers: this.state.users.length,
      totalJobSeekers: this.state.users.filter((u) => u.role === "JOB_SEEKER").length,
      totalRecruiters: this.state.users.filter((u) => u.role === "RECRUITER").length,
      totalActiveJobs: this.state.jobs.filter((j) => j.status === "PUBLISHED").length,
      totalApplications: this.state.applications.length,
      recentActivity: this.state.statusHistory.slice(-10).reverse(),
    };
  }

  public async getRecruiterStats(recruiterId: string) {
    const myJobs = this.state.jobs.filter((j) => j.recruiterId === recruiterId);
    const myJobIds = new Set(myJobs.map((j) => j.id));
    const myApps = this.state.applications.filter((a) => myJobIds.has(a.jobId));

    const statusCounts = {
      APPLIED: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    myApps.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    return {
      activeJobs: myJobs.filter((j) => j.status === "PUBLISHED").length,
      totalJobs: myJobs.length,
      totalApplications: myApps.length,
      underReview: statusCounts.UNDER_REVIEW,
      shortlisted: statusCounts.SHORTLISTED,
      interview: statusCounts.INTERVIEW,
      hired: statusCounts.HIRED,
      pipeline: statusCounts,
    };
  }

  public async getSeekerStats(userId: string) {
    const myApps = this.state.applications.filter((a) => a.applicantId === userId);
    return {
      totalApplications: myApps.length,
      underReview: myApps.filter((a) => a.status === "UNDER_REVIEW").length,
      shortlisted: myApps.filter((a) => a.status === "SHORTLISTED").length,
      interview: myApps.filter((a) => a.status === "INTERVIEW").length,
      hired: myApps.filter((a) => a.status === "HIRED").length,
      savedJobsCount: this.state.savedJobs.filter((s) => s.userId === userId).length,
    };
  }
}

// Singleton database instance
export const db = new DatabaseManager();
export default db;
