"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Icon from "@/icons/icons";

interface BreadCrumbProps {
  /** Override the page title shown above the crumbs. Defaults to last segment. */
  title?: string;
  /** Optional subtitle shown below the title (e.g. competition name). */
  subtitle?: string;
}

function slugToLabel(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SportsBreadCrumb = ({ title, subtitle }: BreadCrumbProps) => {
  const pathname = usePathname();

  // Build crumb trail from pathname segments
  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    const items = [{ label: "Home", href: "/" }];

    let builtPath = "";
    segments.forEach((seg) => {
      builtPath += `/${seg}`;
      items.push({ label: slugToLabel(seg), href: builtPath });
    });

    return items;
  }, [pathname]);

  const lastCrumb = crumbs[crumbs.length - 1];
  const pageTitle = title ?? lastCrumb?.label ?? "";

  return (
    <div className="px-2 pt-4 pb-2">
      {/* Title */}
      <h1 className="m-0 font-sans text-[1.5rem] font-bold text-white leading-tight">
        {pageTitle}
      </h1>

      {/* Subtitle (e.g. competition name on competition page) */}
      {subtitle && (
        <p className="m-0 mt-0.5 font-sans text-[0.85rem] text-[#919eab] font-medium">
          {subtitle}
        </p>
      )}

      {/* Crumb trail */}
      <nav className="flex flex-row flex-wrap items-center gap-1 mt-1.5">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <div key={crumb.href} className="flex items-center gap-1">
              {/* Separator arrow (skip before Home) */}
              {i > 0 && (
                <span className="text-[#637381]">
                  <Icon name="arrow-right" className="w-3 h-3" />
                </span>
              )}

              {isLast ? (
                <span className="text-[11px] font-bold text-white bg-[rgba(145,158,171,0.16)] px-2.5 py-0.5 rounded-[4px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[11px] font-bold text-[#919eab] bg-[rgba(145,158,171,0.08)] px-2.5 py-0.5 rounded-[4px] no-underline hover:text-white hover:bg-[rgba(145,158,171,0.16)] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SportsBreadCrumb;