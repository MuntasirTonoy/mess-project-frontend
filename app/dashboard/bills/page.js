"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import Link from "next/link";
import { FaTrashAlt, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

// ⭐️ Import date-fns utilities ⭐️
import { format, parseISO, parse } from "date-fns";

// Mock User Context (Replace with real auth context later)
const MOCK_CURRENT_USER = {
  username: "Tony Stark",
  role: "admin", // Change to 'user' to test hidden delete button
};

export default function DashboardBillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Bills
  useEffect(() => {
    async function fetchBills() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bills`);
        if (!response.ok) {
          throw new Error(`Failed to fetch bills. Status: ${response.status}`);
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          "Could not connect to the backend API. Please ensure the server is running on http://localhost:5000."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  // Delete Handler
  const handleDelete = async (billId, billMonth) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the bill for ${billMonth}? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/bills/${billId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete bill. Status: ${response.status}`);
      }
      setBills(bills.filter((bill) => bill._id !== billId));
      alert(`✅ Bill for ${billMonth} deleted successfully!`);
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting bill: " + err.message);
    }
  };

  // --- UI STATES ---
  if (loading)
    return (
      <div className="p-10 text-center text-xl animate-pulse">
        <FaCalculator className="inline mr-2" />
        Loading bill history...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md flex flex-col items-center gap-2">
        <MdErrorOutline className="text-4xl" />
        <p className="font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
        {/* Decreased font size for mobile, reduced gap, reduced bottom margin */}
        <FaMoneyBillWave />
        Bill History Dashboard
      </h1>

      {/* No Bills */}
      {bills.length === 0 ? (
        <div className="p-6 sm:p-10 text-center bg-base-200 rounded-xl shadow-inner">
          <p className="text-lg sm:text-xl opacity-80 mb-4">
            No bills saved yet. Start calculating!
          </p>
          <Link
            href="/"
            className="btn btn-primary btn-lg font-bold gap-2 mt-2"
          >
            <FaCalculator />
            Go to Calculator
          </Link>
        </div>
      ) : (
        // Bill Cards Grid
        // grid-cols-2: Mobile/Tablet (2 cards)
        // lg:grid-cols-3: Desktop (3 cards)
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Reduced gap for smaller screens */}
          {bills.map((bill) => {
            // ------------------------------------------------
            // ⭐️ date-fns Logic for Formatting ⭐️
            // ------------------------------------------------

            // Assuming bill.month is in "YYYY-MM" format (e.g., "2024-02").
            const dateForMonth = parse(bill.month, "yyyy-MM", new Date());

            // Format the month to "Long Month Name YYYY" (e.g., "February 2024")
            const formattedMonth = format(dateForMonth, "MMMM yyyy");

            // Assuming bill.issueTime is an ISO 8601 string (common for MongoDB/APIs)
            const issueDate = parseISO(bill.issueTime);

            // Format the issue date/time
            const issueDateString = format(issueDate, "MMM do, yyyy");
            const issueTimeString = format(issueDate, "h:mm a");

            // ------------------------------------------------

            return (
              <div
                key={bill._id}
                className="card bg-base-300 border border-base-300 rounded-md hover:ring-2 ring-offset-3 ring-offset-base-300 ring-green-300 transition-all duration-300"
              >
                <div className="card-body space-y-2 p-3 sm:p-4">
                  {/* Reduced padding (p-3) and spacing (space-y-2) for smaller screens */}
                  {/* Header */}
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-1">
                    {/* Reduced font size (text-lg) for mobile, reduced gap */}
                    {formattedMonth} {/* 👈 date-fns output */}
                  </h2>
                  <div className="divider my-0.5"></div> {/* Reduced margin */}
                  {/* Bill Totals */}
                  <div className="space-y-0.5">
                    {" "}
                    {/* Reduced margin */}
                    <p className="flex justify-between text-sm sm:text-base font-semibold">
                      {/* Reduced font size for mobile */}
                      <span>Total Bill:</span>
                      <span>৳{bill.totalBill.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-base sm:text-lg font-bold">
                      {/* Reduced font size for mobile */}
                      <span>Per Person:</span>
                      <span>৳{bill.billPerPerson.toFixed(2)}</span>
                    </p>
                  </div>
                  {/* Timestamp */}
                  <p className="text-xs opacity-60 border-t pt-1.5">
                    {/* Reduced top padding */}
                    <b>Issued :</b> {issueDateString} at {issueTimeString}
                  </p>
                  {/* Delete Button (bottom) */}
                  {MOCK_CURRENT_USER.role === "admin" && (
                    <div className="card-actions mt-2">
                      {" "}
                      {/* Reduced margin */}
                      <button
                        onClick={() => handleDelete(bill._id, formattedMonth)}
                        className="btn btn-outline btn-error w-full btn-xs sm:btn-sm flex items-center justify-center gap-1 font-semibold" // Used btn-xs (extra small) for mobile, sm:btn-sm for tablet/desktop
                      >
                        <FaTrashAlt />
                        Delete Bill
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
