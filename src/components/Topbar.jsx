import React, { useState, useEffect } from "react";

function Topbar({ theme, toggleTheme, user, setIsSidebarOpen }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    return (
      time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }) +
      " • " +
      time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  return (
    <header
      className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between transition-all duration-300 select-none backdrop-blur-md relative z-30 ${
        theme === "dark"
          ? "bg-[#000000]/70 border-[#1c1c1e] text-[#f5f5f7]"
          : "bg-[#ffffff]/80 border-[#e5e5ea] text-[#1d1d1f]"
      }`}
    >
      {/* Left section: Hamburger Icon for mobile + Welcome note */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 md:hidden rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
            theme === "dark"
              ? "border-[#2c2c2e] bg-[#1c1c1e] text-[#f5f5f7] hover:bg-[#2c2c2e]"
              : "border-[#e5e5ea] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]"
          }`}
          aria-label="Open menu"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Welcome message with Premium San-Serif weight */}
        <div className="text-xs sm:text-sm font-medium tracking-tight hidden sm:block">
          <span
            className={theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}
          >
            Welcome back,{" "}
          </span>
          <span className="font-semibold">{user?.name || "Operator"}</span>
        </div>
      </div>

      {/* Middle Section: Live Digital Clock */}
      <div
        className={`text-[11px] sm:text-xs font-mono tracking-tight font-medium ${
          theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"
        }`}
      >
        {formatDateTime()}
      </div>

      {/* Right Actions Shell */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:opacity-80 active:scale-95 ${
            theme === "dark"
              ? "border-[#2c2c2e] bg-[#1c1c1e] text-[#f5f5f7]"
              : "border-[#e5e5ea] bg-[#ffffff] text-[#1d1d1f] shadow-sm hover:bg-[#f5f5f7]"
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

        {/* Minimal Rounded Profile Avatar / Google Image Wire */}
        <div
          className={`w-8 h-8 rounded-full font-semibold text-xs flex items-center justify-center border overflow-hidden shadow-sm select-none ${
            theme === "dark"
              ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#f5f5f7]"
              : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f]"
          }`}
        >
          {user?.picture || user?.avatar ? (
            <img
              src={user.picture || user.avatar}
              alt={user.name || "Profile"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer" // Google profiles loading fix
            />
          ) : (
            getInitials()
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
