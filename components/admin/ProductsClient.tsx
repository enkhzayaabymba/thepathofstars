"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";

type Props = { initialProducts: Product[]; categories: string[] };
type FormData = { name: string; description: string; price: string; category: string };
const inputStyle = { border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", backgroundColor: "var(--white)" };

export default function ProductsClient({ initialProducts, categories }: Props) {
  const [categoryList, setCategoryList] = useState(categories);
  const emptyForm = (): FormData => ({ name: "", description: "", price: "", category: categoryList[0] ?? "" });
  const formRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCat, setSelectedCat] = useState("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [form, setForm] = useState<FormData>(emptyForm());
  const [images, setImages] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description, price: String(product.price), category: product.category });
    setImages(product.images?.length ? product.images : product.image_url ? [product.image_url] : []);
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm()); setImages([]); }

  async function addCategory() {
    if (!newCat.trim() || addingCat) return;
    setAddingCat(true);
    const { data } = await supabase.from("categories").insert({ name: newCat.trim() }).select("name").single();
    if (data) { setCategoryList([...categoryList, data.name]); setForm({ ...form, category: data.name }); setNewCat(""); }
    setAddingCat(false);
  }

  async function deleteCategory(name: string) {
    const { error } = await supabase.from("categories").delete().eq("name", name);
    if (error) { alert("Delete failed: " + error.message); return; }
    const next = categoryList.filter((c) => c !== name);
    setCategoryList(next);
    if (form.category === name) setForm({ ...form, category: next[0] ?? "" });
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const image_url = images[0] ?? "";
      if (editingId !== null) {
        const { data, error } = await supabase.from("products").update({ ...form, price: Number(form.price), image_url, images }).eq("id", editingId).select().single();
        if (error) throw new Error(error.message);
        setProducts(products.map((p) => (p.id === editingId ? (data as Product) : p)));
        setEditingId(null);
      } else {
        const { data, error } = await supabase.from("products").insert({ ...form, price: Number(form.price), image_url, images }).select().single();
        if (error) throw new Error(error.message);
        setProducts([...products, data as Product]);
      }
      setForm(emptyForm()); setImages([]);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-5xl">
      <div ref={formRef} style={{ backgroundColor: editingId ? "var(--surface)" : "var(--white)", border: `1px solid ${editingId ? "var(--text-secondary)" : "var(--border)"}`, borderRadius: "16px", padding: "28px" }} className="mb-10 transition-all">
        <h2 style={{ color: "var(--text-primary)" }} className="font-semibold text-base mb-6">{editingId ? "✎ Editing Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Name</label>
            <input style={inputStyle} className="px-3 py-2 text-sm outline-none" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Price ($)</label>
            <input style={inputStyle} className="px-3 py-2 text-sm outline-none" type="number" placeholder="0.00" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Category</label>
            <select style={inputStyle} className="px-3 py-2 text-sm outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categoryList.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 mt-1">
              <input style={{ ...inputStyle, flex: 1 }} className="px-3 py-1.5 text-xs outline-none" placeholder="New category..." value={newCat}
                onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }} />
              <button type="button" onClick={addCategory} disabled={addingCat || !newCat.trim()} style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "8px", opacity: !newCat.trim() ? 0.4 : 1 }} className="px-3 py-1.5 text-xs font-medium transition-opacity whitespace-nowrap">+ Add</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {categoryList.map((c) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: "3px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "100px", padding: "2px 6px 2px 10px" }}>
                  <span style={{ color: "var(--text-primary)", fontSize: "11px" }}>{c}</span>
                  <button type="button" onClick={() => deleteCategory(c)} style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }} className="hover:opacity-70">×</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Images (max 5)</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Description</label>
            <textarea style={inputStyle} className="px-3 py-2 text-sm outline-none resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p className="text-red-500 text-xs sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={loading} style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }} className="px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }} className="px-6 py-2.5 text-sm hover:opacity-70 transition-opacity">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...categoryList].map((c) => (
          <button key={c} onClick={() => { setSelectedCat(c); setPage(1); }} style={{ border: "1px solid var(--border)", borderRadius: "100px", color: selectedCat === c ? "var(--bg-main)" : "var(--text-secondary)", backgroundColor: selectedCat === c ? "var(--text-primary)" : "transparent" }} className="text-xs px-3 py-1.5 transition-all">{c}</button>
        ))}
      </div>

      <div style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }} className="grid grid-cols-6 px-6 py-3">
          {["Image", "Name", "Category", "Price", "", ""].map((h, i) => <p key={i} style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-wide">{h}</p>)}
        </div>
        {(() => {
          const filtered = selectedCat === "All" ? products : products.filter((p) => p.category === selectedCat);
          const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
          const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
          return (<>
            {paginated.map((p) => (
              <div key={p.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: editingId === p.id ? "var(--surface)" : "transparent" }} className="grid grid-cols-6 px-6 py-4 items-center transition-all">
                <div className="h-10 w-10 rounded overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs">✦</div>}
                </div>
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-medium truncate pr-2">{p.name}</p>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm">{p.category}</p>
                <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">${Number(p.price).toFixed(2)}</p>
                <button onClick={() => startEdit(p)} style={{ color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "100px", width: "fit-content" }} className="text-xs px-3 py-1 hover:opacity-70 transition-opacity">Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: "#dc2626", border: "1px solid #fecaca", borderRadius: "100px", width: "fit-content" }} className="text-xs px-3 py-1 hover:opacity-70 transition-opacity">Delete</button>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex gap-2 px-6 py-4 justify-center" style={{ borderTop: "1px solid var(--border)" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: page === p ? "var(--text-primary)" : "transparent", color: page === p ? "var(--bg-main)" : "var(--text-secondary)", border: `1px solid ${page === p ? "var(--text-primary)" : "var(--border)"}`, fontSize: "12px", fontWeight: page === p ? 600 : 400 }} className="transition-all hover:opacity-70">{p}</button>
                ))}
              </div>
            )}
          </>);
        })()}
      </div>
    </div>
  );
}
