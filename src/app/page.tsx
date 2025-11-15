"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { FaCloud, FaRoad, FaEarthAmericas, FaUsers } from "react-icons/fa6";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  getWeather,
  getRoad,
  getCommunity,
  getDisaster,
  getWeatherDetails,
  getRoadDetails,
  getCommunityDetails,
  getDisasterDetails,
} from "@/server/advisories";

import DisasterCards, {
  CommunityCards,
  RoadCards,
  WeatherCards,
} from "./components/cards/AdvisoryCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import DateTimeDisplay from "./components/DateConvertion";
import { IoClose } from "react-icons/io5";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedWeatherId, setSelectedWeatherId] = useState<string | null>(
    null
  );
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(
    null
  );

  const [advisoriesModal, setAdvisoriesModal] = useState({
    weather: false,
    road: false,
    disaster: false,
    community: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["allAdvisories"],
    queryFn: async () => {
      const [weather, road, disaster, community] = await Promise.all([
        getWeather(),
        getRoad(),
        getDisaster(),
        getCommunity(),
      ]);

      return {
        weather,
        road,
        disaster,
        community,
      };
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: weatherDetails, isLoading: isWeatherDetailsLoading } = useQuery(
    {
      queryKey: ["weatherDetails", selectedWeatherId],
      queryFn: () => getWeatherDetails({ id: selectedWeatherId as string }),
      enabled: !!selectedWeatherId,
    }
  );

  const { data: roadDetails, isLoading: isRoadDetailsLoading } = useQuery({
    queryKey: ["roadDetails", selectedRoadId],
    queryFn: () => getRoadDetails({ id: selectedRoadId as string }),
    enabled: !!selectedRoadId,
  });

  const { data: communityDetails, isLoading: isCommunityDetailsLoading } =
    useQuery({
      queryKey: ["communityDetails", selectedCommunityId],
      queryFn: () => getCommunityDetails({ id: selectedCommunityId as string }),
      enabled: !!selectedCommunityId,
    });

  const { data: disasterDetails, isLoading: isDisasterDetailsLoading } =
    useQuery({
      queryKey: ["disasterDetails", selectedDisasterId],
      queryFn: () => getDisasterDetails({ id: selectedDisasterId as string }),
      enabled: !!selectedDisasterId,
    });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    arrows: false,
  };

  useEffect(() => {
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "";
    setIsMobile(/Mobi|Android/i.test(userAgent));
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      toast.error("This feature is only accessible on mobile browsers");
    }
  };

  return (
    <div className="flex flex-col items-center overflow-x-hidden gap-16 ">
      {/* HERO SECTION */}
      <div className="relative w-[100vw]  md:h-[90vh] h-[75vh] ">
        <Slider {...settings}>
          {data?.disaster && data?.disaster.length > 0 ? (
            data?.disaster.map((disaster) => {
              const imageUrl = `https://greenyellow-lion-623632.hostingersite.com/${disaster.img_path}`;
              return (
                <div
                  key={disaster.id}
                  className="relative md:h-[90vh] h-[75vh] w-full"
                >
                  <img
                    src={imageUrl}
                    alt={disaster.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-20 z-50 w-full  md:px-20 pr-5 pl-7 text-zinc-200 text-justify">
                    <p className="font-bold md:text-3xl text-sm text-center">
                      {disaster.title}
                    </p>
                    <p className="mt-2 w-full md:text-base max-h-[200px] md:max-h-[250px] overflow-auto scrollBar pr-2 text-xs leading-normal tracking-wide">
                      {disaster.details}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 z-40"></div>
                </div>
              );
            })
          ) : (
            // Default fallback when disaster is empty
            <div className="relative w-[100vw]  md:h-[650px] h-[75vh] ">
              <img
                src="/images/lb-image.png"
                alt="Default"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 z-40"></div>
              <div className="md:h-[300px] h-[250px] w-[250px] md:w-[300px] absolute top-1/2 left-1/2 -translate-1/2 z-40">
                <Image
                  src={"/logos/lb-logo.png"}
                  alt="lb-logo"
                  fill
                  className="object-center object-cover"
                />
              </div>
            </div>
          )}
        </Slider>

        {data?.disaster && data?.disaster.length > 0 && isMobile && (
          <Link
            href="/donations"
            className="absolute bottom-5 z-40 -translate-x-1/2 left-1/2 text-[10px] md:text-sm mt-6 py-2 px-4 md:py-2.5 md:px-6 rounded-full shadow bg-dark-blue text-white"
          >
            Donate Now
          </Link>
        )}
      </div>

      <h2 className="text-sm md:text-xl font-bold">News & Updates</h2>

      {error && (
        <p className="text-red-500 text-sm">Failed to load advisories</p>
      )}

      {isLoading ? (
        <div className="flex flex-col md:gap-5 gap-4 items-center justify-center h-[300px]">
          <p className="text-sm md:text-base">Loading Advisories...</p>
          <div className="animate-spin rounded-full h-7 w-7 md:h-10 md:w-10 border-4 border-gray-300 border-t-dark-blue"></div>
        </div>
      ) : (
        <>
          {[
            {
              key: "weather",
              length: data?.weather?.length || 0,
              content: (
                <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
                  {data?.weather && data.weather.length > 0 && (
                    <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2 ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                      <FaCloud className="md:text-2xl text-lg" /> Weather
                      Advisories :
                    </h3>
                  )}

                  <div
                    className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                          lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
                  >
                    {data?.weather && data.weather.length > 0 ? (
                      data.weather.map((weather) => (
                        <div
                          key={weather.id}
                          className="flex-none w-[280px] snap-start lg:flex-auto lg:w-auto"
                        >
                          <WeatherCards
                            id={weather.id}
                            title={weather.title}
                            desc={weather.details}
                            dateTime={weather.date_time}
                            addedBy={weather.added_by}
                            onViewDetails={() => {
                              setSelectedWeatherId(weather.id.toString());
                              setAdvisoriesModal((prev) => ({
                                ...prev,
                                weather: true,
                              }));
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                        <FaCloud className="text-dark-blue text-2xl md:text-4xl" />
                        <p className="text-xs md:text-base">
                          No Weather Advisory for now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "road",
              length: data?.road?.length || 0,
              content: (
                <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
                  {data?.road && data.road.length > 0 && (
                    <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2 ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                      <FaRoad className="md:text-2xl text-lg" /> Road Advisories
                      :
                    </h3>
                  )}

                  <div
                    className="flex flex-row gap-4 w-full hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                          lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
                  >
                    {data?.road && data.road.length > 0 ? (
                      data.road.map((road) => (
                        <div
                          key={road.id}
                          className="flex-none w-[280px] snap-start lg:flex-auto lg:w-auto"
                        >
                          <RoadCards
                            id={road.id}
                            title={road.title}
                            desc={road.details}
                            dateTime={road.date_time}
                            addedBy={road.added_by}
                            status={road.status}
                            onViewDetails={() => {
                              setSelectedRoadId(road.id.toString());
                              setAdvisoriesModal((prev) => ({
                                ...prev,
                                road: true,
                              }));
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                        <FaRoad className="text-dark-blue text-2xl md:text-4xl" />
                        <p className="text-xs md:text-base">
                          No Road Advisory for now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "community",
              length: data?.community?.length || 0,
              content: (
                <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
                  {data?.community && data.community.length > 0 && (
                    <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2 ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                      <FaUsers className="md:text-2xl text-lg" /> Community
                      Notice :
                    </h3>
                  )}

                  <div
                    className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                          lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
                  >
                    {data?.community && data.community.length > 0 ? (
                      data.community.map((community) => (
                        <div
                          key={community.id}
                          className="flex-none w-[280px] snap-start lg:flex-auto lg:w-auto"
                        >
                          <CommunityCards
                            id={community.id}
                            title={community.title}
                            desc={community.details}
                            dateTime={community.date_time}
                            addedBy={community.added_by}
                            onViewDetails={() => {
                              setSelectedCommunityId(community.id.toString());
                              setAdvisoriesModal((prev) => ({
                                ...prev,
                                community: true,
                              }));
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                        <FaUsers className="text-dark-blue text-2xl md:text-4xl" />
                        <p className="text-xs md:text-base">
                          No Community Notice for now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "disaster",
              length: data?.disaster?.length || 0,
              content: (
                <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
                  {data?.disaster && data.disaster.length > 0 && (
                    <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2 ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                      <FaEarthAmericas className="md:text-2xl text-lg" />{" "}
                      Disaster Updates :
                    </h3>
                  )}

                  <div
                    className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                          lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
                  >
                    {data?.disaster && data.disaster.length > 0 ? (
                      data.disaster.map((disaster) => (
                        <div
                          key={disaster.id}
                          className="flex-none w-[280px] snap-start lg:flex-auto lg:w-auto"
                        >
                          <DisasterCards
                            id={disaster.id}
                            title={disaster.title}
                            desc={disaster.details}
                            dateTime={disaster.date_time}
                            disasterType={disaster.disaster_type}
                            addedBy={disaster.added_by}
                            image={disaster.img_path}
                            onViewDetails={() => {
                              setSelectedDisasterId(disaster.id.toString());
                              setAdvisoriesModal((prev) => ({
                                ...prev,
                                disaster: true,
                              }));
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex w-[98vw] mt-12 flex-col items-center justify-center gap-4">
                        <FaEarthAmericas className="text-dark-blue text-2xl md:text-4xl" />
                        <p className="text-xs md:text-base">
                          No Disaster Updates for now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]
            .sort((a, b) => {
              if (a.length === 0 && b.length > 0) return 1;
              if (a.length > 0 && b.length === 0) return -1;
              return b.length - a.length;
            })
            // Render sorted order
            .map((section) => (
              <React.Fragment key={section.key}>
                {section.content}
              </React.Fragment>
            ))}
        </>
      )}

      {/* WEATHER DETAILS MODAL */}
      {advisoriesModal.weather && selectedWeatherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Card className="max-h-[80vh] w-[90vw] sm:w-[70vw] md:w-[50vw] relative">
            {/* Close button */}
            <button
              onClick={() => {
                setAdvisoriesModal((prev) => ({ ...prev, weather: false }));
                setSelectedWeatherId(null);
              }}
              className="absolute right-3 top-3 md:text-2xl text-lg text-gray-500 hover:text-red-500 transition-all"
            >
              <IoClose />
            </button>

            {isWeatherDetailsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-dark-blue"></div>
              </div>
            ) : weatherDetails ? (
              <>
                <CardHeader>
                  <CardTitle className="md:max-w-[80%] max-w-[95%] md:text-xl text-sm">
                    {weatherDetails.title}
                  </CardTitle>
                  <CardDescription className="md:mt-2 text-[10px] md:text-sm">
                    <DateTimeDisplay value={weatherDetails.date_time ?? ""} />
                  </CardDescription>
                </CardHeader>

                <CardContent className="scrollBar mr-2 max-h-[40vh] overflow-auto text-xs md:text-base leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
                  <p>{weatherDetails.details}</p>
                </CardContent>

                <CardFooter className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] md:text-sm text-gray-800 dark:text-gray-500">
                    Added by :
                    <Image
                      src={`/logos/${
                        weatherDetails.added_by
                          ?.toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .includes("municipal of los banos")
                          ? "lb-logo.png"
                          : weatherDetails.added_by
                              ?.toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/\s+/g, "-") + "-logo.png"
                      }`}
                      alt={`${weatherDetails.added_by} logo`}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                    {weatherDetails.added_by}
                  </span>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No details found.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ROAD DETAILS MODAL */}
      {advisoriesModal.road && selectedRoadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Card className="max-h-[80vh] w-[90vw] sm:w-[70vw] md:w-[50vw] relative">
            {/* Close button */}
            <button
              onClick={() => {
                setAdvisoriesModal((prev) => ({ ...prev, road: false }));
                setSelectedRoadId(null);
              }}
              className="absolute right-3 top-3 md:text-2xl text-lg text-gray-500 hover:text-red-500 transition-all"
            >
              <IoClose />
            </button>

            {isRoadDetailsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-dark-blue"></div>
              </div>
            ) : roadDetails ? (
              <>
                <CardHeader>
                  <CardTitle className="md:max-w-[80%] max-w-[95%] md:text-xl text-sm">
                    {roadDetails.title}
                  </CardTitle>

                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mt-1">
                    <CardDescription className="text-[11px] md:text-sm">
                      <DateTimeDisplay value={roadDetails.date_time ?? ""} />
                    </CardDescription>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          roadDetails.status === "Open"
                            ? "bg-green-500"
                            : roadDetails.status === "Partially Open"
                              ? "bg-yellow-500"
                              : roadDetails.status === "Closed"
                                ? "bg-red-500"
                                : "bg-zinc-300"
                        }`}
                      ></div>
                      <p
                        className={`text-[11px] md:text-sm font-medium ${
                          roadDetails.status === "Open"
                            ? "text-green-500"
                            : roadDetails.status === "Partially Open"
                              ? "text-yellow-500"
                              : roadDetails.status === "Closed"
                                ? "text-red-500"
                                : "text-zinc-400"
                        }`}
                      >
                        {roadDetails.status || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="scrollBar mr-2 max-h-[40vh] overflow-auto text-xs md:text-base leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
                  <p>{roadDetails.details}</p>
                </CardContent>

                <CardFooter className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] md:text-sm text-gray-800 dark:text-gray-500">
                    Added by:
                    <Image
                      src={`/logos/${
                        roadDetails.added_by
                          ?.toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .includes("municipal of los banos")
                          ? "lb-logo.png"
                          : roadDetails.added_by
                              ?.toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/\s+/g, "-") + "-logo.png"
                      }`}
                      alt={`${roadDetails.added_by} logo`}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                    {roadDetails.added_by}
                  </span>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No road details found.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* COMMUNITY MODAL */}
      {advisoriesModal.community && selectedCommunityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <Card className="max-h-[80vh] w-[90vw] sm:w-[70vw] md:w-[50vw] relative">
            {/* Close button */}
            <button
              onClick={() => {
                setAdvisoriesModal((prev) => ({ ...prev, community: false }));
                setSelectedCommunityId(null);
              }}
              className="absolute right-3 top-3 md:text-2xl text-lg text-gray-500 hover:text-red-500 transition-all"
            >
              <IoClose />
            </button>

            {isCommunityDetailsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-dark-blue"></div>
              </div>
            ) : communityDetails ? (
              <>
                <CardHeader>
                  <CardTitle className="md:max-w-[80%] max-w-[95%] md:text-xl text-sm">
                    {communityDetails.title}
                  </CardTitle>
                  <CardDescription className="md:mt-2 text-[10px] md:text-sm">
                    <DateTimeDisplay value={communityDetails.date_time ?? ""} />
                  </CardDescription>
                </CardHeader>

                <CardContent className="scrollBar mr-2 max-h-[40vh] overflow-auto text-xs md:text-base leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
                  <p>{communityDetails.details}</p>
                </CardContent>

                <CardFooter className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] md:text-sm text-gray-800 dark:text-gray-500">
                    Added by :
                    <Image
                      src={`/logos/${
                        communityDetails.added_by
                          ?.toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .includes("municipal of los banos")
                          ? "lb-logo.png"
                          : communityDetails.added_by
                              ?.toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/\s+/g, "-") + "-logo.png"
                      }`}
                      alt={`${communityDetails.added_by} logo`}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                    {communityDetails.added_by}
                  </span>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No details found.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* DISASTER MODAL */}
      {advisoriesModal.disaster && selectedDisasterId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Card className="relative w-[90vw] !py-0 md:!py-3 md:w-[65vw] md:max-h-[80vh] max-h-[90vh] rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => {
                setAdvisoriesModal((prev) => ({ ...prev, disaster: false }));
                setSelectedDisasterId(null);
              }}
              className="absolute right-3 top-3 text-xl z-40 md:text-2xl text-gray-600 hover:text-red-500 transition"
            >
              <IoClose />
            </button>

            {isDisasterDetailsLoading ? (
              <div className="flex items-center justify-center h-[300px] w-full">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-dark-blue"></div>
              </div>
            ) : disasterDetails ? (
              <div className="flex flex-col md:flex-row h-full  w-full items-center md:items-start  md:gap-6 ">
                {/* Left IMAGE Section */}
                <div
                  className="relative md:h-[250px] h-[180px] md:w-[300px] md:my-7    w-full md:rounded-lg md:ml-10 cursor-pointer group overflow-hidden "
                  onClick={() =>
                    setImagePreview(
                      `https://greenyellow-lion-623632.hostingersite.com/${disasterDetails.img_path}`
                    )
                  }
                >
                  <Image
                    src={`https://greenyellow-lion-623632.hostingersite.com/${disasterDetails.img_path}`}
                    alt="Disaster"
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <HiOutlineArrowsExpand className="text-lg text-white" />
                  </div>
                </div>

                {/* Right DETAILS Section */}
                <div className="flex flex-col  md:w-[60%]  w-[80%] py-5">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-sm md:text-xl leading-snug  pr-8">
                      {disasterDetails.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] md:text-sm md:mt-1">
                      <DateTimeDisplay
                        value={disasterDetails.date_time ?? ""}
                      />
                    </CardDescription>
                    <p className="mt-1 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {disasterDetails.disaster_type}
                    </p>
                  </CardHeader>

                  {/* Scrollable Content */}
                  <CardContent className="scrollBar md:max-h-[250px] pr-3  max-h-[150px] flex-1 pl-0 overflow-y-auto text-xs md:text-sm leading-relaxed ">
                    {disasterDetails.details}
                  </CardContent>

                  <CardFooter className=" pt-5 pl-0">
                    <span className="flex items-center gap-2 px-0 text-[10px] md:text-sm text-gray-700 dark:text-gray-400">
                      Added by:
                      <Image
                        src={`/logos/${
                          disasterDetails.added_by
                            ?.toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .includes("municipal of los banos")
                            ? "lb-logo.png"
                            : disasterDetails.added_by
                                ?.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/\s+/g, "-") + "-logo.png"
                        }`}
                        alt={`${disasterDetails.added_by} logo`}
                        width={18}
                        height={18}
                        className="h-4 w-4 object-contain"
                      />
                      {disasterDetails.added_by}
                    </span>
                  </CardFooter>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No details found.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {imagePreview && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setImagePreview(null)}
        >
          {/* Stop close when clicking the image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagePreview}
              alt="Preview"
              width={1000}
              height={1000}
              className="object-contain max-h-[90vh] max-w-[90vw] select-none"
            />

            {/* Close Button */}
            <button
              onClick={() => setImagePreview(null)}
              className="absolute md:-top-5 -top-[15%] right-0 md:-right-[25%] text-white text-3xl drop-shadow-lg hover:text-red-400 transition"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
