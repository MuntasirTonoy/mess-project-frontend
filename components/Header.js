"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCalculator,
  FaChartLine,
  FaBolt,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaCog,
} from "react-icons/fa"; // Added FaUserCircle, FaSun, FaMoon, FaCog

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Calculate", icon: <FaCalculator /> },
    { href: "/dashboard/bills", label: "Dashboard", icon: <FaChartLine /> },
  ];

  // Theme switch logic is intentionally omitted as requested,
  // we are using the DaisyUI structure for presentation.
  const ThemeSwitch = () => (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      {/* This hidden checkbox controls the state, but we'll use 'value="dark"' and make it non-functional as requested */}
      <input type="checkbox" className="theme-controller" value="dark" />

      {/* Sun icon (swap-off, appears for light theme) */}
      <svg
        className="swap-off h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>

      {/* Moon icon (swap-on, appears for dark theme) */}
      <svg
        className="swap-on h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
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
          <a>Logout</a>
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>{" "}
                  Logout
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}
