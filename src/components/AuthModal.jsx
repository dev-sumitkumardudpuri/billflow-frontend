import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

function AuthModal({ isOpen, onClose, isSignup: initialIsSignup, theme }) {
  const [isSignup, setIsSignup] = useState(initialIsSignup);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiHost = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const apiBaseUrl = `${apiHost}/api/auth`;

  useEffect(() => {
    setIsSignup(initialIsSignup);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  }, [initialIsSignup, isOpen]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");

        const googleUserInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const { name, email, sub: googleId } = googleUserInfo.data;

        const response = await axios.post(`${apiBaseUrl}/google`, {
          name,
          email,
          googleId,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user || response.data),
          );
          window.dispatchEvent(new Event("storage"));
          onClose();
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Google authorization system failed. Please retry.",
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Sign-In sequence aborted or failed.");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmailDomain = (email) => {
    const allowedDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.com",
      "icloud.com",
      "zoho.com",
      "protonmail.com",
      "proton.me",
    ];

    const emailParts = email.trim().toLowerCase().split("@");
    if (emailParts.length !== 2) return false;

    const domain = emailParts[1];
    const isCommonValid = allowedDomains.includes(domain);
    const isLikelyCorporate =
      domain.includes(".") &&
      !domain.match(
        /(yopmail|mailinator|tempmail|dispostable|getairmail|trashmail)/,
      );

    return isCommonValid || isLikelyCorporate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !validateEmailDomain(formData.email)) {
      setError("Please use a valid email account.");
      return;
    }

    setLoading(true);
    const endpoint = isSignup ? `${apiBaseUrl}/signup` : `${apiBaseUrl}/login`;

    try {
      const response = await axios.post(endpoint, formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user || response.data),
        );
        window.dispatchEvent(new Event("storage"));
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication protocols failed. Retry later.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all duration-300">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-xl border transition-all duration-300 relative ${
          theme === "dark"
            ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#f5f5f7] shadow-[0_24px_50px_rgba(0,0,0,0.9)]"
            : "bg-[#ffffff] border-[#d1d1d6] text-[#1d1d1f] shadow-[0_32px_64px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans">
              {isSignup ? "Create account." : "Welcome back."}
            </h2>
            <p
              className={`text-xs mt-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
            >
              {isSignup
                ? "Initialize your cloud billing ledger."
                : "Access your secure core workspace."}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer hover:opacity-70 ${
              theme === "dark"
                ? "border-[#2c2c2e] bg-[#000000]/20 text-[#8e8e93]"
                : "border-[#d1d1d6] bg-[#f5f5f7] text-[#48484a]"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Subtle Low-Sat Error Banner */}
        {error && (
          <div
            className={`mb-5 p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
              theme === "dark"
                ? "bg-[#ff453a]/10 border-[#ff453a]/20 text-[#ff453a]"
                : "bg-[#ff3b30]/5 border-[#ff3b30]/20 text-[#ff3b30]"
            }`}
          >
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label
                className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-[#636366]" : "text-[#48484a]"}`}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                  theme === "dark"
                    ? "bg-[#000000]/20 border-[#2c2c2e] focus:border-[#8e8e93] text-white placeholder-[#636366]"
                    : "bg-[#f5f5f7] border-[#d1d1d6] focus:border-[#000000] focus:bg-[#ffffff] text-[#1d1d1f] placeholder-[#a9a9b0]"
                }`}
              />
            </div>
          )}

          <div>
            <label
              className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-[#636366]" : "text-[#48484a]"}`}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                theme === "dark"
                  ? "bg-[#000000]/20 border-[#2c2c2e] focus:border-[#8e8e93] text-white placeholder-[#636366]"
                  : "bg-[#f5f5f7] border-[#d1d1d6] focus:border-[#000000] focus:bg-[#ffffff] text-[#1d1d1f] placeholder-[#a9a9b0]"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-[#636366]" : "text-[#48484a]"}`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                theme === "dark"
                  ? "bg-[#000000]/20 border-[#2c2c2e] focus:border-[#8e8e93] text-white placeholder-[#636366]"
                  : "bg-[#f5f5f7] border-[#d1d1d6] focus:border-[#000000] focus:bg-[#ffffff] text-[#1d1d1f] placeholder-[#a9a9b0]"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-2 font-medium rounded-lg text-sm transition-all duration-200 cursor-pointer border flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "bg-[#f5f5f7] text-[#000000] border-transparent hover:bg-[#ffffff] disabled:opacity-40"
                : "bg-[#1d1d1f] text-[#ffffff] border-transparent hover:bg-[#000000] shadow-sm disabled:opacity-40"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Minimalist Split Divider */}
        <div className="relative flex py-5 items-center select-none">
          <div
            className={`grow border-t ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
          ></div>
          <span
            className={`shrink mx-3 text-[9px] font-semibold tracking-widest uppercase ${theme === "dark" ? "text-[#636366]" : "text-[#8e8e93]"}`}
          >
            Or connect via
          </span>
          <div
            className={`grow border-t ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
          ></div>
        </div>

        {/* Google OAuth Platform Connector */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className={`w-full py-2.5 px-4 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 ${
            theme === "dark"
              ? "bg-[#000000]/20 border-[#2c2c2e] hover:bg-[#2c2c2e] text-[#f5f5f7]"
              : "bg-[#ffffff] border-[#d1d1d6] hover:bg-[#f5f5f7] text-[#1d1d1f] shadow-sm hover:shadow"
          }`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.054 14.996 0 12 0 7.354 0 3.313 2.667 1.309 6.55l3.957 3.215z"
            />
            <path
              fill="#4285F4"
              d="M23.773 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.6c-.286 1.518-1.141 2.809-2.423 3.664l3.773 2.927c2.205-2.036 3.823-5.036 3.823-8.727z"
            />
            <path
              fill="#FBBC05"
              d="M1.309 6.55A11.944 11.944 0 000 12c0 1.927.455 3.75 1.259 5.373l3.973-3.082a7.042 7.042 0 01-.191-2.291c0-1.636.555-3.136 1.482-4.345L1.31 6.55z"
            />
            <path
              fill="#34A853"
              d="M12 19.091c-1.955 0-3.691-1.1-4.564-2.718L3.464 19.46C5.491 23.345 9.536 24 12 24c3.09 0 5.927-1.055 8.127-2.882l-3.773-2.927c-1.19.791-2.673 1.255-4.354 1.255z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs font-normal">
          <span
            className={theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}
          >
            {isSignup
              ? "Already have an account?"
              : "Don't have a secure account?"}
          </span>
          <button
            onClick={() => {
              setError("");
              setIsSignup(!isSignup);
            }}
            className={`font-semibold cursor-pointer ml-1 underline transition-colors ${
              theme === "dark"
                ? "text-[#ffffff] hover:text-[#8e8e93]"
                : "text-[#000000] hover:text-[#6e6e73]"
            }`}
          >
            {isSignup ? "Sign In" : "Register"}
          </button>
        </div>
        <p
          className="font-bold"
          style={{ fontSize: "12px", color: "gray", marginTop: "10px" }}
        >
          Demo Credentials: <br /> Email: user@gmail.com Password: user
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
