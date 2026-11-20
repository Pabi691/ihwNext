import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// Same-origin on purpose: the browser always calls this admin's own /api proxy
// (pages/api/[...path].js), so the CRM works on whatever domain it is served
// from. A full URL baked in at build time sent home.indianhairworld.com's
// requests to ihwadmin.vercel.app, which the browser blocked (CORS).
const API_BASE = "/api";

export const AdminProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("ihw_admin_token");
    const user  = localStorage.getItem("ihw_admin_user");
    if (token && user) {
      setAdminToken(token);
      setAdminUser(JSON.parse(user));
    }
    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/sign_in`, { email, password });
      if (data.status && data.access_token) {
        const role = data.user?.role;
        if (role === "customer" || role === "guest") {
          return { success: false, message: "Access denied. Admin accounts only." };
        }
        setAdminToken(data.access_token);
        setAdminUser(data.user);
        localStorage.setItem("ihw_admin_token", data.access_token);
        localStorage.setItem("ihw_admin_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.error_message || "Invalid credentials." };
    } catch {
      return { success: false, message: "Cannot connect to server. Is the backend running?" };
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ihw_admin_token");
    localStorage.removeItem("ihw_admin_user");
  };

  const api = useCallback(async (method, endpoint, body = null) => {
    const isFormData = body instanceof FormData;
    const headers = {
      Authorization: `Bearer ${adminToken}`,
      Accept: "application/json",
      ...(!isFormData && { "Content-Type": "application/json" }),
    };
    const url = `${API_BASE}${endpoint}`;
    if (method === "get")    return axios.get(url, { headers });
    if (method === "delete") return axios.delete(url, { headers });
    return axios[method](url, body, { headers });
  }, [adminToken]);

  const setNewLeadsCountFromCustomers = useCallback((list) => {
    const count = (Array.isArray(list) ? list : []).filter(
      (c) => (!c.lead_status || c.lead_status === "new") && !c.admin_viewed_at
    ).length;
    setNewLeadsCount(count);
  }, []);

  const refreshNewLeadsCount = useCallback(async () => {
    try {
      const res = await api("get", "/get_all_customers");
      const list = Array.isArray(res.data?.customers) ? res.data.customers : [];
      setNewLeadsCountFromCustomers(list);
    } catch {}
  }, [api, setNewLeadsCountFromCustomers]);

  useEffect(() => {
    if (!adminToken) return;
    refreshNewLeadsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  return (
    <AdminContext.Provider value={{ adminToken, adminUser, authLoading, login, logout, api, newLeadsCount, refreshNewLeadsCount, setNewLeadsCountFromCustomers }}>
      {children}
    </AdminContext.Provider>
  );
};
