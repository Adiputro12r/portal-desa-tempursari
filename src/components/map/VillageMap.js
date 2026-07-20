"use client";

import { useEffect, useState } from "react";
import { Compass, Landmark, ShoppingBag, MapPin } from "lucide-react";

export default function VillageMap() {
  const [mounted, setMounted] = useState(false);
  const [geojsonData, setGeojsonData] = useState(null);
  const [activeTab, setActiveTab] = useState("batas"); // batas, umkm_wisata, fasum
  const [mapBounds, setMapBounds] = useState(null);
  const [LeafletMap, setLeafletMap] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Dynamically load Leaflet and React-Leaflet strictly on the client side
    Promise.all([
      import("react-leaflet"),
      import("leaflet")
    ]).then(([ReactLeaflet, LeafletModule]) => {
      const L = LeafletModule.default || LeafletModule;
      setLeafletMap({
        MapContainer: ReactLeaflet.MapContainer,
        TileLayer: ReactLeaflet.TileLayer,
        GeoJSON: ReactLeaflet.GeoJSON,
        Marker: ReactLeaflet.Marker,
        Popup: ReactLeaflet.Popup,
        useMap: ReactLeaflet.useMap,
        L: L
      });

      // Fetch geojson on load
      fetch("/maps/tempursari_dummy.geojson")
        .then((res) => res.json())
        .then((data) => {
          setGeojsonData(data);
          const dusunFeatures = data.features.filter(f => f.properties.type === "dusun");
          if (dusunFeatures.length > 0) {
            const coordinates = dusunFeatures.flatMap(f => f.geometry.coordinates[0]);
            const bounds = L.latLngBounds(coordinates.map(coord => [coord[1], coord[0]]));
            setMapBounds(bounds);
          }
        })
        .catch((err) => console.error("Gagal memuat GeoJSON:", err));
    });
  }, []);

  if (!mounted || !LeafletMap) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8 h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Memuat Peta Interaktif...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, L } = LeafletMap;

  function MapController({ bounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [bounds, map]);
    return null;
  }

  const getFilteredData = () => {
    if (!geojsonData) return { type: "FeatureCollection", features: [] };

    if (activeTab === "batas") {
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "dusun"),
      };
    } else if (activeTab === "umkm_wisata") {
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "umkm" || f.properties.type === "wisata"),
      };
    } else if (activeTab === "fasum") {
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "fasum"),
      };
    }
    return geojsonData;
  };

  const polygonStyle = (feature) => {
    return {
      fillColor: feature.properties.fillColor || "#10b981",
      fillOpacity: 0.35,
      color: "#047857",
      weight: 2.5,
      dashArray: "6, 6",
    };
  };

  const createCustomMarker = (type, category) => {
    let color = "#15803d";
    if (type === "wisata") color = "#0284c7";
    if (type === "umkm") color = "#f59e0b";
    if (type === "fasum" && category === "Pendidikan") color = "#9333ea";

    const svgIcon = `<div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; color: white;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`;

    return L.divIcon({
      html: svgIcon,
      className: "custom-leaflet-icon",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30],
    });
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 160px;">
          <h4 style="margin: 0 0 6px 0; font-weight: 800; font-size: 14px; color: #1e293b;">
            ${feature.properties.name}
          </h4>
          <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">
            ${
              feature.properties.type === "dusun"
                ? `<b>Luas:</b> ${feature.properties.area_ha} Ha<br/><b>Penduduk:</b> ${feature.properties.population} Jiwa`
                : feature.properties.description || "Potensi Desa Tempursari"
            }
          </p>
        </div>
      `;
      layer.bindPopup(popupContent);
      
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ fillOpacity: 0.55, weight: 3 });
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle({ fillOpacity: 0.35, weight: 2.5 });
        }
      });
    }
  };

  const filteredGeojson = getFilteredData();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center space-x-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <span>Filter Kontrol Peta</span>
        </h3>
        
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "batas", label: "Batas Wilayah", icon: Landmark },
            { id: "umkm_wisata", label: "UMKM & Destinasi", icon: ShoppingBag },
            { id: "fasum", label: "Fasilitas Umum", icon: MapPin }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/10"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-[500px] rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[-7.655, 110.315]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activeTab === "batas" && filteredGeojson.features.length > 0 && (
            <GeoJSON
              key={activeTab}
              data={filteredGeojson}
              style={polygonStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {activeTab !== "batas" && filteredGeojson.features.map((feature, idx) => {
            const [lon, lat] = feature.geometry.coordinates;
            return (
              <Marker
                key={`${activeTab}-${idx}`}
                position={[lat, lon]}
                icon={createCustomMarker(feature.properties.type, feature.properties.category)}
              >
                <Popup>
                  <div className="font-sans p-1 min-w-[180px]">
                    <span className={`inline-block font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-md mb-2 text-white ${
                      feature.properties.type === "wisata" ? "bg-sky-600" : feature.properties.type === "umkm" ? "bg-amber-500" : "bg-purple-600"
                    }`}>
                      {feature.properties.category || feature.properties.type}
                    </span>
                    <h4 className="margin-0 font-extrabold text-sm text-slate-800 leading-tight">
                      {feature.properties.name}
                    </h4>
                    <p className="margin-0 text-slate-500 text-xs mt-1 leading-relaxed">
                      {feature.properties.description}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {mapBounds && <MapController bounds={mapBounds} />}
        </MapContainer>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 justify-center">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm inline-block" />
          <span>Dusun Sabrang Kidul</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-amber-500 rounded-full border border-white shadow-sm inline-block" />
          <span>Dusun Limbangan</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 bg-[#0284c7] rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold">✓</span>
          <span>Potensi Wisata</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 bg-[#f59e0b] rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold">✓</span>
          <span>UMKM Lokal</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 bg-[#15803d] rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold">✓</span>
          <span>Fasilitas Umum</span>
        </div>
      </div>
    </div>
  );
}
