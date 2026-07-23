"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, Users, Phone, MessageSquare, Upload, Loader2 } from "lucide-react";
import { aparatData as initialDummyAparat } from "@/data/aparatData";
import { uploadToSupabase } from "@/lib/storage";

export default function ManagePemerintah() {
  const [aparatList, setAparatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [kontak, setKontak] = useState("");
  const [hasWhatsapp, setHasWhatsapp] = useState(true);
  const [deskripsi, setDeskripsi] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadToSupabase(file, "pemerintah");
    setUploading(false);

    if (error) {
      alert("Gagal mengunggah foto: " + error.message);
    } else if (url) {
      setFotoUrl(url);
    }
  };

  
  const fetchAparat = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pemerintah_desa")
        .select("*")
        .order("urutan", { ascending: true });

      if (error || !data || data.length === 0) {
        throw new Error("No data or Supabase not connected");
      }
      setAparatList(data);
      setUsingDummy(false);
    } catch (err) {
      setAparatList(initialDummyAparat);
      setUsingDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAparat();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNama("");
    setJabatan("");
    setFotoUrl("/assets/default-avatar.svg");
    setKontak("");
    setHasWhatsapp(true);
    setDeskripsi("");
    setModalOpen(true);
  };

  const openEditModal = (aparat) => {
    setEditingId(aparat.id);
    setNama(aparat.nama);
    setJabatan(aparat.jabatan);
    setFotoUrl(aparat.foto_url || aparat.foto); // fallback key
    setKontak(aparat.kontak);
    setHasWhatsapp(aparat.has_whatsapp !== undefined ? aparat.has_whatsapp : aparat.hasWhatsapp);
    setDeskripsi(aparat.deskripsi);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newAparat = {
      nama,
      jabatan,
      foto_url: fotoUrl || "/assets/default-avatar.svg",
      kontak,
      has_whatsapp: hasWhatsapp,
      deskripsi
    };

    if (usingDummy) {
      if (editingId) {
        setAparatList(aparatList.map(a => a.id === editingId ? { ...a, ...newAparat, foto: newAparat.foto_url, hasWhatsapp: newAparat.has_whatsapp } : a));
      } else {
        setAparatList([...aparatList, { id: `aparat-local-${Date.now()}`, ...newAparat, foto: newAparat.foto_url, hasWhatsapp: newAparat.has_whatsapp, urutan: aparatList.length + 1 }]);
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("pemerintah_desa")
          .update(newAparat)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("pemerintah_desa")
          .insert([{ ...newAparat, urutan: aparatList.length + 1 }]);
        if (error) throw error;
      }
      fetchAparat();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan ke database Supabase.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus aparat ini dari daftar pemerintah desa?")) return;

    if (usingDummy) {
      setAparatList(aparatList.filter(a => a.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("pemerintah_desa")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchAparat();
    } catch (err) {
      alert("Gagal menghapus data aparat.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Users className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Aparat Pemerintah Desa</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Kelola data kepengurusan perangkat desa Tempursari</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Aparat Baru</span>
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
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Memuat data pemerintah...</p>
          </div>
        ) : aparatList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <th className="py-4.5 px-6">Nama / Jabatan</th>
                  <th className="py-4.5 px-6">Metode Hubungi</th>
                  <th className="py-4.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {aparatList.map((aparat) => {
                  const hasWa = aparat.has_whatsapp !== undefined ? aparat.has_whatsapp : aparat.hasWhatsapp;
                  return (
                    <tr key={aparat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 px-6">
                        <div className="font-extrabold text-slate-800 text-sm leading-snug">{aparat.nama}</div>
                        <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">{aparat.jabatan}</div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="font-bold text-slate-700">{aparat.kontak}</div>
                        <div className="mt-1">
                          {hasWa ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[9px] font-bold">
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[9px] font-bold">
                              <Phone className="w-3 h-3" />
                              <span>Panggilan Biasa</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => openEditModal(aparat)}
                            className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(aparat.id)}
                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                          >
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
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Data Aparat</h3>
            <p className="text-xs text-slate-400">Klik tombol "Tambah Aparat Baru" untuk mengisi struktur pengurus desa.</p>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? "Edit Data Aparat" : "Tambah Aparat Baru"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Jabatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kepala Desa"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nomor HP / Kontak</label>
                  <input
                    type="text"
                    required
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Upload Foto / Berkas SVG</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-emerald-50/50 border border-dashed border-emerald-500/40 rounded-xl px-3 py-2 text-center transition-colors">
                      <span className="text-xs font-bold text-emerald-700 flex items-center justify-center space-x-1">
                        {uploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload SVG/Foto...</span>
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.svg"
                        disabled={uploading}
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


              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  id="hasWaCheckbox"
                  checked={hasWhatsapp}
                  onChange={(e) => setHasWhatsapp(e.target.checked)}
                  className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded-md focus:ring-emerald-500"
                />
                <label htmlFor="hasWaCheckbox" className="text-xs font-bold text-slate-600 cursor-pointer">
                  Nomor HP ini terhubung ke WhatsApp aktif (Chat WA langsung)
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Uraian Tugas / Deskripsi Singkat</label>
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
                  <span>Simpan Aparat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
