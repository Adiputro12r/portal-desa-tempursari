"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Calendar, Newspaper } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

function parseImages(foto_url) {
  if (!foto_url) return [];
  try {
    const parsed = JSON.parse(foto_url);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  return [foto_url]; // legacy single string
}

function stringifyImages(imgs) {
  if (!imgs || imgs.length === 0) return "/assets/kesenian-placeholder.svg";
  if (imgs.length === 1) return imgs[0]; // backward compat
  return JSON.stringify(imgs);
}

export default function ManageBerita() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  // Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState("Kegiatan");
  const [images, setImages] = useState([]);

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) throw new Error("No data");
      setBeritaList(data);
      setUsingDummy(false);
    } catch (_) {
      setBeritaList([]);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBerita(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setJudul("");
    setKonten("");
    setKategori("Kegiatan");
    setImages([]);
    setModalOpen(true);
  };

  const openEditModal = (berita) => {
    setEditingId(berita.id);
    setJudul(berita.judul);
    setKonten(berita.konten || "");
    setKategori(berita.kategori);
    setImages(parseImages(berita.foto_url));
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newBerita = {
      judul,
      konten,
      kategori,
      foto_url: stringifyImages(images),
      tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      author: "Admin Desa"
    };

    if (usingDummy) {
      if (editingId) {
        setBeritaList(beritaList.map(b => b.id === editingId ? { ...b, ...newBerita } : b));
      } else {
        setBeritaList([{ id: `local-${Date.now()}`, ...newBerita }, ...beritaList]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from("artikel").update(newBerita).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("artikel").insert([newBerita]);
        if (error) throw error;
      }
      fetchBerita();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan. Periksa koneksi Supabase Anda.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus berita ini?")) return;
    if (usingDummy) { setBeritaList(beritaList.filter(b => b.id !== id)); return; }
    try {
      const { error } = await supabase.from("artikel").delete().eq("id", id);
      if (error) throw error;
      fetchBerita();
    } catch (_) { alert("Gagal menghapus."); }
  };

  const stripHtml = (html) => {
    if (typeof document !== "undefined") {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || "";
    }
    return html?.replace(/<[^>]*>/g, "") || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Newspaper className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Kabar Desa</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Tambah, Edit, dan Hapus Berita Desa</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {usingDummy && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-semibold text-amber-800">
          ⚠️ Supabase belum terhubung. Data bersifat lokal sementara.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/30 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto" />
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Memuat Berita...</p>
          </div>
        ) : beritaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-4 px-6">Berita</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {beritaList.map((berita) => {
                  const previewImages = parseImages(berita.foto_url);
                  return (
                    <tr key={berita.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-center space-x-3">
                          {previewImages[0] && (
                            <img src={previewImages[0]} alt="" className="w-12 h-10 object-cover rounded-lg border border-slate-100 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-1">{berita.judul}</div>
                            <div className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{stripHtml(berita.konten)}</div>
                            {previewImages.length > 1 && (
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">{previewImages.length} foto</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold">{berita.kategori}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{berita.tanggal}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button onClick={() => openEditModal(berita)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(berita.id)} className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Newspaper className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Berita</h3>
            <p className="text-xs">Klik "Tambah Berita Baru" untuk mulai membuat artikel.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl z-10 relative my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center rounded-t-3xl">
              <h3 className="font-bold text-lg">{editingId ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Judul */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 bg-white"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Kesenian & Budaya">Kesenian & Budaya</option>
                </select>
              </div>

              {/* Multi Image Upload */}
              <MultiImageUpload
                images={images}
                onChange={setImages}
                label="Foto Artikel (maks 5 gambar)"
              />

              {/* Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Isi Artikel</label>
                <RichTextEditor
                  value={konten}
                  onChange={setKonten}
                  placeholder="Tulis isi artikel di sini... (gunakan toolbar di atas untuk memformat teks)"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-700/10"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Berita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
