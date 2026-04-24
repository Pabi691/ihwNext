import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiImage, FiAlertCircle } from "react-icons/fi";

export default function CreateProduct() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [form, setForm] = useState({
    prod_type: "Simple",
    prod_name: "",
    sku: "",
    prod_desc: "",
    regular_price: "",
    sale_price: "",
    stock_qty: "",
    min_order_qty: "",
    pack_qty: "",
    pack_price: "",
    brand_id: "",
    color_id: "",
    size_chart_id: "",
    product_tag: "",
    product_quality: "",
    product_rating: "",
    is_sale: false,
    is_returnable: false,
    is_cod: false,
    status: "1",
  });

  const [primaryImg, setPrimaryImg] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [secondaryPreview, setSecondaryPreview] = useState(null);

  const primaryRef = useRef();
  const secondaryRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadDropdowns = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api("get", "/get_active_category"),
        api("get", "/get_active_brand"),
      ]);
      setCategories(Array.isArray(catRes.data?.category_list) ? catRes.data.category_list : []);
      setBrands(Array.isArray(brandRes.data?.brand_list) ? brandRes.data.brand_list : []);
    } catch {}
  }, [api]);

  useEffect(() => {
    if (!ready) return;
    loadDropdowns();
  }, [ready, loadDropdowns]);

  const handleImg = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.find((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, { id: cat.id }]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.prod_name.trim()) return setError("Product name is required.");
    if (!form.regular_price) return setError("Regular price is required.");
    if (!form.sale_price) return setError("Sale price is required.");
    if (!form.stock_qty) return setError("Stock quantity is required.");
    if (!primaryImg) return setError("Primary image is required.");
    if (selectedCategories.length === 0) return setError("At least one category is required.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("prod_type", form.prod_type);
      fd.append("prod_name", form.prod_name);
      fd.append("sku", form.sku);
      fd.append("prod_desc", form.prod_desc);
      fd.append("regular_price", form.regular_price);
      fd.append("sale_price", form.sale_price);
      fd.append("stock_qty", form.stock_qty);
      fd.append("min_order_qty", form.min_order_qty || "1");
      fd.append("pack_qty", form.pack_qty || "");
      fd.append("pack_price", form.pack_price || "");
      fd.append("brand_id", form.brand_id || "");
      fd.append("color_id", form.color_id || "");
      fd.append("size_chart_id", form.size_chart_id || "");
      fd.append("product_tag", form.product_tag || "");
      fd.append("product_quality", form.product_quality || "");
      fd.append("product_rating", form.product_rating || "");
      fd.append("is_sale", form.is_sale ? "1" : "0");
      fd.append("is_returnable", form.is_returnable ? "1" : "0");
      fd.append("is_cod", form.is_cod ? "1" : "0");
      fd.append("status", form.status);
      fd.append("primary_img", primaryImg);
      if (secondaryImg) fd.append("secondary_img", secondaryImg);
      selectedCategories.forEach((cat, i) => {
        fd.append(`product_categories[${i}][id]`, cat.id);
      });

      const res = await api("post", "/create_product", fd);
      if (res.data?.status) {
        router.push(`/products/${res.data.product_id}`);
      } else {
        setError(res.data?.error_message || "Failed to create product.");
      }
    } catch (err) {
      setError("Failed to create product. Please try again.");
    }
    setSaving(false);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="New Product">
      <Head><title>New Product — IHW Admin</title></Head>

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <FiArrowLeft size={15} />
        </button>
        <h2 className="font-bold text-gray-900 text-lg">New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            <FiAlertCircle size={15} /> {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Name *</label>
              <input value={form.prod_name} onChange={(e) => set("prod_name", e.target.value)}
                placeholder="e.g. 10 Inch Natural Black Straight Hair"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">SKU</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
                placeholder="e.g. IHW-10-BLK"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Type</label>
              <select value={form.prod_type} onChange={(e) => set("prod_type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                <option value="Simple">Simple</option>
                <option value="Variable">Variable</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Description</label>
              <textarea rows={5} value={form.prod_desc} onChange={(e) => set("prod_desc", e.target.value)}
                placeholder="Product description..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Pricing & Stock</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Regular Price *</label>
              <input type="number" value={form.regular_price} onChange={(e) => set("regular_price", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Sale Price *</label>
              <input type="number" value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Stock Qty *</label>
              <input type="number" value={form.stock_qty} onChange={(e) => set("stock_qty", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Min Order Qty</label>
              <input type="number" value={form.min_order_qty} onChange={(e) => set("min_order_qty", e.target.value)}
                placeholder="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Pack Qty</label>
              <input type="number" value={form.pack_qty} onChange={(e) => set("pack_qty", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Pack Price</label>
              <input type="number" value={form.pack_price} onChange={(e) => set("pack_price", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Images</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Primary Image *</label>
              <div className="flex items-center gap-3">
                {primaryPreview ? (
                  <img src={primaryPreview} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer" onClick={() => primaryRef.current?.click()}>
                    <FiImage size={22} className="text-gray-300" />
                  </div>
                )}
                <button type="button" onClick={() => primaryRef.current?.click()}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  {primaryPreview ? "Change" : "Upload"}
                </button>
                <input ref={primaryRef} type="file" accept="image/*" className="hidden" onChange={handleImg(setPrimaryImg, setPrimaryPreview)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Secondary Image</label>
              <div className="flex items-center gap-3">
                {secondaryPreview ? (
                  <img src={secondaryPreview} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer" onClick={() => secondaryRef.current?.click()}>
                    <FiImage size={22} className="text-gray-300" />
                  </div>
                )}
                <button type="button" onClick={() => secondaryRef.current?.click()}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  {secondaryPreview ? "Change" : "Upload"}
                </button>
                <input ref={secondaryRef} type="file" accept="image/*" className="hidden" onChange={handleImg(setSecondaryImg, setSecondaryPreview)} />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">Categories *</h3>
          {categories.length === 0 ? (
            <p className="text-xs text-gray-400">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategories.find((c) => c.id === cat.id);
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${selected ? "bg-[#04A9FF] text-white border-[#04A9FF]" : "bg-white text-gray-600 border-gray-200 hover:border-[#04A9FF]"}`}>
                    {cat.category_name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Attributes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Brand</label>
              <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Quality</label>
              <input value={form.product_quality} onChange={(e) => set("product_quality", e.target.value)}
                placeholder="e.g. Premium"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Tag</label>
              <input value={form.product_tag} onChange={(e) => set("product_tag", e.target.value)}
                placeholder="e.g. bestseller"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-2">
            {[
              { key: "is_sale", label: "On Sale" },
              { key: "is_returnable", label: "Returnable" },
              { key: "is_cod", label: "Cash on Delivery" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <div onClick={() => set(key, !form[key])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? "bg-[#04A9FF]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-600 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
