"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Poppins } from "next/font/google";
import Image from "next/image";
import { LuFilter } from "react-icons/lu";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const iconData: Record<string, string> = {
  Flood: "/icons/flood.png",
  Landslide: "/icons/landslide.png",
  FallenTree: "/icons/tree.png",
  RoadBlockage: "/icons/road-blockage.png",
  Hospital: "/icons/hospital.png",
  Pharmacy: "/icons/pharmacy.png",
};

const getIcon = (type: string): L.DivIcon => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const iconUrl = iconData[type] || "";
  const label = type.replace(/([A-Z])/g, " $1").trim();

  const iconSize = isMobile ? 30 : 50;

  return L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <img src="${iconUrl}" class="w-7 h-7 md:h-9 md:w-9" />
          <span class="text-[10px] ${poppins.className} text-gray-700 text-center font-semibold rounded px-1 whitespace-nowrap">
           ${label}
          </span>
      </div>
    `,
    className: "",
    iconSize: [iconSize, iconSize + 10],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    const fullAddress = data.display_name || "Unknown location";
    const shortAddress = fullAddress
      .replace(/,\s*(Laguna|Calabarzon|Philippines)/g, "")
      .trim();
    return shortAddress;
  } catch {
    return "Unknown location";
  }
};

export default function RiskMappingMap() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const zoomLevel = isMobile ? 12 : 14;

  const [activeFilters, setActiveFilters] = useState<string[]>(
    Object.keys(iconData)
  );
  const [markers, setMarkers] = useState<
    { id: number; type: string; lat: number; lng: number; address: string }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch markers only
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://192.168.137.1/Disaster-backend/public/disasterMapping.php"
        );
        if (!res.ok) throw new Error("Failed to fetch markers");

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const fetchedMarkers = await Promise.all(
            result.data.map(async (m: any) => {
              let address = m.address;
              if (!address) {
                address = await reverseGeocode(Number(m.lat), Number(m.lng));
              }
              return {
                id: Number(m.id),
                type: m.type,
                lat: Number(m.lat),
                lng: Number(m.lng),
                address,
              };
            })
          );

          setMarkers(fetchedMarkers);
        } else {
          setMarkers([]);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Toggle filters
  const handleFilterClick = (type: string) => {
    setActiveFilters((prev) => {
      if (prev.length === Object.keys(iconData).length) {
        return [type];
      } else if (prev.includes(type)) {
        const newFilters = prev.filter((t) => t !== type);
        return newFilters.length > 0 ? newFilters : Object.keys(iconData);
      } else {
        return [...prev, type];
      }
    });
  };

  const filteredMarkers =
    activeFilters.length > 0
      ? markers.filter((m) => activeFilters.includes(m.type))
      : [];

  const types = Object.keys(iconData).map((type) => ({
    type,
    icon: iconData[type],
  }));

  return (
    <div className="relative h-full w-full">
      {/*  DESKTOP: Always visible filter buttons */}
      <div className="hidden absolute z-50 md:flex  bg-white shadow-2xl justify-end gap-4   border  px-4 py-3 left-1/2 -translate-x-1/2 bottom-10 rounded-full w-max">
        {types.map((type) => {
          const isActive = activeFilters.includes(type.type);
          return (
            <button
              key={type.type}
              onClick={() => handleFilterClick(type.type)}
              className={`flex items-center gap-2 rounded-full px-3 text-light-black py-2 text-xs  transition ${
                isActive ? "bg-gray-200" : "shadow-sm"
              }`}
            >
              <Image src={type.icon} height={18} width={18} alt={type.type} />
              {type.type}
            </button>
          );
        })}
      </div>

      {/*  MOBILE: Dropdown filter */}

      <div className="absolute top-5 right-5 z-40 md:hidden flex flex-col items-end">
        {/* Filter toggle button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 rounded-full  bg-white shadow-md px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition"
        >
          <LuFilter className="text-gray-600" />
          <span className="font-medium">Filter</span>
        </button>

        {/* Dropdown filters */}
        {isDropdownOpen && (
          <div className="mt-2  flex flex-col gap-2 rounded-lg bg-white shadow-md border p-2 w-[160px] animate-fadeIn">
            {types.map((type) => {
              const isActive = activeFilters.includes(type.type);
              return (
                <button
                  key={type.type}
                  onClick={() => handleFilterClick(type.type)}
                  className={`flex items-center gap-2 rounded-full px-3 text-light-black py-2 text-[10px] transition ${
                    isActive ? "bg-gray-200" : ""
                  }`}
                >
                  <Image
                    src={type.icon}
                    height={16}
                    width={16}
                    alt={type.type}
                  />
                  {type.type}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <MapContainer
        center={isMobile ? [14.17, 121.2436] : [14.173, 121.244]}
        zoom={isMobile ? 13 : 13}
        minZoom={isMobile ? 13 : 13}
        maxZoom={18}
        zoomControl={false}
        zoomSnap={1}
        zoomDelta={1}
        className="z-0 h-full w-full rounded"
        maxBounds={
          isMobile
            ? [
                [14.1, 121.18],
                [14.25, 121.3],
              ]
            : [
                [14.145, 121.225],
                [14.195, 121.265],
              ]
        }
        maxBoundsViscosity={0.5}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {filteredMarkers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={getIcon(m.type)}>
            <Popup maxWidth={180} minWidth={120}>
              <div className={`flex flex-col ${poppins.className}`}>
                <p className="text-center text-sm font-semibold whitespace-nowrap">
                  {m.type.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="mt-1 text-center text-xs text-gray-600">
                  {m.address}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
