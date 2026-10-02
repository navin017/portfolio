// Single source of truth for portfolio content — keep in sync with the resume.
export const profile = {
  name: "Naveen Elango",
  role: "Full Stack Developer",
  tagline: "I build real-time, enterprise-grade web applications with React and Node.js.",
  location: "Chennai, India",
  email: "naveenelango018@gmail.com",
  linkedin: "https://www.linkedin.com/in/naveen-elango-4841302a6",
  github: "https://github.com/navin017",
  resume: "/Naveen_Elango_Resume.pdf",
  yearsExperience: "3.5+",
};

export const about = [
  "I'm a Full Stack Developer at E2 Infosystems in Chennai, where I've spent the last 3.5+ years building enterprise web applications end-to-end, from React interfaces to Node.js services and MySQL data models.",
  "My specialty is real-time systems: WebSocket/STOMP dashboards that push critical alerts in under a second, and RabbitMQ messaging that bridges AMQP and MQTT across distributed environments. I also contribute to system design, review code, and mentor junior developers.",
  "I also build with Generative AI. The assistant on this site (try the button in the corner) runs on Google Gemini, and I use Claude Code every day to research, prototype, and ship faster without cutting corners on quality.",
];

export const stats = [
  { value: "3.5+", label: "Years building production software" },
  { value: "<1s", label: "Alert latency on real-time dashboards" },
  { value: "3", label: "Production platforms contributed to" },
];

export const skills = [
  { group: "Frontend", items: ["React.js", "Angular", "Redux", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive UI"] },
  { group: "Backend", items: ["Node.js", "Express.js", "REST API Design", "Sequelize ORM", "WebSockets", "STOMP"] },
  { group: "Messaging & Data", items: ["RabbitMQ (AMQP / MQTT)", "Redis", "MySQL", "MariaDB", "Database Design"] },
  { group: "Architecture", items: ["Microservices", "Event-Driven Architecture", "Pub/Sub Messaging", "Real-Time Systems", "Component-Based Architecture", "RBAC"] },
  { group: "Tooling", items: ["Git & GitHub", "Jest", "Webpack", "Sentry", "AWS CloudWatch (Log Analysis)", "Ubuntu Linux", "Agile"] },
  { group: "Generative AI", items: ["Google Gemini API", "LLM Integration", "Prompt Engineering", "Streaming Responses", "Claude Code"] },
];

export const experience = [
  {
    title: "Full Stack Developer",
    company: "E2 Infosystems",
    location: "Chennai",
    period: "Mar 2023 – Present",
    points: [
      "Develop and maintain enterprise web applications end-to-end, owning features across React/Redux frontends, Node.js/Express REST APIs, and MySQL/MariaDB data layers.",
      "Contribute to system design and architecture decisions for microservices-based platforms, helping shape service structure, messaging patterns, and frontend architecture.",
      "Mentor junior developers on React component patterns and best practices, and review peer code.",
      "Analyze production logs in AWS CloudWatch and Sentry to trace errors, find root causes, and resolve issues.",
      "Work with cross-functional teams in Agile sprints to take features from requirements through to production releases.",
    ],
  },
];

export const projects = [
  {
    name: "CATMO",
    kind: "Enterprise Safety & Communication Platform",
    role: "Full Stack Developer",
    featured: true,
    summary:
      "A real-time platform for safety alerts, event communication, and emergency mustering across a distributed enterprise network.",
    points: [
      "Real-time operational dashboards over WebSocket + STOMP, delivering critical safety alerts with sub-second latency.",
      "Cross-protocol messaging infrastructure on RabbitMQ (AMQP and MQTT) coordinating multi-channel communication.",
      "Role-based reporting and mustering workflows built end-to-end: React UI, Express APIs, Sequelize models.",
      "QR-based registration and personnel safety check-in, improving mobile adoption and tracking accuracy.",
    ],
    tech: ["React.js", "Redux", "Node.js", "Express.js", "MySQL", "MariaDB", "Sequelize", "RabbitMQ", "Redis", "WebSockets", "STOMP"],
  },
  {
    name: "AI Portfolio Assistant",
    kind: "Generative AI Chatbot",
    role: "Personal Project",
    summary:
      "The \"Ask AI about me\" assistant on this site. It answers recruiter questions about my background in real time.",
    points: [
      "Streams Google Gemini responses token-by-token from a Node.js serverless function into a React chat UI.",
      "Grounds every answer in structured profile data through prompt engineering, with guardrails against made-up facts.",
      "Input limits and per-IP rate limiting protect the API key and keep costs predictable.",
    ],
    tech: ["React.js", "Node.js", "Google Gemini API", "Server-Sent Events", "Vercel Serverless"],
  },
  {
    name: "Formicon",
    kind: "Multi-Tenant SaaS Workflow Platform",
    role: "Frontend Developer",
    summary:
      "A multi-tenant SaaS platform for forms, approvals, and task workflows, with per-tenant roles and permissions. SSO-ready and SOC 2 Type II.",
    points: ["Built frontend features, including notification functionality, for a multi-tenant permission model."],
    tech: ["React.js", "Python"],
  },
  {
    name: "Certify",
    kind: "QR-Secured E-Certificate Platform",
    role: "Frontend Contributor",
    summary: "A platform for issuing e-certificates and verifying them through secure QR codes.",
    points: ["Delivered frontend bug fixes and UI refinements that improved platform stability and usability."],
    tech: ["React.js", "TypeScript", "Python"],
  },
];

export const education = {
  degree: "B.E., Electronics and Communication Engineering",
  school: "Sri Shanmugha College of Engineering and Technology, Salem",
  year: "2023",
};

export const certifications = [
  {
    name: "Frontend Developer (React)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/5da4cc5d4158",
  },
];
