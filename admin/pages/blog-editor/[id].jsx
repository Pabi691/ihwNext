import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/components/AdminContext";
import { useAuthGuard } from "@/components/useAuthGuard";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FiArrowLeft, FiSave, FiImage, FiLink, FiTag, FiGlobe,
  FiChevronDown, FiChevronUp, FiAlertCircle, FiCheckCircle,
  FiBold, FiItalic, FiList, FiCode, FiMinus,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
  FiRotateCcw, FiRotateCw,
} from "react-icons/fi";
import {
  MdFormatStrikethrough, MdFormatUnderlined, MdFormatListNumbered,
  MdFormatQuote, MdFormatClear,
} from "react-icons/md";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReadTime(text) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Toolbar ─────────────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors select-none ${
        active
          ? "bg-[#04A9FF] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0 self-center" />;
}

function EditorToolbar({ editor }) {
  if (!editor) return (
    <div className="h-11 bg-gray-50 border-b border-gray-200 rounded-t-xl animate-pulse" />
  );

  const insertLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return;
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };

  const insertImage = () => {
    const url = window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
      {/* History */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
        <FiRotateCcw size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
        <FiRotateCw size={13} />
      </ToolBtn>

      <Sep />

      {/* Headings */}
      {[1, 2, 3, 4].map((level) => (
        <ToolBtn
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
          title={`Heading ${level}`}
        >
          <span className="font-black text-[11px]">H{level}</span>
        </ToolBtn>
      ))}

      <Sep />

      {/* Inline marks */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <FiBold size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <FiItalic size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <MdFormatUnderlined size={15} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <MdFormatStrikethrough size={15} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code">
        <FiCode size={13} />
      </ToolBtn>

      <Sep />

      {/* Alignment */}
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <FiAlignLeft size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Center">
        <FiAlignCenter size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <FiAlignRight size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <FiAlignJustify size={13} />
      </ToolBtn>

      <Sep />

      {/* Lists & blocks */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <FiList size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
        <MdFormatListNumbered size={15} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <MdFormatQuote size={15} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
        <span className="font-mono text-[10px] font-bold">{`</>`}</span>
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <FiMinus size={13} />
      </ToolBtn>

      <Sep />

      {/* Insert */}
      <ToolBtn onClick={insertLink} active={editor.isActive("link")} title="Insert / Edit Link">
        <FiLink size={13} />
      </ToolBtn>
      <ToolBtn onClick={insertImage} title="Insert Image from URL">
        <FiImage size={13} />
      </ToolBtn>

      <Sep />

      {/* Clear */}
      <ToolBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
        <MdFormatClear size={14} />
      </ToolBtn>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { api } = useAdmin();
  const { ready } = useAuthGuard();

  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    author: "",
    short_description: "",
    status: "Published",
    tags: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const fileRef = useRef();
  const contentLoaded = useRef(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ImageExt,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Start writing your blog post here..." }),
    ],
    editorProps: {
      attributes: { class: "min-h-[520px] outline-none" },
    },
  });

  // Load existing blog data
  useEffect(() => {
    if (!ready || !id || isNew || !editor || contentLoaded.current) return;
    contentLoaded.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await api("get", `/blogs/${id}`);
        const blog = res.data?.data || res.data;
        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          author: blog.author || "",
          short_description: blog.short_description || "",
          status: blog.status || "Published",
          tags: blog.tags || "",
          meta_title: blog.meta_title || "",
          meta_description: blog.meta_description || "",
          meta_keywords: blog.meta_keywords || "",
        });
        setImgPreview(blog.featured_image || null);
        if (blog.content) editor.commands.setContent(blog.content);
      } catch {
        setError("Failed to load blog post.");
      }
      setLoading(false);
    })();
  }, [ready, id, isNew, api, editor]);

  const handleTitleChange = (val) => {
    set("title", val);
    if (isNew) set("slug", slugify(val));
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.author.trim()) return setError("Author is required.");
    if (!form.short_description.trim()) return setError("Short description is required.");
    const content = editor?.getHTML() || "";
    if (!content || content === "<p></p>") return setError("Content is required.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",             form.title);
      fd.append("slug",              form.slug);
      fd.append("author",            form.author);
      fd.append("short_description", form.short_description);
      fd.append("content",           content);
      fd.append("status",            form.status);
      fd.append("tags",              form.tags || "");
      fd.append("meta_title",        form.meta_title || "");
      fd.append("meta_description",  form.meta_description || "");
      fd.append("meta_keywords",     form.meta_keywords || "");
      if (imgFile) fd.append("featured_image", imgFile);

      if (!isNew) {
        await api("post", `/blogs/${id}`, fd);
      } else {
        await api("post", "/blogs", fd);
      }
      setSaved(true);
      setTimeout(() => router.push("/blogs"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save. Please try again.";
      setError(msg);
      setSaving(false);
    }
  };

  const wordCount = editor?.getText()?.split(/\s+/).filter(Boolean).length || 0;
  const readTime  = estimateReadTime(editor?.getText() || "");
  const tagList   = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  if (!ready) return null;

  return (
    <AdminLayout title={isNew ? "New Blog Post" : "Edit Blog Post"}>
      <Head><title>{isNew ? "New Post" : "Edit Post"} — IHW Admin</title></Head>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <button
          onClick={() => router.push("/blogs")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-semibold transition-colors"
        >
          <FiArrowLeft size={15} /> All Posts
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {wordCount > 0 && (
            <span className="text-xs text-gray-400 hidden sm:block">
              ~{readTime} min read &middot; {wordCount} words
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 text-red-500 text-xs font-semibold bg-red-50 px-3 py-1.5 rounded-lg">
              <FiAlertCircle size={13} /> {error}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
              <FiCheckCircle size={13} /> Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
          >
            <FiSave size={14} />
            {saving ? "Saving..." : saved ? "Saved!" : isNew ? "Publish Post" : "Update Post"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="flex gap-5 items-start">

          {/* ── Main column ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Title + Slug */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Blog post title..."
                className="w-full text-2xl font-bold text-gray-900 outline-none placeholder-gray-300 pb-3 mb-3 border-b border-gray-100"
              />
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold flex-shrink-0">Slug:</span>
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                  className="flex-1 font-mono bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 text-gray-600 outline-none focus:bg-gray-100 focus:ring-1 focus:ring-[#04A9FF] transition-colors"
                />
              </div>
            </div>

            {/* TipTap editor */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <EditorToolbar editor={editor} />

              {/* editor styles */}
              <style>{`
                .tiptap-wrap .tiptap h1{font-size:1.875rem;font-weight:700;margin:1.25rem 0 .5rem;color:#111827}
                .tiptap-wrap .tiptap h2{font-size:1.5rem;font-weight:700;margin:1.1rem 0 .4rem;color:#111827}
                .tiptap-wrap .tiptap h3{font-size:1.25rem;font-weight:600;margin:.9rem 0 .3rem;color:#1f2937}
                .tiptap-wrap .tiptap h4{font-size:1.1rem;font-weight:600;margin:.75rem 0 .3rem;color:#1f2937}
                .tiptap-wrap .tiptap p{margin:.4rem 0;line-height:1.8;color:#374151}
                .tiptap-wrap .tiptap ul{list-style-type:disc;padding-left:1.5rem;margin:.5rem 0}
                .tiptap-wrap .tiptap ol{list-style-type:decimal;padding-left:1.5rem;margin:.5rem 0}
                .tiptap-wrap .tiptap li{margin:.2rem 0;line-height:1.7;color:#374151}
                .tiptap-wrap .tiptap blockquote{border-left:4px solid #04A9FF;padding:.5rem 1rem;color:#6b7280;font-style:italic;margin:.75rem 0;background:#f0f9ff;border-radius:0 8px 8px 0}
                .tiptap-wrap .tiptap code{background:#f3f4f6;padding:.15rem .4rem;border-radius:4px;font-family:monospace;font-size:.875em;color:#e11d48}
                .tiptap-wrap .tiptap pre{background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto;margin:.75rem 0}
                .tiptap-wrap .tiptap pre code{background:none;color:inherit;padding:0;font-size:.875rem}
                .tiptap-wrap .tiptap a{color:#04A9FF;text-decoration:underline}
                .tiptap-wrap .tiptap a:hover{color:#0070cc}
                .tiptap-wrap .tiptap hr{border:none;border-top:2px solid #e5e7eb;margin:1.5rem 0}
                .tiptap-wrap .tiptap img{max-width:100%;height:auto;border-radius:8px;margin:.75rem 0}
                .tiptap-wrap .tiptap strong{font-weight:700}
                .tiptap-wrap .tiptap s{text-decoration:line-through}
                .tiptap-wrap .tiptap u{text-decoration:underline}
                .tiptap-wrap .tiptap p.is-editor-empty:first-child::before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none;float:left;height:0}
              `}</style>

              <div className="px-6 py-5 tiptap-wrap">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Short description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-2">
                Short Description *
              </label>
              <textarea
                rows={3}
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
                placeholder="Brief summary shown in listing pages and search results..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none"
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button type="button" onClick={() => setSeoOpen(!seoOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FiGlobe size={14} className="text-[#04A9FF]" />
                  SEO Settings
                  <span className="text-xs font-normal text-gray-400">— meta title, description, keywords</span>
                </span>
                {seoOpen ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
              </button>

              {seoOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                  <div className="pt-4">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Meta Title</label>
                      <span className={`text-xs ${form.meta_title.length > 60 ? "text-red-500" : "text-gray-400"}`}>
                        {form.meta_title.length}/60
                      </span>
                    </div>
                    <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)}
                      placeholder={form.title || "SEO page title"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Meta Description</label>
                      <span className={`text-xs ${form.meta_description.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                        {form.meta_description.length}/160
                      </span>
                    </div>
                    <textarea rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)}
                      placeholder={form.short_description || "SEO description"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#04A9FF] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wide block mb-1.5">Meta Keywords</label>
                    <input value={form.meta_keywords} onChange={(e) => set("meta_keywords", e.target.value)}
                      placeholder="hair patch, wig care, hair replacement..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors" />
                  </div>
                  {(form.meta_title || form.title) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Search Preview</p>
                      <p className="text-base font-medium text-blue-700 line-clamp-1">{form.meta_title || form.title}</p>
                      <p className="text-xs text-green-700">indianhairworld.com/blog/{form.slug || "post-url"}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {form.meta_description || form.short_description || "No description."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div className="w-72 flex-shrink-0 space-y-4">

            {/* Publish */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Publish</p>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] bg-white transition-colors">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1.5">Author *</label>
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="Author name"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="w-full py-2.5 bg-[#04A9FF] hover:bg-[#0070cc] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : saved ? "Saved!" : isNew ? "Publish Post" : "Update Post"}
              </button>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-3">Featured Image</p>
              {imgPreview ? (
                <img src={imgPreview} alt="" className="w-full h-40 object-cover rounded-xl border border-gray-100 mb-3" />
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center mb-3 cursor-pointer hover:border-[#04A9FF] hover:bg-blue-50/30 transition-colors"
                >
                  <FiImage size={26} className="text-gray-300 mb-1.5" />
                  <span className="text-xs text-gray-400 font-medium">Click to upload</span>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  {imgPreview ? "Change" : "Upload"}
                </button>
                {imgPreview && (
                  <button type="button" onClick={() => { setImgPreview(null); setImgFile(null); }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
              <p className="text-[10px] text-gray-400 mt-2">1200×630px · JPG/PNG · max 2MB</p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <FiTag size={11} /> Tags
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="hair loss, wig care, tips..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#04A9FF] transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1.5">Comma-separated</p>
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tagList.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
