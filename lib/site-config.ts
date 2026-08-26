export const siteConfig = {
  name: "Dhruv Kumar",
  title: "Dhruv Kumar - AI / Full-stack engineer",
  description:
    "Dhruv Kumar, AI / full-stack engineer in Punjab, India. RAG pipelines, real-time systems, production React and TypeScript.",
  ogDescription:
    "RAG pipelines, real-time ordering systems, row-level-secure backends, plus the occasional Rust desktop pet.",
  url: "https://dhruvkumar.dev",
  email: "dhruvkumar1805@gmail.com",
  location: "Punjab, India",
  timezone: "IST · UTC+5:30",
  github: "https://github.com/dhruvkumar1805",
  githubHandle: "dhruvkumar1805",
  linkedin: "https://linkedin.com/in/dhruvkumar1805",
  twitter: "https://x.com/dhruvkumar1805",
  resume: "/resume.pdf",
};

export const navLinks = [
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#stack", label: "Stack", id: "stack" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  tag: string;
  description: string;
  metricValue?: string;
  metricLabel?: string;
  stack: string[];
  href: string;
  hrefLabel: string;
  caseStudyHref?: string;
  image?: string;
  stats?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "solvo",
    index: "01",
    title: "Solvo",
    tag: "Solo build · shipped",
    description:
      "An embeddable AI support widget. One script tag and a site answers its visitors from its own docs, and every answer cites the chunk it came from.",
    metricValue: "90%",
    metricLabel: "Query relevance · under 2s",
    stack: ["pgvector", "Gemini 2.5 Flash", "Next.js 16", "Prisma"],
    href: "https://solvochat.com",
    hrefLabel: "solvochat.com",
    caseStudyHref: "/projects/solvo",
    image: "/images/projects/solvo-dashboard.jpg",
    stats: [
      { label: "Role", value: "Sole designer & engineer" },
      { label: "Retrieval", value: "400-word chunks, 50 overlap" },
      { label: "Answer time", value: "Under 2 seconds" },
    ],
  },
  {
    slug: "bunnys-cafe",
    index: "02",
    title: "Bunny's Cafe ordering system",
    tag: "Pitched & built solo · live",
    description:
      "The cafe behind my college was jammed every lunch break, so the queue was the product. I pitched the owner, then built the whole thing solo: the menu in every student's hand, pay online or cash at the counter, kitchen watching orders land in real time.",
    metricValue: "+35%",
    metricLabel: "Checkout completion",
    stack: ["Server-Sent Events", "Razorpay", "Prisma", "Firebase Auth"],
    href: "https://bunnyscafe.in",
    hrefLabel: "bunnyscafe.in",
    caseStudyHref: "/projects/bunnys-cafe",
    image: "/images/projects/bunnys-cafe-admin.jpg",
    stats: [
      { label: "Role", value: "Pitched, designed & built solo" },
      { label: "Order status", value: "1.5s refresh, diffed not polled" },
      { label: "Shipped", value: "195 commits, solo" },
    ],
  },
  {
    slug: "nekopet",
    index: "03",
    title: "nekopet",
    tag: "Open source · solo build",
    description:
      "A desktop pet for Wayland, in Rust. Speaks wlr-layer-shell directly, reads raw keys from /dev/input, renders sprites through shared-memory buffers. Its eyes follow the cursor.",
    metricValue: "1,000",
    metricLabel: "Lines of Rust",
    stack: ["Rust", "Wayland", "smithay-client-toolkit"],
    href: "https://github.com/dhruvkumar1805/nekopet",
    hrefLabel: "github",
    caseStudyHref: "/projects/nekopet",
    stats: [
      { label: "Role", value: "Open source, solo build" },
      { label: "States", value: "7, one event loop, no library" },
      { label: "Dependencies", value: "0 external processes" },
    ],
  },
  {
    slug: "cipheros",
    index: "04",
    title: "CipherOS & DerpFest builds",
    tag: "Official maintainer · 2 ROMs",
    description:
      "Maintainer for the Redmi S2/Y2 (ysl) on two ROMs: kernel compiled from source, device trees for the msm8953 platform kept current, patches carried upstream.",
    metricValue: "2,500+",
    metricLabel: "Installs per release",
    stack: ["AOSP", "Linux Kernel", "msm8953", "Jenkins"],
    href: "https://cipheros.org.in/",
    hrefLabel: "cipheros.org.in",
    caseStudyHref: "/projects/cipheros",
    stats: [
      { label: "Role", value: "Official maintainer, 2 ROMs" },
      { label: "Platform", value: "msm8953 device trees" },
      { label: "Active", value: "2021–22" },
    ],
  },
];

export type WorkEntry = {
  role: string;
  org: string;
  period: string;
  points: string[];
  stack: string[];
};

export const work: WorkEntry[] = [
  {
    role: "Founding Full-Stack AI Engineer",
    org: "Nomara USA",
    period: "Jul 2026 to now",
    points: [
      "Sole engineer on Nomara's multi-tenant agency platform: own the schema, the RLS policies, the edge functions, the UI, working straight with the two founders on architecture and product calls.",
      "Ran a security pass that closed 35+ vulnerabilities across 26 fixes, an unauthenticated account-takeover flow and cross-tenant RLS leaks among them. Cut route bundle sizes up to 92%, 324KB down to 26KB, by code-splitting panels across four major routes.",
      "Traced a recurring cloud storage bill to a duplication bug in the archive pipeline rather than a provider problem, averting a proposed multi-month AWS migration and cutting retention costs 50% with a fix shipped in days. Also wired the OAuth auto-publish pipeline to Meta, TikTok and YouTube.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "RLS",
      "Playwright",
      "Vitest",
    ],
  },
  {
    role: "Full-Stack Developer, freelance",
    org: "Bunny's Cafe",
    period: "Apr to May 2026",
    points: [
      "Sole developer on a paid engagement: requirements straight from the owner, then design, build, deploy and handoff of a production ordering system.",
      "QR-code table entry, rate-limited phone OTP auth, live order status over Server-Sent Events with a Web Push fallback, admin dashboard, Razorpay payments, Cloudinary media. Checkout completion rose 35% after launch.",
    ],
    stack: [
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Firebase Auth",
      "Razorpay",
      "Cloudinary",
    ],
  },
  {
    role: "Android Platform Developer",
    org: "CipherOS, open source",
    period: "2021 to 2022",
    points: [
      "Maintained official custom ROM builds for the Redmi S2/Y2 (ysl) from AOSP source across two projects: kernel compilation, device-tree configuration, upstream patch integration.",
      "Releases averaged 2,500+ downloads each, with distributed maintainer teams on GitHub and user bug triage on the side.",
    ],
    stack: ["AOSP", "Linux Kernel", "Device Trees", "Jenkins", "Bash"],
  },
];

export type StackTool = {
  name: string;
  note: string;
  daily: boolean;
};

export type StackCategory = {
  category: string;
  tools: StackTool[];
};

export const stack: StackCategory[] = [
  {
    category: "Languages",
    tools: [
      {
        name: "TypeScript",
        note: "Every product ships in strict mode",
        daily: true,
      },
      {
        name: "Rust",
        note: "nekopet, and anything that must not fall over",
        daily: true,
      },
      {
        name: "JavaScript",
        note: "Where a build step would be overkill",
        daily: false,
      },
      {
        name: "C++",
        note: "Kernel and ROM work, when it asks for it",
        daily: false,
      },
      { name: "C", note: "Device trees, drivers, the low shelf", daily: false },
    ],
  },
  {
    category: "Frameworks",
    tools: [
      {
        name: "Next.js",
        note: "App Router end to end, server actions included",
        daily: true,
      },
      {
        name: "React",
        note: "The default surface for everything I build",
        daily: true,
      },
      {
        name: "Tailwind CSS",
        note: "Design tokens I can keep in my head",
        daily: true,
      },
      {
        name: "Node.js",
        note: "Workers, webhooks, glue that has to stay up",
        daily: false,
      },
      {
        name: "Express",
        note: "When a route file is the whole backend",
        daily: false,
      },
      {
        name: "Prisma",
        note: "Migrations that keep the schema honest",
        daily: false,
      },
      {
        name: "Framer Motion",
        note: "Motion that explains, not decorates",
        daily: false,
      },
      {
        name: "Playwright",
        note: "E2E coverage that catches a regression before a client does",
        daily: false,
      },
      {
        name: "Vitest",
        note: "Unit tests fast enough that I actually run them",
        daily: false,
      },
    ],
  },
  {
    category: "AI",
    tools: [
      {
        name: "Gemini API",
        note: "Streaming answers with citations attached",
        daily: true,
      },
      {
        name: "RAG pipelines",
        note: "Chunking, retrieval, eval loops I can debug",
        daily: true,
      },
      {
        name: "pgvector",
        note: "Embeddings living next to the real data",
        daily: true,
      },
      {
        name: "LLM integration",
        note: "Prompt plumbing, tools, and cost limits",
        daily: false,
      },
    ],
  },
  {
    category: "Data",
    tools: [
      {
        name: "PostgreSQL",
        note: "First choice, row-level security from day one",
        daily: true,
      },
      {
        name: "Supabase",
        note: "Auth, storage, realtime without a backend team",
        daily: true,
      },
      {
        name: "MongoDB",
        note: "Older projects that still pay rent",
        daily: false,
      },
    ],
  },
  {
    category: "Infrastructure",
    tools: [
      {
        name: "Vercel",
        note: "Preview per branch, ship on merge",
        daily: true,
      },
      {
        name: "Linux",
        note: "Daily driver, Wayland session and all",
        daily: true,
      },
      {
        name: "GitHub Actions",
        note: "CI that keeps building while I sleep",
        daily: false,
      },
      { name: "Jenkins", note: "ROM pipelines, nightly builds", daily: false },
      {
        name: "Bash",
        note: "The glue under every repeatable task",
        daily: false,
      },
      { name: "GCP", note: "Buckets, jobs, the occasional VM", daily: false },
      {
        name: "Azure",
        note: "Client estates that already live there",
        daily: false,
      },
    ],
  },
];

export const education = {
  degree: "Bachelor of Computer Applications",
  school: "Chandigarh University",
  location: "Punjab, India",
  period: "2023 — 2026",
  note: "Most of what I ship I learned outside the syllabus: ROM maintainership taught me build systems; a paying cafe taught me deadlines.",
};
