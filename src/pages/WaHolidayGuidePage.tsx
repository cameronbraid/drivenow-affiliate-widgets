import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    DRIVENOW_WIDGET_THEME?: string;
  }
}

const waholidayguideWidgetConfig = {
  widgetType: "TabbedSearchWidget",
  affiliateCode: "waholidayguide.com.au",
  defaultTab: 0,
  tabs: [
    {
      vehicleCategory: "campervan-hire",
      locationCountry: { code: "AU", name: "Australia" },
      countryCode: "AU",
      context: null,
      variation: null,
    },
    {
      vehicleCategory: "car-hire",
      locationCountry: { code: "AU", name: "Australia" },
      countryCode: "AU",
      context: null,
      variation: null,
    },
  ],
};

export function WaHolidayGuidePage() {
  const config = useMemo(() => JSON.stringify(waholidayguideWidgetConfig), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Affiliate Widgets
        </a>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">WA Holiday Guide</p>
            <h1 className="mt-3 text-3xl font-bold">Themed affiliate widget</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Embedded with the same WA Holiday Guide two-tab campervan and car hire configuration used by the recent Oxide
              screenshot test.
            </p>
          </div>

          <aside className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            <strong className="block text-card-foreground">Production script</strong>
            Loads the production widget script from <code>www.drivenow.com.au</code> and applies the WA Holiday Guide theme.
          </aside>
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card" data-testid="waholidayguide-widget-story">
          <WaHolidayGuideWidget config={config} />
        </section>
      </div>
    </div>
  );
}

function WaHolidayGuideWidget({ config }: { config: string }) {
  return (
    <AffiliateWidget
      config={config}
      scriptSrc="https://www.drivenow.com.au/oxide/widget.js?gen=1"
      beforeLoad={() => {
        window.DRIVENOW_WIDGET_THEME = "waholidayguide";
      }}
    />
  );
}

function AffiliateWidget({
  config,
  scriptSrc,
  beforeLoad,
}: {
  config: string;
  scriptSrc: string;
  beforeLoad?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    beforeLoad?.();

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-drivenow-widget-gen1", `json:${config}`);
    script.setAttribute("data-testid", "waholidayguide-widget-script");
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [beforeLoad, config, scriptSrc]);

  return <div ref={containerRef} />;
}
