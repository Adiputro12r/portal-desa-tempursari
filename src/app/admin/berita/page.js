"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Calendar, Newspaper, Image as ImageIcon, Upload } from "lucide-react";
import { beritaData as initialDummyBerita } from "@/data/beritaData";

export default function ManageBerita() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);
  
  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState("Kegiatan");
  const [fotoUrl, setFotoUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoUrl(event.target?.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  
  const fetchBerita = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        throw new Error("No data or Supabase not connected");
      }
      setBeritaList(data);
      setUsingDummy(false);
    } catch (err) {
      // Fallback to local dummy data
      setBeritaList(initialDummyBerita);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setJudul("");
    setKonten("");
    setKategori("Kegiatan");
    setFotoUrl("/assets/kesenian-placeholder.svg"); // default placeholder
    setModalOpen(true);
  };

  const openEditModal = (berita) => {
    setEditingId(berita.id);
    setJudul(berita.judul);
    setKonten(berita.konten);
    setKategori(berita.kategori);
    setFotoUrl(berita.foto_url);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newBerita = {
      judul,
      konten,
      kategori,
      foto_url: fotoUrl || "/assets/kesenian-placeholder.svg",
      tanggal: new Date().toISOString().split("T")[0],
      author: "Admin Desa"
    };

    if (usingDummy) {
      // Offline local array manipulation
      if (editingId) {
        setBeritaList(beritaList.map(b => b.id === editingId ? { ...b, ...newBerita } : b));
      } else {
        setBeritaList([{ id: `berita-local-${Date.now()}`, ...newBerita }, ...beritaList]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        // Update Supabase
        const { error } = await supabase
          .from("artikel")
          .update(newBerita)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        // Insert Supabase
        const { error } = await supabase
          .from("artikel")
          .insert([newBerita]);
        if (error) throw error;
      }
      fetchBerita();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan ke database. Cek autentikasi & RLS kebijakan Supabase Anda.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

    if (usingDummy) {
      setBeritaList(beritaList.filter(b => b.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("artikel")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchBerita();
    } catch (err) {
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Newspaper className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Kabar Desa</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Tambah, Edit, dan Hapus Berita/Event Desa</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* Offline Alert Badge */}
      {usingDummy && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-semibold text-amber-800 flex items-center space-x-2 leading-relaxed">
          <span>⚠️ Catatan: Supabase belum terkonfigurasi. Menggunakan data dummy lokal (perubahan hanya disimpan sementara di memory browser).</span>
        </div>
      )}

      {/* Table grid */}
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
                  <th className="py-4.5 px-6">Berita</th>
                  <th className="py-4.5 px-6">Kategori</th>
                  <th className="py-4.5 px-6">Tanggal</th>
                  <th className="py-4.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {beritaList.map((berita) => (
                  <tr key={berita.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 max-w-sm">
                      <div className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-1">{berita.judul}</div>
                      <div className="text-xs text-slate-400 font-medium line-clamp-1 mt-1">{berita.konten}</div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold">
                        {berita.kategori}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{berita.tanggal}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEditModal(berita)}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(berita.id)}
                          className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Newspaper className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Berita</h3>
            <p className="text-xs text-slate-400">Klik tombol "Tambah Berita Baru" untuk menambahkan pengumuman atau artikel.</p>
          </div>
        )}
      </div>

      {/* Input Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? "Edit Artikel Berita" : "Tambah Artikel Berita Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
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

              {/* Upload Foto / SVG File */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Upload Berkas Foto / SVG</label>
                <div className="flex items-center space-x-2">
                  <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-emerald-50/50 border border-dashed border-emerald-500/40 rounded-xl px-3 py-2 text-center transition-colors">
                    <span className="text-xs font-bold text-emerald-700 flex items-center justify-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload SVG/Foto...</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {fotoUrl && (
                    <div className="w-10 h-10 relative rounded-lg border overflow-hidden shrink-0 bg-slate-100">
                      <img src={fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Atau tempel URL gambar..."
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 mt-1"
                />
              </div>


              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Isi Artikel Berita</label>
                <textarea
                  required
                  rows={6}
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 resize-none"
                />
              </div>

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
