"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useMemo } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

type Props = {
  lat?: string | number;
  lng?: string | number;
  name?: string;
};

export default function MapDetails({ lat, lng, name }: Props) {
  const mapRef = useRef<L.Map>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const customMarkerIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "/icons/gps.png",
        iconSize: isMobile ? [40, 40] : [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -40],
      }),
    [isMobile]
  );

  return (
    <div className="h-full w-full shadow-md">
      <MapContainer
        ref={mapRef}
        center={[Number(lat), Number(lng)]}
        zoom={isMobile ? 17 : 18}
        minZoom={14}
        maxZoom={18}
        zoomControl={false}
        className="z-0 h-full w-full rounded-lg"
        maxBounds={[
          [14.12, 121.2],
          [14.22, 121.28],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[Number(lat), Number(lng)]} icon={customMarkerIcon}>
          <Popup>
            <div className={`pr-2 ${poppins.className}`}>
              <h3 className="text-xs font-semibold">{name}</h3>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
