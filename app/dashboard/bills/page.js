"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../../../config/api";
import Link from "next/link";
import { FaTrashAlt, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

// ⭐️ Import date-fns utilities ⭐️
import { format, parseISO, parse } from "date-fns";
import Swal from "sweetalert2";

// Mock User Context (Replace with real auth context later)
const MOCK_CURRENT_USER = {
  username: "Tonoy",
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
        const response = await axiosInstance.get("/api/bills");
        setBills(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          "Could not connect to the backend API. Please ensure the server is running on http://localhost:5000.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  // Delete Handler
  const handleDelete = async (billId, billMonth) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the bill for ${billMonth}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1d232a",
      color: "#a6adbb",
    });

    if (!result.isConfirmed) return;

    // PIN code verification
    const { value: pin } = await Swal.fire({
      title: "Enter Admin PIN",
      input: "password",
      inputLabel: "Please enter the admin PIN to confirm deletion",
      inputPlaceholder: "Enter 4-digit PIN",
      inputAttributes: {
        maxlength: "4",
        autocapitalize: "off",
        autocorrect: "off",
        style: "text-align: center; letter-spacing: 0.5em; font-size: 1.5rem;",
      },
      showCancelButton: true,
      confirmButtonText: "Verify & Delete",
      background: "#1d232a",
      color: "#a6adbb",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter the PIN!";
        }
      },
    });

    // If user cancelled the PIN prompt
    if (pin === undefined) return;

    // Check if the PIN is correct
    if (pin !== "4242") {
      Swal.fire({
        title: "Wrong PIN!",
        text: "The PIN you entered is incorrect. Deletion aborted.",
        icon: "error",
        background: "#1d232a",
        color: "#a6adbb",
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/bills/${billId}`);
      // Use functional update to ensure latest state is used
      setBills((prev) => prev.filter((bill) => bill._id !== billId));
      Swal.fire({
        title: "Deleted!",
        text: `Bill for ${billMonth} has been deleted.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1d232a",
        color: "#a6adbb",
      });
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        title: "Error!",
        text: "Error deleting bill: " + err.message,
        icon: "error",
        background: "#1d232a",
        color: "#a6adbb",
      });
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title - Enhanced */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-3 mb-2 animate-slide-up">
            <FaMoneyBillWave className="text-primary animate-float" />
            Bill History Dashboard
          </h1>
          <p className="text-base-content/60 text-sm sm:text-base ml-12 animate-slide-up delay-100">
            View and manage all your saved bills
          </p>
        </div>

        {/* No Bills - Enhanced Empty State */}
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-content/10 max-w-lg">
              <div className="card-body items-center text-center p-8 sm:p-12">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <FaCalculator className="text-5xl sm:text-6xl text-primary" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-base-content mb-3">
                  No Bills Yet
                </h3>
                <p className="text-base-content/70 mb-6 text-sm sm:text-base">
                  Start calculating your utility bills to see them here
                </p>
                <Link
                  href="/"
                  className="btn btn-primary btn-lg gap-2 transition-all"
                >
                  <FaCalculator />
                  Go to Calculator
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Bill Cards Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bills.map((bill, index) => {
              let formattedMonth = "Invalid Date";
              try {
                const cleanMonth =
                  bill.month && bill.month.length >= 7
                    ? bill.month.substring(0, 7)
                    : bill.month;
                const dateForMonth = parse(cleanMonth, "yyyy-MM", new Date());
                formattedMonth = format(dateForMonth, "MMMM yyyy");
              } catch (error) {
                console.error("Date parsing error for bill:", bill._id, error);
                formattedMonth = bill.month;
              }

              const issueDate = parseISO(bill.issueTime);
              const issueDateString = format(issueDate, "MMM do, yyyy");
              const issueTimeString = format(issueDate, "h:mm a");

              return (
                <div
                  key={bill._id}
                  className={`card bg-gradient-to-br from-base-100 to-base-200 border border-base-content/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-scale-in delay-${((index % 5) + 1) * 100}`}
                  onClick={() => {
                    setSelectedBill(bill);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="card-body p-4 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formattedMonth}
                      </h2>
                    </div>

                    <div className="divider my-1"></div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-base-200/50 rounded-lg p-2">
                        <span className="text-sm font-medium text-base-content/70">
                          Total Bill:
                        </span>
                        <span className="font-bold text-primary">
                          ৳{bill.totalBill.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-success/10 rounded-lg p-2 border border-success/20">
                        <span className="text-sm font-semibold text-base-content">
                          Per Person:
                        </span>
                        <span className="text-lg font-bold text-success">
                          ৳{bill.billPerPerson.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-base-content/60 pt-2 border-t border-base-content/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {issueDateString} at {issueTimeString}
                      </span>
                    </div>

                    {MOCK_CURRENT_USER.role === "admin" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(bill._id, formattedMonth);
                        }}
                        className="btn btn-outline btn-error btn-sm w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrashAlt />
                        Delete Bill
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="relative z-10 w-[95%] sm:w-[85%] lg:w-[60%] bg-base-100 rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    🧾 Bill Details —{" "}
                    {(() => {
                      try {
                        const cleanMonth =
                          selectedBill.month && selectedBill.month.length >= 7
                            ? selectedBill.month.substring(0, 7)
                            : selectedBill.month;
                        return format(
                          parse(cleanMonth, "yyyy-MM", new Date()),
                          "MMMM yyyy",
                        );
                      } catch (e) {
                        return selectedBill.month;
                      }
                    })()}
                  </h2>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>

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
                            <li key={sIndex}>
                              • {source.meterName}: ৳
                              {Number(source.amount).toFixed(2)}
                            </li>
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

                <div className="bg-base-200 rounded-md p-5 shadow mt-5">
                  <h3 className="text-lg font-bold">
                    Total Bill: ৳{Number(selectedBill.totalBill).toFixed(2)}
                  </h3>
                  <h3 className="text-xl font-bold mt-2">
                    Bill per person: ৳
                    {Number(selectedBill.billPerPerson).toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
