"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit3, Save, X, BarChart3 } from "lucide-react";

const KATEGORI_LIST = ["Pekerjaan", "Pendidikan", "Usia"];

export default function ManageDemografi() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState("Pekerjaan");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [kategori, setKategori] = useState("Pekerjaan");
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("demografi_desa")
        .select("*")
        .order("kategori")
        .order("jumlah", { ascending: false });
      if (!error && data) setList(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setKategori(activeKategori);
    setNama("");
    setJumlah("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setKategori(item.kategori);
    setNama(item.nama);
    setJumlah(String(item.jumlah));
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { kategori, nama, jumlah: parseInt(jumlah) || 0 };
    try {
      if (editingId) {
        const { error } = await supabase.from("demografi_desa").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("demografi_desa").insert([payload]);
        if (error) throw error;
      }
      fetchData();
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan: " + (err.message || "Cek koneksi Supabase."));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    try {
      const { error } = await supabase.from("demografi_desa").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (_) { alert("Gagal menghapus."); }
  };

  const filtered = list.filter(i => i.kategori === activeKategori);
  const total = filtered.reduce((sum, i) => sum + (i.jumlah || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Kelola Data Demografi</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Data Kependudukan Berdasarkan Kategori</p>
        </div>
        <button onClick={openAdd} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Tambah Data</span>
        </button>
      </div>

      {/* Kategori Tabs */}
      <div className="flex space-x-2">
        {KATEGORI_LIST.map(k => (
          <button
            key={k}
            onClick={() => setActiveKategori(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeKategori === k ? "bg-emerald-700 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >{k}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/30 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto" />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <th className="py-4 px-6">Keterangan ({activeKategori})</th>
                    <th className="py-4 px-6">Jumlah (orang)</th>
                    <th className="py-4 px-6">Persentase</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{item.nama}</td>
                      <td className="py-4 px-6">{item.jumlah?.toLocaleString("id-ID")}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${total ? Math.round((item.jumlah / total) * 100) : 0}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-[10px]">{total ? Math.round((item.jumlah / total) * 100) : 0}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-emerald-100 text-xs font-extrabold text-emerald-800">
                    <td className="py-3 px-6">TOTAL</td>
                    <td className="py-3 px-6">{total.toLocaleString("id-ID")}</td>
                    <td className="py-3 px-6">100%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <BarChart3 className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-sm">Belum Ada Data {activeKategori}</h3>
            <p className="text-xs">Klik "Tambah Data" untuk memasukkan data demografi.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md z-10 relative">
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center rounded-t-3xl">
              <h3 className="font-bold text-lg">{editingId ? "Edit Data Demografi" : "Tambah Data Demografi"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 text-slate-800 bg-white">
                  {KATEGORI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Keterangan</label>
                <input type="text" required value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Cth: Petani, SD, 20-30 Tahun..." className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Jumlah (Orang)</label>
                <input type="number" required min="0" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" className="block w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 text-slate-800" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold">Batal</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
