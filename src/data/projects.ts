export type ProjectGalleryImage = {
  url: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  shortSummary: string;
  description: string;
  techStack: string[];
  topBannerImg: string;
  live: string;
  github: string;
  image: ProjectGalleryImage[];
};

export const projects: Project[] = [
  {
    id: "proj-1",
    slug: "rabta-social-platform",
    title: "Rabta Social Platform",
    shortSummary:
      "A social application with live messaging, activity updates, and responsive community spaces.",
    description:
      "Rabta explores how social products can feel fast, lightweight, and more human. The interface was built around active conversations, user presence, and quick transitions between feed content and direct discussion.\n\nThe product direction favors clarity over noise. Rather than stacking too many features, the system emphasizes smooth messaging, useful notifications, and clean relationship between profiles, posts, and realtime chat flows.",
    techStack: ["React", "Socket.io", "Express", "MongoDB", "Tailwind CSS"],
    topBannerImg:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    live: "https://rabta.app",
    github: "https://github.com/username/rabta",
    image: [
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },
  {
    id: "proj-2",
    slug: "shipsmart-logistics",
    title: "ShipSmart Logistics",
    shortSummary:
      "A full-stack operations dashboard that turns shipment telemetry into clear delivery decisions.",
    description:
      "ShipSmart is designed for teams that need shipment visibility without reading raw telemetry streams. It combines a React control surface with an event-driven backend so operations staff can track location, delivery confidence, and route delays in one place.\n\nThe project focuses on making complex logistics signals understandable. Alerts, route summaries, and status views were structured to reduce response time for dispatch teams and create a simpler handoff between warehouse, rider, and customer updates.",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "ESP32"],
    topBannerImg:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    live: "https://shipsmart.app",
    github: "https://github.com/username/shipsmart",
    image: [
      {
        url: "https://images.unsplash.com/photo-1586528116493-cac3586f0f44?auto=format&fit=crop&w=500&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500&q=80",
      },
    ],
  }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
