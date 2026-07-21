"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Landmark } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

function parseImages(foto_url) {
  if (!foto_url) return [];
  try {
    const arr = JSON.parse(foto_url);
    if (Array.isArray(arr)) return arr;
  } catch (_) {}
  return foto_url ? [foto_url] : [];
}

function stringifyImages(imgs) {
  if (!imgs || imgs.length === 0) return "";
  if (imgs.length === 1) return imgs[0];
  return JSON.stringify(imgs);
}

export default function ManageLembaga() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [namaLembaga, setNamaLembaga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lembaga_desa")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) setList(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setNamaLembaga("");
    setDeskripsi("");
    setImages([]);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setNamaLembaga(item.nama_lembaga || "");
    setDeskripsi(item.deskripsi || "");
    setImages(parseImages(item.foto_url || item.logo_url));
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nama_lembaga: namaLembaga,
      deskripsi,
      foto_url: stringifyImages(images),
    };
    try {
      if (editingId) {
        const { error } = await supabase.from("lembaga_desa").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lembaga_desa").insert([payload]);
        if (error) throw error;
      }
      // Invalidate public cache
      localStorage.removeItem("lembaga_desa_cache");
      fetchData();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan: " + (err.message || "Cek koneksi Supabase."));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data lembaga ini?")) return;
    try {
      const { error } = await supabase.from("lembaga_desa").delete().eq("id", id);
      if (error) throw error;
      localStorage.removeItem("lembaga_desa_cache");
      fetchData();
    } catch (_) { alert("Gagal menghapus."); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Landmark className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Lembaga Desa</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Tambah, Edit, dan Hapus Informasi Lembaga</p>
        </div>
        <button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Tambah Lembaga</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/30 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto" />
          </div>
        ) : list.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {list.map((item) => {
              const img = parseImages(item.foto_url || item.logo_url)[0];
              return (
                <div key={item.id} className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                  {img && (
                    <img src={img} alt={item.nama_lembaga} className="w-16 h-12 object-cover rounded-lg border border-slate-100 shrink-0" />
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="font-extrabold text-sm text-slate-800">{item.nama_lembaga}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{(item.deskripsi || "").replace(/<[^>]*>/g, "")}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Landmark className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Data Lembaga</h3>
            <p className="text-xs">Klik "Tambah Lembaga" untuk menambahkan informasi lembaga desa.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl z-10 relative my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center rounded-t-3xl">
              <h3 className="font-bold text-lg">{editingId ? "Edit Lembaga" : "Tambah Lembaga Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lembaga</label>
                <input
                  type="text"
                  required
                  value={namaLembaga}
                  onChange={(e) => setNamaLembaga(e.target.value)}
                  placeholder="Cth: BPD Desa Tempursari"
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              <MultiImageUpload
                images={images}
                onChange={setImages}
                label="Foto / Bagan Struktur Lembaga"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi & Penjelasan</label>
                <RichTextEditor
                  value={deskripsi}
                  onChange={setDeskripsi}
                  placeholder="Tulis penjelasan tentang lembaga ini..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Lembaga"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
