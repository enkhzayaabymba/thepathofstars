"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

type Props = { initialProducts: Product[]; categories: string[] };
type FormData = { name: string; description: string; price: string; category: string };
const inputStyle = { border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", backgroundColor: "var(--white)" };

export default function ProductsClient({ initialProducts, categories }: Props) {
  const [categoryList, setCategoryList] = useState(categories);
  const emptyForm = (): FormData => ({ name: "", description: "", price: "", category: categoryList[0] ?? "" });

  const formRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [newCat, setNewCat] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description, price: String(product.price), category: product.category });
    setPreview(product.image_url || "");
    setImageFile(null);
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setPreview("");
    setImageFile(null);
  }

  async function uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("products").upload(fileName, file);
    if (error) throw new Error(error.message);
    return supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
  }

  async function addCategory() {
    if (!newCat.trim() || addingCat) return;
    setAddingCat(true);
    const { data } = await supabase.from("categories").insert({ name: newCat.trim() }).select("name").single();
    if (data) { setCategoryList([...categoryList, data.name]); setForm({ ...form, category: data.name }); setNewCat(""); }
    setAddingCat(false);
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let image_url = preview;
      if (imageFile) image_url = await uploadImage(imageFile);

      if (editingId !== null) {
        const { data, error } = await supabase.from("products").update({ ...form, price: Number(form.price), image_url }).eq("id", editingId).select().single();
        if (error) throw new Error(error.message);
        setProducts(products.map((p) => (p.id === editingId ? (data as Product) : p)));
        setEditingId(null);
      } else {
        const { data, error } = await supabase.from("products").insert({ ...form, price: Number(form.price), image_url }).select().single();
        if (error) throw new Error(error.message);
        setProducts([...products, data as Product]);
      }

      setForm(emptyForm());
      setImageFile(null);
      setPreview("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
            <input style={inputStyle} className="px-3 py-2 text-sm outline-none" placeholder="Product name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Price ($)</label>
            <input style={inputStyle} className="px-3 py-2 text-sm outline-none" type="number" placeholder="0.00" step="0.01"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Category</label>
            <select style={inputStyle} className="px-3 py-2 text-sm outline-none"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categoryList.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 mt-1">
              <input style={{ ...inputStyle, flex: 1 }} className="px-3 py-1.5 text-xs outline-none"
                placeholder="New category..."
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }} />
              <button type="button" onClick={addCategory} disabled={addingCat || !newCat.trim()}
                style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "8px", opacity: !newCat.trim() ? 0.4 : 1 }}
                className="px-3 py-1.5 text-xs font-medium transition-opacity whitespace-nowrap">
                + Add
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Image</label>
            <div className="flex items-center gap-3">
              {preview && <img src={preview} alt="preview" className="h-10 w-10 rounded object-cover" />}
              <label style={{ border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", cursor: "pointer" }}
                className="px-3 py-2 text-sm hover:opacity-70 transition-opacity">
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label style={{ color: "var(--text-secondary)" }} className="text-xs">Description</label>
            <textarea style={inputStyle} className="px-3 py-2 text-sm outline-none resize-none" rows={2}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {error && <p className="text-red-500 text-xs sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={loading}
              style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }}
              className="px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit}
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }}
                className="px-6 py-2.5 text-sm hover:opacity-70 transition-opacity">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }} className="grid grid-cols-6 px-6 py-3">
          {["Image", "Name", "Category", "Price", "", ""].map((h, i) => (
            <p key={i} style={{ color: "var(--text-secondary)" }} className="text-xs font-semibold uppercase tracking-wide">{h}</p>
          ))}
        </div>
        {products.map((p) => (
          <div key={p.id} style={{ borderBottom: "1px solid var(--border)", backgroundColor: editingId === p.id ? "var(--surface)" : "transparent" }}
            className="grid grid-cols-6 px-6 py-4 items-center transition-all">
            <div className="h-10 w-10 rounded overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                : <div className="h-full w-full flex items-center justify-center text-xs">✦</div>}
            </div>
            <p style={{ color: "var(--text-primary)" }} className="text-sm font-medium truncate pr-2">{p.name}</p>
            <p style={{ color: "var(--text-secondary)" }} className="text-sm">{p.category}</p>
            <p style={{ color: "var(--text-primary)" }} className="text-sm font-semibold">${Number(p.price).toFixed(2)}</p>
            <button onClick={() => startEdit(p)}
              style={{ color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "100px", width: "fit-content" }}
              className="text-xs px-3 py-1 hover:opacity-70 transition-opacity">Edit</button>
            <button onClick={() => handleDelete(p.id)}
              style={{ color: "#dc2626", border: "1px solid #fecaca", borderRadius: "100px", width: "fit-content" }}
              className="text-xs px-3 py-1 hover:opacity-70 transition-opacity">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
