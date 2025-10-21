"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface EvacDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlyTo?: (lat: number, long: number) => void;
  evac: {
    id?: string | number;
    name?: string;
    location?: string;
    capacity?: string | number;
    current_evacuees?: string | number;
    contact_person?: string;
    contact_number?: string;
    created_by?: string;
    lat?: string | number;
    long?: string | number;
  } | null;
}

export const EvacDetailsModal = ({
  isOpen,
  onClose,
  onFlyTo,
  evac,
}: EvacDetailsModalProps) => {
  if (!evac) return null;

  const capacity = Number(evac.capacity) || 0;
  const evacuees = Number(evac.current_evacuees) || 0;
  const vacancy = Math.max(capacity - evacuees, 0);
  const percentFull = capacity > 0 ? (evacuees / capacity) * 100 : 0;

  let statusLabel = "";
  let statusColor = "";

  if (capacity === 0) {
    statusLabel = "No capacity data";
    statusColor = "bg-gray-400";
  } else if (vacancy === 0) {
    statusLabel = "Not Available (Full)";
    statusColor = "bg-red-600";
  } else if (percentFull >= 70) {
    statusLabel = "Almost full";
    statusColor = "bg-yellow-400";
  } else {
    statusLabel = "Plenty of space";
    statusColor = "bg-green-500";
  }

  const createdBy = evac.created_by ?? "";
  const barangayRaw = createdBy.split(",").pop()?.trim() ?? "";
  const normalized = barangayRaw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  let logoFile = "default-logo.png";
  if (/municipality\s+of\s+los\s*baños/i.test(createdBy)) {
    logoFile = "lb-logo.png";
  } else if (normalized) {
    logoFile = `${normalized}-logo.png`;
  }

  const handleViewInMap = () => {
    if (onFlyTo && evac.lat && evac.long) {
      onFlyTo(Number(evac.lat), Number(evac.long));
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] w-[90%] rounded-xl">
        <DialogHeader>
          <div className="flex items-center md:gap-3 gap-2 ">
            <div className="relative shrink-0 h-10 w-10">
              <Image
                src={`/logos/${logoFile}`}
                alt={`${barangayRaw || "barangay"} logo`}
                fill
                className="object-cover object-center rounded-full"
              />
            </div>

            <div className=" w-full">
              <DialogTitle className="md:text-lg text-start w-[87%]   text-xs font-semibold">
                {evac.name}
              </DialogTitle>
              <DialogDescription className="md:text-sm text-start text-[10px] text-gray-500">
                Evacuation center details{" "}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-3" />

        {/* DETAILS */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin size={14} className="text-gray-500 shrink-0" />
            <p className="text-xs md:text-sm">
              {evac.location ?? "No location provided"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`${statusColor} h-2 transition-all`}
                style={{ width: `${percentFull}%` }}
              />
            </div>
            <p className="md:text-xs text-gray-500 dark:text-gray-400 text-[10px]">
              {percentFull.toFixed(0)}% full • {statusLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4  mt-8">
            <div>
              <p className="text-gray-500 text-xs md:text:sm ">Capacity</p>
              <p className=" mt-2 md:text-sm text-xs">{capacity || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 md:text-sm text-xs">Status</p>
              <p className="mt-1 md:text-sm text-xs capitalize">
                {statusLabel}
              </p>
            </div>
            <div>
              <p className="text-gray-500 md:text-sm text-xs">Evacuees</p>
              <p className="mt-1 md:text-sm text-xs">{evacuees || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500 md:text-sm text-xs">Contact Person</p>
              <p className="mt-1 md:text-sm text-xs">
                {evac.contact_person ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 md:text-sm text-xs">Vacancy</p>
              <p className="mt-1 md:text-sm text-xs">
                {vacancy > 0 ? vacancy : "Full"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 md:text-sm text-xs">Contact Number</p>
              <p className="mt-1 md:text-sm text-xs">
                {evac.contact_number ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            onClick={handleViewInMap}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
