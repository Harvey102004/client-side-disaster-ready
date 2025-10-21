"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo } from "react";
import { EvacuationCards } from "@/app/components/cards/evacuations";
import { EvacDetailsModal } from "@/app/components/modals/evac-details-modal";

const EvacuationListView = dynamic(
  () => import("../../components/maps/evac-map-list"),
  {
    ssr: false,
  }
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getEvacuationCenters } from "@/server/evacuation";
import { EvacuationCenterProps } from "../../../../types";

export default function Page() {
  // =========================
  // 📱 Bottom Sheet Setup
  // =========================
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const translateY = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<"collapsed" | "mid" | "full">(
    "collapsed"
  );
  const [screenHeight, setScreenHeight] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [selectedEvac, setSelectedEvac] =
    useState<EvacuationCenterProps | null>(null);

  const [selectedEvacForDetails, setSelectedEvacForDetails] =
    useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
    setIsDesktop(window.innerWidth >= 768);
    setHydrated(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const heights = {
    collapsed: isDesktop ? screenHeight * 0.19 : screenHeight * 0.17,
    mid: screenHeight * 0.55,
    full: screenHeight * 0.9,
  };

  const setSheetPosition = (height: number) => {
    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transform = `translateY(${screenHeight - height}px)`;
    }
  };

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hydrated) setSheetPosition(heights.collapsed);
  }, [hydrated, screenHeight]);

  const startDrag = (y: number) => {
    setIsDragging(true);
    startY.current = y;
  };

  const moveDrag = (y: number) => {
    if (!isDragging) return;
    currentY.current = y;
    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(() => {
        const delta = startY.current - currentY.current;
        const sheet = sheetRef.current;
        if (sheet) {
          const currentTranslate =
            screenHeight -
            (position === "collapsed"
              ? heights.collapsed
              : position === "mid"
                ? heights.mid
                : heights.full);
          const nextTranslate = Math.min(
            Math.max(currentTranslate - delta, screenHeight - heights.full),
            screenHeight - heights.collapsed
          );
          sheet.style.transition = "none";
          sheet.style.transform = `translateY(${nextTranslate}px)`;
          translateY.current = nextTranslate;
        }
        animationFrame.current = null;
      });
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const draggedHeight = screenHeight - translateY.current;
    const distances = [
      { name: "collapsed", value: heights.collapsed },
      { name: "mid", value: heights.mid },
      { name: "full", value: heights.full },
    ];

    const nearest = distances.reduce((prev, curr) =>
      Math.abs(curr.value - draggedHeight) <
      Math.abs(prev.value - draggedHeight)
        ? curr
        : prev
    );

    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transition = "transform 0.3s ease";
      setSheetPosition(nearest.value);
    }

    setPosition(nearest.name as "collapsed" | "mid" | "full");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientY);
    const handleTouchMove = (e: TouchEvent) => moveDrag(e.touches[0].clientY);
    const handleMouseUp = () => endDrag();
    const handleTouchEnd = () => endDrag();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  // =========================
  // 📦 Data Fetching
  // =========================
  const { data, isLoading, error } = useQuery({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  // =========================
  // 🧩 Filters Setup
  // =========================
  const filterBtns = [
    { name: "Nearest Evacuations" },
    { name: "Plenty of space" },
    { name: "Almost Full" },
    { name: "Full" },
  ];

  const allBrgy = [
    { name: "All Brgy", value: "all" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong-silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong-malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san-antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const resetSheet = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.transition = "transform 0.3s ease";
    setSheetPosition(heights.collapsed);
    setPosition("collapsed");
  };

  const [selectedBrgy, setSelectedBrgy] = useState("all");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [nearestActive, setNearestActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  // toggle multiple status filters
  const handleStatusFilter = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // barangay filter handler
  const handleBrgyFilter = (value: string) => {
    setSelectedBrgy(value);
  };

  // =========================
  // 📍 Get user location
  // =========================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => console.log("Location error:", error)
      );
    }
  }, []);

  // =========================
  // 🔍 Filter Logic
  // =========================
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter logic
  const filteredData = useMemo(() => {
    if (!data) return [];

    let results = data.filter((evac) => {
      const barangay =
        evac.created_by?.split(",")[1]?.trim()?.toLowerCase() || "";
      const capacity = Number(evac.capacity);
      const evacuees = Number(evac.current_evacuees);
      const vacancy = capacity - evacuees;
      const vacancyRate = (vacancy / capacity) * 100;

      let status = "";
      if (capacity === 0) status = "No capacity data";
      else if (vacancy === 0) status = "Full";
      else if (vacancyRate < 50) status = "Almost Full";
      else status = "Plenty of space";

      const matchesBrgy =
        selectedBrgy === "all" || barangay === selectedBrgy.toLowerCase();
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(status);

      return matchesBrgy && matchesStatus;
    });

    if (nearestActive && userLocation) {
      const MAX_DISTANCE_KM = 2; // Around 2–3 km
      results = results
        .filter((evac) => evac.lat && evac.long) // only valid coords
        .map((evac) => ({
          ...evac,
          distance: Math.sqrt(
            (Number(evac.lat) - userLocation.lat) ** 2 +
              (Number(evac.long) - userLocation.long) ** 2
          ),
        }))
        .filter((evac) => evac.distance <= MAX_DISTANCE_KM / 111) // rough km to deg
        .map(({ distance, ...evac }) => evac); // remove distance after filter
    }

    return results;
  }, [data, selectedBrgy, selectedStatuses, nearestActive, userLocation]);

  // =========================
  // 🧱 Render
  // =========================
  if (!hydrated)
    return (
      <EvacuationListView
        selectedEvac={selectedEvac}
        setSelectedEvac={setSelectedEvac}
      />
    );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <EvacuationListView
        selectedEvac={selectedEvac}
        setSelectedEvac={setSelectedEvac}
      />

      <div
        ref={sheetRef}
        className="absolute left-0 top-0 z-40 md:rounded-t-4xl h-screen w-full md:w-[80%] md:left-1/2 md:top-24 md:-translate-x-1/2 rounded-t-2xl bg-background shadow-2xl"
        style={{
          transform: `translateY(${screenHeight - heights.collapsed}px)`,
          transition: "transform 0.3s ease",
          touchAction: "none",
        }}
      >
        {/* drag handle */}
        <div
          onMouseDown={(e) => startDrag(e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          className="flex cursor-grab justify-center py-3 active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* content */}
        <div className="h-10 w-full">
          <h2 className="text-center text-sm md:text-base mt-4 font-semibold">
            Evacuation Centers
          </h2>

          {/* Filters */}
          <div className="h-10 w-full px-5 mt-5 flex items-center md:mx-auto md:w-max overflow-x-auto gap-2 md:gap-3 scrollbar-hide">
            {/* Barangay dropdown */}
            <Select defaultValue="all" onValueChange={handleBrgyFilter}>
              <SelectTrigger className="text-[10px] md:text-xs bg-gray-100 border dark:bg-light-black border-gray-300/50 dark:text-zinc-300 text-gray-600 py-2 px-4 rounded-full h-auto w-fit">
                <SelectValue placeholder="Select Barangay" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-light-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                {allBrgy.map((brgy) => (
                  <SelectItem
                    key={brgy.value}
                    value={brgy.value}
                    className="text-gray-600 dark:text-zinc-300 text-[10px] md:text-xs cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  >
                    {brgy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status buttons (including Nearest) */}
            {filterBtns.map((btn) => (
              <button
                key={btn.name}
                onClick={() =>
                  btn.name === "Nearest Evacuations"
                    ? setNearestActive((prev) => !prev)
                    : handleStatusFilter(btn.name)
                }
                className={`text-[10px] md:text-xs text-nowrap border py-2 px-4 rounded-full transition ${
                  (btn.name === "Nearest Evacuations" && nearestActive) ||
                  selectedStatuses.includes(btn.name)
                    ? "border-blue-500 text-dark-blue bg-blue-50 dark:bg-light-black"
                    : "border-gray-300/50 text-gray-600 hover:border-dark-blue hover:text-dark-blue transition-colors duration-300 dark:text-zinc-300 bg-gray-100 dark:bg-light-black"
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>

          {/* Evacuation list */}
          <div
            className="mt-5 px-4 md:px-8 pb-32 scrollBar space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] 
                md:mt-8 md:grid md:grid-cols-4 md:gap-4 md:space-y-0"
          >
            {filteredData.length > 0 ? (
              filteredData.map((evac) => (
                <EvacuationCards
                  key={evac.id}
                  id={evac.id}
                  name={evac.name}
                  location={evac.location}
                  capacity={evac.capacity}
                  current_evacuees={evac.current_evacuees}
                  barangay={evac.created_by?.split(",")[1]?.trim()}
                  onClickDirections={() => {
                    if (evac.lat && evac.long) {
                      setSelectedEvac({
                        ...evac,
                        lat: Number(evac.lat),
                        long: Number(evac.long),
                      });

                      resetSheet();
                    } else {
                      alert("This evacuation center has no coordinates.");
                    }
                  }}
                  onViewDetails={() => {
                    setSelectedEvacForDetails(evac);
                    setIsDetailsOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="absolute top-1/2 left-1/2 -translate-1/2 text-xs text-gray-500">
                No evacuations found.
              </p>
            )}
          </div>
        </div>
      </div>

      <EvacDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        evac={selectedEvacForDetails || {}}
      />
    </div>
  );
}
