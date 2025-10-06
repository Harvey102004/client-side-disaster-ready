import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill } from "react-icons/go";
import { FaPhone, FaEarthAsia, FaCircleInfo } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { HiLocationMarker } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaBuildingShield } from "react-icons/fa6";

import { IoClose } from "react-icons/io5";
import { SegmentedThemeToggle } from "../theme-toggle";
import { useEffect, useState } from "react";

export default function SidebarMobile({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { link: "Home", path: "/", icon: <GoHomeFill /> },
    { link: "Calamities", path: "/calamities", icon: <FaEarthAsia /> },
    {
      link: "Emergency Resources",
      path: "/emergency-resources",
      icon: <FaPhone />,
    },
    {
      link: "Realtime Updates",
      path: "/realtime-updates",
      icon: <HiLocationMarker />,
    },
    {
      link: "Evacuation Centers",
      path: "/evacuation-centers",
      icon: <FaBuildingShield />,
    },
    { link: "Prone Areas", path: "/prone-areas", icon: <IoWarning /> },
    { link: "About Us", path: "/about-us", icon: <FaCircleInfo /> },
    { link: "Send Report", path: "/send-report", icon: <RiSendPlaneFill /> },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between relative">
      <div className="">
        <div className="p-5 flex items-center justify-between mt-2">
          <h1 className="text-dark-blue dark:text-white text-center   font-extrabold    md:text-xl text">
            Disaster Ready
          </h1>
          <IoClose
            onClick={onClick}
            className="text-lg absolute top-5 cursor-pointer right-3"
          />
        </div>

        <nav className="mt-5">
          <p className="pl-5 text-xs mb-4">Menu</p>
          <ul className="flex flex-col text-sm gap-2  pr-[15%]   ">
            {navLinks.map((navLink) => {
              const isActive = pathname === navLink.path;

              return (
                <Link
                  key={navLink.link}
                  href={navLink.path}
                  onClick={onClick}
                  className={`hover:text-dark-blue text-xs py-3 rounded-r-full  ${isActive ? "text-white bg-dark-blue" : ""}`}
                >
                  <li className="flex items-center gap-4 pl-5">
                    <div className="text-base">{navLink.icon}</div>
                    <span>{navLink.link}</span>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className=" h-14 mx-auto mb-[5%] w-[80%]">
        {mounted && <SegmentedThemeToggle />}
      </div>
    </div>
  );
}
