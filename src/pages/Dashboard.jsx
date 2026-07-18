import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import ClientManager from "../components/dashboard/ClientManager";
import InvoiceCreator from "../components/dashboard/InvoiceCreator";
import ProfileSettings from "../components/dashboard/ProfileSettings";

function Dashboard({ onLogout, user, theme: initialTheme }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeSidebarTab") || "dashboard";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem("theme") || initialTheme || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dashboardTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", dashboardTheme);
  }, [dashboardTheme]);

  const toggleTheme = () => {
    setDashboardTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview theme={dashboardTheme} user={user} />;
      case "clients":
        return <ClientManager theme={dashboardTheme} user={user} />;
      case "invoices":
        return <InvoiceCreator theme={dashboardTheme} user={user} />;
      case "profile":
        return <ProfileSettings theme={dashboardTheme} user={user} />;
      default:
        return <DashboardOverview theme={dashboardTheme} user={user} />;
    }
  };

  return (
    <div
      className={`flex min-h-screen font-sans antialiased transition-colors duration-300 ${
        dashboardTheme === "dark"
          ? "bg-[#000000] text-[#f5f5f7]"
          : "bg-[#f5f5f7] text-[#1d1d1f]" // Premium light mode subtle background (Pure white card look contrast ke liye)
      }`}
    >
      {/* 1. SIDEBAR PANEL ARCHITECTURE */}
      <Sidebar
        theme={dashboardTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* RIGHT WORKSPACE LAYER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div
          className={`absolute top-0 right-0 w-125 h-125 rounded-full filter blur-[180px] pointer-events-none opacity-25 transition-all duration-700 ${
            dashboardTheme === "dark" ? "bg-[#1c1c1e]" : "bg-blue-200/40"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-12 w-75 h-75 rounded-full filter blur-[140px] pointer-events-none opacity-10 transition-all duration-700 ${
            dashboardTheme === "dark" ? "bg-zinc-800" : "bg-purple-200/30"
          }`}
        ></div>

        {/* 2. TOPBAR SUB-SYSTEM */}
        <Topbar
          theme={dashboardTheme}
          toggleTheme={toggleTheme}
          user={user}
          onLogout={onLogout}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* 3. FLUID CONTENT CORE */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto grow relative z-10 scrollbar-none">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
