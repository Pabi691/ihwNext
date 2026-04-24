import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiImage, FiAlertCircle, FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function EditProduct() {
  const { ready } = useAuthGuard();
  const { api } = useAdmin();
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  const [primaryImg, setPrimaryImg] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [secondaryPreview, setSecondaryPreview] = useState(null);

  const [variations, setVariations] = useState([]);
  const [newVariation, setNewVariation] = useState({ size: "", color: "", regular_price: "", sale_price: "", stock_qty: "" });
  const [addingVariation, setAddingVariation] = useState(false);

  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgUploadRef = useRef();

  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState({ label: "", value: "" });
  const [editHighlight, setEditHighlight] = useState(null);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const [reviews, setReviews] = useState([]);

  const primaryRef = useRef();
  const secondaryRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        api("get", `/get_product_id/${id}`),
        api("get", "/get_active_category"),
        api("get", "/get_active_brand"),
      ]);

      const p = prodRes.data?.product_data;
      if (!p) { router.push("/products"); return; }

      setForm({
        id: p.id,
        prod_type: p.prod_type || "Simple",
        prod_name: p.prod_name || "",
        sku: p.sku || "",
        prod_desc: p.prod_desc || "",
        regular_price: p.regular_price || "",
        sale_price: p.sale_price || "",
        stock_qty: p.stock_qty || "",
        min_order_qty: p.min_order_qty || "",
        pack_qty: p.pack_qty || "",
        pack_price: p.pack_price || "",
        brand_id: p.brand_id || "",
        color_id: p.color_id || "",
        size_chart_id: p.size_chart_id || "",
        product_tag: p.product_tag || "",
        product_quality: p.product_quality || "",
        product_rating: p.product_rating || "",
        is_sale: p.is_sale == 1 || p.is_sale === "1",
        is_returnable: p.is_returnable == 1 || p.is_returnable === "1",
        is_cod: p.is_cod == 1 || p.is_cod === "1",
        status: String(p.status ?? "1"),
      });

      setPrimaryPreview(p.primary_img || null);
      setSecondaryPreview(p.secondary_img || null);
      setSelectedCategories((p.product_categories || []).map((c) => ({ id: c.id })));
      setVariations(p.product_variations || []);
      setAdditionalImages(p.product_image_list || []);
      setHighlights(p.product_key_highlights || []);
      setReviews(p.product_review || []);
      setAllCategories(Array.isArray(catRes.data?.category_list) ? catRes.data.category_list : []);
      setAllBrands(Array.isArray(brandRes.data?.brand_list) ? brandRes.data.brand_list : []);
    } catch {
      router.push("/products");
    }
    setLoading(false);
  }, [api, id, router]);

  useEffect(() => {
    if (!ready || !id) return;
    loadProduct();
  }, [ready, id, loadProduct]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.prod_name.trim()) return setError("Product name is required.");
    if (!form.regular_price) return setError("Regular price is required.");
    if (!form.sale_price) return setError("Sale price is required.");
    if (!form.stock_qty) return setError("Stock quantity is required.");
    if (selectedCategories.length === 0) return setError("At least one category is required.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("id", form.id);
      fd.append("prod_type", form.prod_type);
      fd.append("prod_name", form.prod_name);
      fd.append("sku", form.sku || "");
      fd.append("prod_desc", form.prod_desc || "");
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
      if (primaryImg) fd.append("primary_img", primaryImg);
      if (secondaryImg) fd.append("secondary_img", secondaryImg);
      selectedCategories.forEach((cat, i) => {
        fd.append(`product_categories[${i}][id]`, cat.id);
      });
      variations.forEach((v, i) => {
        Object.keys(v).forEach((k) => {
          if (v[k] !== undefined) fd.append(`product_variations[${i}][${k}]`, v[k]);
        });
      });

      const res = await api("post", `/update_product/${form.id}`, fd);
      if (res.data?.status) {
        setSuccess("Product updated successfully.");
        setPrimaryImg(null); setSecondaryImg(null);
      } else {
        setError(res.data?.error_message || "Failed to update product.");
      }
    } catch {
      setError("Failed to update product. Please try again.");
    }
    setSaving(false);
  };

  /* Variations */
  const addVariation = async () => {
    if (!newVariation.size || !newVariation.color) return;
    setAddingVariation(true);
    try {
      await api("post", "/add_product_variation_size", { product_id: id, ...newVariation });
      await loadProduct();
      setNewVariation({ size: "", color: "", regular_price: "", sale_price: "", stock_qty: "" });
    } catch {}
    setAddingVariation(false);
  };

  const deleteVariation = async (varId) => {
    if (!window.confirm("Delete this variation?")) return;
    try {
      await api("get", `/delete_product_variation/${varId}`);
      setVariations((prev) => prev.filter((v) => v.id !== varId));
    } catch {}
  };

  /* Additional Images */
  const handleAdditionalImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImg(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("product_id", id);
        fd.append("product_image", file);
        await api("post", `/upload_product_image/${id}`, fd);
      }
      await loadProduct();
    } catch {}
    setUploadingImg(false);
  };

  const deleteAdditionalImage = async (imgno) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api("post", `/delete_product_image/${id}`, { imgno });
      setAdditionalImages((prev) => prev.filter((img) => img.image_no !== imgno));
    } catch {}
  };

  /* Key Highlights */
  const addHighlight = async () => {
    if (!newHighlight.label || !newHighlight.value) return;
    setSavingHighlight(true);
    try {
      await api("post", `/add_product_key_highlight/${id}`, newHighlight);
      await loadProduct();
      setNewHighlight({ label: "", value: "" });
    } catch {}
    setSavingHighlight(false);
  };

  const saveHighlight = async () => {
    if (!editHighlight) return;
    setSavingHighlight(true);
    try {
      await api("put", `/update_key_highlights/${editHighlight.id}`, { label: editHighlight.label, value: editHighlight.value });
      setHighlights((prev) => prev.map((h) => h.id === editHighlight.id ? editHighlight : h));
      setEditHighlight(null);
    } catch {}
    setSavingHighlight(false);
  };

  const deleteHighlight = async (hlId) => {
    try {
      await api("delete", `/delete_product_key_highlight/${hlId}`);
      setHighlights((prev) => prev.filter((h) => h.id !== hlId));
    } catch {}
  };

  if (!ready || loading) return (
    <AdminLayout title="Edit Product">
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    </AdminLayout>
  );

  if (!form) return null;

  return (
    <AdminLayout title="Edit Product">
      <Head><title>Edit Product — IHW Admin</title></Head>

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <FiArrowLeft size={15} />
        </button>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">{form.prod_name}</h2>
          <p className="text-xs text-gray-400 font-mono">Product #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-4xl">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            <FiAlertCircle size={15} /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3">{success}</div>
        )}

        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Name *</label>
              <input value={form.prod_name} onChange={(e) => set("prod_name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">SKU</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
            </div>
          </div>
        </Section>

        {/* Pricing & Stock */}
        <Section title="Pricing & Stock">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "regular_price", label: "Regular Price *" },
              { key: "sale_price", label: "Sale Price *" },
              { key: "stock_qty", label: "Stock Qty *" },
              { key: "min_order_qty", label: "Min Order Qty" },
              { key: "pack_qty", label: "Pack Qty" },
              { key: "pack_price", label: "Pack Price" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">{label}</label>
                <input type="number" value={form[key]} onChange={(e) => set(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
              </div>
            ))}
          </div>
        </Section>

        {/* Images */}
        <Section title="Main Images">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Primary Image", preview: primaryPreview, ref: primaryRef, setter: setPrimaryImg, previewSetter: setPrimaryPreview },
              { label: "Secondary Image", preview: secondaryPreview, ref: secondaryRef, setter: setSecondaryImg, previewSetter: setSecondaryPreview },
            ].map(({ label, preview, ref, setter, previewSetter }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">{label}</label>
                <div className="flex items-center gap-3">
                  {preview ? (
                    <img src={preview} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer" onClick={() => ref.current?.click()}>
                      <FiImage size={22} className="text-gray-300" />
                    </div>
                  )}
                  <button type="button" onClick={() => ref.current?.click()}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    {preview ? "Change" : "Upload"}
                  </button>
                  <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleImg(setter, previewSetter)} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Categories */}
        <Section title="Categories *">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const selected = selectedCategories.find((c) => c.id === cat.id);
              return (
                <button key={cat.id} type="button" onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${selected ? "bg-[#04A9FF] text-white border-[#04A9FF]" : "bg-white text-gray-600 border-gray-200 hover:border-[#04A9FF]"}`}>
                  {cat.category_name}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Attributes */}
        <Section title="Attributes & Settings">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Brand</label>
              <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                <option value="">Select Brand</option>
                {allBrands.map((b) => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Quality</label>
              <input value={form.product_quality} onChange={(e) => set("product_quality", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5">Product Tag</label>
              <input value={form.product_tag} onChange={(e) => set("product_tag", e.target.value)}
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
        </Section>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/products")}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Back to Products
          </button>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
            <FiSave size={14} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Variations */}
      <div className="mt-5 max-w-4xl space-y-5">
        <Section title="Product Variations">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-4 py-2.5 text-left">Size</th>
                  <th className="px-4 py-2.5 text-left">Color</th>
                  <th className="px-4 py-2.5 text-left">Regular Price</th>
                  <th className="px-4 py-2.5 text-left">Sale Price</th>
                  <th className="px-4 py-2.5 text-left">Stock</th>
                  <th className="px-4 py-2.5 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {variations.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-2.5 font-medium">{v.size || "—"}</td>
                    <td className="px-4 py-2.5">{v.color || "—"}</td>
                    <td className="px-4 py-2.5">₹{v.regular_price || 0}</td>
                    <td className="px-4 py-2.5">₹{v.sale_price || 0}</td>
                    <td className="px-4 py-2.5">{v.stock_qty || 0}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => deleteVariation(v.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {variations.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-xs">No variations added</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-gray-50">
            {[
              { key: "size", placeholder: "Size" },
              { key: "color", placeholder: "Color" },
              { key: "regular_price", placeholder: "Reg. Price", type: "number" },
              { key: "sale_price", placeholder: "Sale Price", type: "number" },
              { key: "stock_qty", placeholder: "Stock", type: "number" },
            ].map(({ key, placeholder, type }) => (
              <input key={key} type={type || "text"} value={newVariation[key]} onChange={(e) => setNewVariation((v) => ({ ...v, [key]: e.target.value }))}
                placeholder={placeholder}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
            ))}
            <button type="button" onClick={addVariation} disabled={addingVariation || !newVariation.size || !newVariation.color}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
              <FiPlus size={13} /> {addingVariation ? "Adding..." : "Add"}
            </button>
          </div>
        </Section>

        {/* Additional Images */}
        <Section title="Additional Images">
          <div className="flex flex-wrap gap-3">
            {additionalImages.map((img) => (
              <div key={img.image_no} className="relative group">
                <img src={img.prod_img_url} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                <button type="button" onClick={() => deleteAdditionalImage(img.image_no)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiX size={10} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => imgUploadRef.current?.click()} disabled={uploadingImg}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-[#04A9FF] hover:text-[#04A9FF] transition-colors disabled:opacity-60">
              {uploadingImg ? <span className="text-xs text-gray-400">...</span> : <FiPlus size={20} />}
            </button>
            <input ref={imgUploadRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalImgUpload} />
          </div>
        </Section>

        {/* Key Highlights */}
        <Section title="Key Highlights">
          <div className="space-y-2">
            {highlights.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                {editHighlight?.id === h.id ? (
                  <>
                    <input value={editHighlight.label} onChange={(e) => setEditHighlight((p) => ({ ...p, label: e.target.value }))}
                      placeholder="Label"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                    <input value={editHighlight.value} onChange={(e) => setEditHighlight((p) => ({ ...p, value: e.target.value }))}
                      placeholder="Value"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                    <button type="button" onClick={saveHighlight} disabled={savingHighlight}
                      className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-60">
                      <FiSave size={13} />
                    </button>
                    <button type="button" onClick={() => setEditHighlight(null)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiX size={13} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{h.label}</span>
                    <span className="flex-1 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">{h.value}</span>
                    <button type="button" onClick={() => setEditHighlight({ ...h })}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <FiEdit2 size={13} />
                    </button>
                    <button type="button" onClick={() => deleteHighlight(h.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <FiTrash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <input value={newHighlight.label} onChange={(e) => setNewHighlight((p) => ({ ...p, label: e.target.value }))}
                placeholder="Label (e.g. Length)"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
              <input value={newHighlight.value} onChange={(e) => setNewHighlight((p) => ({ ...p, value: e.target.value }))}
                placeholder="Value (e.g. 10 inch)"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
              <button type="button" onClick={addHighlight} disabled={savingHighlight || !newHighlight.label || !newHighlight.value}
                className="inline-flex items-center gap-1 px-3 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                <FiPlus size={13} /> Add
              </button>
            </div>
          </div>
        </Section>

        {/* Reviews */}
        {reviews.length > 0 && (
          <Section title={`Reviews (${reviews.length})`}>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                      <span className="text-xs text-yellow-500">{"★".repeat(Math.min(5, parseInt(r.rating) || 0))}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${r.is_approved == 1 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {r.is_approved == 1 ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{r.review_text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </AdminLayout>
  );
}
