export interface DemoPageDef {
  href: string;
  title: string;
  description: string;
  shortLabel?: string;
  group?: string;
  category?: "favorite" | "ideas";
}

export interface DemoPage {
  href: string;
  label: string;
  shortLabel?: string;
  group?: string;
}

export function toNavPages(pages: DemoPageDef[]): DemoPage[] {
  return pages.map((page) => ({
    href: page.href,
    label: page.title,
    shortLabel: page.shortLabel,
    group: page.group,
  }));
}
