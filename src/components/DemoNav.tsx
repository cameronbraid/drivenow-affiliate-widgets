import { useEffect, useRef, useState } from "react";
import type { DemoPage } from "../lib/demo-pages";

interface DemoNavProps {
  pages: DemoPage[];
  indexPaths: string[];
  pathname: string;
}

export function DemoNav({ pages, indexPaths, pathname }: DemoNavProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isIndex = indexPaths.includes(pathname);
  const currentIndex = pages.findIndex((page) => page.href === pathname);
  const current = currentIndex >= 0 ? pages[currentIndex] : null;
  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const groups: { name: string; items: DemoPage[] }[] = [];
  for (const page of pages) {
    const groupName = page.group || "";
    const existing = groups.find((group) => group.name === groupName);
    if (existing) {
      existing.items.push(page);
    } else {
      groups.push({ name: groupName, items: [page] });
    }
  }

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (isIndex) return null;

  return (
    <div className="demo-nav" ref={dropdownRef}>
      {prev ? (
        <a className="demo-nav-icon" href={prev.href} title={prev.label} aria-label={`Previous: ${prev.label}`}>
          <ChevronLeft />
        </a>
      ) : (
        <span className="demo-nav-icon is-disabled"><ChevronLeft /></span>
      )}

      <button className="demo-nav-current" type="button" onClick={() => setOpen(!open)}>
        {current?.shortLabel || current?.label || pathname.split("/").pop()}
        <ChevronDown flipped={open} />
      </button>

      {next ? (
        <a className="demo-nav-icon" href={next.href} title={next.label} aria-label={`Next: ${next.label}`}>
          <ChevronRight />
        </a>
      ) : (
        <span className="demo-nav-icon is-disabled"><ChevronRight /></span>
      )}

      <span className="demo-nav-divider" />

      <a className="demo-nav-icon" href={indexPaths[0]} title="All widgets" aria-label="All widgets">
        <GridIcon />
      </a>

      {open && (
        <div className="demo-nav-dropdown">
          {groups.map((group) => (
            <div key={group.name || "default"}>
              {group.name && <div className="demo-nav-group">{group.name}</div>}
              {group.items.map((page) => (
                <a
                  className={`demo-nav-item${page.href === pathname ? " is-active" : ""}`}
                  href={page.href}
                  key={page.href}
                  onClick={() => setOpen(false)}
                >
                  {page.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronLeft() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChevronDown({ flipped }: { flipped: boolean }) {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: flipped ? "rotate(180deg)" : undefined }}><path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
