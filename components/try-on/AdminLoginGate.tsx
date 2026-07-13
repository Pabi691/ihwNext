import React, { useState } from "react";
import { TRY_ON_API_BASE, TRY_ON_SESSION_KEY } from "./adminSession";

export default function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${TRY_ON_API_BASE}/api/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status && data.access_token) {
        const role = data.user?.role;
        if (role === "customer" || role === "guest") {
          setError("Access denied. Admin accounts only.");
        } else {
          sessionStorage.setItem(TRY_ON_SESSION_KEY, data.access_token);
          onSuccess();
        }
      } else {
        setError(data.error_message || "Invalid credentials.");
      }
    } catch {
      setError("Cannot connect to server. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#04A9FF]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#04A9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#04A9FF] to-[#0070cc] rounded-2xl shadow-2xl shadow-[#04A9FF]/30 mb-4">
            <span className="text-white text-2xl">✂️</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Try-On Studio</h1>
          <p className="text-slate-500 text-sm mt-1">Admin access only</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest block mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@indianhairworld.com"
                className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-[#04A9FF]/60 transition-colors" />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  className="w-full py-3 px-4 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-[#04A9FF]/60 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-lg">
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#04A9FF] to-[#0070cc] hover:from-[#0070cc] hover:to-[#004fa3] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#04A9FF]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                : "Enter Studio"}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-700 text-xs mt-6">© {new Date().getFullYear()} Indian Hair World — Authorised Access Only</p>
      </div>
    </div>
  );
}
