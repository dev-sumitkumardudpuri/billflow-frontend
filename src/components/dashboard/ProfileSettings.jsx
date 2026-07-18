import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";

function ProfileSettings({ theme }) {
  const [formData, setFormData] = useState({
    name: "",
    companyDetails: {
      businessName: "",
      address: "",
      currency: "",
      phone: "",
      website: "",
      taxId: "",
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      swiftCode: "",
      upiId: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [backupData, setBackupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currencyOptions = [
    { code: "USD", symbol: "$", label: "US Dollar ($)" },
    { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
    { code: "EUR", symbol: "€", label: "Euro (€)" },
    { code: "GBP", symbol: "£", label: "British Pound (£)" },
    { code: "AED", symbol: "د.إ", label: "UAE Dirham (د.إ)" },
    { code: "CAD", symbol: "C$", label: "Canadian Dollar (C$)" },
  ];

  const currentCurrencyObj =
    currencyOptions.find((c) => c.code === formData.companyDetails.currency) ||
    currencyOptions[0];

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000); // 2000ms = 2 seconds

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/api/users/profile");
        const data = response.data;
        const profileData = {
          name: data.name || "",
          companyDetails: {
            businessName: data.companyDetails?.businessName || "",
            address: data.companyDetails?.address || "",
            currency: data.companyDetails?.currency || "USD",
            phone: data.companyDetails?.phone || "",
            website: data.companyDetails?.website || "",
            taxId: data.companyDetails?.taxId || "",
          },
          bankDetails: {
            bankName: data.bankDetails?.bankName || "",
            accountNumber: data.bankDetails?.accountNumber || "",
            ifscCode: data.bankDetails?.ifscCode || "",
            swiftCode: data.bankDetails?.swiftCode || "",
            upiId: data.bankDetails?.upiId || "",
          },
        };
        setFormData(profileData);
        setBackupData(profileData);
      } catch (error) {
        console.error("Profile load issue:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (section, field, value) => {
    if (!isEditing) return;

    if (field === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 10) return;
      value = numericValue;
    }

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCancel = () => {
    if (backupData) {
      setFormData(backupData);
    }
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await API.put("/api/users/profile", formData);
      if (response.data) {
        setMessage({
          type: "success",
          text: "Profile configurations updated successfully.",
        });
        setBackupData(formData);
        setIsEditing(false);
        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to finalize profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full mt-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-[13px] outline-none transition-all duration-200 tracking-tight font-sans ${
    !isEditing
      ? theme === "dark"
        ? "bg-[#1c1c1e]/30 border-[#2c2c2e]/50 text-[#8e8e93] cursor-not-allowed select-text"
        : "bg-[#f5f5f7]/80 border-[#e5e5ea]/50 text-[#636366] cursor-not-allowed select-text"
      : theme === "dark"
        ? "bg-[#000000] border-[#2c2c2e] focus:border-[#ffffff] text-white placeholder-[#48484a] cursor-text"
        : "bg-[#ffffff] border-[#c7c7cc] focus:border-[#000000] text-[#1d1d1f] placeholder-[#a1a1a6] shadow-sm cursor-text"
  }`;

  const labelClass = `block text-[11px] font-medium tracking-tight ${
    theme === "dark" ? "text-[#8e8e93]" : "text-[#515154]"
  }`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans">
            Settings
          </h2>
          <p
            className={`text-xs sm:text-[13px] mt-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
          >
            Configure corporate metadata identities, global invoice currency
            scales, and banking channels.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`self-start sm:self-center py-2 px-4 rounded-lg font-medium text-xs sm:text-[13px] tracking-tight border cursor-pointer transition-all active:scale-[0.98] ${
              theme === "dark"
                ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#ffffff] hover:bg-[#2c2c2e]"
                : "bg-[#ffffff] border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b] shadow-sm"
            }`}
          >
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`py-2.5 px-4 rounded-lg text-xs font-medium border tracking-tight transition-all duration-300 ease-in-out ${
            message.type === "success"
              ? theme === "dark"
                ? "bg-[#30d158]/10 border-[#30d158]/20 text-[#30d158]"
                : "bg-[#34c759]/10 border-[#34c759]/20 text-[#1d7531]"
              : theme === "dark"
                ? "bg-[#ff453a]/10 border-[#ff453a]/20 text-[#ff453a]"
                : "bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#bc1b1b]"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e]"
              : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="font-semibold text-sm tracking-tight">
              Account Signatory & Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Signatory Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange(null, "name", e.target.value)}
                required
                readOnly={!isEditing}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className={labelClass}>Global Invoice Currency</label>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between mt-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-[13px] tracking-tight font-sans text-left transition-all duration-200 ${
                  !isEditing
                    ? theme === "dark"
                      ? "bg-[#1c1c1e]/30 border-[#2c2c2e]/50 text-[#8e8e93] cursor-not-allowed"
                      : "bg-[#f5f5f7]/80 border-[#e5e5ea]/50 text-[#636366] cursor-not-allowed"
                    : theme === "dark"
                      ? "bg-[#000000] border-[#2c2c2e] text-white hover:border-[#48484a] cursor-pointer"
                      : "bg-[#ffffff] border-[#c7c7cc] text-[#1d1d1f] hover:border-[#86868b] shadow-sm cursor-pointer"
                } ${isDropdownOpen ? (theme === "dark" ? "border-[#ffffff]" : "border-[#000000]") : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center font-mono font-medium text-[11px] ${
                      theme === "dark"
                        ? "bg-[#1c1c1e] text-[#8e8e93]"
                        : "bg-[#f5f5f7] text-[#48484a]"
                    }`}
                  >
                    {currentCurrencyObj.symbol}
                  </span>
                  <span>{currentCurrencyObj.label}</span>
                </div>
                {isEditing && (
                  <svg
                    className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {isDropdownOpen && isEditing && (
                <div
                  className={`absolute left-0 right-0 mt-1 z-50 rounded-lg border max-h-56 overflow-y-auto font-sans p-1 shadow-xl transition-all animate-fade-in ${
                    theme === "dark"
                      ? "bg-[#1c1c1e] border-[#2c2c2e] text-white"
                      : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f]"
                  }`}
                >
                  {currencyOptions.map((curr) => {
                    const isSelected =
                      formData.companyDetails.currency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => {
                          handleChange("companyDetails", "currency", curr.code);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between py-2 px-2.5 my-0.5 rounded-md text-xs tracking-tight text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? theme === "dark"
                              ? "bg-[#ffffff] text-[#000000] font-semibold"
                              : "bg-[#1d1d1f] text-[#ffffff] font-semibold"
                            : theme === "dark"
                              ? "bg-[#2c2c2e]/60 text-[#f5f5f7]"
                              : "hover:bg-[#f5f5f7] text-[#1d1d1f]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] ${
                              isSelected
                                ? theme === "dark"
                                  ? "bg-[#f5f5f7] text-[#000000]"
                                  : "bg-[#323236] text-[#ffffff]"
                                : theme === "dark"
                                  ? "bg-[#2c2c2e] text-[#8e8e93]"
                                  : "bg-[#f5f5f7] text-[#636366]"
                            }`}
                          >
                            {curr.symbol}
                          </span>
                          <span>{curr.label}</span>
                        </div>
                        {isSelected && (
                          <svg
                            className="w-3.5 h-3.5 font-bold"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e]"
              : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0h4m0 0v10m-4-10a3 3 0 013-3h4a3 3 0 013 3M7 7h3m-3 4h3m4-4h3m-3 4h3"
              />
            </svg>
            <h3 className="font-semibold text-sm tracking-tight">
              Corporate Profile
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Registered Business Name</label>
                <input
                  type="text"
                  value={formData.companyDetails.businessName}
                  onChange={(e) =>
                    handleChange(
                      "companyDetails",
                      "businessName",
                      e.target.value,
                    )
                  }
                  required
                  readOnly={!isEditing}
                  className={inputClass}
                  placeholder="Acme Engineering Systems LLC"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Corporate Tax ID{" "}
                  <span className="opacity-60">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.companyDetails.taxId}
                  onChange={(e) =>
                    handleChange("companyDetails", "taxId", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={inputClass}
                  placeholder="GSTIN / EIN Number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Corporate Phone </label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={formData.companyDetails.phone}
                  onChange={(e) =>
                    handleChange("companyDetails", "phone", e.target.value)
                  }
                  required
                  readOnly={!isEditing}
                  className={inputClass}
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Official Website{" "}
                  <span className="opacity-60">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.companyDetails.website}
                  onChange={(e) =>
                    handleChange("companyDetails", "website", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={inputClass}
                  placeholder="https://acme-engineering.com"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Operational Corporate Address
              </label>
              <textarea
                rows={2}
                value={formData.companyDetails.address}
                onChange={(e) =>
                  handleChange("companyDetails", "address", e.target.value)
                }
                required
                readOnly={!isEditing}
                className={`${inputClass} resize-none`}
                placeholder="Full operational infrastructure billing coordinate locations..."
              />
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e]"
              : "bg-[#ffffff] border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="font-semibold text-sm tracking-tight">
              Settlement Remittance
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Financial Institution (Bank Name)
              </label>
              <input
                type="text"
                value={formData.bankDetails.bankName}
                onChange={(e) =>
                  handleChange("bankDetails", "bankName", e.target.value)
                }
                required
                readOnly={!isEditing}
                className={inputClass}
                placeholder="Federal Reserve Core"
              />
            </div>
            <div>
              <label className={labelClass}>Settlement Account Number</label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) =>
                  handleChange("bankDetails", "accountNumber", e.target.value)
                }
                required
                readOnly={!isEditing}
                className={inputClass}
                placeholder="9901004128522"
              />
            </div>
            <div>
              <label className={labelClass}>Routing IFSC Vector (Local)</label>
              <input
                type="text"
                value={formData.bankDetails.ifscCode}
                onChange={(e) =>
                  handleChange("bankDetails", "ifscCode", e.target.value)
                }
                required
                readOnly={!isEditing}
                className={inputClass}
                placeholder="ROUT0000881"
              />
            </div>
            <div>
              <label className={labelClass}>
                SWIFT / BIC Routing Code (International)
              </label>
              <input
                type="text"
                value={formData.bankDetails.swiftCode}
                onChange={(e) =>
                  handleChange("bankDetails", "swiftCode", e.target.value)
                }
                readOnly={!isEditing}
                className={inputClass}
                placeholder="ROUTINBBXXX"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Settlement UPI ID</label>
              <input
                type="text"
                value={formData.bankDetails.upiId}
                onChange={(e) =>
                  handleChange("bankDetails", "upiId", e.target.value)
                }
                readOnly={!isEditing}
                className={inputClass}
                placeholder="user@okhdfcbank"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-start gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-6 rounded-lg font-medium text-xs sm:text-[13px] tracking-tight border cursor-pointer transition-all active:scale-[0.98] ${
                theme === "dark"
                  ? "bg-[#f5f5f7] border-[#ffffff] text-[#000000] hover:bg-[#e5e5ea]"
                  : "bg-[#1d1d1f] border-[#000000] text-[#ffffff] hover:bg-[#323236]"
              } disabled:opacity-40`}
            >
              {loading ? "Synchronizing Contexts..." : "Save Settings"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className={`py-2 px-6 rounded-lg font-medium text-xs sm:text-[13px] tracking-tight border cursor-pointer transition-all active:scale-[0.98] ${
                theme === "dark"
                  ? "bg-[#000000] border-[#2c2c2e] text-[#8e8e93] hover:text-[#ffffff] hover:border-[#48484a]"
                  : "bg-[#ffffff] border-[#d2d2d7] text-[#515154] hover:text-[#1d1d1f] hover:border-[#86868b]"
              } disabled:opacity-40`}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfileSettings;
