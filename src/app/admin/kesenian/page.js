"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Sparkles, Calendar, Upload } from "lucide-react";
import { kesenianData as initialDummyKesenian } from "@/data/umkmWisataData";

export default function ManageKesenian() {
  const [kesenianList, setKesenianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);
  
  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [namaKesenian, setNamaKesenian] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [jadwalKegiatan, setJadwalKegiatan] = useState("");

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

  
  const fetchKesenian = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("kesenian_daerah")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        throw new Error("No data or Supabase not connected");
      }
      setKesenianList(data);
      setUsingDummy(false);
    } catch (err) {
      setKesenianList(initialDummyKesenian);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKesenian();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNamaKesenian("");
    setDeskripsi("");
    setFotoUrl("/assets/kesenian-jathilan.svg");
    setJadwalKegiatan("");
    setModalOpen(true);
  };

  const openEditModal = (kesenian) => {
    setEditingId(kesenian.id);
    setNamaKesenian(kesenian.nama_kesenian);
    setDeskripsi(kesenian.deskripsi);
    setFotoUrl(kesenian.foto_url);
    setJadwalKegiatan(kesenian.jadwal_kegiatan);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newKesenian = {
      nama_kesenian: namaKesenian,
      deskripsi,
      foto_url: fotoUrl || "/assets/kesenian-jathilan.svg",
      jadwal_kegiatan: jadwalKegiatan
    };

    if (usingDummy) {
      if (editingId) {
        setKesenianList(kesenianList.map(k => k.id === editingId ? { ...k, ...newKesenian } : k));
      } else {
        setKesenianList([{ id: `kesenian-local-${Date.now()}`, ...newKesenian }, ...kesenianList]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("kesenian_daerah")
          .update(newKesenian)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("kesenian_daerah")
          .insert([newKesenian]);
        if (error) throw error;
      }
      fetchKesenian();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan ke database Supabase.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kesenian ini?")) return;

    if (usingDummy) {
      setKesenianList(kesenianList.filter(k => k.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("kesenian_daerah")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchKesenian();
    } catch (err) {
      alert("Gagal menghapus kesenian.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Kesenian Daerah</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Kelola data kebudayaan dan atraksi seni desa</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kesenian Baru</span>
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
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Memuat data kesenian...</p>
          </div>
        ) : kesenianList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-4.5 px-6">Nama Kesenian</th>
                  <th className="py-4.5 px-6">Jadwal Latihan / Pentas</th>
                  <th className="py-4.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {kesenianList.map((kesenian) => (
                  <tr key={kesenian.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="font-extrabold text-slate-800 text-sm leading-snug">{kesenian.nama_kesenian}</div>
                      <div className="text-xs text-slate-400 font-medium line-clamp-1 mt-1">{kesenian.deskripsi}</div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center space-x-1.5 text-slate-600 font-bold">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{kesenian.jadwal_kegiatan}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEditModal(kesenian)}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kesenian.id)}
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
            <Sparkles className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Data Kesenian</h3>
            <p className="text-xs text-slate-400">Klik tombol "Tambah Kesenian Baru" untuk mendaftarkan kebudayaan lokal.</p>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? "Edit Kesenian" : "Tambah Kesenian Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Kesenian</label>
                  <input
                    type="text"
                    required
                    value={namaKesenian}
                    onChange={(e) => setNamaKesenian(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Jadwal Latihan / Pentas</label>
                  <input
                    type="text"
                    required
                    placeholder="Setiap Malam Minggu Kliwon"
                    value={jadwalKegiatan}
                    onChange={(e) => setJadwalKegiatan(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

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
                <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi / Sejarah Kesenian</label>
                <textarea
                  required
                  rows={5}
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
                  <span>Simpan Kesenian</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
