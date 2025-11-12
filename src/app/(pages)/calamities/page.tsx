"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { FaAnglesDown } from "react-icons/fa6";

export default function Calamities() {
  const disasters = [
    { image: "/calamities-images/typhoon.png", title: "Typhoon" },
    { image: "/calamities-images/flood.png", title: "Flood" },
    { image: "/calamities-images/earthquake.png", title: "Earthquake" },
    { image: "/calamities-images/landslide.png", title: "Landslide" },
    { image: "/calamities-images/volcano.png", title: "Volcanic Eruption" },
  ];

  const [isActive, setIsActive] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleHover = (index: number) => {
    if (!isTouchDevice) setIsActive(index);
  };

  const handleLeave = () => {
    if (!isTouchDevice) setIsActive(null);
  };

  const handleClick = (index: number) => {
    if (!isTouchDevice) return;

    if (isActive === index) {
      setIsActive(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      setIsActive(index);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsActive(null);
      }, 2000);
    }
  };

  const safetyTips = [
    {
      title: "Typhoon Safety Tips",
      before: [
        {
          img: "/calamities-images/tv.png",
          desc: "Watch out for weather updates on your tv, radio or the internet.",
        },
        {
          img: "/calamities-images/fam.png",
          desc: "Store an adequate supply of food and clean water.",
        },
        {
          img: "/calamities-images/tools.png",
          desc: "Keep flashlights, candles and battery powered within easy reach.",
        },
        {
          img: "/calamities-images/pets.png",
          desc: "Take your pets and livestocks to safe places like the evacuation area for animals.",
        },
        {
          img: "/calamities-images/evac.png",
          desc: "Follow evacuation orders by the authority.",
        },
      ],
      during: [
        {
          img: "/calamities-images/house.png",
          desc: "Stay inside a safe building",
        },
        {
          img: "/calamities-images/kidlat.png",
          desc: "Always keep yourself updated with the latest weather report.",
        },
        {
          img: "/calamities-images/boil.png",
          desc: "Boil water for at least 20 minutes. Safe drinking water in a container with cover.",
        },
        {
          img: "/calamities-images/candle.png",
          desc: "Keep an eye on lighted candles or gas lamp.",
        },
        {
          img: "/calamities-images/feet.png",
          desc: "Do not wade through floodwaters to avoid being electrocuted and contradicting disease.",
        },
      ],
      after: [
        {
          img: "/calamities-images/house.png",
          desc: "Stay inside a safe building",
        },
        {
          img: "/calamities-images/danger.png",
          desc: "Beware of dangerous animals that may have entered your house.",
        },
        {
          img: "/calamities-images/extension.png",
          desc: "Watch out for live wires or outlet immersed in water.",
        },
        {
          img: "/calamities-images/lighter.png",
          desc: "Report damaged electrical cables and fallen electric posts to officers.",
        },
        {
          img: "/calamities-images/lamok.png",
          desc: "To avoid creating a favorable condition for mosquito breeding, do not let water gather.",
        },
      ],
    },
    {
      title: "Flood Safety Tips",
      before: [
        {
          img: "/calamities-images/tv.png",
          desc: "Watch out for weather updates on your tv, radio or the internet.",
        },
        {
          img: "/calamities-images/notes.png",
          desc: "Prepare an emergency bag with food, flashlight, medicine and important documents.",
        },
        {
          img: "/calamities-images/baha.png",
          desc: "Move any items that could be swept away by the flood ",
        },
      ],
      during: [
        {
          img: "/calamities-images/baha2.png",
          desc: "Avoid walking or driving in flooded areas. Also avoid places that are prone in flash flood.",
        },
        {
          img: "/calamities-images/turnoffswitch.png",
          desc: "Turn of the main power switch and close the windows and doors of your home before evacuating.",
        },
        {
          img: "/calamities-images/helping.png",
          desc: "Follow authorities if there's an evacuation notice. Bring your pets or set them free.",
        },
      ],
      after: [
        {
          img: "/calamities-images/baha3.png",
          desc: "Do not return to a flooded home or area until it has been declared safe.",
        },
        {
          img: "/calamities-images/communicate.png",
          desc: "Inform your family about your condition.",
        },
        {
          img: "/calamities-images/walis.png",
          desc: "Clean and disinfect items that were contaminated by floodwater.",
        },
        {
          img: "/calamities-images/extension2.png",
          desc: "Have an electrician inspect any appliances or outlets affected by the flood before using them.",
        },
      ],
    },
    {
      title: "Earthquake Safety Tips",
      before: [
        {
          img: "/calamities-images/communicate.png",
          desc: "Plan how you’re going to communicate with your family members.",
        },
        {
          img: "/calamities-images/dch.png",
          desc: "Practice to “Drop, Cover, and Hold On” to protect yourself from earthquake.",
        },
        {
          img: "/calamities-images/first-aid.png",
          desc: "Make sure you have at home: Fire extinguisher, first aid kit, a flashlight, extra batteries and a battery-powered radio to keep yourself updated.",
        },
        {
          img: "/calamities-images/sofa.png",
          desc: "Anchor all heavy furniture or any appliances to the walls or floor.",
        },
      ],
      during: [
        {
          img: "/calamities-images/calm.png",
          desc: "Stay calm. Don’t panic.",
        },
        {
          img: "/calamities-images/dch.png",
          desc: "Do “Drop, Cover, and Hold On” to protect yourself  from falling objects.",
        },
        {
          img: "/calamities-images/car.png",
          desc: "If you’re inside a car, stay inside until the earthquake stops.",
        },
        {
          img: "/calamities-images/elevator.png",
          desc: "Never use elevators you might get stuck.",
        },
        {
          img: "/calamities-images/run.png",
          desc: "If you’re outdoors, stay in an open area away from power lines, falling objects, and buildings.",
        },
      ],
      after: [
        {
          img: "/calamities-images/hilot.png",
          desc: "When the shaking stops, check yourself and others for injuries. Provide first aid to the injured",
        },
        {
          img: "/calamities-images/search.png",
          desc: "Look around your area. If there’s a clear and safe path, leave the building and go to an open space away from damaged areas.",
        },
        {
          img: "/calamities-images/washing.png",
          desc: "Check your appliances, electrical lines, gas, or water for damages.",
        },
        {
          img: "/calamities-images/radio.png",
          desc: "If you have a battery-operated radio or cellphone, use it to monitor local news and text alerts for emergency information and instructions.",
        },
        {
          img: "/calamities-images/beach.png",
          desc: "Stay away from beaches, as earthquakes can cause tsunamis.",
        },
        {
          img: "/calamities-images/kids.png",
          desc: "If you’re at school or work, follow the emergency instructions of the person in charge.",
        },
      ],
    },
    {
      title: "Landslide Safety Tips",
      before: [
        {
          img: "/calamities-images/light.png",
          desc: "Know the landslide-prone areas and learn the early signs of impending landslides.",
        },
        {
          img: "/calamities-images/tv.png",
          desc: "Monitor the news for weather updates, warnings, and advisories.",
        },
        {
          img: "/calamities-images/bag.png",
          desc: "Prepare your family’s GO BAG containing items needed for survival.",
        },
        {
          img: "/calamities-images/evac.png",
          desc: "Know the location of the evacuation site and the fastest and safest way to go there.",
        },
        {
          img: "/calamities-images/takbo.png",
          desc: "When notified, immediately evacuate to safer grounds.",
        },
      ],
      during: [
        {
          img: "/calamities-images/table.png",
          desc: "When inside a house or building and evacuation is not possible, stay inside and get under a sturdy table.",
        },
        {
          img: "/calamities-images/takbo.png",
          desc: "When outside, avoid affected areas and go to a safer place.",
        },
        {
          img: "/calamities-images/worker.png",
          desc: "When landslide cannot be avoided, protect your head.",
        },
        {
          img: "/calamities-images/bridge.png",
          desc: "When driving, do not cross bridges and damaged roads.",
        },
      ],
      after: [
        {
          img: "/calamities-images/go-out.png",
          desc: "Leave the evacuation areas only when authorities say it is safe.",
        },
        {
          img: "/calamities-images/landslide2.png",
          desc: "Avoid landslide affected areas.",
        },
        {
          img: "/calamities-images/ilog.png",
          desc: "Watch out for possible flashfloods due to clogging of creeks or rivers..",
        },
        {
          img: "/calamities-images/damingtao.png",
          desc: "Check for missing persons and report it to authorities.",
        },
        {
          img: "/calamities-images/ambulance.png",
          desc: "Bring the injured and sick to the nearest hospital.",
        },
        {
          img: "/calamities-images/bahay.png",
          desc: "Check your house for possible damages and repair as necessary.",
        },
        {
          img: "/calamities-images/cp.png",
          desc: "Report fallen trees and electric posts to proper authorities.",
        },
      ],
    },
    {
      title: "Volcanic Eruption Safety Tips",
      before: [
        {
          img: "/calamities-images/bag.png",
          desc: "Assemble an emergency preparedness kit.",
        },
        {
          img: "/calamities-images/notes.png",
          desc: "Create an evacuation plan. Ensure every family member knows it.",
        },
        {
          img: "/calamities-images/tv.png",
          desc: "Always stay updated with the news. Make it a habit.",
        },
      ],
      during: [
        {
          img: "/calamities-images/evac.png",
          desc: "Follow any evacuation orders issued by authorities.",
        },
        {
          img: "/calamities-images/house.png",
          desc: "If indoors, close all windows, doors, and dampers to keep volcanic ash from entering.",
        },
        {
          img: "/calamities-images/pets2.png",
          desc: "Bring animals and livestock into closed shelters to protect them from breathing volcanic ash.",
        },
      ],
      after: [
        {
          img: "/calamities-images/car.png",
          desc: "Avoid driving in heavy ashfall.",
        },
        {
          img: "/calamities-images/communicate.png",
          desc: "Update family and friends that you’re safe.",
        },
        {
          img: "/calamities-images/mask.png",
          desc: "Wear protective clothing.",
        },
      ],
    },
  ];

  return (
    <div className="mt-10 max-w-[1500px] md:mt-20">
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
        <div className="order-2 flex w-[85%] flex-col items-center gap-3 md:order-1 md:max-w-[450px] md:items-start md:gap-6 lg:max-w-[600px]">
          <h1 className=" text-center text-xl font-extrabold md:text-3xl lg:text-4xl">
            Be Ready, Stay Safe
          </h1>
          <p className="text-center text-xs leading-5 md:text-start md:text-[14px] md:leading-6 lg:text-[16px]">
            Learn how to stay safe and prepared during natural disasters such as
            typhoons, earthquakes, volcanic eruptions, landslide and floods.
          </p>
          <a
            href="#disaster0"
            className=" text-background bg-primary mt-5 flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-[10px] md:mt-0 md:gap-3 md:py-4 md:text-xs"
          >
            Read Safety Tips
            <FaAnglesDown />
          </a>
        </div>

        <div className="box-shadow order-1 flex h-54 w-[80%] overflow-hidden bg-red-800 md:order-2 md:h-60 md:w-[350px] lg:h-[400px] lg:w-[600px]">
          {disasters.map((d, index) => (
            <div
              key={index}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(index)}
              className={`text-light relative flex ${
                isActive === index ? "flex-[10]" : "flex-[1]"
              } transition-all duration-500 hover:flex-[10]`}
            >
              <Image
                src={d.image}
                fill
                alt={d.image}
                className="object-cover"
              />

              <div
                className={`${
                  isActive === index
                    ? "bg-labo absolute h-full w-full"
                    : "hidden"
                }`}
              >
                <h1 className="mt-5 text-center text-xs font-bold md:text-sm lg:text-base">
                  {d.title}
                </h1>
                <a
                  href={`#disaster${index}`}
                  className="bg-dark-blue text-white  absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full px-4 py-2 text-[8px] text-nowrap md:px-5 md:py-2.5 md:text-[10px] lg:px-6 lg:py-3 lg:text-xs"
                >
                  View safety tips
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {safetyTips.map((tip, index) => (
        <div
          key={index}
          id={`disaster${index}`}
          className="mx-auto mt-20 flex w-[95%] scroll-mt-5 flex-col gap-5 md:w-[90%] md:max-w-[1500px] md:scroll-mt-[-50px]"
        >
          <h1 className="text-primary mt-3 mb-4 text-center text-base font-extrabold md:mt-20 md:text-xl lg:mt-32 lg:text-2xl">
            {tip.title}
          </h1>

          <div className="mt-7 flex  flex-col flex-wrap gap-14 md:flex-row md:items-start md:justify-around lg:mt-10">
            <div className="flex flex-col md:gap-8 gap-6">
              <h2 className="text-center text-sm font-bold lg:text-base">
                Before
              </h2>
              {tip.before.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-5 lg:gap-7"
                >
                  <div className="relative h-10 w-10 lg:h-12 lg:w-12">
                    <Image
                      src={item.img}
                      fill
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <p className="w-[70%] text-xs lg:w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:gap-8 gap-6">
              <h2 className="text-center text-sm font-bold lg:text-base">
                During
              </h2>
              {tip.during.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-5 lg:gap-7"
                >
                  <div className="relative h-10 w-10 lg:h-12 lg:w-12">
                    <Image
                      src={item.img}
                      fill
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <p className="w-[70%] text-xs lg:w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:gap-8 gap-6">
              <h2 className="text-center text-sm font-bold lg:text-base">
                After
              </h2>
              {tip.after.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-5 lg:gap-7"
                >
                  <div className="relative h-10 w-10 lg:h-12 lg:w-12">
                    <Image
                      src={item.img}
                      fill
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <p className="w-[70%] text-xs lg:w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
