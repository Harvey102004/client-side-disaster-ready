"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";

import { RiSendPlaneFill } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import SidebarMobile from "./sidebarMobile";

export default function NavbarDesktop() {
  const pathname = usePathname();

  const isOnMapPage =
    pathname.includes("/realtime-updates") ||
    pathname.includes("evacuation-centers");

  const isHomepage = pathname === "/";

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const navLinks = [
    { link: "Home", path: "/" },
    { link: "Calamities", path: "/calamities" },
    { link: "Emergency Resources", path: "/emergency-resources" },
    { link: "Realtime Updates", path: "/realtime-updates" },
    { link: "Evacuation Centers", path: "/evacuation-centers" },
    { link: "Prone Areas", path: "/prone-areas" },
    { link: "About Us", path: "/about-us" },
  ];

  useEffect(() => {
    if (isSideBarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSideBarOpen]);

  return (
    <div
      className={`md:w-full w-max md:h-20 h-16   flex items-center  justify-between px-5  md:px-10 ${isOnMapPage || isHomepage ? "absolute top-0 z-50 bg-transparent md:backdrop-blur-xs" : "bg-background"}`}
    >
      <h1
        className={`${isHomepage ? "text-white" : "text-dark-blue"} hidden md:flex  font-extrabold  md:font-black text-lg md:text-xl text`}
      >
        Disaster Ready
      </h1>

      <nav className="lg:order-2 ">
        <ul className=" gap-8 items-center hidden lg:flex">
          {navLinks.map((navLink) => {
            const isActive = pathname === navLink.path;
            return (
              <li key={navLink.path}>
                <Link
                  href={navLink.path}
                  className={`text-sm
    ${isHomepage ? "text-white hover:opacity-80" : " hover:text-dark-blue"} 
    ${isOnMapPage && "text-black"} 
    ${isActive ? "text-dark-blue underline underline-offset-8" : ""}
  `}
                >
                  {navLink.link}
                </Link>
              </li>
            );
          })}
          <ThemeToggle />
          <Link
            href={"/send-report"}
            className="bg-dark-blue text-white px-4 py-2 text-xs rounded cursor-pointer"
          >
            Send Report
            <RiSendPlaneFill className="inline ml-2" />
          </Link>
        </ul>
        <FiMenu
          onClick={() => setIsSideBarOpen(true)}
          className={`text-2xl lg:hidden cursor-pointer ${isOnMapPage ? "text-black" : "text-dark-blue"} ${isHomepage && "text-white"}`}
        />
      </nav>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/10 transition-opacity backdrop-blur-[5px] ${
          isSideBarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSideBarOpen(false)}
      />

      {/* Sidebar itself */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] bg-white dark:bg-light-black rounded-r-3xl  shadow-lg z-50 transform transition-transform duration-300 ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarMobile onClick={() => setIsSideBarOpen(false)} />
      </div>
    </div>
  );
}
