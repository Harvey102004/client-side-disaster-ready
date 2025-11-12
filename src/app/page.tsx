"use client";

import { useState } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";
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

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // Step 1 fields
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 fields
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentType, setPaymentType] = useState("gcash");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");

  const paymentOptions = [
    { id: "card", label: "Card", image: "card.png" },
    { id: "gcash", label: "GCash", image: "gcash-logo.png" },
    { id: "paymaya", label: "PayMaya", image: "paymaya.png" },
  ];

  // ✅ Step 1: Create Payment Intent
  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://192.168.137.1/Disaster-backend/public/createPaymentIntent.php",
        {
          amount: Math.round(Number(amount) * 100),
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.data?.id) {
        setPaymentIntentId(res.data.data.id);
        setStep(2);
      } else {
        alert("Failed to create payment intent.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating payment intent.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Attach Payment Method (JSON payload version)
  const handleAttachPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      payment_intent_id: paymentIntentId,
      type: paymentType,
      name: name.trim() || "Anonymous Donor",
      email: email.trim() || "noemail@disasterready.app",
      return_url:
        "http://localhost/Disaster-backend/public/attachmentPaymentMethod.php",
    };

    if (paymentType === "card") {
      payload.details = {
        card_number: cardNumber,
        exp_month: Number(expMonth),
        exp_year: Number(expYear),
        cvc: cvc,
      };
    }

    try {
      const res = await axios.post(
        "http://localhost/Disaster-backend/public/attachPaymentMethod.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const redirect = res.data?.data?.attributes?.next_action?.redirect?.url;
      if (redirect) window.open(redirect, "_self");
      else alert("Failed to get payment redirect URL.");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Error attaching payment method.");
    } finally {
      setLoading(false);
    }
  };

  // Reset modal state when closed
  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setAmount("");
    setDescription("");
    setName("");
    setEmail("");
  };

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

  return (
    <div className="flex flex-col items-center overflow-x-hidden gap-16 ">
      {/* HERO SECTION */}
      <div className="relative w-[100vw]  md:h-[90vh] h-[75vh] ">
        <Slider {...settings}>
          {data?.disaster && data?.disaster.length > 0 ? (
            data?.disaster.map((disaster) => {
              const imageUrl = `http://localhost/Disaster-backend/${disaster.img_path}`;
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

        {data?.disaster && data?.disaster.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className=" absolute bottom-5 z-40 -translate-x-1/2 left-1/2 text-[10px] md:text-sm mt-6  py-2 px-4 md:py-2.5 md:px-6 rounded-full shadow bg-dark-blue text-white "
          >
            Donate Now
          </button>
        )}
      </div>

      <h2 className="text-sm md:text-xl font-bold ">News & Updates</h2>

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
          {/* WEATHER ADVISORIES */}
          <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col  gap-4 md:gap-6">
            {data?.weather && data?.weather.length > 0 && (
              <h3 className="md:text-lg text-sm font-semibold  flex items-center md:gap-3 gap-2  ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                <FaCloud className="md:text-2xl text-lg" /> Weather Advisories :
              </h3>
            )}

            <div
              className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                    lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
            >
              {data?.weather && data?.weather.length > 0 ? (
                data?.weather.map((weather) => (
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
                <div className=" flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                  <FaCloud className="text-dark-blue text-2xl md:text-4xl" />
                  <p className="text-xs md:text-base">
                    No Weather Advisory for now.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* ROAD ADVISORIES */}
          <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
            {data?.road && data?.road.length > 0 && (
              <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2  ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                <FaRoad className="md:text-2xl text-lg" /> Road Advisories :
              </h3>
            )}

            <div
              className="flex flex-row gap-4 w-full hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                    lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
            >
              {data?.road && data?.road.length > 0 ? (
                data?.road.map((road) => (
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
                        setAdvisoriesModal((prev) => ({ ...prev, road: true }));
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className=" flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                  <FaRoad className="text-dark-blue text-2xl md:text-4xl" />
                  <p className="text-xs md:text-base">
                    No Road Advisory for now.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* COMMUNITY NOTICE */}
          <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
            {data?.community && data.community.length > 0 && (
              <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2  ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                <FaUsers className="md:text-2xl text-lg" /> Community Notice :
              </h3>
            )}

            <div
              className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                    lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
            >
              {data?.community && data?.community.length > 0 ? (
                data?.community.map((community) => (
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
                <div className=" flex w-[98vw] mt-12 flex-col items-center justify-center gap-2">
                  <FaUsers className="text-dark-blue text-2xl md:text-4xl" />
                  <p className="text-xs md:text-base">
                    No Community Notice for now.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* DISASTER UPDATES */}
          <div className="w-full mt-4 mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-4 md:gap-6">
            {data?.disaster && data?.disaster.length > 0 && (
              <h3 className="md:text-lg text-sm font-semibold flex items-center md:gap-3 gap-2  ml-2 text-gray-800 dark:text-gray-100 md:mb-2">
                <FaEarthAmericas className="md:text-2xl text-lg" /> Disaster
                Updates :
              </h3>
            )}

            <div
              className="flex flex-row gap-4 hide-scrollbar overflow-x-auto snap-x snap-mandatory 
                    lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible"
            >
              {data?.disaster && data?.disaster.length > 0 ? (
                data?.disaster.map((disaster) => (
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
                <div className=" flex w-[98vw] mt-12 flex-col items-center justify-center gap-4">
                  <FaEarthAmericas className="text-dark-blue text-2xl md:text-4xl" />
                  <p className="text-xs md:text-base">
                    No Disaster Updates for now.
                  </p>
                </div>
              )}
            </div>
          </div>
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
                      `http://localhost/Disaster-backend/${disasterDetails.img_path}`
                    )
                  }
                >
                  <Image
                    src={`http://localhost/Disaster-backend/${disasterDetails.img_path}`}
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

      {/* 🪟 DONATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-[90%] max-w-max shadow-xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-md"
            >
              ✕
            </button>

            {/* STEP 1: CREATE PAYMENT INTENT */}
            {step === 1 && (
              <form
                onSubmit={handleCreatePaymentIntent}
                className="relative flex flex-col gap-4]"
              >
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center  rounded-lg z-10">
                    <div className="flex flex-col items-center text-dark-blue">
                      <div className="border-dark-blue border-t-background h-10 w-10 animate-spin rounded-full border-4" />
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-center mb-3">
                    Make a Donation
                  </h3>

                  <p className="text-xs text-center text-gray-600">
                    A little kindness goes a long way. Thank you for your
                    support.
                  </p>
                </div>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (₱)"
                  className="border rounded text-sm p-3 mt-4 w-full dark:bg-neutral-800 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  required
                  disabled={loading}
                />

                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="border rounded p-3 text-sm mt-4 dark:bg-neutral-800"
                  required
                  disabled={loading}
                />

                <button
                  disabled={loading}
                  type="submit"
                  className={`rounded p-3 text-sm mt-3 transition ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed text-"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? "Creating..." : "Next Step"}
                </button>
              </form>
            )}

            {/* STEP 2: ATTACH PAYMENT METHOD */}
            {step === 2 && (
              <form
                onSubmit={handleAttachPaymentMethod}
                className="relative flex flex-col gap-6 w-full max-w-2xl mx-auto py-2"
              >
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center  rounded-lg z-10">
                    <div className="flex flex-col items-center text-dark-blue">
                      <div className="border-dark-blue border-t-background h-10 w-10 animate-spin rounded-full border-4" />
                    </div>
                  </div>
                )}

                {/* Title */}
                <h3 className="font-semibold text-xl text-center text-dark-blue dark:text-white mb-4">
                  Donation Details
                </h3>

                {/* Payment Options */}
                <div className="flex justify-center flex-wrap gap-4">
                  {paymentOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentType(opt.id)}
                      className={`cursor-pointer rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center p-5 w-[180px] h-[130px]
              ${
                paymentType === opt.id
                  ? "border-2 border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/30 scale-105"
                  : "border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-white hover:scale-105"
              }`}
                    >
                      <img
                        src={`/images/${opt.image}`}
                        alt={opt.label}
                        className="w-12 h-12 object-contain mb-2"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                  ))}
                </div>

                {/* Card Fields */}
                {paymentType === "card" && (
                  <div className="flex flex-col gap-3 px-4 mt-4">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm focus:ring focus:ring-blue-500/50"
                      required
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        placeholder="MM"
                        className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm flex-1 focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                      <input
                        type="text"
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        placeholder="YYYY"
                        className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm flex-1 focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="CVC"
                        className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm flex-1 focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div className="flex flex-col gap-4 px-4 ">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className={`w-1/2 rounded-lg p-3 font-medium text-white text-sm transition-all duration-200 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-md"
                    }`}
                  >
                    {loading ? "Processing..." : "Proceed to Pay"}
                  </button>
                </div>
              </form>
            )}
          </div>
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
