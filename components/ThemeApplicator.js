"use client";

import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeApplicator({ children }) {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}