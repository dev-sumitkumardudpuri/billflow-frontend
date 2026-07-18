import React, { useEffect } from "react";

function Sidebar({
  theme,
  activeTab,
  setActiveTab,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const appName = import.meta.env.VITE_APP_NAME || "BillFlow";

  useEffect(() => {
    const savedTab = localStorage.getItem("activeSidebarTab");
    if (savedTab && savedTab !== activeTab) {
      setActiveTab(savedTab);
    }
  }, [setActiveTab]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
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
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 011-1H5a1 1 0 01-1-1V5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 16V10m3 6V13m3 3V8"
          />
        </svg>
      ),
    },
    {
      id: "clients",
      label: "Clients",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-60 p-5 border-r flex flex-col justify-between transition-all duration-300 ease-in-out md:translate-x-0 md:static ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } ${
    theme === "dark"
      ? "bg-[#000000] border-[#1c1c1e] text-[#f5f5f7]"
      : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f] shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
  }`;

  const handleTabClick = (id) => {
    setActiveTab(id);
    localStorage.setItem("activeSidebarTab", id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Top Content Shell */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-2.5 select-none">
              <div
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-[#1c1c1e] text-[#f5f5f7] border border-[#2c2c2e]"
                    : "bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]"
                }`}
              >
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight font-sans">
                {appName.slice(0, 4)}
                <span
                  className={
                    theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"
                  }
                >
                  {appName.slice(4)}
                </span>
              </span>
            </div>

            {/* Close button for mobile views */}
            <button
              className={`p-1.5 rounded-md md:hidden border transition-all active:scale-95 cursor-pointer ${
                theme === "dark"
                  ? "border-[#2c2c2e] bg-[#1c1c1e] text-[#8e8e93]"
                  : "border-[#e5e5ea] bg-[#f5f5f7] text-[#86868b]"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links Layer */}
          <nav className="space-y-1 font-medium text-xs sm:text-[13px]">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300 ease-out cursor-pointer text-left tracking-tight border text-sm active:scale-[0.98] hover:translate-x-0.5 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#ffffff] font-semibold shadow-inner"
                        : "bg-[#f5f5f7] border-[#e5e5ea] text-[#000000] font-semibold shadow-sm"
                      : theme === "dark"
                        ? "bg-transparent border-transparent text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-[#1c1c1e]/50"
                        : "bg-transparent border-transparent text-[#636366] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]/80"
                  }`}
                >
                  <span
                    className={`transition-all duration-300 ${isActive ? "text-inherit scale-105" : "opacity-70 group-hover:opacity-100"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Module */}
        <div
          className={`pt-4 border-t transition-colors duration-300 ${theme === "dark" ? "border-[#1c1c1e]" : "border-[#e5e5ea]"}`}
        >
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer text-left font-medium text-xs sm:text-[13px] tracking-tight border border-transparent text-[#ff453a] active:scale-[0.99] ${
              theme === "dark"
                ? "hover:bg-[#ff453a]/10"
                : "hover:bg-[#ff3b30]/5"
            }`}
          >
            <svg
              className="w-4 h-4 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
