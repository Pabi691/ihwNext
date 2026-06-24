import { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiImage, FiAlertCircle, FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";

const L = "text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1.5";
const I = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors";
const S = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-[#04A9FF]" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </label>
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
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

  const [primaryImg, setPrimaryImg] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondaryImg, setSecondaryImg] = useState(null);
  const [secondaryPreview, setSecondaryPreview] = useState(null);

  const [variations, setVariations] = useState([]);

  // Editable state for existing variations
  const [sizeVarEdits, setSizeVarEdits] = useState({});
  const [colorVarEdits, setColorVarEdits] = useState({});
  const [savingVarId, setSavingVarId] = useState(null);

  // Pending new variations to add
  const [pendingSizes, setPendingSizes] = useState([]);
  const [pendingColors, setPendingColors] = useState([]);
  const [savingNewVars, setSavingNewVars] = useState(false);

  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgUploadRef = useRef();

  const [highlights, setHighlights] = useState([]);
  const [newHighlight, setNewHighlight] = useState({ label: "", value: "" });
  const [editHighlight, setEditHighlight] = useState(null);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const [seo, setSeo] = useState({ meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "" });

  const [reviews, setReviews] = useState([]);

  // How to Wear state
  const [howToWearSteps, setHowToWearSteps] = useState([]);
  const [newStep, setNewStep] = useState({ badge_text: "", title: "", thumbnail_image: "", video_url: "" });
  const [editStep, setEditStep] = useState(null);
  const [savingStep, setSavingStep] = useState(false);
  const [uploadingStepImg, setUploadingStepImg] = useState(false);
  const stepImgRef = useRef();
  const editStepImgRef = useRef();

  const primaryRef = useRef();
  const secondaryRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSeoField = (k, v) => setSeo((s) => ({ ...s, [k]: v }));

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes, colorRes, sizeRes] = await Promise.all([
        api("get", `/get_product_id/${id}`),
        api("get", "/get_active_category"),
        api("get", "/get_active_brand"),
        api("get", "/get_active_colors"),
        api("get", "/get_active_sizes"),
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
        stock_qty: p.stock_qty ?? "",
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

      const sm = p.seo_metadata || {};
      setSeo({
        meta_title: sm.meta_title || "",
        meta_description: sm.meta_description || "",
        meta_keywords: sm.meta_keywords || "",
        canonical_url: sm.canonical_url || "",
      });

      setPrimaryPreview(p.primary_img || null);
      setSecondaryPreview(p.secondary_img || null);
      setSelectedCategories((p.product_categories || []).map((c) => ({ id: c.id })));

      const vars = p.product_variations || [];
      setVariations(vars);

      // Initialize editable state for existing variations
      const sizeEdits = {};
      vars.filter(v => v.size_id).forEach(v => {
        sizeEdits[v.id] = {
          regular_price: v.regular_price ?? "",
          sale_price: v.sale_price ?? "",
          stock_qty: v.stock_qty ?? "",
        };
      });
      setSizeVarEdits(sizeEdits);

      const colorEdits = {};
      vars.filter(v => v.color_id).forEach(v => {
        colorEdits[v.id] = { color_page_link: v.color_page_link || "" };
      });
      setColorVarEdits(colorEdits);

      setAdditionalImages(p.product_image_list || []);
      setHighlights(p.product_key_highlights || []);
      setReviews(p.product_review || []);

      // Load how-to-wear steps
      try {
        const htw = await api("get", `/get_how_to_wear/${p.id}`);
        setHowToWearSteps(Array.isArray(htw.data?.steps) ? htw.data.steps : []);
      } catch { setHowToWearSteps([]); }
      setAllCategories(Array.isArray(catRes.data?.category_list) ? catRes.data.category_list : []);
      setAllBrands(Array.isArray(brandRes.data?.brand_list) ? brandRes.data.brand_list : []);
      setAllColors(Array.isArray(colorRes.data?.colors) ? colorRes.data.colors : []);
      setAllSizes(Array.isArray(sizeRes.data?.sizes) ? sizeRes.data.sizes : []);
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
    if (form.stock_qty === "" || form.stock_qty == null) return setError("Stock quantity is required.");
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

      const res = await api("post", `/update_product/${form.id}`, fd);
      if (res.data?.status) {
        if (seo.meta_title) {
          api("post", "/update_seo_metadata", {
            entity_type: "product",
            entity_id: form.id,
            ...seo,
          }).catch(() => {});
        }
        setPrimaryImg(null); setSecondaryImg(null);
        await loadProduct(); // re-fetch to confirm actual saved values
        setSuccess("Product updated successfully.");
      } else {
        setError(res.data?.error_message || "Failed to update product.");
      }
    } catch {
      setError("Failed to update product. Please try again.");
    }
    setSaving(false);
  };

  /* ── Size variation helpers ── */
  const sizeVariations = variations.filter(v => v.size_id);
  const colorVariations = variations.filter(v => v.color_id);

  const updateSizeVarEdit = (varId, field, value) =>
    setSizeVarEdits(prev => ({ ...prev, [varId]: { ...prev[varId], [field]: value } }));

  const saveSizeVar = async (varId) => {
    setSavingVarId(varId);
    try {
      await api("post", `/update_product_variation/${varId}`, sizeVarEdits[varId]);
    } catch {}
    setSavingVarId(null);
  };

  const updateColorVarEdit = (varId, value) =>
    setColorVarEdits(prev => ({ ...prev, [varId]: { color_page_link: value } }));

  const saveColorVar = async (varId) => {
    setSavingVarId(varId);
    try {
      await api("post", `/update_product_variation/${varId}`, {
        color_page_link: colorVarEdits[varId]?.color_page_link || "",
      });
    } catch {}
    setSavingVarId(null);
  };

  const deleteVariation = async (varId) => {
    if (!window.confirm("Delete this variation?")) return;
    try {
      await api("get", `/delete_product_variation/${varId}`);
      setVariations(prev => prev.filter(v => v.id !== varId));
    } catch {}
  };

  /* ── Pending new sizes ── */
  const togglePendingSize = (size) => {
    const already = variations.some(v => String(v.size_id) === String(size.id));
    if (already) return;
    setPendingSizes(prev => {
      if (prev.find(p => p.size_id === size.id)) return prev.filter(p => p.size_id !== size.id);
      return [...prev, {
        size_id: size.id,
        size_name: size.size_name,
        regular_price: form?.regular_price || "",
        sale_price: form?.sale_price || "",
        stock_qty: form?.stock_qty || "",
      }];
    });
  };

  const updatePendingSize = (sizeId, field, value) =>
    setPendingSizes(prev => prev.map(s => s.size_id === sizeId ? { ...s, [field]: value } : s));

  const saveNewSizes = async () => {
    if (!pendingSizes.length) return;
    setSavingNewVars(true);
    try {
      await Promise.all(pendingSizes.map(s =>
        api("post", "/add_product_variation_size", {
          product_id: id,
          size_id: s.size_id,
          regular_price: s.regular_price,
          sale_price: s.sale_price,
          stock_qty: s.stock_qty,
        })
      ));
      await loadProduct();
      setPendingSizes([]);
    } catch {}
    setSavingNewVars(false);
  };

  /* ── Pending new colors ── */
  const togglePendingColor = (color) => {
    const already = colorVariations.some(v => String(v.color_id) === String(color.id));
    if (already) return;
    setPendingColors(prev => {
      if (prev.find(p => p.color_id === color.id)) return prev.filter(p => p.color_id !== color.id);
      return [...prev, {
        color_id: color.id,
        color_name: color.color_name,
        color_code: color.color_code || "#cccccc",
        product_link: "",
      }];
    });
  };

  const updatePendingColorLink = (colorId, value) =>
    setPendingColors(prev => prev.map(c => c.color_id === colorId ? { ...c, product_link: value } : c));

  const saveNewColors = async () => {
    if (!pendingColors.length) return;
    setSavingNewVars(true);
    try {
      await Promise.all(pendingColors.map(c =>
        api("post", "/add_product_variation_color", {
          product_id: id,
          color_id: c.color_id,
          color_page_link: c.product_link,
        })
      ));
      await loadProduct();
      setPendingColors([]);
    } catch {}
    setSavingNewVars(false);
  };

  /* ── Additional Images ── */
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
      setAdditionalImages(prev => prev.filter(img => img.image_no !== imgno));
    } catch {}
  };

  /* ── Key Highlights ── */
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
      setHighlights(prev => prev.map(h => h.id === editHighlight.id ? editHighlight : h));
      setEditHighlight(null);
    } catch {}
    setSavingHighlight(false);
  };

  const deleteHighlight = async (hlId) => {
    try {
      await api("delete", `/delete_product_key_highlight/${hlId}`);
      setHighlights(prev => prev.filter(h => h.id !== hlId));
    } catch {}
  };

  /* ── How to Wear helpers ── */
  const uploadStepImage = async (file, onDone) => {
    if (!file) return;
    setUploadingStepImg(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api("post", "/upload_how_to_wear_image", fd);
      if (res.data?.url) onDone(res.data.url);
    } catch {}
    setUploadingStepImg(false);
  };

  const addHowToWearStep = async () => {
    if (!newStep.badge_text.trim() || !newStep.title.trim()) return;
    setSavingStep(true);
    try {
      const res = await api("post", `/add_how_to_wear/${form.id}`, newStep);
      if (res.data?.step) {
        setHowToWearSteps(prev => [...prev, res.data.step]);
        setNewStep({ badge_text: "", title: "", thumbnail_image: "", video_url: "" });
      }
    } catch {}
    setSavingStep(false);
  };

  const saveEditStep = async () => {
    if (!editStep) return;
    setSavingStep(true);
    try {
      const res = await api("put", `/update_how_to_wear/${editStep.id}`, editStep);
      if (res.data?.step) {
        setHowToWearSteps(prev => prev.map(s => s.id === editStep.id ? res.data.step : s));
        setEditStep(null);
      }
    } catch {}
    setSavingStep(false);
  };

  const deleteHowToWearStep = async (stepId) => {
    try {
      await api("delete", `/delete_how_to_wear/${stepId}`);
      setHowToWearSteps(prev => prev.filter(s => s.id !== stepId));
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

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          <FiAlertCircle size={15} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-12 gap-5">
          {/* ── Left column ── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Basic Info */}
            <Section title="Basic Information">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={L}>Product Name *</label>
                  <input value={form.prod_name} onChange={(e) => set("prod_name", e.target.value)} className={I} />
                </div>
                <div>
                  <label className={L}>SKU</label>
                  <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={I} />
                </div>
                <div>
                  <label className={L}>Product Type</label>
                  <select value={form.prod_type} onChange={(e) => set("prod_type", e.target.value)} className={S}>
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={L}>Description</label>
                  <textarea rows={5} value={form.prod_desc} onChange={(e) => set("prod_desc", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                </div>
              </div>
            </Section>

            {/* Pricing & Stock */}
            <Section title="Pricing & Stock">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: "regular_price", label: "Regular Price *" },
                  { key: "sale_price", label: "Sale Price *" },
                  { key: "stock_qty", label: "Stock Qty *" },
                  { key: "min_order_qty", label: "Min Order Qty" },
                  { key: "pack_qty", label: "Pack Qty" },
                  { key: "pack_price", label: "Pack Price" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className={L}>{label}</label>
                    <input type="number" value={form[key]} onChange={(e) => set(key, e.target.value)} className={I} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Size Variations */}
            <Section title="Product Variations (Sizes)">
              {/* Existing size variations table */}
              {sizeVariations.length > 0 && (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Size</th>
                        <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Regular Price</th>
                        <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Sale Price</th>
                        <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Stock Qty</th>
                        <th className="pb-2 px-1"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sizeVariations.map(v => {
                        const edit = sizeVarEdits[v.id] || {};
                        const isSaving = savingVarId === v.id;
                        return (
                          <tr key={v.id}>
                            <td className="py-2 px-1">
                              <span className="bg-[#04A9FF] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                {v.size || v.size_name || `Size ${v.size_id}`}
                              </span>
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={edit.regular_price ?? ""}
                                onChange={e => updateSizeVarEdit(v.id, "regular_price", e.target.value)}
                                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={edit.sale_price ?? ""}
                                onChange={e => updateSizeVarEdit(v.id, "sale_price", e.target.value)}
                                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={edit.stock_qty ?? ""}
                                onChange={e => updateSizeVarEdit(v.id, "stock_qty", e.target.value)}
                                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <div className="flex gap-1">
                                <button type="button" onClick={() => saveSizeVar(v.id)} disabled={isSaving}
                                  className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-60">
                                  <FiSave size={12} />
                                </button>
                                <button type="button" onClick={() => deleteVariation(v.id)}
                                  className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Size chips to add */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Click sizes to add:</p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No sizes available. Add sizes in the Sizes module first.</p>
                  )}
                  {allSizes.map(size => {
                    const already = variations.some(v => String(v.size_id) === String(size.id));
                    const pending = pendingSizes.find(p => p.size_id === size.id);
                    return (
                      <button key={size.id} type="button"
                        onClick={() => !already && togglePendingSize(size)}
                        disabled={already}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          already ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed" :
                          pending ? "bg-[#04A9FF] text-white border-[#04A9FF]" :
                          "bg-white text-gray-600 border-gray-200 hover:border-[#04A9FF]"
                        }`}>
                        {size.size_name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pending sizes table */}
              {pendingSizes.length > 0 && (
                <div className="border border-dashed border-[#04A9FF]/40 rounded-xl p-3 bg-blue-50/30">
                  <p className="text-xs font-semibold text-[#04A9FF] mb-2">New sizes to add — set prices:</p>
                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-sm min-w-[420px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Size</th>
                          <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Regular Price</th>
                          <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Sale Price</th>
                          <th className="text-left text-xs text-gray-500 pb-2 font-semibold px-1">Stock Qty</th>
                          <th className="pb-2 px-1"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {pendingSizes.map(s => (
                          <tr key={s.size_id}>
                            <td className="py-2 px-1">
                              <span className="bg-[#04A9FF]/20 text-[#04A9FF] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                {s.size_name}
                              </span>
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={s.regular_price}
                                onChange={e => updatePendingSize(s.size_id, "regular_price", e.target.value)}
                                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] bg-white transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={s.sale_price}
                                onChange={e => updatePendingSize(s.size_id, "sale_price", e.target.value)}
                                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] bg-white transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <input type="number" value={s.stock_qty}
                                onChange={e => updatePendingSize(s.size_id, "stock_qty", e.target.value)}
                                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#04A9FF] bg-white transition-colors" />
                            </td>
                            <td className="py-2 px-1">
                              <button type="button"
                                onClick={() => setPendingSizes(prev => prev.filter(p => p.size_id !== s.size_id))}
                                className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors">
                                <FiX size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={saveNewSizes} disabled={savingNewVars}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                    <FiPlus size={12} />
                    {savingNewVars ? "Saving..." : `Add ${pendingSizes.length} Size${pendingSizes.length > 1 ? "s" : ""}`}
                  </button>
                </div>
              )}
            </Section>

            {/* Color Variations */}
            <Section title="Color Variations">
              {/* Existing color variations */}
              {colorVariations.length > 0 && (
                <div className="space-y-2 pb-3 border-b border-gray-50">
                  {colorVariations.map(v => {
                    const edit = colorVarEdits[v.id] || {};
                    const isSaving = savingVarId === v.id;
                    const colorData = allColors.find(c => String(c.id) === String(v.color_id));
                    const colorCode = colorData?.color_code || v.color_code || "#cccccc";
                    return (
                      <div key={v.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 w-28 shrink-0">
                          <div className="w-6 h-6 rounded-full border border-gray-200 shrink-0"
                            style={{ backgroundColor: colorCode }} />
                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {v.color || v.color_name}
                          </span>
                        </div>
                        <input value={edit.color_page_link ?? ""}
                          onChange={e => updateColorVarEdit(v.id, e.target.value)}
                          placeholder="Product page URL for this color..."
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#04A9FF] transition-colors" />
                        <button type="button" onClick={() => saveColorVar(v.id)} disabled={isSaving}
                          className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-60 shrink-0">
                          <FiSave size={12} />
                        </button>
                        <button type="button" onClick={() => deleteVariation(v.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Color swatches to add */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Click color to add a variant:</p>
                <div className="flex flex-wrap gap-2">
                  {allColors.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No colors available. Add colors in the Colors module first.</p>
                  )}
                  {allColors.map(color => {
                    const already = colorVariations.some(v => String(v.color_id) === String(color.id));
                    const pending = pendingColors.find(p => p.color_id === color.id);
                    return (
                      <button key={color.id} type="button"
                        onClick={() => !already && togglePendingColor(color)}
                        disabled={already}
                        title={color.color_name}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                          already ? "opacity-40 cursor-not-allowed border-gray-200" :
                          pending ? "border-[#04A9FF] scale-110 ring-2 ring-[#04A9FF]/30" :
                          "border-gray-200 hover:border-gray-400 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.color_code || "#cccccc" }}>
                        {pending && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#04A9FF] rounded-full flex items-center justify-center">
                            <FiPlus size={9} className="text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pending colors */}
              {pendingColors.length > 0 && (
                <div className="border border-dashed border-[#04A9FF]/40 rounded-xl p-3 bg-blue-50/30">
                  <p className="text-xs font-semibold text-[#04A9FF] mb-2">New color variants to add — enter product links:</p>
                  <div className="space-y-2">
                    {pendingColors.map(c => (
                      <div key={c.color_id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 w-28 shrink-0">
                          <div className="w-6 h-6 rounded-full border border-gray-200 shrink-0"
                            style={{ backgroundColor: c.color_code }} />
                          <span className="text-xs font-semibold text-gray-700 truncate">{c.color_name}</span>
                        </div>
                        <input value={c.product_link}
                          onChange={e => updatePendingColorLink(c.color_id, e.target.value)}
                          placeholder="Product page URL for this color..."
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#04A9FF] bg-white transition-colors" />
                        <button type="button"
                          onClick={() => setPendingColors(prev => prev.filter(p => p.color_id !== c.color_id))}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={saveNewColors} disabled={savingNewVars}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                    <FiPlus size={12} />
                    {savingNewVars ? "Saving..." : `Add ${pendingColors.length} Color${pendingColors.length > 1 ? "s" : ""}`}
                  </button>
                </div>
              )}
            </Section>

            {/* Key Highlights */}
            <Section title="Key Highlights">
              <div className="space-y-2">
                {highlights.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    {editHighlight?.id === h.id ? (
                      <>
                        <input value={editHighlight.label} onChange={(e) => setEditHighlight((p) => ({ ...p, label: e.target.value }))}
                          placeholder="Label" className={`flex-1 ${I}`} />
                        <input value={editHighlight.value} onChange={(e) => setEditHighlight((p) => ({ ...p, value: e.target.value }))}
                          placeholder="Value" className={`flex-1 ${I}`} />
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
                    placeholder="Label (e.g. Length)" className={`flex-1 ${I}`} />
                  <input value={newHighlight.value} onChange={(e) => setNewHighlight((p) => ({ ...p, value: e.target.value }))}
                    placeholder="Value (e.g. 10 inch)" className={`flex-1 ${I}`} />
                  <button type="button" onClick={addHighlight} disabled={savingHighlight || !newHighlight.label || !newHighlight.value}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                    <FiPlus size={13} /> Add
                  </button>
                </div>
              </div>
            </Section>

            {/* How to Wear Steps */}
            <Section title="How to Wear Steps">
              {/* Hidden file inputs */}
              <input ref={stepImgRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => uploadStepImage(e.target.files[0], (url) => setNewStep(p => ({ ...p, thumbnail_image: url })))} />
              <input ref={editStepImgRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => uploadStepImage(e.target.files[0], (url) => setEditStep(p => ({ ...p, thumbnail_image: url })))} />

              {/* Existing steps */}
              <div className="space-y-2">
                {howToWearSteps.map((s, i) => (
                  <div key={s.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    {editStep?.id === s.id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={L}>Badge Text</label>
                            <input value={editStep.badge_text} onChange={e => setEditStep(p => ({ ...p, badge_text: e.target.value }))}
                              placeholder="e.g. PREPARATION" className={I} />
                          </div>
                          <div>
                            <label className={L}>Title</label>
                            <input value={editStep.title} onChange={e => setEditStep(p => ({ ...p, title: e.target.value }))}
                              placeholder="Step title" className={I} />
                          </div>
                        </div>
                        <div>
                          <label className={L}>YouTube Video URL</label>
                          <input value={editStep.video_url || ""} onChange={e => setEditStep(p => ({ ...p, video_url: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..." className={I} />
                        </div>
                        <div className="flex items-center gap-2">
                          {editStep.thumbnail_image && (
                            <img src={editStep.thumbnail_image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                          )}
                          <button type="button" onClick={() => editStepImgRef.current?.click()} disabled={uploadingStepImg}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-60">
                            {uploadingStepImg ? "Uploading..." : editStep.thumbnail_image ? "Change Image" : "Upload Image"}
                          </button>
                          {editStep.thumbnail_image && (
                            <button type="button" onClick={() => setEditStep(p => ({ ...p, thumbnail_image: "" }))}
                              className="text-xs text-red-400 hover:text-red-600">Remove</button>
                          )}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button type="button" onClick={saveEditStep} disabled={savingStep}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg disabled:opacity-60">
                            <FiSave size={12} /> {savingStep ? "Saving..." : "Save"}
                          </button>
                          <button type="button" onClick={() => setEditStep(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {s.thumbnail_image ? (
                          <img src={s.thumbnail_image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                            <FiImage size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#04A9FF] bg-[#04A9FF]/10 px-2 py-0.5 rounded-full">
                            {s.badge_text}
                          </span>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{s.title}</p>
                          {s.video_url && (
                            <p className="text-[10px] text-gray-400 truncate">{s.video_url}</p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setEditStep({ ...s })}
                            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <FiEdit2 size={12} />
                          </button>
                          <button type="button" onClick={() => deleteHowToWearStep(s.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add new step */}
              <div className="border border-dashed border-[#04A9FF]/40 rounded-xl p-3 bg-blue-50/30 space-y-2">
                <p className="text-xs font-semibold text-[#04A9FF]">Add New Step</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={L}>Badge Text *</label>
                    <input value={newStep.badge_text} onChange={e => setNewStep(p => ({ ...p, badge_text: e.target.value }))}
                      placeholder="e.g. PREPARATION" className={I} />
                  </div>
                  <div>
                    <label className={L}>Title *</label>
                    <input value={newStep.title} onChange={e => setNewStep(p => ({ ...p, title: e.target.value }))}
                      placeholder="Step title" className={I} />
                  </div>
                </div>
                <div>
                  <label className={L}>YouTube Video URL</label>
                  <input value={newStep.video_url} onChange={e => setNewStep(p => ({ ...p, video_url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..." className={I} />
                </div>
                <div className="flex items-center gap-2">
                  {newStep.thumbnail_image && (
                    <img src={newStep.thumbnail_image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  )}
                  <button type="button" onClick={() => stepImgRef.current?.click()} disabled={uploadingStepImg}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-60">
                    {uploadingStepImg ? "Uploading..." : newStep.thumbnail_image ? "Change Image" : "Upload Thumbnail"}
                  </button>
                  {newStep.thumbnail_image && (
                    <button type="button" onClick={() => setNewStep(p => ({ ...p, thumbnail_image: "" }))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  )}
                </div>
                <button type="button" onClick={addHowToWearStep}
                  disabled={savingStep || !newStep.badge_text.trim() || !newStep.title.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#04A9FF] text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                  <FiPlus size={12} />
                  {savingStep ? "Adding..." : "Add Step"}
                </button>
              </div>
            </Section>

            {/* SEO Details */}
            <Section title="SEO Details">
              <div className="space-y-3">
                <div>
                  <label className={L}>Meta Title</label>
                  <input value={seo.meta_title} onChange={(e) => setSeoField("meta_title", e.target.value)}
                    placeholder={form.prod_name} className={I} />
                </div>
                <div>
                  <label className={L}>Meta Description</label>
                  <textarea rows={3} value={seo.meta_description} onChange={(e) => setSeoField("meta_description", e.target.value)}
                    placeholder="Brief description for search engines (150–160 chars recommended)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{seo.meta_description.length} chars</p>
                </div>
                <div>
                  <label className={L}>Meta Keywords</label>
                  <input value={seo.meta_keywords} onChange={(e) => setSeoField("meta_keywords", e.target.value)}
                    placeholder="keyword1, keyword2, keyword3" className={I} />
                </div>
                <div>
                  <label className={L}>Canonical URL</label>
                  <input value={seo.canonical_url} onChange={(e) => setSeoField("canonical_url", e.target.value)}
                    placeholder="https://indianhairworld.com/product/..." className={I} />
                </div>
              </div>
            </Section>

          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Main Images */}
            <Section title="Main Images">
              <div className="space-y-4">
                {[
                  { label: "Primary Image", preview: primaryPreview, ref: primaryRef, setter: setPrimaryImg, previewSetter: setPrimaryPreview },
                  { label: "Secondary Image", preview: secondaryPreview, ref: secondaryRef, setter: setSecondaryImg, previewSetter: setSecondaryPreview },
                ].map(({ label, preview, ref, setter, previewSetter }) => (
                  <div key={label}>
                    <label className={L}>{label}</label>
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

            {/* Attributes & Settings */}
            <Section title="Attributes & Settings">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={L}>Brand</label>
                  <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)} className={S}>
                    <option value="">Select Brand</option>
                    {allBrands.map((b) => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={L}>Main Color</label>
                  <select value={form.color_id} onChange={(e) => set("color_id", e.target.value)} className={S}>
                    <option value="">Select Color</option>
                    {allColors.map((c) => <option key={c.id} value={c.id}>{c.color_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={L}>Product Quality</label>
                  <input value={form.product_quality} onChange={(e) => set("product_quality", e.target.value)} className={I} />
                </div>
                <div>
                  <label className={L}>Product Tag</label>
                  <input value={form.product_tag} onChange={(e) => set("product_tag", e.target.value)} className={I} />
                </div>
                <div>
                  <label className={L}>Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={S}>
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

        <div className="flex gap-3 mt-5">
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

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-5">
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
        </div>
      )}
    </AdminLayout>
  );
}
