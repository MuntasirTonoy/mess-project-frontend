"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import Link from "next/link";
import {
  FaTrashAlt,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaCalculator,
} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

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
      <div className="p-10 text-center text-xl  animate-pulse">
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
    <div className="container mx-auto p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-3">
        <FaMoneyBillWave />
        Bill History Dashboard
      </h1>

      {/* No Bills */}
      {bills.length === 0 ? (
        <div className="p-10 text-center bg-base-200 rounded-xl shadow-inner">
          <p className="text-xl opacity-80 mb-4">
            No bills saved yet. Start calculating!
          </p>
          <Link
            href="/"
            className="btn btn-primary   btn-lg font-bold gap-2 mt-2"
          >
            <FaCalculator />
            Go to Calculator
          </Link>
        </div>
      ) : (
        // Bill Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="card bg-base-300 border border-base-300 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="card-body space-y-3">
                {/* Header */}
                <h2 className="text-2xl font-bold  flex items-center gap-2">
                  <FaCalendarAlt />
                  {bill.month}
                </h2>

                {/* Sub Info */}
                <div className="text-sm opacity-80">
                  <p className="flex items-center gap-2">
                    <FaUser /> {bill.madeBy}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaUsers /> {bill.totalMembers} Members
                  </p>
                </div>

                <div className="divider my-2"></div>

                {/* Bill Totals */}
                <div className="space-y-2">
                  <p className="flex justify-between text-lg font-semibold">
                    <span>Total Bill:</span>
                    <span>৳{bill.totalBill.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between text-xl font-bold ">
                    <span>Per Person:</span>
                    <span>৳{bill.billPerPerson.toFixed(2)}</span>
                  </p>
                </div>

                {/* Timestamp */}
                <p className="text-xs opacity-60 border-t pt-2">
                  Issued: {new Date(bill.issueTime).toLocaleDateString()} at{" "}
                  {new Date(bill.issueTime).toLocaleTimeString()}
                </p>

                {/* Delete Button (bottom) */}
                {MOCK_CURRENT_USER.role === "admin" && (
                  <div className="card-actions mt-4">
                    <button
                      onClick={() => handleDelete(bill._id, bill.month)}
                      className="btn btn-outline btn-error w-full flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaTrashAlt />
                      Delete Bill
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
