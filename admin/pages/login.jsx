import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

export default function Login() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const { login, adminToken, authLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && adminToken) router.replace("/");
  }, [adminToken, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.success) router.replace("/");
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Head><title>Sign In — IHW Admin</title></Head>

      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#04A9FF]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#04A9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#04A9FF] to-[#0070cc] rounded-2xl shadow-2xl shadow-[#04A9FF]/30 mb-4">
            <span className="text-white text-lg font-black tracking-tight">IHW</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <FiAlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-[#04A9FF]/60 transition-colors">
                <FiMail size={15} className="text-slate-500 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@indianhairworld.com"
                  className="flex-1 py-3 bg-transparent text-white text-sm placeholder-slate-600 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-[#04A9FF]/60 transition-colors">
                <FiLock size={15} className="text-slate-500 flex-shrink-0" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 py-3 bg-transparent text-white text-sm placeholder-slate-600 outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#04A9FF] to-[#0070cc] hover:from-[#0070cc] hover:to-[#004fa3] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#04A9FF]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : "Sign In to Admin"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          © {new Date().getFullYear()} Indian Hair World — Authorised Access Only
        </p>
      </div>
    </div>
  );
}
