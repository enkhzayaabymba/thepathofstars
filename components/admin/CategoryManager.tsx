"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/types";

type Props = {
  initialCategories: Category[];
};

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!newName.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newName.trim() })
      .select()
      .single();
    if (!error && data) {
      setCategories([...categories, data as Category]);
      setNewName("");
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setCategories(categories.filter((c) => c.id !== id));
  }

  async function handleRename(id: number) {
    if (!editName.trim()) return;
    const { error } = await supabase
      .from("categories")
      .update({ name: editName.trim() })
      .eq("id", id);
    if (!error) {
      setCategories(categories.map((c) => c.id === id ? { ...c, name: editName.trim() } : c));
      setEditingId(null);
    }
  }

  const inputStyle = {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    backgroundColor: "var(--white)",
    outline: "none",
  };

  return (
    <div
      style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" }}
      className="mb-10"
    >
      <h2 style={{ color: "var(--text-primary)" }} className="font-semibold text-base mb-6">
        Categories
      </h2>

      {/* Category list */}
      <div className="flex flex-col gap-2 mb-5">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3">
            {editingId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ ...inputStyle, padding: "6px 10px", fontSize: "14px", flex: 1 }}
                />
                <button
                  onClick={() => handleRename(cat.id)}
                  style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }}
                  className="text-xs px-3 py-1.5 hover:opacity-80 transition-opacity"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "100px" }}
                  className="text-xs px-3 py-1.5 hover:opacity-70 transition-opacity"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ color: "var(--text-primary)" }} className="text-sm flex-1">{cat.name}</span>
                <button
                  onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                  style={{ border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "100px" }}
                  className="text-xs px-3 py-1 hover:opacity-70 transition-opacity"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{ border: "1px solid #fecaca", color: "#dc2626", borderRadius: "100px" }}
                  className="text-xs px-3 py-1 hover:opacity-70 transition-opacity"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new category */}
      <div className="flex gap-3">
        <input
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ ...inputStyle, padding: "8px 12px", fontSize: "14px", flex: 1 }}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newName.trim()}
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px", opacity: !newName.trim() ? 0.4 : 1 }}
          className="px-5 py-2 text-sm font-medium transition-opacity"
        >
          Add
        </button>
      </div>
    </div>
  );
}
