"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { FaPhone } from "react-icons/fa6";
import { FaBuildingShield } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";

export default function NavMobile() {
  const pathname = usePathname();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const isOnMapPage = pathname.includes("/realtime-updates");

  // SSR safe
  useEffect(() => {
    setMounted(true);
    const index = navLinks.findIndex(
      (link) =>
        pathname === link.href ||
        (pathname.startsWith(link.href) && link.href !== "/")
    );
    setActiveIndex(index);
  }, [pathname]);

  const navLinks = [
    { icon: <GoHomeFill />, label: "Home", href: "/" },
    {
      icon: <FaPhone />,
      label: "Emergency ",
      href: "/emergency-resources",
    },
    {
      icon: <HiLocationMarker />,
      label: "Map",
      href: "/realtime-updates",
    },
    {
      icon: <FaBuildingShield />,
      label: "Evacuations",
      href: "/evacuation-centers",
    },
    { icon: <RiSendPlaneFill />, label: "Report", href: "/send-report" },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 pb-3 z-45 block w-full pt-4 md:hidden ${isOnMapPage ? "bg-transparent" : "bg-background"}`}
    >
      <nav className="bg-dark-blue relative mx-auto flex h-14 w-[95%] items-center rounded-xl">
        {activeIndex !== null && activeIndex !== -1 && (
          <div
            className="bg-light absolute -top-3 flex h-[55px] w-[55px] items-center justify-center rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: `calc(${(100 / navLinks.length) * activeIndex}% + ${
                100 / navLinks.length / 2
              }% - 27.5px)`,
            }}
          >
            <div className="bg-dark-blue flex h-[45px] w-[45px] items-center justify-center rounded-full">
              <div className="text-white">{navLinks[activeIndex].icon}</div>
            </div>
          </div>
        )}

        <ul className="z-10 flex w-full items-center justify-between">
          {navLinks.map((link, index) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");

            return (
              <Link
                href={link.href}
                key={link.label}
                className="relative flex h-full w-1/5 items-center justify-center"
              >
                {!isActive && (
                  <div className="transition-all duration-300 text-lg flex items-center text-white flex-col gap-1">
                    {link.icon}
                    <span className="text-[8px] text-nowrap">{link.label}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
