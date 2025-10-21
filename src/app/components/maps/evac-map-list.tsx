"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { getEvacuationCenters } from "@/server/evacuation";
import { EvacuationCenterProps } from "../../../../types";
import { TbMapPinSearch } from "react-icons/tb";
import { LuMapPin } from "react-icons/lu";
import { MdFilterList } from "react-icons/md";
import "leaflet-routing-machine";
import { BiCurrentLocation } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { PiNewspaperFill } from "react-icons/pi";
import { AiFillWarning } from "react-icons/ai";

// ✅ Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function FlyToEvac({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 18);
  return null;
}

function LocateButton({
  mapRef,
  userLocation,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
  userLocation: [number, number] | null;
}) {
  const handleClick = () => {
    const map = mapRef.current;
    if (map && userLocation) {
      map.flyTo(userLocation, 18, { duration: 1.5 });
    }
  };

  if (!userLocation) return null;

  return (
    <button
      onClick={handleClick}
      className="absolute top-[10%] left-2.5 md:top-auto md:left-auto md:bottom-5 md:right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition"
      title="Go to my location"
    >
      <BiCurrentLocation className="text-xl text-dark-blue" />
    </button>
  );
}

export default function EvacuationListView({
  selectedEvac,
  setSelectedEvac,
}: {
  selectedEvac: EvacuationCenterProps | null;
  setSelectedEvac: React.Dispatch<
    React.SetStateAction<EvacuationCenterProps | null>
  >;
}) {
  const { data = [], isLoading } = useQuery<EvacuationCenterProps[]>({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  const [search, setSearch] = useState("");
  const mapRef = useRef<L.Map | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [flyOnly, setFlyOnly] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // ✅ Mobile directions toggle
  const [mobileDirectionsVisible, setMobileDirectionsVisible] = useState(true);

  const [showRiskMapping, setShowRiskMapping] = useState(false);
  const [riskMarkers, setRiskMarkers] = useState<
    { id: number; type: string; lat: number; lng: number; address: string }[]
  >([]);

  const [directions, setDirections] = useState<{
    totalDistance: string;
    list: { text: string; distance: string }[];
  } | null>(null);

  useEffect(() => {
    if (!showRiskMapping) return;

    const fetchRisk = async () => {
      try {
        const res = await fetch(
          "http://192.168.137.1/Disaster-backend/public/disasterMapping.php"
        );
        const json = await res.json();
        console.log("Raw risk mapping data:", json);

        const filtered = json.data.filter(
          (item: any) => item.type !== "Pharmacy" && item.type !== "Hospital"
        );

        const markers = await Promise.all(
          filtered.map(async (m: any) => {
            let address = m.address;
            if (!address) {
              address = "";
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

        setRiskMarkers(markers);
      } catch (err) {
        console.error("Failed to fetch risk markers:", err);
      }
    };

    fetchRisk();
  }, [showRiskMapping]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ start with all true = show all
  const [filterStates, setFilterStates] = useState({
    plenty: true,
    almost: true,
    full: true,
  });

  // ✅ toggle = ON means visible
  const toggleFilter = (status: "plenty" | "almost" | "full") => {
    setFilterStates((prev) => {
      const allActive = Object.values(prev).every((v) => v === true);
      if (allActive) {
        return { plenty: false, almost: false, full: false, [status]: true };
      }
      return { ...prev, [status]: !prev[status] };
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedInsidePanel =
        filterRef.current && filterRef.current.contains(target);
      const clickedButton = target.closest("#filter-btn");

      if (!clickedInsidePanel && !clickedButton) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (flyOnly) {
      setFlyOnly(false);
      return;
    }

    // Remove previous route layer if exists
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Marker)) {
        map.removeLayer(layer);
      }
    });

    if (userLocation && selectedEvac) {
      const body = {
        coordinates: [
          [userLocation[1], userLocation[0]],
          [Number(selectedEvac.long), Number(selectedEvac.lat)],
        ],
        preference: "shortest",
        profile: "foot-walking",
        options: { avoid_features: [] },
        instructions: true,
      };

      fetch(
        "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjIwNzBmZGY4NjViZDQ4NDk5MzViMTgzZGEyYTUyMWYyIiwiaCI6Im11cm11cjY0In0=",
          },
          body: JSON.stringify(body),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.features) return;
          const coords = data.features[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );

          const routeLine = L.polyline(coords, {
            color: "#0078FF",
            weight: 5,
            opacity: 0.9,
          }).addTo(map);

          map.fitBounds(routeLine.getBounds());

          const segment = data.features[0].properties.segments[0];
          const totalDistance = segment.distance;
          const steps = segment.steps;

          let distText =
            totalDistance >= 1000
              ? `${(totalDistance / 1000).toFixed(2)} km`
              : `${Math.round(totalDistance)} m`;

          const directionsList = steps.map((step: any) => {
            const distance = step.distance;
            const stepDist =
              distance >= 1000
                ? `${(distance / 1000).toFixed(2)} km`
                : `${Math.round(distance)} m`;
            return {
              text: `${step.instruction} in ${stepDist}`,
              distance: stepDist,
            };
          });

          setDirections({ totalDistance: distText, list: directionsList });
        })
        .catch((err) => console.error("ORS route error:", err));
    }
  }, [userLocation, selectedEvac]);

  const filtered = data.filter((evac) =>
    evac.name.toLowerCase().includes(search.toLowerCase())
  );

  const iconRed = new L.Icon({
    iconUrl: "/icons/gps.png",
    iconSize: [40, 40],
    iconAnchor: [17, 30],
    popupAnchor: [0, -30],
  });

  const riskIconMap: Record<string, string> = {
    Flood: "flood.png",
    Landslide: "landslide.png",
    FallenTree: "tree.png",
    RoadBlockage: "road-blockage.png",
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      {/* Filter Button */}
      <button
        id="filter-btn"
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-5 right-4 z-40 md:hidden"
      >
        <MdFilterList className="text-2xl text-light-black" />
      </button>

      {/* Toggle Show Risk Mapping */}
      <button
        onClick={() => setShowRiskMapping((prev) => !prev)}
        className="absolute top-[17%] md:top-auto md:left-auto md:right-4 md:bottom-18 left-2.5 z-40 rounded-full bg-white h-10 w-10  flex items-center text-xl justify-center shadow-md text-red-500 font-semibold hover:bg-gray-100 transition"
      >
        {showRiskMapping ? <IoClose /> : <AiFillWarning />}
      </button>

      {/* Desktop floating filters */}
      <div className="hidden md:flex  gap-2 absolute top-22 left-5 z-40 rounded-full bg-white shadow-md py-2 px-4">
        {(["plenty", "almost", "full"] as const).map((status) => {
          const active = filterStates[status];
          const label =
            status === "plenty"
              ? "Plenty of Space"
              : status === "almost"
                ? "Almost Full"
                : "Full";
          return (
            <button
              key={status}
              onClick={() => toggleFilter(status)}
              className={`flex items-center gap-2 rounded-full border px-4 shadow py-1 text-[10px] transition ${active ? " border-blue-400 text-dark-blue " : "bg-white border-gray-300 text-gray-600"}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${status === "plenty" ? "bg-green-500" : status === "almost" ? "bg-yellow-500" : "bg-red-500"}`}
              ></div>
              {label}
            </button>
          );
        })}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-16 right-3 z-40 md:hidden flex w-[170px] flex-col gap-2 rounded-lg bg-white p-3 shadow-md"
        >
          <h3 className="mb-1 text-[11px] ml-2  text-gray-600">
            Filter by status:
          </h3>
          {(["plenty", "almost", "full"] as const).map((status) => {
            const active = filterStates[status];
            const label =
              status === "plenty"
                ? "Plenty of Space"
                : status === "almost"
                  ? "Almost Full"
                  : "Full";
            return (
              <button
                key={status}
                onClick={() => toggleFilter(status)}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[10px] transition ${active ? " border-blue-400 text-dark-blue " : "bg-gray-100 border-gray-300 text-gray-600"}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${status === "plenty" ? "bg-green-500" : status === "almost" ? "bg-yellow-500" : "bg-red-500"}`}
                ></div>
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Box */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 z-40 flex w-[70%] max-w-[700px] md:top-24 flex-col gap-1">
        <div className="relative">
          <TbMapPinSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-500" />
          <input
            type="text"
            placeholder="Search evacuation center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border bg-white px-5 py-2.5 pl-10 text-[11px] text-black shadow outline-none"
          />
        </div>

        {search && (
          <div className="scrollBar max-h-[350px] overflow-auto rounded-md border bg-white shadow">
            {filtered.length > 0 ? (
              filtered.map((evac) => (
                <button
                  key={evac.id}
                  onClick={() => {
                    setFlyOnly(true);
                    setSelectedEvac(evac);
                  }}
                  className="block w-full truncate px-4 py-3 text-left text-sm text-black hover:bg-gray-100"
                >
                  <span className="flex items-center gap-3 w-full">
                    <LuMapPin className="text-sm text-gray-600" />
                    <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="truncate text-[11px]">{evac.name}</span>
                      <span className="truncate text-[9px] text-gray-500">
                        {evac.location}
                      </span>
                    </span>
                    {(() => {
                      const capacity = Number(evac.capacity);
                      const evacuees = Number(evac.current_evacuees);
                      const vacancy = capacity - evacuees;
                      const vacancyRate = capacity > 0 ? vacancy / capacity : 0;
                      const statusClass =
                        capacity === 0 || vacancy === 0
                          ? "bg-red-500"
                          : vacancyRate < 0.5
                            ? "bg-yellow-500"
                            : "bg-green-500";
                      return (
                        <div
                          className={`ml-auto h-2.5 w-2.5 rounded-full ${statusClass}`}
                        />
                      );
                    })()}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-[11px] text-gray-500">
                Evacuation center not found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show Directions toggle for mobile */}
      {isMobile && !mobileDirectionsVisible && directions && (
        <button
          onClick={() => setMobileDirectionsVisible(true)}
          className="absolute top-[30%] left-2.5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          title="Show Directions"
        >
          <PiNewspaperFill
            className="text-lg
           text-dark-blue"
          />
        </button>
      )}

      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[14.1709, 121.244]}
        zoom={14}
        minZoom={13}
        maxZoom={18}
        zoomSnap={1}
        zoomDelta={1}
        dragging={true}
        zoomControl={false}
        className="z-10 h-full w-full"
        maxBounds={[
          [14.135, 121.185],
          [14.23, 121.295],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {selectedEvac && (
          <FlyToEvac
            center={[Number(selectedEvac.lat), Number(selectedEvac.long)]}
          />
        )}

        {showRiskMapping &&
          riskMarkers.map((m) => {
            const isMobile =
              typeof window !== "undefined" && window.innerWidth < 768;
            const iconSize = isMobile ? 30 : 40;
            const iconUrl = riskIconMap[m.type] || "default.png";

            return (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={L.divIcon({
                  html: `
            <div class="flex flex-col items-center">
              <img src="/icons/${iconUrl}" class="w-5 h-5 md:w-9 md:h-9" />
              <span class="text-[10px] font-semibold text-gray-700 text-center px-1 whitespace-nowrap">
                ${m.type.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          `,
                  className: "",
                  iconSize: [iconSize, iconSize],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                })}
              >
                <Popup maxWidth={180} minWidth={120}>
                  <div className="flex flex-col">
                    <p className="text-center text-sm font-semibold whitespace-nowrap">
                      {m.type.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    {m.address && (
                      <p className="mt-1 text-center text-xs text-gray-600">
                        {m.address}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        <LocateButton mapRef={mapRef} userLocation={userLocation} />

        {data
          .filter((evac) => {
            const capacity = Number(evac.capacity);
            const evacuees = Number(evac.current_evacuees);
            const vacancy = capacity - evacuees;
            const vacancyRate = capacity > 0 ? vacancy / capacity : 0;
            let status: "plenty" | "almost" | "full";
            if (vacancy === 0) status = "full";
            else if (vacancyRate < 0.5) status = "almost";
            else status = "plenty";
            return filterStates[status];
          })
          .map((evac) => (
            <Marker
              key={evac.id}
              position={[Number(evac.lat), Number(evac.long)]}
              icon={iconRed}
            >
              {userLocation && (
                <>
                  <Circle
                    center={userLocation}
                    radius={30}
                    pathOptions={{
                      color: "#1E90FF",
                      fillColor: "#1E90FF",
                      fillOpacity: 0.15,
                      weight: 0,
                    }}
                  />
                  <CircleMarker
                    center={userLocation}
                    radius={7}
                    pathOptions={{
                      color: "#ffffff",
                      fillColor: "#1E90FF",
                      fillOpacity: 1,
                      weight: 2,
                    }}
                  >
                    <Popup>You are here</Popup>
                  </CircleMarker>
                </>
              )}

              <Popup>
                <div className="w-max pr-2 text-sm">
                  <div className="my-4 flex items-center gap-2">
                    {(() => {
                      const capacity = Number(evac.capacity);
                      const evacuees = Number(evac.current_evacuees);
                      const vacancy = capacity - evacuees;
                      const vacancyRate = capacity > 0 ? vacancy / capacity : 0;
                      const statusClass =
                        capacity === 0 || vacancy === 0
                          ? "bg-red-500"
                          : vacancyRate < 0.5
                            ? "bg-yellow-500"
                            : "bg-green-500";
                      const statusLabel =
                        capacity === 0 || vacancy === 0
                          ? "Full"
                          : vacancyRate < 0.5
                            ? "Almost Full"
                            : "Plenty of Space";
                      return (
                        <>
                          <div
                            className={`h-3 w-3 rounded-full ${statusClass}`}
                          />
                          <span className="text-xs font-semibold">
                            {statusLabel}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                  <h3 className="max-w-[250px] font-semibold">{evac.name}</h3>

                  <p className="text-xs">
                    Vacancy:{" "}
                    <span className="ml-2 font-bold">
                      {Number(evac.capacity) - Number(evac.current_evacuees)}
                    </span>
                  </p>
                </div>
              </Popup>

              {/* Close route button */}
              {directions && (
                <button
                  onClick={() => {
                    setDirections(null);
                    setSelectedEvac(null);
                    const map = mapRef.current;
                    if (map) {
                      map.eachLayer((layer: any) => {
                        if (
                          layer instanceof L.Polyline &&
                          !(layer instanceof L.Marker)
                        ) {
                          map.removeLayer(layer);
                        }
                      });
                    }
                  }}
                  className={`absolute z-[1000] flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition
      ${isMobile ? "top-[24%] left-3" : "bottom-[18%] right-5"}`}
                >
                  <IoClose className="text-lg" />
                </button>
              )}

              {/* Directions Panel */}
              {directions && (!isMobile || mobileDirectionsVisible) && (
                <div
                  className={`absolute z-[1000] pointer-events-auto 
                ${
                  isMobile
                    ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]"
                    : "top-1/2 left-5 -translate-y-1/2 w-max"
                }`}
                >
                  <div className="relative overflow-auto rounded-lg bg-white/90 p-3 text-sm shadow-md backdrop-blur font-[Poppins]">
                    {isMobile && (
                      <button
                        onClick={() => setMobileDirectionsVisible(false)}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-red-500"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    )}

                    <h3 className="mb-1 text-sm font-semibold text-blue-700">
                      Directions
                    </h3>
                    <p className="mb-2 text-xs text-gray-600">
                      Distance to destination:{" "}
                      <span className="font-semibold text-gray-800">
                        {directions.totalDistance}
                      </span>
                    </p>
                    <ol className="list-decimal space-y-2 pl-4">
                      {directions.list.map((dir, i) => (
                        <li
                          key={i}
                          className="text-gray-800 text-xs leading-snug"
                        >
                          {dir.text}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </Marker>
          ))}
      </MapContainer>
    </>
  );
}
