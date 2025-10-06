"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getBarangayContact } from "@/server/barangayinfo";
import { MdOutlineOpenInNew } from "react-icons/md";
import { brgyContactType } from "@/server/barangayinfo";
import { FaRegFolderOpen } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { RiCloseFill } from "react-icons/ri";
import dynamic from "next/dynamic";

const MapDetails = dynamic(
  () => import("@/app/components/maps/contact-map-details"),
  {
    ssr: false,
  }
);

interface ContactPopUpProps {
  id: number | string;
  onclose: () => void;
}

const ContactPopUp = ({ id, onclose }: ContactPopUpProps) => {
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["barangayContacts"],
    queryFn: getBarangayContact,
  });

  const selectedContact = data?.find(
    (contact: any) => String(contact.id) === String(id)
  );

  console.log(selectedContact);

  const lat = Number(selectedContact?.lat);
  const lng = Number(selectedContact?.long);

  const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  if (isLoading) {
    return (
      <div
        className="fixed  inset-0 z-50 flex items-center justify-center bg-black
      "
      >
        <h1>Loading... Please wait</h1>
      </div>
    );
  }

  return (
    <div
      onClick={onclose}
      className="fixed  inset-0 z-50 flex items-center justify-center backdrop-blur-xs  bg-black/40  back
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background h-3/4 md:max-h-[500px] shadow-2xl dark:bg-light-black  max-h-[430px] w-[90%] max-w-[700px] rounded-lg  relative overflow-hidden"
      >
        {/* FULLSCREEN WITHIN POPUP */}
        {hasValidCoords && isFullMapOpen && (
          <div className="absolute inset-0 z-50 bg-background rounded-lg shadow-lg">
            <button
              onClick={() => setIsFullMapOpen(false)}
              className="absolute top-3 right-3 z-40 text-black bg-white rounded-full p-1 hover:bg-gray-200 transition"
            >
              <RiCloseFill size={15} />
            </button>
            <MapDetails
              lat={lat}
              lng={lng}
              name={selectedContact?.barangay_name}
            />
          </div>
        )}

        <div className="h-[30%] w-full relative">
          <MdOutlineZoomOutMap
            onClick={() => setIsFullMapOpen(true)}
            className="absolute bottom-3 md:text-2xl text-white left-4 z-45"
          />
          <button
            onClick={onclose}
            className="absolute top-3 right-3 flex items-center justify-center z-45 text-black bg-white rounded-full p-1 hover:bg-gray-200 transition"
          >
            <RiCloseFill size={15} />
          </button>

          {hasValidCoords ? (
            <MapDetails
              lat={lat}
              lng={lng}
              name={selectedContact?.barangay_name}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              ⚠️ Location data not available
            </div>
          )}

          {/* Fade overlay  */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-40 h-full w-full bg-gradient-to-t from-black/60 to-transparent" />

          <Image
            src={`/logos/${selectedContact?.barangay_name
              ?.toLowerCase()
              .replace(/\s+/g, "-")}-logo.png`}
            height={90}
            width={90}
            alt={selectedContact?.barangay_name}
            className="mb-3 drop-shadow-md z-40 absolute left-1/2 -translate-x-1/2 -bottom-14 transition-all duration-500 group-hover:scale-90"
          />
        </div>

        <div className="mt-14">
          <p className="text-xs pb-3 border-b md:text-sm lg:text-base">
            {selectedContact?.barangay_name
              ?.split("-")
              .map(
                (word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // capitalize
              )
              .join(" ")}{" "}
          </p>
        </div>

        <div className="flex  justify-between items-centerf gap-5 px-5 mt-5">
          <div className="flex flex-col gap-7  w-1/2 ">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div>
                <p className="  text-xs md:text-sm lg:text-base">
                  {selectedContact?.captain_name}
                </p>
                <p className="text-[10px] pt-1"> Captain</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <div>
                <p className="  text-xs md:text-sm lg:text-base">
                  {selectedContact?.contact_number}
                </p>
                <p className="text-[10px] pt-1"> Contact</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center ">
              <div className="w-full">
                <a
                  href={`mailto:${selectedContact?.email}`}
                  title={selectedContact?.email}
                >
                  <p className="  text-[10px] w-full pl-3 md:text-sm lg:text-base overflow-hidden truncate text-dark-blue">
                    {selectedContact?.email}
                  </p>
                </a>
                <p className="text-[10px] pt-1">Email</p>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-7  ">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div>
                <p className="text-xs md:text-sm lg:text-base">
                  {selectedContact?.secretary_name}
                </p>
                <p className="text-[10px] pt-1"> Secretary</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <div>
                <p className="text-xs md:text-sm lg:text-base">
                  {selectedContact?.landline}
                </p>
                <p className="text-[10px] pt-1"> Landline</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="">
                <a
                  href={`${selectedContact?.facebook_page}`}
                  title={selectedContact?.facebook_page}
                >
                  <p className="  text-[11px] w-full truncate text-dark-blue md:text-sm lg:text-base overflow-hidden">
                    Facebook Page
                  </p>
                </a>
                <p className="text-[10px] pt-1"> Facebook</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EmergencyResources() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [barangayId, setBarangayId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["barangayContacts"],
    queryFn: getBarangayContact,
  });

  const sortedData =
    data
      ?.slice()
      .sort((a: brgyContactType, b: brgyContactType) =>
        a.barangay_name.localeCompare(b.barangay_name)
      ) ?? [];

  useEffect(() => {
    if (isInfoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isInfoOpen]);

  return (
    <div className="">
      <div className="text-center flex flex-col gap-3 md:gap-5 p-5 md:mt-10">
        <h1 className="text-sm md:text-lg lg:text-xl font-bold">
          Barangay Emergency Resources
        </h1>
        <p className="text-xs md:text-sm lg:text-base max-w-[700px] mx-auto  leading-relaxed tracking-normal">
          In case of emergencies, contact the appropriate authorities
          immediately. Below are the important emergency hotlines available for
          assistance:
        </p>

        <div className="flex flex-col gap-8 mt-10 md:gap-16 md:mt-20 md:grid md:grid-cols-3  place-items-center relative">
          {isLoading && (
            <p className="text-xs text-center   absolute top-1/2 -translate-1/2 left-1/2  text-black dark:text-white  rounded-md">
              Loading... Please wait.
            </p>
          )}

          {!isLoading && sortedData.length === 0 && (
            <p className="text-xs md:text-base text-gray-500 flex flex-col gap-3 items-center justify-center mt-10">
              <FaRegFolderOpen className="text-3xl md:text-5xl" />
              No contact information available.
            </p>
          )}

          {sortedData.map((brgy: brgyContactType) => {
            const logoFileName = `${brgy.barangay_name
              .toLowerCase()
              .replace(/\s+/g, "-")}-logo.png`;

            return (
              <div
                key={brgy.barangay_name}
                className="w-[90%] md:max-w-[350px] cursor-pointer"
                onClick={() => {
                  setBarangayId(brgy.id.toString());
                  setIsInfoOpen(true);
                }}
              >
                <div className="relative">
                  <div className="absolute h-16 w-16 md:h-20 md:w-20 top-1/2 -translate-y-1/2">
                    <Image
                      src={`/logos/${logoFileName}`}
                      alt={brgy.barangay_name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>

                  <div className="h-13 w-full ml-2 md:h-14 shadow-xl rounded-full flex items-center bg-white dark:bg-light-black">
                    <div className="h-[85%] w-[85%] bg-dark-blue pl-7 rounded-full flex items-center justify-center">
                      <p className="text-[10px] md:text-xs text-white font-bold md:font-semibold">
                        Barangay{" "}
                        {brgy.barangay_name
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")}{" "}
                      </p>
                    </div>

                    <MdOutlineOpenInNew className="absolute top-1/2 -translate-y-1/2 right-2 text-sm" />
                  </div>
                </div>
              </div>
            );
          })}

          {isInfoOpen && (
            <ContactPopUp
              id={barangayId as string}
              onclose={() => setIsInfoOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
