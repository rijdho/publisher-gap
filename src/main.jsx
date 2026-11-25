import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, useLocation, NavLink } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import GapAnalysisPage from "./pages/GapAnalysisPage";
import PublisherDetailPage from "./pages/PublisherDetailPage";
import AboutPage from "./pages/AboutPage";
// The shared look (a synced copy of the house style), then this tool's own styles.
import "./house/house.css";
import "./index.css";

// The theme follows the system until the visitor chooses one; the choice is kept in this browser.
function useTheme() {
  const system = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("pg-theme");
    return saved === "dark" || saved === "light" ? saved : system();
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggle = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("pg-theme", next);
      return next;
    });
  return { theme, toggle };
}

const TABS = [
  { to: "/", label: "Overview", end: true },
  { to: "/gap-analysis", label: "Gap Analysis" },
  { to: "/about", label: "About" },
];

const SunIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

// The rail of the house style: the name of the tool, the pages, and the credits at its foot.
function Rail({ onNavigate }) {
  return (
    <aside className="rail">
      <div className="brand-mark">
        <a className="brand-glyph" href="#/" tabIndex={-1} aria-hidden="true" style={{ "--glyph": "'PG'" }} />
        <div>
          <div className="brand-name"><a href="#/">Publisher Gap</a></div>
          <a className="brand-sub" href="https://rijdho.github.io">rijdho.github.io</a>
          <p className="brand-family">Part of{" "}<a href="https://rijdho.github.io/metaudits-home/" target="_blank" rel="noopener noreferrer">Metaudits</a></p>
        </div>
      </div>
      <nav aria-label="Pages">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} onClick={onNavigate} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className="rail-foot">
        By{" "}<a href="https://rijdho.github.io" target="_blank" rel="noopener noreferrer">Ricardo Hartley Belmar</a>
        <br />
        Code under MIT
        <br />
        data and texts under{" "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
        <br />
        <a href="https://github.com/rijdho/publisher-gap" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
      </div>
    </aside>
  );
}

function CommandBar({ theme, toggleTheme, onMenu }) {
  const { pathname } = useLocation();
  const tab = TABS.find((t) => (t.end ? pathname === t.to : pathname.startsWith(t.to)));
  const title = pathname.startsWith("/publisher/") ? "Publisher Detail" : tab ? tab.label : "Overview";
  return (
    <div className="cmdbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Menu"><MenuIcon /></button>
      <div className="cmd-title">{title}</div>
      <div className="cmd-spacer" />
      <button
        className="icon-btn"
        onClick={toggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}

function Shell() {
  const { theme, toggle } = useTheme();
  const [railOpen, setRailOpen] = useState(false);
  return (
    <div className={`app${railOpen ? " rail-open" : ""}`}>
      <Rail onNavigate={() => setRailOpen(false)} />
      {railOpen && <button className="rail-backdrop" aria-label="Close menu" onClick={() => setRailOpen(false)} />}
      <div className="main-col">
        <CommandBar theme={theme} toggleTheme={toggle} onMenu={() => setRailOpen(true)} />
        <main className="content">
          <div className="content-inner pg-wide">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/gap-analysis" element={<GapAnalysisPage />} />
              <Route path="/publisher/:id" element={<PublisherDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
