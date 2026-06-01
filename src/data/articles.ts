export type Article = {
  aiSummary: string;
  category: string;
  content: string[];
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
  title: string;
  topics: string[];
};

export const articles: Article[] = [
  {
    slug: "mastering-the-mern-stack-in-2026",
    title: "Mastering the MERN Stack in 2026",
    category: "Architecture",
    date: "May 10, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "A practical look at how React 19, Node.js services, and cleaner data boundaries make MERN applications easier to scale.",
    aiSummary:
      "This article argues that modern MERN success depends less on the stack itself and more on disciplined component boundaries, explicit API contracts, and predictable state flow.",
    topics: ["React 19", "Node.js", "MongoDB", "API Design"],
    content: [
      "The MERN stack still works well in 2026, but the baseline expectation is higher. Shipping a React frontend with a Node API is no longer enough if the interface collapses under state complexity or the backend becomes an unstructured collection of routes.",
      "The strongest MERN products now separate concerns more aggressively. React should own experience and interaction flow, while the API should expose durable contracts that remain stable even as UI requirements expand. That discipline reduces regressions and gives new features somewhere clean to land.",
      "What changed most is the quality bar for product feel. Faster rendering, better transition states, and clearer data ownership matter just as much as the tech choice itself. The stack is still relevant, but the implementation style has to be more intentional.",
    ],
  },
  {
    slug: "esp32-iot-the-new-frontier",
    title: "ESP32 & IoT: The New Frontier",
    category: "IoT Systems",
    date: "May 05, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Why low-cost telemetry hardware becomes powerful once its data is shaped into useful product decisions.",
    aiSummary:
      "The piece frames ESP32 not as a gadget choice, but as a systems entry point for collecting real-world signals and transforming them into responsive dashboards.",
    topics: ["ESP32", "Telemetry", "Realtime Data", "Dashboards"],
    content: [
      "ESP32 projects become meaningful when they stop being demos and start becoming decision tools. A sensor feed on its own is just output. The real product work begins when that output is cleaned, interpreted, and connected to actions people can take.",
      "Reliable telemetry systems are mostly about handling imperfect conditions. Devices disconnect, payloads arrive late, and values drift. The frontend should reflect that reality honestly instead of pretending every signal is stable and precise.",
      "Good IoT UX avoids overwhelming people with numbers. It turns raw events into timelines, alerts, and confidence indicators. That is where hardware and software finally start behaving like one coherent product.",
    ],
  },
  {
    slug: "ai-driven-ux-design",
    title: "AI-Driven UX Design",
    category: "Design Systems",
    date: "April 28, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "How AI-generated context can help users scan a product faster without replacing the underlying content.",
    aiSummary:
      "This article explores AI as a comprehension layer for interfaces, where summaries and guided context reduce friction without flattening the original work.",
    topics: ["AI UX", "Summaries", "Content Design", "Portfolio UI"],
    content: [
      "AI in interface design is most useful when it helps people orient themselves quickly. That usually means summarizing long content, explaining dense sections, or bridging the gap between overview and detail.",
      "The mistake is using AI as decoration. If the model output does not improve understanding, it becomes one more thing competing for attention. Strong AI UX is quiet, purposeful, and placed exactly where users are likely to hesitate.",
      "A portfolio is a good example. Recruiters, collaborators, and technical reviewers all arrive with different context. A well-placed AI summary can accelerate the first read while still allowing the full work to stand on its own.",
    ],
  },
  {
    slug: "cybersecurity-in-web-apps",
    title: "Cybersecurity in Web Apps",
    category: "Security",
    date: "April 15, 2026",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Security work becomes more effective when it is built into product decisions early instead of added after launch.",
    aiSummary:
      "The article emphasizes that practical web security is a workflow discipline involving safer defaults, clearer permissions, and fewer hidden assumptions across the stack.",
    topics: ["Authentication", "Authorization", "App Security", "Backend"],
    content: [
      "Web application security rarely fails because one team forgot that security matters. It usually fails because the system has too many implicit assumptions spread across UI, API, and database behavior.",
      "The most reliable way to improve security is to simplify those assumptions. Authentication should be obvious, authorization should be intentional, and sensitive actions should have traceable entry points.",
      "Security also affects product trust. Clear session behavior, understandable permissions, and predictable error handling are not just technical controls. They are interface decisions that tell users whether a product is safe to rely on.",
    ],
  },
];

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug);
