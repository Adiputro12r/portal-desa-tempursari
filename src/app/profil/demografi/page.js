"use client";

import { useEffect, useState } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, BarChart3, PieChartIcon, TrendingUp } from "lucide-react";
import { pekerjaanData, pendidikanData, usiaData } from "@/data/demografiData";

export default function DemografiPenduduk() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = "Demografi Kependudukan - Portal Desa Tempursari";
  }, []);


  // Palette colors for Pie Cells
  const COLORS = ["#047857", "#059669", "#10b981", "#34d399", "#a7f3d0", "#d1fae5"];

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Demografi Penduduk Desa</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Visualisasi data statistik kependudukan Desa Tempursari berdasarkan pekerjaan, jenjang pendidikan, dan kelompok umur.
          </p>
        </div>
      </section>

      {/* Main Charts Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!mounted ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto" />
            <p className="text-xs text-slate-400 mt-3 font-semibold">Memuat grafik kependudukan...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Row 1: Pekerjaan & Pendidikan side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Pekerjaan */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <PieChartIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 leading-none">Mata Pencaharian Penduduk</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Persentase Pekerjaan</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pekerjaanData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pekerjaanData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", fontSize: "12px", border: "none" }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={10}
                        iconType="circle"
                        wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Pendidikan */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 leading-none">Jenjang Pendidikan Terakhir</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Tingkat Pendidikan Warga</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={pendidikanData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={110} axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", fontSize: "12px", border: "none" }}
                      />
                      <Bar dataKey="value" fill="#059669" radius={[0, 8, 8, 0]} barSize={16} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Row 2: Kelompok Umur full-width */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 leading-none">Kelompok Usia Penduduk</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Sebaran Umur Warga</p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={usiaData}>
                    <XAxis dataKey="range" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", fontSize: "12px", border: "none" }}
                    />
                    <Bar dataKey="jumlah" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={36} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
