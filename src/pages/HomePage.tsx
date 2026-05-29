import { PageList } from "../components/PageList";
import { widgetPages } from "../lib/widget-pages";

const accent = "#60a5fa";
const affiliateWidgets = widgetPages.filter((page) => page.group === "Affiliate Widgets");

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold">Affiliate Widgets</h1>
        <p className="mt-2 text-muted-foreground">
          Select an affiliate widget page to review its embedded DriveNow widget.
        </p>

        <section className="mt-8">
          <PageList pages={affiliateWidgets} accentColor={accent} />
        </section>
      </div>
    </div>
  );
}
