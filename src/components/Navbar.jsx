import React from "react";

function Navbar({ openLogin, theme, toggleTheme }) {
  const appName = import.meta.env.VITE_APP_NAME || "BillFlow";

  return (
    <nav
      className={`w-full border-b px-6 md:px-12 py-3.5 flex justify-between items-center fixed top-0 left-0 z-50 transition-all duration-300 backdrop-blur-md select-none ${
        theme === "dark"
          ? "border-[#1c1c1e] bg-[#000000]/70 text-[#f5f5f7]"
          : "border-[#e2e2e7] bg-[#ffffff]/80 text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      }`}
    >
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e] text-[#f5f5f7] border border-[#2c2c2e]"
              : "bg-[#f2f2f7] text-[#1d1d1f] border border-[#d1d1d6]"
          }`}
        >
          {/* Executive Invoice Minimal Icon */}
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <span className="text-base sm:text-lg font-semibold tracking-tight font-sans">
          {appName.slice(0, 4)}
          <span
            className={`font-normal ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
          >
            {appName.slice(4)}
          </span>
        </span>
      </div>

      {/* Navigation Actions */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Apple-style Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
            theme === "dark"
              ? "border-[#2c2c2e] bg-[#1c1c1e] text-[#f5f5f7] hover:opacity-80"
              : "border-[#d1d1d6] bg-[#f2f2f7] text-[#1d1d1f] hover:bg-[#e5e5ea]"
          }`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Premium Solid Capsule Button */}
        <button
          onClick={openLogin}
          className={`px-4 py-1.5 font-medium rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 border ${
            theme === "dark"
              ? "bg-[#f5f5f7] text-[#000000] border-transparent hover:bg-[#ffffff]"
              : "bg-[#1d1d1f] text-[#ffffff] border-transparent hover:bg-[#000000] shadow-sm"
          }`}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
