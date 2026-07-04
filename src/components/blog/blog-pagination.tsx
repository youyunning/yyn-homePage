import { getTranslations } from "next-intl/server";

import { Icons } from "@/components/icons";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
}

/* Returns the canonical href for a given blog list page (1 → /blog) */
function getPageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export async function BlogPagination({
  currentPage,
  totalPages,
  locale,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const t = await getTranslations({ locale });
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const navClass =
    "border-border bg-card text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";
  const disabledClass =
    "border-border bg-card text-muted-foreground/50 inline-flex cursor-not-allowed items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium opacity-60";

  return (
    <nav
      className="mt-10 flex items-center justify-between gap-4"
      aria-label="Blog pagination"
    >
      {hasPrev ? (
        <Link
          href={getPageHref(currentPage - 1)}
          locale={locale}
          aria-label={t("blog.pagination.previousLabel")}
          className={cn(navClass)}
        >
          <Icons.chevronleft className="h-4 w-4" aria-hidden="true" />
          <span>{t("blog.pagination.previous")}</span>
        </Link>
      ) : (
        <span className={cn(disabledClass)} aria-disabled="true">
          <Icons.chevronleft className="h-4 w-4" aria-hidden="true" />
          <span>{t("blog.pagination.previous")}</span>
        </span>
      )}

      <span
        className="text-muted-foreground text-xs sm:text-sm"
        aria-current="page"
      >
        {t("blog.pagination.pageInfo", {
          current: currentPage,
          total: totalPages,
        })}
      </span>

      {hasNext ? (
        <Link
          href={getPageHref(currentPage + 1)}
          locale={locale}
          aria-label={t("blog.pagination.nextLabel")}
          className={cn(navClass)}
        >
          <span>{t("blog.pagination.next")}</span>
          <Icons.chevronright className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(disabledClass)} aria-disabled="true">
          <span>{t("blog.pagination.next")}</span>
          <Icons.chevronright className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
