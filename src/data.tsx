import { Icons } from "@/components/icons";
import { siteConfig } from "@/data/site";

export const DATA = {
  url: siteConfig.url,
  lastUpdated: siteConfig.lastUpdated,
  name: "Youyinian",
  description: "iOS & Java Developer",
  chinese: {
    name: "有一年",
  },
  navbar: [
    { href: "/", icon: Icons.home, label: "Home" },
    { href: "/blog", icon: Icons.notebook, label: "Blog" },
    { href: "/resume.pdf", icon: Icons.fileuser, label: "CV" },
  ],
  location: "Wuhan, China",
  locationLink: "https://www.google.com/maps/place/wuhan",
  discover: [
    {
      name: "GitHub",
      url: "https://github.com/youyunning/yyn-homePage",
    },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/youyunning",
        icon: Icons.github,
        footer: true,
      },
      email: {
        name: "Email",
        url: "mailto:youyunning@cug.edu.cn",
        icon: Icons.email,
        footer: false,
      },
    },
  },
} as const;

export function getEmail(): string {
  return DATA.contact.social.email.url;
}
