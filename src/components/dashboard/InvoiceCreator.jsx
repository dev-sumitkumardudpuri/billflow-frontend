import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";

function InvoiceCreator({ theme, user }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, price: "" },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userCurrencyCode = user?.companyDetails?.currency || "USD";
  const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    CAD: "C$",
    AUD: "A$",
  };
  const currencySymbol = currencySymbols[userCurrencyCode] || "$";

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await API.get("/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error loading client options:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === "description") {
      updatedItems[index][field] = value;
    } else {
      const sanitized = value.replace(/[^0-9.]/g, "");
      updatedItems[index][field] = sanitized;
    }
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([...items, { description: "", quantity: 1, price: "" }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleDiscountChange = (value) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    setDiscount(sanitized);
  };

  const preventInvalidKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const subTotal = items.reduce(
    (acc, item) => acc + Number(item.quantity || 0) * Number(item.price || 0),
    0,
  );
  const grandTotal = Math.max(0, subTotal - Number(discount || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setMessage({ type: "error", text: "Please select a client profile." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const formattedItems = items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
    }));

    const payload = {
      clientId,
      items: formattedItems,
      dueDate,
      discount: Number(discount || 0),
    };

    try {
      const response = await API.post("/api/invoices/generate", payload);
      if (response.status === 201) {
        setMessage({
          type: "success",
          text: "Invoice generated. PDF transmitted securely.",
        });
        setClientId("");
        setDueDate("");
        setDiscount("");
        setItems([{ description: "", quantity: 1, price: "" }]);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to automate invoice dispatch.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find((c) => c._id === clientId);

  const inputClass = `w-full mt-1.5 px-3 py-2 rounded-lg border text-xs sm:text-[13px] outline-none transition-all duration-200 tracking-tight font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
    theme === "dark"
      ? "bg-[#000000] border-[#2c2c2e] focus:border-[#ffffff] text-white placeholder-[#48484a] [color-scheme:dark]"
      : "bg-[#ffffff] border-[#e5e5ea] focus:border-[#000000] text-[#1d1d1f] placeholder-[#c7c7cc] [color-scheme:light]"
  }`;

  const labelClass = `block text-[11px] font-medium tracking-tight ${
    theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"
  }`;

  return (
    <div
      className={`max-w-5xl mx-auto space-y-8 select-none animate-fade-in ${theme === "dark" ? "text-white" : "text-[#1d1d1f]"}`}
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans">
          Invoices
        </h2>
        <p
          className={`text-xs sm:text-[13px] mt-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
        >
          Structure ledger items, target client profiles, and trigger dispatch
          pipelines.
        </p>
      </div>

      {message.text && (
        <div
          className={`py-2.5 px-4 rounded-lg text-xs font-medium border tracking-tight ${
            message.type === "success"
              ? theme === "dark"
                ? "bg-[#30d158]/10 border-[#30d158]/20 text-[#30d158]"
                : "bg-[#34c759]/10 border-[#34c759]/20 text-[#248a3d]"
              : theme === "dark"
                ? "bg-[#ff453a]/10 border-[#ff453a]/20 text-[#ff453a]"
                : "bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#d7261e]"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`p-5 rounded-xl border transition-all duration-300 ${theme === "dark" ? "bg-[#1c1c1e]/40 border-[#2c2c2e]" : "bg-[#f5f5f7]/60 border-[#e5e5ea]"}`}
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
                Invoice Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative" ref={dropdownRef}>
                <label className={labelClass}>Recipient Client *</label>

                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full mt-1.5 px-3 py-2 rounded-lg border text-xs sm:text-[13px] outline-none transition-all duration-200 tracking-tight font-sans flex items-between items-center justify-between cursor-pointer ${
                    theme === "dark"
                      ? "bg-[#000000] border-[#2c2c2e] text-white"
                      : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f]"
                  } ${isDropdownOpen ? (theme === "dark" ? "border-white" : "border-black") : ""}`}
                >
                  <span
                    className={
                      !clientId
                        ? theme === "dark"
                          ? "text-[#48484a]"
                          : "text-[#c7c7cc]"
                        : ""
                    }
                  >
                    {selectedClient
                      ? `${selectedClient.clientName} ${selectedClient.companyName ? `— ${selectedClient.companyName}` : ""}`
                      : "Choose Profile"}
                  </span>
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
                </div>

                {isDropdownOpen && (
                  <div
                    className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-xl animate-fade-in transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-[#1c1c1e] border-[#2c2c2e] text-white shadow-black/40"
                        : "bg-white border-[#e5e5ea] text-black shadow-gray-200/80"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setClientId("");
                        setIsDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-xs sm:text-[13px] cursor-pointer transition-colors ${
                        !clientId
                          ? theme === "dark"
                            ? "bg-[#2c2c2e]"
                            : "bg-[#f5f5f7]"
                          : theme === "dark"
                            ? "hover:bg-[#2c2c2e]/50"
                            : "hover:bg-[#f5f5f7]/50"
                      }`}
                    >
                      Choose Profile
                    </div>
                    {clients.map((c) => (
                      <div
                        key={c._id}
                        onClick={() => {
                          setClientId(c._id);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3 py-2 text-xs sm:text-[13px] cursor-pointer transition-colors flex justify-between items-center ${
                          clientId === c._id
                            ? theme === "dark"
                              ? "bg-[#2c2c2e] font-medium"
                              : "bg-[#f5f5f7] font-medium"
                            : theme === "dark"
                              ? "hover:bg-[#2c2c2e]/50"
                              : "hover:bg-[#f5f5f7]/50"
                        }`}
                      >
                        <span className="truncate">
                          {c.clientName}{" "}
                          {c.companyName ? `— ${c.companyName}` : ""}
                        </span>
                        {clientId === c._id && (
                          <svg
                            className="w-3.5 h-3.5 opacity-80"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div
            className={`p-5 rounded-xl border transition-all duration-300 ${theme === "dark" ? "bg-[#1c1c1e]/40 border-[#2c2c2e]" : "bg-[#f5f5f7]/60 border-[#e5e5ea]"}`}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <h3 className="font-semibold text-sm tracking-tight">
                  Inventory Items
                </h3>
              </div>
              <button
                type="button"
                onClick={addItemRow}
                className={`py-1 px-3 rounded-md font-medium text-xs tracking-tight border cursor-pointer transition-all active:scale-[0.97] ${
                  theme === "dark"
                    ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#f5f5f7] hover:bg-[#2c2c2e]"
                    : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                Add Row
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 items-end"
                >
                  <div className="grow w-full">
                    <label className={labelClass}>
                      Work / Item Description
                    </label>
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="UI/UX Core Engineering Contract..."
                      className={inputClass}
                    />
                  </div>

                  <div className="w-full sm:w-20">
                    <label className={labelClass}>Qty</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      onKeyDown={preventInvalidKeys}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="w-full sm:w-28">
                    <label className={labelClass}>
                      Price ({currencySymbol})
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      onKeyDown={preventInvalidKeys}
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all active:scale-95 mb-px ${
                        theme === "dark"
                          ? "border-[#2c2c2e] text-[#ff453a] hover:bg-[#ff453a]/10"
                          : "border-[#e5e5ea] text-[#ff3b30] hover:bg-[#ff3b30]/5"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div
            className={`p-5 rounded-xl border transition-all duration-300 ${theme === "dark" ? "bg-[#1c1c1e]/40 border-[#2c2c2e]" : "bg-[#f5f5f7]/60 border-[#e5e5ea]"}`}
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-semibold text-sm tracking-tight">
                Settlement Audit
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Apply Discount ({currencySymbol})
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  onKeyDown={preventInvalidKeys}
                  value={discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div
                className={`pt-4 border-t border-dashed space-y-2.5 text-xs sm:text-[13px] font-medium ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
              >
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"
                    }
                  >
                    Gross Subtotal:
                  </span>
                  <span className="font-sans font-medium">
                    {currencySymbol}
                    {subTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"
                    }
                  >
                    Discount Off:
                  </span>
                  <span className="font-sans text-[#ff453a] font-medium">
                    -{currencySymbol}
                    {Number(discount || 0).toFixed(2)}
                  </span>
                </div>

                <div
                  className={`flex justify-between text-sm sm:text-base font-semibold pt-3 border-t ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
                >
                  <span>Net Due:</span>
                  <span className="font-sans">
                    {currencySymbol}
                    {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-2 rounded-lg font-medium text-xs sm:text-[13px] tracking-tight border cursor-pointer transition-all active:scale-[0.98] ${
                  theme === "dark"
                    ? "bg-[#f5f5f7] border-[#ffffff] text-[#000000] hover:bg-[#e5e5ea]"
                    : "bg-[#1d1d1f] border-[#000000] text-[#ffffff] hover:bg-[#323236]"
                } disabled:opacity-40`}
              >
                {loading ? "Processing Securely..." : "Generate & Dispatch"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceCreator;
