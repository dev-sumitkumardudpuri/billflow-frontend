import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const appName = import.meta.env.VITE_APP_NAME || "BillFlow";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const openLogin = () => {
    setIsSignup(false);
    setIsOpen(true);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 pt-24 sm:pt-32 overflow-x-hidden ${
        theme === "dark"
          ? "bg-[#000000] text-[#f5f5f7] selection:bg-[#ffffff]/10"
          : "bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#000000]/5"
      }`}
    >
      {/* Navigation Header */}
      <Navbar openLogin={openLogin} theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative">
        <div
          className={`absolute top-0 left-1/4 w-125 h-125 rounded-full filter blur-[140px] pointer-events-none transition-all duration-700 ${
            theme === "dark" ? "bg-[#1c1c1e]/40" : "bg-[#e8e8ed]/60"
          }`}
        ></div>

        {/* Hero Left: Text & CTA */}
        <div className="flex flex-col items-start text-left z-10 order-first md:order-0">
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight leading-[1.1] font-sans">
            Automate invoicing. <br />
            <span
              className={theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}
            >
              Get paid faster.
            </span>
          </h1>

          <p
            className={`mb-8 max-w-md text-sm sm:text-base leading-relaxed tracking-wide font-normal ${
              theme === "dark" ? "text-[#8e8e93]" : "text-[#48484a]"
            }`}
          >
            Create premium PDF invoices, manage your global client ledger, and
            let our intelligent automation handle gentle payment reminders
            straight to their inbox.
          </p>

          <button
            onClick={openLogin}
            className={`w-full sm:w-auto px-7 py-3.5 font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 border ${
              theme === "dark"
                ? "bg-[#f5f5f7] text-[#000000] border-transparent hover:bg-[#ffffff]"
                : "bg-[#1d1d1f] text-[#ffffff] border-transparent hover:bg-[#000000] shadow-md shadow-black/10"
            }`}
          >
            Start For Free
            <svg
              className="w-4 h-4 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Hero Right: Ultra-Premium Dashboard Preview Mockup */}
        <div className="w-full z-10 mt-6 md:mt-0">
          <div
            className={`w-full border rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1c1c1e] border-[#2c2c2e] shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
                : "bg-[#ffffff] border-[#d1d1d6] shadow-[0_32px_64px_rgba(0,0,0,0.06)]"
            }`}
          >
            {/* Window Top Bar */}
            <div
              className={`w-full h-10 border-b flex items-center justify-between px-4 z-20 ${
                theme === "dark"
                  ? "bg-[#1c1c1e] border-[#2c2c2e]"
                  : "bg-[#f5f5f7] border-[#e5e5ea]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/40"></span>
                <span
                  className={`text-[10px] font-mono ml-2 tracking-tight ${
                    theme === "dark" ? "text-[#636366]" : "text-[#8e8e93]"
                  }`}
                >
                  {appName.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Mockup App Content */}
            <div className="flex flex-1 text-[11px] h-72 sm:h-80">
              {/* Sidebar Navigation Mockup */}
              <div
                className={`w-14 sm:w-28 border-r p-2 flex flex-col justify-between select-none ${
                  theme === "dark"
                    ? "bg-[#000000]/30 border-[#2c2c2e] text-[#8e8e93]"
                    : "bg-[#f5f5f7] border-[#e5e5ea] text-[#48484a]"
                }`}
              >
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex flex-col gap-1.5">
                    <div
                      className={`flex items-center justify-center sm:justify-start gap-2 p-1.5 px-2 rounded-md ${
                        theme === "dark"
                          ? "bg-[#2c2c2e] text-[#ffffff]"
                          : "bg-[#ffffff] text-[#000000] border border-[#d1d1d6] shadow-sm"
                      }`}
                    >
                      <span className="text-xs">📑</span>
                      <span className="hidden sm:inline font-medium">
                        Invoices
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-1.5 px-2 rounded-md opacity-60 hover:opacity-100 transition-opacity">
                      <span className="text-xs">👥</span>
                      <span className="hidden sm:inline">Clients</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 p-1.5 px-2 rounded-md opacity-60 hover:opacity-100 transition-opacity">
                      <span className="text-xs">⚙️</span>
                      <span className="hidden sm:inline">Settings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 p-1.5 px-2 text-[#ff3b30] border-t border-inherit opacity-80">
                  <span className="text-xs">🚪</span>
                  <span className="hidden sm:inline font-medium">Sign Out</span>
                </div>
              </div>

              {/* Main App Content Mockup */}
              <div className="flex-1 flex flex-col bg-transparent">
                <div
                  className={`p-2.5 px-4 border-b flex items-center justify-between gap-4 ${
                    theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded w-28 sm:w-36 border ${
                      theme === "dark"
                        ? "bg-[#000000]/20 border-[#2c2c2e] text-[#636366]"
                        : "bg-[#f5f5f7] border-[#e5e5ea] text-[#8e8e93]"
                    }`}
                  >
                    <span>🔍</span>
                    <span className="text-[9px]">Search ledger...</span>
                  </div>

                  <div className="h-5 w-5 rounded-full font-medium text-[9px] flex items-center justify-center bg-[#8e8e93] text-white">
                    JD
                  </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div
                      className={`p-2.5 rounded-lg border text-left ${
                        theme === "dark"
                          ? "bg-[#000000]/20 border-[#2c2c2e]"
                          : "bg-[#f5f5f7] border-[#e5e5ea]"
                      }`}
                    >
                      <p
                        className={`text-[8px] uppercase tracking-wider font-medium ${theme === "dark" ? "text-[#636366]" : "text-[#8e8e93]"}`}
                      >
                        Issued
                      </p>
                      <p className="text-xs font-semibold mt-0.5">$14,820</p>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border text-left ${
                        theme === "dark"
                          ? "bg-[#000000]/20 border-[#2c2c2e]"
                          : "bg-[#f5f5f7] border-[#e5e5ea]"
                      }`}
                    >
                      <p
                        className={`text-[8px] uppercase tracking-wider font-medium ${theme === "dark" ? "text-[#636366]" : "text-[#8e8e93]"}`}
                      >
                        Pending
                      </p>
                      <p className="text-xs font-semibold mt-0.5 text-[#ff9500]">
                        $3,150
                      </p>
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border text-left ${
                        theme === "dark"
                          ? "bg-[#000000]/20 border-[#2c2c2e]"
                          : "bg-[#f5f5f7] border-[#e5e5ea]"
                      }`}
                    >
                      <p
                        className={`text-[8px] uppercase tracking-wider font-medium ${theme === "dark" ? "text-[#636366]" : "text-[#8e8e93]"}`}
                      >
                        Clients
                      </p>
                      <p className="text-xs font-semibold mt-0.5 text-[#34c759]">
                        12 Active
                      </p>
                    </div>
                  </div>

                  {/* Inline Invoice Table Mockup */}
                  <div
                    className={`p-3 rounded-lg border flex flex-col gap-2 flex-1 text-left overflow-hidden ${
                      theme === "dark"
                        ? "bg-[#000000]/20 border-[#2c2c2e]"
                        : "bg-[#f5f5f7] border-[#e5e5ea]"
                    }`}
                  >
                    <p className="font-medium text-[9px]">Recent Activity</p>
                    <div className="flex flex-col gap-2 font-mono text-[9px] opacity-90">
                      <div
                        className={`flex justify-between border-b pb-1.5 ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
                      >
                        <span
                          className={
                            theme === "dark"
                              ? "text-[#636366]"
                              : "text-[#8e8e93]"
                          }
                        >
                          INV-9824
                        </span>
                        <span>Acme Corp</span>
                        <span className="font-medium">$1,200</span>
                        <span className="text-[#34c759]">Paid</span>
                      </div>
                      <div className="flex justify-between pb-0.5">
                        <span
                          className={
                            theme === "dark"
                              ? "text-[#636366]"
                              : "text-[#8e8e93]"
                          }
                        >
                          INV-7731
                        </span>
                        <span>Stark Ind.</span>
                        <span className="font-medium">$850</span>
                        <span className="text-[#ff9500]">Overdue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div
        className={`max-w-6xl mx-auto px-6 py-16 border-t ${
          theme === "dark" ? "border-[#1c1c1e]" : "border-[#e5e5ea]"
        }`}
      >
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 01 */}
          <div
            className={`p-6 border rounded-lg text-left transition-all hover:scale-[1.01] ${
              theme === "dark"
                ? "bg-[#1c1c1e]/50 border-[#2c2c2e]"
                : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            }`}
          >
            <div className="text-sm font-semibold mb-2">
              01 &bull; Custom PDF Branding
            </div>
            <p
              className={`text-xs leading-relaxed ${theme === "dark" ? "text-[#8e8e93]" : "text-[#48484a]"}`}
            >
              Generate dynamic corporate layout invoices tailored with your
              custom studio branding, instant balance compilation, and unified
              international bank settlement options.
            </p>
          </div>

          {/* Feature 02 */}
          <div
            className={`p-6 border rounded-lg text-left transition-all hover:scale-[1.01] ${
              theme === "dark"
                ? "bg-[#1c1c1e]/50 border-[#2c2c2e]"
                : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            }`}
          >
            <div className="text-sm font-semibold mb-2">
              02 &bull; Direct Core Delivery
            </div>
            <p
              className={`text-xs leading-relaxed ${theme === "dark" ? "text-[#8e8e93]" : "text-[#48484a]"}`}
            >
              Skip the manual download and re-attachment flow. Dispatch secure,
              system-compiled transaction statements directly from the billing
              core dashboard safely.
            </p>
          </div>

          {/* Feature 03 */}
          <div
            className={`p-6 border rounded-lg text-left transition-all hover:scale-[1.01] ${
              theme === "dark"
                ? "bg-[#1c1c1e]/50 border-[#2c2c2e]"
                : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            }`}
          >
            <div className="text-sm font-semibold mb-2">
              03 &bull; Autonomous Ledgers
            </div>
            <p
              className={`text-xs leading-relaxed ${theme === "dark" ? "text-[#8e8e93]" : "text-[#48484a]"}`}
            >
              Offload outstanding follow-ups to automated internal background
              routines. Clients receive isolated, non-intrusive payment status
              adjustments on timeline schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`w-full py-8 text-center border-t text-[11px] font-normal transition-colors ${
          theme === "dark"
            ? "border-[#1c1c1e] text-[#636366] bg-[#000000]"
            : "border-[#e5e5ea] text-[#6e6e73] bg-[#f5f5f7]"
        }`}
      >
        <p>
          © 2026 {appName}. Built with cryptographic security protocols and
          minimal fluid design structures.
        </p>
      </footer>

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isSignup={isSignup}
        theme={theme}
      />
    </div>
  );
}

export default Home;
