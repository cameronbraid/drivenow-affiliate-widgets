import React from "react";
import { createRoot } from "react-dom/client";
import { DemoNav } from "./components/DemoNav";
import { toNavPages } from "./lib/demo-pages";
import { widgetIndexPaths, widgetPages } from "./lib/widget-pages";
import { HomePage } from "./pages/HomePage";
import { WaHolidayGuidePage } from "./pages/WaHolidayGuidePage";
import "./styles.css";

const navPages = toNavPages(widgetPages);

function App() {
  const pathname = normalizePath(window.location.pathname);

  return (
    <>
      {pathname === "/waholidayguide" ? <WaHolidayGuidePage /> : <HomePage />}
      <DemoNav pages={navPages} indexPaths={widgetIndexPaths} pathname={pathname} />
    </>
  );
}

function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return normalized;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
