"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, ShoppingBag, MapPin, Upload, Loader2 } from "lucide-react";
import { umkmData as initialDummyUmkm } from "@/data/umkmWisataData";
import { uploadToSupabase } from "@/lib/storage";

export default function ManageUmkm() {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [kontak, setKontak] = useState("");
  const [alamat, setAlamat] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadToSupabase(file, "umkm");
    setUploading(false);

    if (error) {
      alert("Gagal mengunggah foto: " + error.message);
    } else if (url) {
      setFotoUrl(url);
    }
  };

  
  const fetchUmkm = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("umkm")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        throw new Error("No data or Supabase not connected");
      }
      setUmkmList(data);
      setUsingDummy(false);
    } catch (err) {
      setUmkmList(initialDummyUmkm);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkm();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNamaUsaha("");
    setPemilik("");
    setDeskripsi("");
    setFotoUrl("/assets/umkm-kripik.svg");
    setKontak("");
    setAlamat("");
    setModalOpen(true);
  };

  const openEditModal = (umkm) => {
    setEditingId(umkm.id);
    setNamaUsaha(umkm.nama_usaha);
    setPemilik(umkm.pemilik);
    setDeskripsi(umkm.deskripsi);
    setFotoUrl(umkm.foto_url);
    setKontak(umkm.kontak);
    setAlamat(umkm.alamat);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newUmkm = {
      nama_usaha: namaUsaha,
      pemilik,
      deskripsi,
      foto_url: fotoUrl || "/assets/umkm-kripik.svg",
      kontak,
      alamat
    };

    if (usingDummy) {
      if (editingId) {
        setUmkmList(umkmList.map(u => u.id === editingId ? { ...u, ...newUmkm } : u));
      } else {
        setUmkmList([{ id: `umkm-local-${Date.now()}`, ...newUmkm }, ...umkmList]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("umkm")
          .update(newUmkm)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("umkm")
          .insert([newUmkm]);
        if (error) throw error;
      }
      fetchUmkm();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan ke database Supabase.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) return;

    if (usingDummy) {
      setUmkmList(umkmList.filter(u => u.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("umkm")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchUmkm();
    } catch (err) {
      alert("Gagal menghapus UMKM.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola UMKM Desa</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Kelola data usaha mikro warga Tempursari</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah UMKM Baru</span>
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
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Memuat data UMKM...</p>
          </div>
        ) : umkmList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-4.5 px-6">Nama Usaha / Pemilik</th>
                  <th className="py-4.5 px-6">Kontak & Alamat</th>
                  <th className="py-4.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {umkmList.map((umkm) => (
                  <tr key={umkm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="font-extrabold text-slate-800 text-sm leading-snug">{umkm.nama_usaha}</div>
                      <div className="text-xs text-slate-400 font-medium mt-1">Pemilik: {umkm.pemilik}</div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="font-bold text-slate-700">{umkm.kontak}</div>
                      <div className="text-slate-400 flex items-center space-x-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{umkm.alamat}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEditModal(umkm)}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(umkm.id)}
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
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada UMKM</h3>
            <p className="text-xs text-slate-400">Klik tombol "Tambah UMKM Baru" untuk mendaftarkan UMKM lokal.</p>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? "Edit UMKM" : "Tambah UMKM Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Usaha</label>
                  <input
                    type="text"
                    required
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    value={pemilik}
                    onChange={(e) => setPemilik(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nomor HP/WA</label>
                  <input
                    type="text"
                    required
                    placeholder="+628..."
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
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
              </div>


              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="RT/RW, Nama Dusun"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Deskripsi Usaha</label>
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
                  <span>Simpan UMKM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
