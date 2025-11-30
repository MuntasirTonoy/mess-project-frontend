"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import {
  FaCalculator,
  FaChartLine,
  FaBolt,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaCog,
} from "react-icons/fa"; // Added FaUserCircle, FaSun, FaMoon, FaCog
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { href: "/", label: "Calculate", icon: <FaCalculator /> },
    { href: "/dashboard/bills", label: "Dashboard", icon: <FaChartLine /> },
  ];

  // Theme switch logic is intentionally omitted as requested,
  // we are using the DaisyUI structure for presentation.
  const ThemeSwitch = () => (
    <button
      className="btn btn-ghost btn-circle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaMoon className="h-6 w-6" />
      ) : (
        <FaSun className="h-6 w-6" />
      )}
    </button>
  );

  // Avatar Dropdown Component
  const AvatarDropdown = () => (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          {/* Placeholder Avatar Image or Icon */}
          <FaUserCircle className="w-full h-full text-base-content/80" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge badge-primary">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a>
            Logout <LuLogOut />
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-base-100 shadow-md z-50 backdrop-blur-md bg-opacity-90 border-b border-base-300">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-primary hover:text-accent transition-colors"
        >
          <FaBolt className="text-accent" />
          <span>Facebook Mess</span>
        </Link>

        {/* Desktop Navigation, Theme Switch, and Avatar */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-base-content/70 hover:text-primary"
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>{" "}
                {/* Hide label on smaller screens in desktop nav for space */}
              </Link>
            ))}
          </nav>

          {/* Theme Switch and Avatar (Desktop/Tablet) */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitch />
            <AvatarDropdown />
          </div>
        </div>

        {/* Mobile Menu (includes Nav Items, Theme Switch, and Avatar) */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitch /> {/* Theme Switch is always visible on mobile */}
          <details className="dropdown dropdown-end">
            <summary className="m-1 btn btn-ghost btn-circle">
              {" "}
              {/* Changed btn-sm to btn-circle */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </summary>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-lg mt-2 w-52 border border-base-200 z-[1]">
              {/* Avatar/Profile Link */}
              <li className="mb-1 border-b border-base-300">
                <a className="flex items-center gap-2 font-semibold">
                  <FaUserCircle className="w-5 h-5" />
                  <span>User Profile</span>
                </a>
              </li>
              {/* Navigation Items */}
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 ${
                      pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-base-content/70"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Placeholder Mobile Settings/Logout */}
              <li className="mt-1 border-t border-base-300">
                <a>
                  <FaCog /> Settings
                </a>
              </li>
              <li>
                <a>
                  Logout <LuLogOut />
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}
