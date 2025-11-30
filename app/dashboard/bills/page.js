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
  // Add modal state for showing bill details
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Use functional update to ensure latest state is used
      setBills((prev) => prev.filter((bill) => bill._id !== billId));
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
                className="card bg-base-300 border border-base-300 rounded-md hover:ring-2 ring-offset-3 ring-offset-base-300 ring-green-300 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedBill(bill);
                  setIsModalOpen(true);
                }}
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
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(bill._id, formattedMonth);
                        }}
                        className="btn btn-outline btn-error w-full btn-xs sm:btn-sm flex items-center justify-center gap-1 font-semibold"
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

      {/* Modal for Bill Details */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-[95%] sm:w-[85%] lg:w-[60%] bg-base-100 rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  🧾 Bill Details — {format(parse(selectedBill.month, "yyyy-MM", new Date()), "MMMM yyyy")}
                </h2>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>

              {/* Header Info */}
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="font-semibold w-40">👤 Calculated By</td>
                      <td>{selectedBill.madeBy}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">👥 Total Members</td>
                      <td>{selectedBill.totalMembers}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">🕒 Issued</td>
                      <td className="text-xs opacity-70">
                        {(() => {
                          const issue = parseISO(selectedBill.issueTime);
                          return `${format(issue, "MMM do, yyyy")} at ${format(issue, "h:mm a")}`;
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Utilities Breakdown */}
              <div className="mt-4 space-y-3">
                <h3 className="text-lg font-semibold text-base-content/80 flex items-center gap-2">
                  Utilities Breakdown
                </h3>

                {selectedBill.billDetails?.length > 0 ? (
                  selectedBill.billDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="card bg-base-200 rounded-md p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm text-white bg-green-500 py-1 px-4 rounded-full font-semibold">
                          {detail.utility}
                        </h4>
                        <span className="badge badge-lg badge-secondary text-base px-3">
                          ৳{Number(detail.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <ul className="mt-2 text-sm font-semibold opacity-80 space-y-1">
                        {detail.sources?.map((source, sIndex) => (
                          <li key={sIndex}>• {source.meterName}: ৳{Number(source.amount).toFixed(2)}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-warning text-sm">
                    <span>No utilities with costs to display.</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-base-200 rounded-md p-5 shadow mt-5">
                <h3 className="text-lg font-bold">Total Bill: ৳{Number(selectedBill.totalBill).toFixed(2)}</h3>
                <h3 className="text-xl font-bold mt-2">Bill per person: ৳{Number(selectedBill.billPerPerson).toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
