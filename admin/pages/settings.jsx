import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiSave, FiTag, FiPercent, FiAlertCircle } from "react-icons/fi";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-3 flex items-center gap-2">
        {Icon && <Icon size={15} className="text-[#04A9FF]" />} {title}
      </h3>
      {children}
    </div>
  );
}

const L = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const I = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";

const COLOR_OPTIONS = [
  { value: "red",    label: "Red",    preview: "bg-red-500" },
  { value: "orange", label: "Orange", preview: "bg-orange-500" },
  { value: "purple", label: "Purple", preview: "bg-purple-500" },
  { value: "blue",   label: "Blue",   preview: "bg-blue-500" },
  { value: "green",  label: "Green",  preview: "bg-green-500" },
];

export default function Settings() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();

  const [form, setForm] = useState({
    sale_label:        "SALE",
    sale_banner_text:  "Limited time offers — shop now!",
    sale_badge_color:  "red",
    sale_discount_pct: "",
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("get", "/get_settings");
      if (res.data?.settings) {
        setForm((f) => ({ ...f, ...res.data.settings }));
      }
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    fetchSettings();
  }, [ready, fetchSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      await api("post", "/update_settings", form);
      setSuccess("Settings saved successfully.");
    } catch {
      setError("Failed to save settings.");
    }
    setSaving(false);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Settings">
      <Head><title>Settings — IHW Admin</title></Head>

      <div className="mb-6">
        <h2 className="font-bold text-gray-900 text-xl">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Configure global sale settings and other options</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          <FiAlertCircle size={15} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-2xl space-y-5">

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Sale Settings */}
            <Section title="Sale Settings" icon={FiTag}>

              {/* Preview badge */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500 font-medium">Preview:</span>
                <span className={`inline-flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 rounded-full ${
                  form.sale_badge_color === "orange" ? "bg-orange-500" :
                  form.sale_badge_color === "purple" ? "bg-purple-500" :
                  form.sale_badge_color === "blue"   ? "bg-blue-500" :
                  form.sale_badge_color === "green"  ? "bg-green-500" :
                  "bg-red-500"
                }`}>
                  🔥 {form.sale_label || "SALE"}
                </span>
                {form.sale_discount_pct && (
                  <span className="text-xs font-bold text-gray-600 bg-yellow-100 px-2 py-1 rounded-full">
                    Up to {form.sale_discount_pct}% Off
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={L}>Sale Label</label>
                  <input value={form.sale_label} onChange={(e) => set("sale_label", e.target.value)}
                    placeholder="e.g. MEGA SALE" className={I} maxLength={20} />
                  <p className="text-xs text-gray-400 mt-1">Shown on the sale badge (max 20 chars)</p>
                </div>
                <div>
                  <label className={L}>
                    <span className="flex items-center gap-1"><FiPercent size={11} /> Max Discount %</span>
                  </label>
                  <input type="number" min="0" max="100" value={form.sale_discount_pct}
                    onChange={(e) => set("sale_discount_pct", e.target.value)}
                    placeholder="e.g. 50" className={I} />
                  <p className="text-xs text-gray-400 mt-1">Displayed as "Up to X% Off" (leave blank to hide)</p>
                </div>
              </div>

              <div>
                <label className={L}>Banner Text</label>
                <input value={form.sale_banner_text} onChange={(e) => set("sale_banner_text", e.target.value)}
                  placeholder="e.g. Grab amazing deals before they're gone!"
                  className={I} maxLength={120} />
                <p className="text-xs text-gray-400 mt-1">Shown below the section title on the home page</p>
              </div>

              <div>
                <label className={L}>Badge Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c.value} type="button" onClick={() => set("sale_badge_color", c.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        form.sale_badge_color === c.value
                          ? "border-[#04A9FF] bg-blue-50 text-[#04A9FF]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <span className={`w-3 h-3 rounded-full ${c.preview}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              <FiSave size={14} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </>
        )}
      </form>
    </AdminLayout>
  );
}
