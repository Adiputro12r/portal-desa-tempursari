import Image from "next/image";
import { Landmark, ShieldCheck } from "lucide-react";
import { lembagaData } from "@/data/demografiData";

export const metadata = {
  title: "Lembaga Desa - Portal Desa Tempursari",
  description: "Daftar lembaga kemasyarakatan resmi Desa Tempursari seperti PKK, LPMD, dan Karang Taruna.",
};

const lembagaDetail = {
  "lembaga-1": {
    ketua: "Bpk. Sumarno",
    tahunBerdiri: "2010",
    program: ["Musyawarah Perencanaan Desa", "Gotong Royong Lingkungan", "Pembangunan Infrastruktur Swadaya"],
    color: "emerald",
  },
  "lembaga-2": {
    ketua: "Ibu Sri Wahyuni, S.E.",
    tahunBerdiri: "2005",
    program: ["Penyuluhan Gizi dan Kesehatan", "Kegiatan PKK Rutin", "Pengembangan UPPKS"],
    color: "rose",
  },
  "lembaga-3": {
    ketua: "Sdr. Rizky Pratama",
    tahunBerdiri: "2015",
    program: ["Kegiatan Olahraga Pemuda", "Pentas Seni & Kesenian", "Bakti Sosial Masyarakat"],
    color: "amber",
  },
};

const colorMap = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    tag: "bg-emerald-100 text-emerald-800",
    border: "hover:border-emerald-400/30",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    tag: "bg-rose-100 text-rose-800",
    border: "hover:border-rose-400/30",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    tag: "bg-amber-100 text-amber-800",
    border: "hover:border-amber-400/30",
  },
};

export default function LembagaDesa() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Landmark className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Lembaga Kemasyarakatan Desa</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Mengenal organisasi sosial dan wadah aspirasi gotong-royong warga di Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Main Grid content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {lembagaData.map((lembaga) => {
            const detail = lembagaDetail[lembaga.id];
            const c = colorMap[detail?.color] || colorMap.emerald;

            return (
              <div
                key={lembaga.id}
                className={`bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 group hover:shadow-2xl ${c.border}`}
              >
                {/* Top row: Logo + Name + Description */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Logo */}
                  <div className="relative w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 p-3 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={lembaga.logo_url}
                      alt={lembaga.nama_lembaga}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Name + Badge + Description */}
                  <div className="space-y-3 text-center md:text-left flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <h3 className="font-extrabold text-lg text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {lembaga.nama_lembaga}
                      </h3>
                      <span className={`inline-flex self-center md:self-start items-center space-x-1 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${c.badge}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Lembaga Resmi</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {lembaga.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Bottom: Details grid */}
                {detail && (
                  <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ketua</p>
                      <p className="font-bold text-slate-700">{detail.ketua}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Berdiri Sejak</p>
                      <p className="font-bold text-slate-700">{detail.tahunBerdiri}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Program Unggulan</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.program.map((prog, i) => (
                          <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.tag}`}>
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
