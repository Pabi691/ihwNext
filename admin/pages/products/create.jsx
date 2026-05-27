import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiImage, FiAlertCircle, FiPlus, FiTrash2, FiX } from "react-icons/fi";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">
      {children}
    </label>
  );
}

const INPUT  = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";
const SELECT = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors";
const SMALL  = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-[#04A9FF]" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </label>
  );
}

export default function CreateProduct() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);

  /* Size variations: each row = { size_id, size_name, regular_price, sale_price, stock_qty } */
  const [sizeVariations, setSizeVariations] = useState([]);

  /* Color variations: each row = { color_id, color_name, color_code, product_link } */
  const [colorVariations, setColorVariations] = useState([]);

  const [highlights, setHighlights] = useState([]);
  const [newHL, setNewHL] = useState({ label: "", value: "" });

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

  const [seo, setSeo] = useState({ meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "" });
  const setSeoField = (k, v) => setSeo((s) => ({ ...s, [k]: v }));

  const [primaryImg, setPrimaryImg] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [secondaryPreview, setSecondaryPreview] = useState(null);

  const primaryRef = useRef();
  const secondaryRef = useRef();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadDropdowns = useCallback(async () => {
    try {
      const [catRes, brandRes, sizeRes, colorRes] = await Promise.all([
        api("get", "/get_active_category"),
        api("get", "/get_active_brand"),
        api("get", "/get_active_sizes"),
        api("get", "/get_active_colors"),
      ]);
      setCategories(Array.isArray(catRes.data?.category_list) ? catRes.data.category_list : []);
      setBrands(Array.isArray(brandRes.data?.brand_list) ? brandRes.data.brand_list : []);
      setSizes(Array.isArray(sizeRes.data?.sizes) ? sizeRes.data.sizes : []);
      setColors(Array.isArray(colorRes.data?.colors) ? colorRes.data.colors : []);
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

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.find((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, { id: cat.id }]
    );

  /* ── Size variations ── */
  const toggleSize = (size) => {
    setSizeVariations((prev) => {
      if (prev.find((v) => v.size_id === size.id)) return prev.filter((v) => v.size_id !== size.id);
      return [...prev, {
        size_id: size.id,
        size_name: size.size_name,
        regular_price: form.regular_price || "",
        sale_price: form.sale_price || "",
        stock_qty: "0",
      }];
    });
  };

  const updateSizeRow = (sizeId, field, value) =>
    setSizeVariations((prev) => prev.map((v) => v.size_id === sizeId ? { ...v, [field]: value } : v));

  /* ── Color variations ── */
  const toggleColor = (color) => {
    setColorVariations((prev) => {
      if (prev.find((v) => v.color_id === color.id)) return prev.filter((v) => v.color_id !== color.id);
      return [...prev, { color_id: color.id, color_name: color.color_name, color_code: color.color_code, product_link: "" }];
    });
  };

  const updateColorLink = (colorId, value) =>
    setColorVariations((prev) => prev.map((v) => v.color_id === colorId ? { ...v, product_link: value } : v));

  /* ── Highlights ── */
  const addHighlight = () => {
    if (!newHL.label.trim() || !newHL.value.trim()) return;
    setHighlights((prev) => [...prev, { ...newHL, _key: Date.now() }]);
    setNewHL({ label: "", value: "" });
  };

  /* ── Submit ── */
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
      [
        "prod_type", "prod_name", "sku", "prod_desc", "regular_price",
        "sale_price", "stock_qty", "brand_id", "color_id", "size_chart_id",
        "product_tag", "product_quality", "product_rating", "status",
      ].forEach((k) => fd.append(k, form[k] || ""));
      fd.append("min_order_qty", form.min_order_qty || "1");
      fd.append("pack_qty", form.pack_qty || "");
      fd.append("pack_price", form.pack_price || "");
      fd.append("is_sale", form.is_sale ? "1" : "0");
      fd.append("is_returnable", form.is_returnable ? "1" : "0");
      fd.append("is_cod", form.is_cod ? "1" : "0");
      fd.append("primary_img", primaryImg);
      if (secondaryImg) fd.append("secondary_img", secondaryImg);
      selectedCategories.forEach((cat, i) =>
        fd.append(`product_categories[${i}][id]`, cat.id)
      );

      const res = await api("post", "/create_product", fd);
      if (!res.data?.status) {
        setError(res.data?.error_message || "Failed to create product.");
        setSaving(false);
        return;
      }

      const productId = res.data.product_id;

      await Promise.all([
        ...sizeVariations.map((v) =>
          api("post", "/add_product_variation_size", {
            product_id: productId, size_id: v.size_id,
            regular_price: v.regular_price, sale_price: v.sale_price, stock_qty: v.stock_qty,
          }).catch(() => null)
        ),
        ...colorVariations.map((v) =>
          api("post", "/add_product_variation_color", {
            product_id: productId, color_id: v.color_id, color_page_link: v.product_link,
          }).catch(() => null)
        ),
        ...highlights.map((h) =>
          api("post", `/add_product_key_highlight/${productId}`, { label: h.label, value: h.value }).catch(() => null)
        ),
        seo.meta_title
          ? api("post", "/update_seo_metadata", { entity_type: "product", entity_id: productId, ...seo }).catch(() => null)
          : null,
      ].filter(Boolean));

      router.push(`/products/${productId}`);
    } catch {
      setError("Failed to create product. Please try again.");
    }
    setSaving(false);
  };

  if (!ready) return null;

  return (
    <AdminLayout title="New Product">
      <Head><title>New Product — IHW Admin</title></Head>

      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <FiArrowLeft size={15} />
        </button>
        <h2 className="font-bold text-gray-900 text-lg">New Product</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 max-w-6xl">
            <FiAlertCircle size={15} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl">

          {/* ── Left column ─────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Basic Information */}
            <Section title="Basic Information">
              <div>
                <Label>Product Name *</Label>
                <input value={form.prod_name} onChange={(e) => set("prod_name", e.target.value)}
                  placeholder="e.g. 10 Inch Natural Black Straight Hair" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SKU</Label>
                  <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
                    placeholder="e.g. IHW-10-BLK" className={INPUT} />
                </div>
                <div>
                  <Label>Product Type</Label>
                  <select value={form.prod_type} onChange={(e) => set("prod_type", e.target.value)} className={SELECT}>
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <textarea rows={5} value={form.prod_desc} onChange={(e) => set("prod_desc", e.target.value)}
                  placeholder="Product description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
              </div>
            </Section>

            {/* Pricing & Stock */}
            <Section title="Pricing & Stock">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "regular_price", label: "Regular Price *" },
                  { key: "sale_price",    label: "Sale Price *" },
                  { key: "stock_qty",     label: "Stock Qty *" },
                  { key: "min_order_qty", label: "Min Order Qty" },
                  { key: "pack_qty",      label: "Pack Qty" },
                  { key: "pack_price",    label: "Pack Price" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <input type="number" value={form[key]} onChange={(e) => set(key, e.target.value)}
                      placeholder="0" className={INPUT} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Size Variations */}
            <Section title="Product Variations (Sizes)">
              {sizes.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No sizes available.{" "}
                  <a href="/sizes" className="text-[#04A9FF] hover:underline">Create sizes first →</a>
                </p>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Click to select sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => {
                        const active = sizeVariations.some((v) => v.size_id === s.id);
                        return (
                          <button key={s.id} type="button" onClick={() => toggleSize(s)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              active
                                ? "bg-[#04A9FF] text-white border-[#04A9FF]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#04A9FF] hover:text-[#04A9FF]"
                            }`}>
                            {s.size_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Size variation table */}
                  {sizeVariations.length > 0 && (
                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                            <th className="px-4 py-2.5 text-left">Size</th>
                            <th className="px-3 py-2.5 text-left">Regular Price</th>
                            <th className="px-3 py-2.5 text-left">Sale Price</th>
                            <th className="px-3 py-2.5 text-left">Stock Qty</th>
                            <th className="px-3 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {sizeVariations.map((v) => (
                            <tr key={v.size_id}>
                              <td className="px-4 py-2.5 font-semibold text-gray-700">{v.size_name}</td>
                              <td className="px-3 py-2.5">
                                <input type="number" value={v.regular_price}
                                  onChange={(e) => updateSizeRow(v.size_id, "regular_price", e.target.value)}
                                  placeholder="Regular Price" className={SMALL} />
                              </td>
                              <td className="px-3 py-2.5">
                                <input type="number" value={v.sale_price}
                                  onChange={(e) => updateSizeRow(v.size_id, "sale_price", e.target.value)}
                                  placeholder="Sale Price" className={SMALL} />
                              </td>
                              <td className="px-3 py-2.5">
                                <input type="number" value={v.stock_qty}
                                  onChange={(e) => updateSizeRow(v.size_id, "stock_qty", e.target.value)}
                                  placeholder="Stock Qty" className={SMALL} />
                              </td>
                              <td className="px-3 py-2.5">
                                <button type="button" onClick={() => toggleSize({ id: v.size_id })}
                                  className="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                                  <FiX size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </Section>

            {/* Color Variations */}
            <Section title="Color Variations (with Product Link)">
              {colors.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No colors available.{" "}
                  <a href="/colors" className="text-[#04A9FF] hover:underline">Create colors first →</a>
                </p>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Click to select colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => {
                        const active = colorVariations.some((v) => v.color_id === c.id);
                        return (
                          <button key={c.id} type="button" onClick={() => toggleColor(c)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              active
                                ? "border-[#04A9FF] bg-blue-50 text-[#04A9FF]"
                                : "border-gray-200 text-gray-600 hover:border-[#04A9FF]"
                            }`}>
                            <span className="w-4 h-4 rounded-sm flex-shrink-0 border border-black/10"
                              style={{ backgroundColor: c.color_code }} />
                            {c.color_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color variation table */}
                  {colorVariations.length > 0 && (
                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                            <th className="px-4 py-2.5 text-left">Color</th>
                            <th className="px-3 py-2.5 text-left">Product Link</th>
                            <th className="px-3 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {colorVariations.map((v) => (
                            <tr key={v.color_id}>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-7 h-7 rounded-md flex-shrink-0 border border-black/10 text-white text-xs font-bold flex items-center justify-center"
                                    style={{ backgroundColor: v.color_code }}>
                                  </span>
                                  <div>
                                    <p className="font-semibold text-gray-700 text-xs">{v.color_name}</p>
                                    <p className="text-gray-400 text-xs">{v.color_code}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <input type="url" value={v.product_link}
                                  onChange={(e) => updateColorLink(v.color_id, e.target.value)}
                                  placeholder="Copy paste your product url"
                                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                              </td>
                              <td className="px-3 py-2.5">
                                <button type="button" onClick={() => toggleColor({ id: v.color_id })}
                                  className="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                                  <FiX size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </Section>

            {/* Key Highlights */}
            <Section title="Key Highlights">
              <div className="space-y-2">
                {highlights.map((h) => (
                  <div key={h._key} className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl px-3 py-2 truncate">{h.label}</span>
                    <span className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2 truncate">{h.value}</span>
                    <button type="button" onClick={() => setHighlights((p) => p.filter((x) => x._key !== h._key))}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <input value={newHL.label} onChange={(e) => setNewHL((p) => ({ ...p, label: e.target.value }))}
                    placeholder="Label (e.g. Length)"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                  <input value={newHL.value} onChange={(e) => setNewHL((p) => ({ ...p, value: e.target.value }))}
                    placeholder="Value (e.g. 10 inch)"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                  <button type="button" onClick={addHighlight}
                    disabled={!newHL.label.trim() || !newHL.value.trim()}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors flex-shrink-0">
                    <FiPlus size={13} /> Add
                  </button>
                </div>
              </div>
            </Section>

            {/* SEO Details */}
            <Section title="SEO Details">
              <div className="space-y-3">
                <div>
                  <Label>Meta Title</Label>
                  <input value={seo.meta_title} onChange={(e) => setSeoField("meta_title", e.target.value)}
                    placeholder={form.prod_name || "Page title for search engines"} className={INPUT} />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <textarea rows={3} value={seo.meta_description} onChange={(e) => setSeoField("meta_description", e.target.value)}
                    placeholder="Brief description (150–160 chars recommended)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{seo.meta_description.length} chars</p>
                </div>
                <div>
                  <Label>Meta Keywords</Label>
                  <input value={seo.meta_keywords} onChange={(e) => setSeoField("meta_keywords", e.target.value)}
                    placeholder="keyword1, keyword2, keyword3" className={INPUT} />
                </div>
                <div>
                  <Label>Canonical URL</Label>
                  <input value={seo.canonical_url} onChange={(e) => setSeoField("canonical_url", e.target.value)}
                    placeholder="https://indianhairworld.com/product/..." className={INPUT} />
                </div>
              </div>
            </Section>

          </div>

          {/* ── Right column ─────────────────────────── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Images */}
            <Section title="Images">
              <div className="space-y-4">
                {[
                  { label: "Primary Image *", preview: primaryPreview, ref: primaryRef, setter: setPrimaryImg, previewSetter: setPrimaryPreview },
                  { label: "Secondary Image",  preview: secondaryPreview, ref: secondaryRef, setter: setSecondaryImg, previewSetter: setSecondaryPreview },
                ].map(({ label, preview, ref, setter, previewSetter }) => (
                  <div key={label}>
                    <Label>{label}</Label>
                    <div className="flex items-center gap-3">
                      {preview ? (
                        <img src={preview} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div onClick={() => ref.current?.click()}
                          className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0">
                          <FiImage size={18} className="text-gray-300" />
                        </div>
                      )}
                      <button type="button" onClick={() => ref.current?.click()}
                        className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        {preview ? "Change" : "Upload"}
                      </button>
                      <input ref={ref} type="file" accept="image/*" className="hidden"
                        onChange={handleImg(setter, previewSetter)} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Categories */}
            <Section title="Categories *">
              {categories.length === 0 ? (
                <p className="text-xs text-gray-400">Loading categories...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = selectedCategories.find((c) => c.id === cat.id);
                    return (
                      <button key={cat.id} type="button" onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          selected ? "bg-[#04A9FF] text-white border-[#04A9FF]" : "bg-white text-gray-600 border-gray-200 hover:border-[#04A9FF]"
                        }`}>
                        {cat.category_name}
                      </button>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* Attributes & Settings */}
            <Section title="Attributes & Settings">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Brand</Label>
                  <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)} className={SELECT}>
                    <option value="">Select Brand</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Main Color</Label>
                  <select value={form.color_id} onChange={(e) => set("color_id", e.target.value)} className={SELECT}>
                    <option value="">Select Color</option>
                    {colors.map((c) => <option key={c.id} value={c.id}>{c.color_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Product Quality</Label>
                  <input value={form.product_quality} onChange={(e) => set("product_quality", e.target.value)}
                    placeholder="e.g. Premium" className={INPUT} />
                </div>
                <div>
                  <Label>Product Tag</Label>
                  <input value={form.product_tag} onChange={(e) => set("product_tag", e.target.value)}
                    placeholder="e.g. bestseller" className={INPUT} />
                </div>
                <div className="col-span-2">
                  <Label>Status</Label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={SELECT}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 border-t border-gray-50">
                <Toggle checked={form.is_sale} onChange={(v) => set("is_sale", v)} label={
                  <span className="flex items-center gap-2">
                    On Sale
                    {form.is_sale && <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">SALE</span>}
                  </span>
                } />
                <Toggle checked={form.is_returnable} onChange={(v) => set("is_returnable", v)} label="Returnable (15 days)" />
                <Toggle checked={form.is_cod} onChange={(v) => set("is_cod", v)} label="Cash on Delivery" />
              </div>
            </Section>

          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-5 max-w-6xl">
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
