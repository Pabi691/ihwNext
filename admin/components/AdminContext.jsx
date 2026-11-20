import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// Two ways to reach the Laravel backend:
//  • API_BACKEND_RESOLVE set when the CRM was built (it runs on the same
//    Hostinger server as Laravel): call this app's own /api. The proxy in
//    pages/api/[...path].js connects to Laravel over the loopback, skipping the
//    CDN edge. Same-origin, so no CORS preflight — on some networks the edge
//    answered the preflight without CORS headers and login failed.
//  • otherwise: call Laravel directly from the browser (it allows any origin).
const VIA_PROXY = !!process.env.NEXT_PUBLIC_API_VIA_PROXY;
const API_BASE = VIA_PROXY ? "/api" : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
// Local dev only: /images goes through that proxy so uploads land on the live CDN.
const IMAGES_BASE = VIA_PROXY || process.env.NEXT_PUBLIC_IMAGES_VIA_PROXY ? "/api" : API_BASE;

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
    const base = /^\/images(\/|\?|$)/.test(endpoint) ? IMAGES_BASE : API_BASE;
    const url = `${base}${endpoint}`;
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
