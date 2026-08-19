"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/content/types";
import { portalNav } from "@/content/nav.config";

export function MobileNav({
  items,
  basePath,
  inverse = false,
}: {
  items: NavItem[];
  basePath: string;
  inverse?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("flex h-10 w-10 items-center justify-center rounded-control", inverse ? "text-white" : "text-ink")}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-surface-raised p-6 shadow-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            >
              <div className="flex justify-end">
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-ink"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-4 flex flex-col gap-1">
                {items.map((item) => (
                  <div key={item.label} className="border-b border-border">
                    {item.children?.length ? (
                      <>
                        <button
                          className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-ink"
                          onClick={() =>
                            setExpanded((e) => (e === item.label ? null : item.label))
                          }
                          aria-expanded={expanded === item.label}
                        >
                          {item.label}
                          <ChevronDown
                            size={18}
                            className={cn(
                              "transition-transform",
                              expanded === item.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {expanded === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-3"
                            >
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={`${basePath}${child.href}`}
                                    onClick={() => setOpen(false)}
                                    className="block py-2.5 text-sm text-ink-muted hover:text-cta"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={`${basePath}${item.href}`}
                        onClick={() => setOpen(false)}
                        className="block py-3 text-base font-semibold text-ink"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <Link
                href={`${basePath}${portalNav.href}`}
                onClick={() => setOpen(false)}
                className="mt-6 flex items-center justify-center rounded-control bg-cta px-5 py-3 text-sm font-semibold text-cta-ink"
              >
                {portalNav.label}
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
