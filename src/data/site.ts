/**
 * Site configuration
 * Unified configuration for the portfolio website
 */

export const BLUR_FADE_DELAY = 0.05;

export const siteConfig = {
  url: "https://www.zangwei.dev", // Use 'www' for vercel recommendation
  lastUpdated: "2025.12",
  avatarUrl: "/me.png",
  blog: {
    /* Number of posts per page on the blog list */
    postsPerPage: 6,
  },
} as const;
