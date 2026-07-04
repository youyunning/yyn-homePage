import { Icons } from "@/components/icons";
import { siteConfig } from "@/data/site";

export const DATA = {
  url: siteConfig.url,
  lastUpdated: siteConfig.lastUpdated,
  name: "Zangwei Zheng",
  description: "AI Researcher & Full Stack Developer",
  chinese: {
    name: "郑奘巍",
  },
  navbar: [
    { href: "/", icon: Icons.home, label: "Home" },
    { href: "/blog", icon: Icons.notebook, label: "Blog" },
    { href: "/resume.pdf", icon: Icons.fileuser, label: "CV" },
  ],
  location: "Singapore",
  locationLink: "https://www.google.com/maps/place/singapore",
  discover: [
    { name: "HPC-AI Lab", url: "https://ai.comp.nus.edu.sg/" },
    { name: "iCyPhy", url: "https://www.icyphy.org/people.html" },
    {
      name: "Template",
      url: "https://github.com/zhengzangw/nextjs-portfolio-blog-research",
    },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/zhengzangw",
        icon: Icons.github,
        footer: true,
      },
      X: {
        name: "X",
        url: "https://x.com/zangweizheng",
        icon: Icons.x,
        footer: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/zangweizheng/",
        icon: Icons.linkedin,
        footer: true,
      },
      email: {
        name: "Email",
        url: "mailto:zhengzangwei@gmail.com",
        icon: Icons.email,
        footer: false,
      },
    },
  },
} as const;

export function getEmail(): string {
  return DATA.contact.social.email.url;
}
