"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { DATA, getEmail } from "@/data";

// Use DATA.contact.social directly instead of redefining socialLinks

export default function Footer() {
  const pathname = usePathname();
  const isChinese = pathname.startsWith("/zh");
  const currentYear = new Date().getFullYear();
  const isStaticFileHref = (href: string) =>
    href.endsWith(".pdf") ||
    href.endsWith(".png") ||
    href.endsWith(".jpg") ||
    href.endsWith(".jpeg");

  // Translations directly in the component
  const translations = {
    en: {
      navigation: {
        about: "About",
        projects: "Projects",
        education: "Education",
        experience: "Experience",
        skills: "Skills",
        awards: "Awards",
      },
      sections: {
        quickNavigation: "Quick Navigation",
        connect: "Connect",
        resources: "Resources",
        discover: "Discover",
        contact: "Contact",
      },
      resources: {
        blog: "Blog",
        downloadCV: "Download CV",
      },
      contact: {
        support: "Support",
      },
      legal: {
        allRightsReserved: "All rights reserved",
        privacyPolicy: "Privacy Policy",
        termsDisclaimer: "Terms & Disclaimer",
      },
      bottom: {
        lastUpdated: "Last updated",
        madeWith: "Made with",
        modifiedFrom: "Build with",
      },
    },
    zh: {
      navigation: {
        about: "关于",
        projects: "项目",
        education: "教育",
        experience: "经历",
        skills: "技能",
        awards: "奖项",
      },
      sections: {
        quickNavigation: "快速导航",
        connect: "联系",
        resources: "资源",
        discover: "发现",
        contact: "联系",
      },
      resources: {
        blog: "博客",
        downloadCV: "下载简历",
      },
      contact: {
        support: "支持",
      },
      legal: {
        allRightsReserved: "版权所有",
        privacyPolicy: "隐私政策",
        termsDisclaimer: "条款与免责声明",
      },
      bottom: {
        lastUpdated: "最后更新",
        madeWith: "追随",
        modifiedFrom: "修改自",
      },
    },
  };

  const t = isChinese ? translations.zh : translations.en;

  // Create navigation sections with translations
  const translatedNavigationSections = [
    { name: t.navigation.about, href: "#about" },
    { name: t.navigation.projects, href: "#projects" },
    { name: t.navigation.education, href: "#education" },
    { name: t.navigation.experience, href: "#work" },
    { name: t.navigation.skills, href: "#skills" },
    { name: t.navigation.awards, href: "#awards" },
  ];

  return (
    <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12 pb-20 sm:px-16 md:px-20 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.sections.quickNavigation}
            </h3>
            <nav className="space-y-2">
              {translatedNavigationSections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {section.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.sections.connect}
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.values(DATA.contact.social)
                .filter((social) => social.footer)
                .map((social) =>
                  isStaticFileHref(social.url) ? (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ) : (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  ),
                )}
            </div>
          </div>

          {/* Blog & CV */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.sections.resources}
            </h3>
            <nav className="space-y-2">
              <Link
                href={isChinese ? "/zh/blog" : "/blog"}
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                {t.resources.blog}
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                {t.resources.downloadCV}
              </a>
            </nav>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.sections.discover}
            </h3>
            <nav className="space-y-2">
              {DATA.discover.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.sections.contact}
            </h3>
            <div className="text-muted-foreground space-y-2 text-sm">
              <Link
                href={DATA.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground block transition-colors"
              >
                {DATA.location}
              </Link>
              <Link
                href={getEmail()}
                className="hover:text-foreground block transition-colors"
              >
                {t.contact.support}
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Copyright and Legal Links - Desktop: same line, Mobile: separate lines */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                © {currentYear} {isChinese ? DATA.chinese.name : DATA.name}
              </span>
              <span>•</span>
              <span>{t.legal.allRightsReserved}</span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Link
                href={isChinese ? "/zh/privacy" : "/privacy"}
                className="hover:text-foreground transition-colors"
              >
                {t.legal.privacyPolicy}
              </Link>
              <span>•</span>
              <Link
                href={isChinese ? "/zh/terms" : "/terms"}
                className="hover:text-foreground transition-colors"
              >
                {t.legal.termsDisclaimer}
              </Link>
            </div>
          </div>

          {/* Last Updated and Made with - Desktop: same line, Mobile: separate lines */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm">
              {t.bottom.lastUpdated}: {DATA.lastUpdated}
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{t.bottom.madeWith}</span>
              <Icons.heartbeat className="h-4 w-4 fill-red-500 text-red-500" />
              <span>•</span>
              <span>{t.bottom.modifiedFrom}</span>
              <Link
                href="https://github.com/zhengzangw/nextjs-portfolio-blog-research"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <Icons.github className="h-4 w-4" />
                <span>zhengzangw/nextjs-portfolio-blog-research</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
