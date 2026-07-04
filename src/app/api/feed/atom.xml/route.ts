import { DATA, getEmail } from "@/data";
import { getBlogPosts } from "@/lib/blog";

// ISR configuration - revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  const posts = await getBlogPosts();
  const authorEmail = extractEmailAddress(getEmail());

  // Sort posts by published date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return (
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );
  });

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${DATA.name} - Blog</title>
  <subtitle>${DATA.description}</subtitle>
  <link href="${DATA.url}/blog" rel="self"/>
  <link href="${DATA.url}"/>
  <id>${DATA.url}/blog</id>
  <author>
    <name>${DATA.name}</name>
    <email>${authorEmail}</email>
  </author>
  <updated>${new Date().toISOString()}</updated>
  ${sortedPosts
    .map((post) => {
      const postUrl = `${DATA.url}/blog/${post.slug}`;
      const publishedDate = new Date(post.metadata.date).toISOString();
      const updatedDate = new Date(post.metadata.date).toISOString();

      return `
  <entry>
    <title>${escapeXml(post.metadata.title)}</title>
    <link href="${postUrl}"/>
    <id>${postUrl}</id>
    <published>${publishedDate}</published>
    <updated>${updatedDate}</updated>
    <author>
      <name>${DATA.name}</name>
      <email>${authorEmail}</email>
    </author>
    <summary>${escapeXml(post.metadata.summary || "")}</summary>
    <content type="html">${escapeXml(post.source)}</content>
  </entry>`;
    })
    .join("")}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractEmailAddress(emailUrl: string): string {
  return emailUrl.replace(/^mailto:/i, "");
}
