"use client";

import Image from "next/image";

import DateTimeDisplay from "../DateConvertion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface WeatherCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  addedBy: string;
  onViewDetails: () => void;
}

interface CommunityCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  addedBy: string;
  onViewDetails: () => void;
}

interface RoadCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  status: string;
  addedBy: string;
  onViewDetails: () => void;
}

interface DisasterCardsProps {
  id: string | number;
  image?: string;
  title: string;
  desc: string;
  disasterType: string;
  dateTime: string;
  addedBy: string;
  currentUser?: string;
  onViewDetails: () => void;
}

export const WeatherCards = ({
  id,
  title,
  desc,
  dateTime,
  addedBy,
  onViewDetails,
}: WeatherCardsProps) => {
  return (
    <Card className="border-dark-blue/50 relative flex md:h-[280px] h-[250px] max-w-[350px] transition-all duration-300 hover:z-10 hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3 text-xs md:text-base">
          {title}
        </CardTitle>
        <CardDescription className="md:text-xs text-[10px] text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
      </CardHeader>

      <CardContent className="justify-self-end">
        <p className="line-clamp-5 md:text-sm text-xs leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-500">
          <Image
            src={`/logos/${
              addedBy
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes("municipal of los banos")
                ? "lb-logo.png"
                : addedBy
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-") + "-logo.png"
            }`}
            alt={`${addedBy} logo`}
            width={40}
            height={40}
            className="h-6 w-6 object-contain"
          />
        </span>
        <button
          onClick={onViewDetails}
          className="text-dark-blue md:text-sm text-[11px]"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
};

export const CommunityCards = ({
  id,
  title,
  desc,
  dateTime,
  addedBy,
  onViewDetails,
}: CommunityCardsProps) => {
  return (
    <Card className="border-dark-blue/50 relative flex md:h-[280px] h-[250px] max-w-[350px] transition-all duration-300 hover:z-10 hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3 text-xs md:text-base">
          {title}
        </CardTitle>
        <CardDescription className="md:text-xs text-[10px] text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
      </CardHeader>

      <CardContent className="justify-self-end">
        <p className="line-clamp-5 md:text-sm text-xs leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-500">
          <Image
            src={`/logos/${
              addedBy
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes("municipal of los banos")
                ? "lb-logo.png"
                : addedBy
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-") + "-logo.png"
            }`}
            alt={`${addedBy} logo`}
            width={40}
            height={40}
            className="h-6 w-6 object-contain"
          />
        </span>
        <button
          onClick={onViewDetails}
          className="text-dark-blue md:text-sm text-[11px]"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
};

export const RoadCards = ({
  id,
  title,
  desc,
  dateTime,
  status,
  addedBy,
  onViewDetails,
}: RoadCardsProps) => {
  return (
    <Card className="border-dark-blue/50 relative flex md:h-[280px] h-[250px] max-w-[350px] transition-all duration-300 hover:z-10  hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3 md:text-base text-xs">
          {title}
        </CardTitle>
        <CardDescription className="md:text-xs text-[10px] text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
      </CardHeader>
      <CardContent className="justify-self-end">
        <p className="line-clamp-5 md:text-sm text-xs leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-1 ">
            <div className="flex items-center gap-1 ">
              <div
                className={`h-2 w-2 mb-[1.5px] md:mb-[0px] rounded-full bg-green-700 ${
                  status === "Open"
                    ? "bg-green-500"
                    : status === "Partially Open"
                      ? "bg-yellow-600"
                      : status === "Closed"
                        ? "bg-red-500"
                        : "bg-zinc-300"
                }`}
              ></div>
              <p
                className={`text-[11px]  ${
                  status === "Open"
                    ? "text-green-500"
                    : status === "Partially Open"
                      ? "text-yellow-600"
                      : status === "Closed"
                        ? "text-red-500"
                        : "text-zinc-300"
                }`}
              >
                {status}
              </p>
            </div>
            <span className="ml-2 text-xs text-gray-800 dark:text-gray-500">
              <Image
                src={`/logos/${
                  addedBy
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes("municipal of los banos")
                    ? "lb-logo.png"
                    : addedBy
                        ?.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-") + "-logo.png"
                }`}
                alt={`${addedBy} logo`}
                width={30}
                height={30}
                className="h-5 w-5 object-contain"
              />
            </span>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-dark-blue md:text-sm text-[11px]"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
};

export default function DisasterCards({
  id,
  title,
  desc,
  dateTime,
  addedBy,
  image,
  disasterType,
  onViewDetails,
}: DisasterCardsProps) {
  return (
    <Card
      className="border-dark-blue/50 relative flex h-[280px] md:h-[300px] max-w-[350px] 
      transition-all duration-300 hover:z-10  hover:shadow-lg
      dark:border-gray-500/40 dark:bg-transparent"
    >
      <CardHeader>
        <div className="flex gap-3 w-full overflow-hidden">
          <div className="relative shrink-0 h-14 w-14 overflow-hidden rounded-md bg-transparent">
            <Image
              src={
                image
                  ? `https://greenyellow-lion-623632.hostingersite.com/${image}`
                  : "/icons/default.png"
              }
              fill
              alt=""
              className="object-cover object-center"
            />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="truncate md:text-base text-xs">
              {title}
            </CardTitle>

            {disasterType && (
              <CardDescription className="text-dark-blue mt-1 text-xs truncate">
                {disasterType}
              </CardDescription>
            )}

            <CardDescription className="mt-1 text-[8px] md:text-[10px] text-gray-800 dark:text-gray-500 truncate">
              <DateTimeDisplay value={dateTime} />
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-5 text-xs md:text-sm leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between">
        {/* Added by */}
        <span className="flex items-center gap-2 text-[10px] md:text-xs text-gray-800 dark:text-gray-500">
          <Image
            src={`/logos/${
              addedBy
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes("municipal of los banos")
                ? "lb-logo.png"
                : addedBy
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-") + "-logo.png"
            }`}
            alt={`${addedBy} logo`}
            width={18}
            height={18}
            className="h-6 w-6 object-contain"
          />
        </span>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="text-dark-blue text-[11px] md:text-sm "
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
}

export const WeatherCardDetail = ({
  id,
  title,
  desc,
  dateTime,
  addedBy,
  onViewDetails,
}: WeatherCardsProps) => {
  return (
    <Card className="border-dark-blue/50 relative flex md:h-[280px] h-[250px] max-w-[350px] transition-all duration-300 hover:z-10 hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3 text-xs md:text-base">
          {title}
        </CardTitle>
        <CardDescription className="md:text-xs text-[10px] text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
      </CardHeader>

      <CardContent className="justify-self-end">
        <p className="line-clamp-5 md:text-sm text-xs leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-500">
          <Image
            src={`/logos/${
              addedBy
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes("municipal of los banos")
                ? "lb-logo.png"
                : addedBy
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-") + "-logo.png"
            }`}
            alt={`${addedBy} logo`}
            width={40}
            height={40}
            className="h-6 w-6 object-contain"
          />
        </span>
        <button
          onClick={onViewDetails}
          className="text-dark-blue md:text-sm text-xs"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
};
