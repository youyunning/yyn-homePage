import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { siteConfig } from "@/data/site";
import { LOCALES, routing } from "@/i18n/routing";
import { getBlogPosts, getPaginatedBlogPosts } from "@/lib/blog";
import { generateBlogJsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { jsonldScript } from "@/lib/utils";

type RouteParams = {
  locale: string;
  page: string;
};

type MetadataProps = {
  params: Promise<RouteParams>;
};

function parsePage(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number.parseInt(value, 10);
  /* Page 1 lives at /blog – avoid duplicate URLs by 404'ing /blog/page/1 */
  return parsed >= 2 ? parsed : null;
}

export async function generateStaticParams() {
  const postsPerPage = siteConfig.blog.postsPerPage;
  const params: Array<{ locale: string; page: string }> = [];

  for (const locale of LOCALES) {
    const posts = await getBlogPosts(locale);
    const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
    for (let page = 2; page <= totalPages; page++) {
      params.push({ locale, page: String(page) });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, page } = await params;
  const t = await getTranslations({ locale });
  const pageNumber = parsePage(page);

  if (pageNumber === null) {
    return constructMetadata({
      title: t("blog.title"),
      description: t("blogTagline"),
      path: "/blog",
      locale,
    });
  }

  return constructMetadata({
    title: `${t("blog.title")} – ${t("blog.pagination.pageInfo", {
      current: pageNumber,
      total: pageNumber,
    })}`,
    description: t("blogTagline"),
    path: `/blog/page/${pageNumber}`,
    locale,
  });
}

export default async function BlogPaginatedPage(props: {
  params: Promise<RouteParams>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const pageNumber = parsePage(params.page);

  if (pageNumber === null) notFound();

  const { posts, currentPage, totalPages } = await getPaginatedBlogPosts(
    locale,
    pageNumber,
  );

  if (pageNumber > totalPages || posts.length === 0) notFound();

  const blogJsonLd = generateBlogJsonLd(posts);
  const t = await getTranslations({ locale });

  return (
    <main className="pt-16 pb-12 sm:pt-24 sm:pb-14 md:pt-32 md:pb-16 lg:pt-36 xl:pt-40">
      {jsonldScript(blogJsonLd)}
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 md:px-10">
        <h1 className="mb-4 text-3xl font-semibold tracking-tighter md:text-4xl">
          {t("blog.title")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl text-sm md:text-base">
          {t("blogTagline")}
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              locale={locale}
              slug={post.slug}
              title={post.metadata.title}
              date={post.metadata.date}
              summary={post.metadata.summary}
            />
          ))}
        </div>

        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          locale={locale}
        />
      </div>
    </main>
  );
}
