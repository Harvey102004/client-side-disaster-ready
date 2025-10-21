import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

import Image from "next/image";

interface EvacuationProps {
  id?: string | number;
  name: string;
  location: string;
  capacity: string | number;
  current_evacuees?: string | number;
  barangay?: string;
  contact_person?: string;
  contact_number?: string;
  lat?: string;
  long?: string;
  status?: string;
  onClickDirections?: () => void;
  onViewDetails?: () => void;
}

export const EvacuationCards = ({
  id,
  name,
  location,
  capacity,
  barangay,
  current_evacuees = 0,
  lat,
  long,
  onClickDirections,
  onViewDetails,
}: EvacuationProps) => {
  const cap = Number(capacity);
  const evac = Number(current_evacuees);
  const vacancy = cap - evac;
  const vacancyRate = cap > 0 ? (vacancy / cap) * 100 : 0;

  let statusLabel = "";
  let statusColor = "";

  if (cap === 0) {
    statusLabel = "No capacity data";
    statusColor = "bg-gray-400";
  } else if (vacancy === 0) {
    statusLabel = "Not Available (Full)";
    statusColor = "bg-red-600";
  } else if (vacancyRate < 50) {
    statusLabel = "Almost full";
    statusColor = "bg-yellow-400";
  } else {
    statusLabel = "Plenty of space";
    statusColor = "bg-green-500";
  }

  const percentFull = cap > 0 ? (evac / cap) * 100 : 0;

  const getLogoFile = (barangay?: string) => {
    if (!barangay) return "default-logo.png";

    const normalized = barangay
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accent (ñ -> n)
      .trim();

    let filename = "";

    if (normalized === "municipality of los banos") {
      filename = "anos-logo.png";
    } else {
      filename = `${normalized.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-logo.png`;
    }

    // 🔍 Debug logs
    console.log("Barangay raw:", barangay);
    console.log("Normalized:", normalized);
    console.log("Final filename:", filename);

    return filename;
  };

  return (
    <Card className="rounded-xl relative shadow-sm border md:max-w-[400px] dark:bg-light-black border-gray-200 dark:border-gray-600 hover:shadow-md transition">
      <div className="absolute h-8 w-8  top-5 right-3">
        <Image
          src={`/logos/${(() => {
            if (
              barangay
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim() === "municipality of los banos"
            ) {
              return "lb-logo.png";
            }

            return `${barangay
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")}-logo.png`;
          })()}`}
          fill
          alt={barangay ?? ""}
          className="object-cover object-center"
        />
      </div>

      <CardContent className="space-y-3">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-800 dark:text-zinc-300 max-w-[85%] truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-[11px]  text-gray-500 dark:text-gray-400">
            <MapPin size={11} />
            <p className="max-w-[80%] truncate ">{location}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${statusColor} h-2 rounded-full transition-all`}
              style={{ width: `${percentFull}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {percentFull.toFixed(0)}% full • {statusLabel}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-[10px] py-1 px-3 rounded-full h-auto"
            onClick={() => onViewDetails?.()}
          >
            View Details
          </Button>
          <Button
            onClick={onClickDirections}
            className="text-[10px] py-1 shadow px-3 rounded-full h-auto hover:opacity-80 hover:bg-dark-blue bg-blue-600 text-white"
          >
            View Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
