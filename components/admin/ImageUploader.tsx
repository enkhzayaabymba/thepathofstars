"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

const MAX = 5;
const box = { width: "68px", height: "68px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 };

async function uploadFile(file: File): Promise<string> {
  const name = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("products").upload(name, file);
  if (error) throw new Error(error.message);
  return supabase.storage.from("products").getPublicUrl(name).data.publicUrl;
}

export default function ImageUploader({ images, onChange }: Props) {
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX - images.length);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      onChange([...images, ...urls]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    }
    e.target.value = "";
  }

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, i) => (
        <div key={i} style={{ ...box, border: "1px solid var(--border)", position: "relative" }}>
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => remove(i)}
            style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            ×
          </button>
          {i === 0 && (
            <span style={{ position: "absolute", bottom: "2px", left: "2px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "8px", borderRadius: "3px", padding: "1px 4px" }}>Main</span>
          )}
        </div>
      ))}
      {images.length < MAX && (
        <label style={{ ...box, border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "22px", cursor: "pointer", backgroundColor: "var(--surface)" }}
          className="hover:opacity-70 transition-opacity">
          +
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        </label>
      )}
    </div>
  );
}
