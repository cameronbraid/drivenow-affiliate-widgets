import type { DemoPageDef } from "../lib/demo-pages";

export function PageList({
  pages,
  accentColor,
}: {
  pages: DemoPageDef[];
  accentColor?: string;
}) {
  return (
    <ul className="page-list">
      {pages.map((page) => (
        <li key={page.href}>
          <a
            href={page.href}
            className="page-list-card"
            onMouseEnter={
              accentColor
                ? (event) => (event.currentTarget.style.borderColor = accentColor)
                : undefined
            }
            onMouseLeave={
              accentColor
                ? (event) => (event.currentTarget.style.borderColor = "")
                : undefined
            }
          >
            <span className="page-list-title">{page.title}</span>
            <span className="page-list-description">{page.description}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
