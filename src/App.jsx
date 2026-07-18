import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeSidebarTab");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div
        className={`h-screen w-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-[#000000]" : "bg-[#ffffff]"
        }`}
      >
        <div className="relative w-7 h-7">
          <div
            className={`absolute inset-0 rounded-full border-2 opacity-20 ${theme === "dark" ? "border-white" : "border-black"}`}
          ></div>
          <div
            className={`absolute inset-0 rounded-full border-2 border-t-transparent animate-spin ${theme === "dark" ? "border-white" : "border-black"}`}
          ></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} theme={theme} user={user} />;
  }

  return <Home checkAuth={checkAuth} theme={theme} setTheme={setTheme} />;
}

export default App;
