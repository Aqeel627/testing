"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { IconName } from "@/lib/utils";
import Icon from "@/icons/icons";
import { highlight } from "@/components/modal/search";

type IconGalleryProps = {
  names: IconName[];
};

export default function IconGallery({ names }: IconGalleryProps) {
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return names;
    return names.filter((n: any) => n.toLowerCase().includes(q));
  }, [names, query]);

  const handleCopy = async (name: string) => {
    const usage = `<Icon name="${name}" />`;

    try {
      await navigator.clipboard.writeText(usage);
      setCopied(name);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = usage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(name);
      setTimeout(() => setCopied(null), 1200);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-(--primary-color)">Icon Library</h1>

        <input
          className="w-full md:w-80 rounded-md border border-(--primary-color) px-3 py-2 outline-none"
          placeholder="Search icons by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <p className="mb-4 text-sm text-(--secondary-text-color)">
        Add icons to the registry file and they will automatically appear here.
        Click any card to copy the JSX selector.
      </p>

      {/* Grid */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((name: any) => (
          <motion.button
            key={name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy(name)}
            className="relative rounded-md focus:outline-none"
          >
            {/* Card */}
            <div
              className="flex h-28 w-full flex-col cursor-pointer items-center justify-center gap-2 rounded-md p-3 transition-colors bg-(--sidebar-badge-bg) border border-(--primary-color)"
            >
              <div className="flex h-10 w-10 items-center justify-center">
                <Icon name={name} className="h-8 w-8" />
              </div>

              <span className="text-xs font-medium">{highlight(name,query)}</span>

              {/* <span
                className="text-[10px]"
                style={{ color: "var(--secondary-color)" }}
              >
                Copy selector
              </span> */}
            </div>

            {/* Copied badge */}
            {copied === name && (
              <span
                className="absolute right-2 top-2 rounded-md px-2 py-1 text-[10px]"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--primary-color)",
                }}
              >
                Copied!
              </span>
            )}
          </motion.button>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="mt-10 text-center text-sm opacity-70">
          No icons match “{query}”.
        </div>
      )}
    </div>
  );
}