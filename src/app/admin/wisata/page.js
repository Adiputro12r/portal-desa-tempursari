"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Compass, MapPin } from "lucide-react";
import { wisataData as initialDummyWisata } from "@/data/umkmWisataData";

export default function ManageWisata() {
  const [wisataList, setWisataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);
  
  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [namaWisata, setNamaWisata] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  
  const fetchWisata = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("objek_wisata")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        throw new Error("No data or Supabase not connected");
      }
      setWisataList(data);
      setUsingDummy(false);
    } catch (err) {
      setWisataList(initialDummyWisata);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWisata();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNamaWisata("");
    setDeskripsi("");
    setFotoUrl("/assets/wisata-embung.svg");
    setLokasi("");
    setMapsUrl("");
    setModalOpen(true);
  };

  const openEditModal = (wisata) => {
    setEditingId(wisata.id);
    setNamaWisata(wisata.nama_wisata);
    setDeskripsi(wisata.deskripsi);
    setFotoUrl(wisata.foto_url);
    setLokasi(wisata.lokasi);
    setMapsUrl(wisata.maps_url);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newWisata = {
      nama_wisata: namaWisata,
      deskripsi,
      foto_url: fotoUrl || "/assets/wisata-embung.svg",
      lokasi,
      maps_url: mapsUrl
    };

    if (usingDummy) {
      if (editingId) {
        setWisataList(wisataList.map(w => w.id === editingId ? { ...w, ...newWisata } : w));
      } else {
        setWisataList([{ id: `wisata-local-${Date.now()}`, ...newWisata }, ...wisataList]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("objek_wisata")
          .update(newWisata)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("objek_wisata")
          .insert([newWisata]);
        if (error) throw error;
      }
      fetchWisata();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan ke database Supabase.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus wisata ini?")) return;

    if (usingDummy) {
      setWisataList(wisataList.filter(w => w.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("objek_wisata")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchWisata();
    } catch (err) {
      alert("Gagal menghapus objek wisata.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Compass className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Objek Wisata</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Kelola data destinasi pariwisata Desa Tempursari</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Wisata Baru</span>
        </button>
      </div>

      {usingDummy && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-semibold text-amber-800 leading-relaxed">
          <span>⚠️ Catatan: Supabase belum terkonfigurasi. Menggunakan data dummy lokal.</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/30 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto" />
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Memuat data wisata...</p>
          </div>
        ) : wisataList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-4.5 px-6">Nama Wisata</th>
                  <th className="py-4.5 px-6">Lokasi & Deskripsi</th>
                  <th className="py-4.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {wisataList.map((wisata) => (
                  <tr key={wisata.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 font-extrabold text-slate-800 text-sm leading-snug">
                      {wisata.nama_wisata}
                    </td>
                    <td className="py-4.5 px-6 max-w-sm">
                      <div className="text-slate-500 font-medium line-clamp-1">{wisata.deskripsi}</div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{wisata.lokasi}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEditModal(wisata)}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(wisata.id)}
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
            <Compass className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Objek Wisata</h3>
            <p className="text-xs text-slate-400">Klik tombol "Tambah Wisata Baru" untuk mendaftarkan objek pariwisata.</p>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? "Edit Objek Wisata" : "Tambah Wisata Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Objek Wisata</label>
                  <input
                    type="text"
                    required
                    value={namaWisata}
                    onChange={(e) => setNamaWisata(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Lokasi Dusun</label>
                  <input
                    type="text"
                    required
                    placeholder="Dusun Sabrang Kidul, Tempursari"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Link Google Maps</label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/..."
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Foto Sampul (URL)</label>
                  <input
                    type="text"
                    value={fotoUrl}
                    onChange={(e) => setFotoUrl(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi Daya Tarik Wisata</label>
                <textarea
                  required
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
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
                  <span>Simpan Wisata</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
