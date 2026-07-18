import React, { useState, useEffect } from "react";
import API from "../../services/api";

function ClientManager({ theme }) {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const fetchClients = async () => {
    try {
      setFetchLoading(true);
      const response = await API.get("/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      return;
    }

    if (name === "clientName") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: onlyLetters });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone && formData.phone.length !== 10) {
      setMessage({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await API.post("/api/clients", formData);
      if (response.status === 201) {
        setMessage({
          type: "success",
          text: "Client registered successfully.",
        });
        setFormData({
          clientName: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
        });
        fetchClients();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add client profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    const id = clientToDelete._id;
    setShowDeleteModal(false);

    try {
      const response = await API.delete(`/api/clients/${id}`);
      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Client deleted successfully.",
        });
        setClients(clients.filter((client) => client._id !== id));
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete client.",
      });
    } finally {
      setClientToDelete(null);
    }
  };

  const inputClass = `w-full mt-1.5 px-3 py-2 rounded-lg border text-xs sm:text-[13px] outline-none transition-all duration-200 tracking-tight font-sans ${
    theme === "dark"
      ? "bg-[#000000] border-[#2c2c2e] focus:border-[#ffffff] text-white placeholder-[#48484a]"
      : "bg-[#ffffff] border-[#e5e5ea] focus:border-[#000000] text-[#1d1d1f] placeholder-[#a1a1a6]"
  }`;

  const labelClass = `block text-[11px] font-medium tracking-tight ${
    theme === "dark" ? "text-[#8e8e93]" : "text-[#515154]"
  }`;

  return (
    <div className="w-full flex flex-col justify-center min-h-[85vh] py-4 relative">
      {/* PREMIUM CUSTOM DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-all duration-300 animate-fadeIn">
          <div
            className={`max-w-xs w-full p-5 rounded-xl border shadow-lg space-y-4 transition-all duration-300 font-sans ${
              theme === "dark"
                ? "bg-[#1c1c1e] border-[#2c2c2e] text-white"
                : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f]"
            }`}
          >
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Delete Client Profile?
              </h3>
              <p
                className={`text-[11px] mt-1.5 leading-normal ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {clientToDelete?.clientName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setClientToDelete(null);
                }}
                className={`flex-1 py-1.5 text-xs font-medium border rounded-md cursor-pointer transition-all active:scale-[0.98] ${
                  theme === "dark"
                    ? "bg-transparent border-[#2c2c2e] text-white hover:bg-[#2c2c2e]"
                    : "bg-transparent border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all active:scale-[0.98] bg-[#ff3b30] hover:bg-[#bd1d14] text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-5xl w-full mx-auto space-y-8 select-none transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1d1d1f]"}`}
      >
        {/* Header section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans">
            Clients
          </h2>
          <p
            className={`text-xs sm:text-[13px] mt-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
          >
            Manage your clients, company names, and contact details.
          </p>
        </div>

        {/* Message alert box */}
        {message.text && (
          <div
            className={`py-2.5 px-4 rounded-lg text-xs font-medium border tracking-tight transition-all duration-300 ${
              message.type === "success"
                ? theme === "dark"
                  ? "bg-[#30d158]/10 border-[#30d158]/20 text-[#30d158]"
                  : "bg-[#34c759]/10 border-[#34c759]/30 text-[#1d722f]"
                : theme === "dark"
                  ? "bg-[#ff453a]/10 border-[#ff453a]/20 text-[#ff453a]"
                  : "bg-[#ff3b30]/10 border-[#ff3b30]/30 text-[#bd1d14]"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: ADD NEW CLIENT FORM */}
          <div
            className={`p-5 rounded-xl border h-fit lg:col-span-1 transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1c1c1e]/40 border-[#2c2c2e]"
                : "bg-[#f5f5f7] border-[#e5e5ea]"
            }`}
          >
            <div className="flex items-center gap-2 mb-5">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <h3 className="font-semibold text-sm tracking-tight">
                Add New Client
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Rahul Mehta"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Apex Media Agency"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@apexmedia.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter client office or billing address..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-medium text-xs sm:text-[13px] tracking-tight border cursor-pointer transition-all active:scale-[0.98] mt-2 ${
                  theme === "dark"
                    ? "bg-[#f5f5f7] border-[#ffffff] text-[#000000] hover:bg-[#e5e5ea]"
                    : "bg-[#1d1d1f] border-[#000000] text-[#ffffff] hover:bg-[#323236]"
                }`}
              >
                {loading ? "Saving..." : "Save Client"}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: REGISTERED CLIENTS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-1">
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <h3 className="font-semibold text-sm tracking-tight">
                  Client List ({clients.length})
                </h3>
              </div>

              {fetchLoading && clients.length > 0 && (
                <span className="text-[11px] opacity-60 animate-pulse font-medium">
                  Updating...
                </span>
              )}
            </div>

            {fetchLoading && clients.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className={`p-4 rounded-xl border h-32 ${
                      theme === "dark"
                        ? "bg-[#1c1c1e]/40 border-[#2c2c2e]"
                        : "bg-[#ffffff] border-[#e5e5ea]"
                    }`}
                  />
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div
                className={`p-10 rounded-xl border border-dashed flex flex-col items-center justify-center text-center min-h-75 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-[#2c2c2e] bg-[#1c1c1e]/10"
                    : "border-[#e5e5ea] bg-[#f5f5f7]/50"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg mb-3 border ${
                    theme === "dark"
                      ? "bg-[#1c1c1e] border-[#2c2c2e]"
                      : "bg-[#ffffff] border-[#e5e5ea]"
                  }`}
                >
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium tracking-tight">
                  No clients found
                </h4>
                <p
                  className={`text-xs mt-1.5 max-w-xs leading-relaxed ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
                >
                  Add new clients using the form on the left to see them listed
                  here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300">
                {clients.map((client) => (
                  <div
                    key={client._id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 relative ${
                      theme === "dark"
                        ? "bg-[#1c1c1e]/40 border-[#2c2c2e] hover:border-[#48484a]"
                        : "bg-[#ffffff] border-[#e5e5ea] hover:border-[#b9b9be] hover:shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Top wrapper for title and delete button */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-medium text-xs border shrink-0 ${
                              theme === "dark"
                                ? "bg-[#1c1c1e] border-[#2c2c2e] text-[#ffffff]"
                                : "bg-[#f5f5f7] border-[#e5e5ea] text-[#000000]"
                            }`}
                          >
                            {client.clientName
                              ? client.clientName.slice(0, 1).toUpperCase()
                              : "C"}
                          </div>
                          <h4 className="text-sm font-semibold tracking-tight truncate">
                            {client.clientName}
                          </h4>
                        </div>

                        {/* Trash Icon Button custom pop-up */}
                        <button
                          onClick={() => initiateDelete(client)}
                          title="Delete Client"
                          className={`p-1 rounded-md transition-colors border cursor-pointer ${
                            theme === "dark"
                              ? "border-transparent text-[#ff453a] hover:bg-[#ff453a]/10"
                              : "border-transparent text-[#ff3b30] hover:bg-[#ff3b30]/10"
                          }`}
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {client.companyName && (
                        <div
                          className={`text-xs font-medium tracking-tight flex items-center gap-1.5 mb-2.5 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
                        >
                          <span className="opacity-60 text-[11px]">
                            Company:
                          </span>{" "}
                          {client.companyName}
                        </div>
                      )}

                      <div
                        className={`text-xs tracking-tight space-y-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#6e6e73]"}`}
                      >
                        <div className="truncate">
                          <span className="opacity-50">Email:</span>{" "}
                          {client.email}
                        </div>
                        {client.phone && (
                          <div>
                            <span className="opacity-50">Phone:</span>{" "}
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {client.address && (
                      <div
                        className={`mt-3 pt-3 border-t border-dashed text-[11px] truncate ${
                          theme === "dark"
                            ? "border-[#2c2c2e] text-[#636366]"
                            : "border-[#e5e5ea] text-[#8e8e93]"
                        }`}
                      >
                        {client.address}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientManager;
