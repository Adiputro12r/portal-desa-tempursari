"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Compass, Landmark, ShoppingBag, Eye } from "lucide-react";

// Helper component to recenter/refit bounds of map when layer data changes
function MapController({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function VillageMap() {
  const [geojsonData, setGeojsonData] = useState(null);
  const [activeTab, setActiveTab] = useState("batas"); // batas, umkm_wisata, fasum
  const [mapBounds, setMapBounds] = useState(null);

  // Fetch geojson on load
  useEffect(() => {
    fetch("/maps/tempursari_dummy.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeojsonData(data);
        // Calculate initial bounds from the dusun polygon coordinates
        const dusunFeatures = data.features.filter(f => f.properties.type === "dusun");
        if (dusunFeatures.length > 0) {
          const coordinates = dusunFeatures.flatMap(f => f.geometry.coordinates[0]);
          const bounds = L.latLngBounds(coordinates.map(coord => [coord[1], coord[0]]));
          setMapBounds(bounds);
        }
      })
      .catch((err) => console.error("Gagal memuat GeoJSON:", err));
  }, []);

  // Filter features based on tab selection
  const getFilteredData = () => {
    if (!geojsonData) return { type: "FeatureCollection", features: [] };

    if (activeTab === "batas") {
      // Show only dusun polygons
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "dusun"),
      };
    } else if (activeTab === "umkm_wisata") {
      // Show only umkm and wisata points
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "umkm" || f.properties.type === "wisata"),
      };
    } else if (activeTab === "fasum") {
      // Show only public facilities points
      return {
        type: "FeatureCollection",
        features: geojsonData.features.filter((f) => f.properties.type === "fasum"),
      };
    }
    return geojsonData;
  };

  // Custom styling for GeoJSON Polygons (boundaries)
  const polygonStyle = (feature) => {
    return {
      fillColor: feature.properties.fillColor || "#10b981",
      fillOpacity: 0.35,
      color: "#047857",
      weight: 2.5,
      dashArray: "6, 6",
    };
  };

  // Custom marker creators using inline SVG DivIcons to bypass Leaflet asset loader bug
  const createCustomMarker = (type, category) => {
    let color = "#15803d"; // default green
    if (type === "wisata") color = "#0284c7"; // blue
    if (type === "umkm") color = "#f59e0b"; // gold
    if (type === "fasum" && category === "Pendidikan") color = "#9333ea"; // purple

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

  // Interactive GeoJSON features callbacks
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
      
      // Hover effects
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
      
      {/* 3-Tab Filter Switcher */}
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

      {/* Leaflet Map Rendering Area */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[-7.655, 110.315]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Tile Layer (OSM Base Map) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render boundary polygons (Dusun lines) */}
          {activeTab === "batas" && filteredGeojson.features.length > 0 && (
            <GeoJSON
              key={activeTab} // Forces Leaflet to redraw layer on switch
              data={filteredGeojson}
              style={polygonStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {/* Render markers (UMKM, Wisata, Fasum) */}
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

          {/* Map bounds auto adjustment */}
          {mapBounds && <MapController bounds={mapBounds} />}
        </MapContainer>
      </div>

      {/* Map Legend */}
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
