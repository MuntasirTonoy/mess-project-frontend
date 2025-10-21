import "./globals.css";
import { Poppins } from "next/font/google";
import Header from "../components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Hostel Bill Calculator",
  description: "Utility bill calculation for hostel members.",
};
// 1. Configure the Poppins font
const poppins = Poppins({
  // Poppins is NOT a variable font, so you MUST specify weights
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap", // Recommended to prevent layout shift
  variable: "--font-poppins", // Optional: creates a CSS variable for Tailwind/CSS
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} data-theme="light">
      <body>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
