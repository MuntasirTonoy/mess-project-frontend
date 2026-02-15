"use client";
import { useRouter } from "next/navigation";
import axiosInstance from "../config/api";
import { IoIosSave } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function BillSummary({ summary, clearSummary }) {
  const router = useRouter();

  const prepareDataForSave = (summary) => ({
    month: summary.month,
    madeBy: summary.madeBy,
    totalMembers: summary.totalMembers,
    totalBill: Number(summary.totalBill),
    billPerPerson: Number(summary.billPerPerson),
    billDetails: summary.billDetails.map((util) => ({
      utility: util.utility,
      totalAmount: Number(util.totalAmount),
      sources: util.sources.map((s) => ({
        meterName: s.meterName,
        amount: Number(s.amount),
      })),
    })),
  });

  const handleSave = async () => {
    if (!summary) return;
    try {
      const dataToSave = prepareDataForSave(summary);
      await axiosInstance.post("/api/bills", dataToSave);

      Swal.fire({
        title: "Success!",
        text: "Bill saved successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      clearSummary();
      router.push("/dashboard/bills");
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error!",
        text:
          "Error saving bill: " +
          (error.response?.data?.message || error.message),
        icon: "error",
      });
    }
  };

  return (
    <div className="sticky top-24 h-fit">
      <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-content/10">
        <div className="card-body p-6 sm:p-8">
          {/* Title with Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
              Bill Summary
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-success to-primary rounded-full mx-auto mt-2"></div>
          </div>

          {/* Header Info Table */}
          <div className="bg-base-200/50 rounded-xl p-4 mb-6 border border-base-content/5">
            <table className="table table-sm w-full">
              <tbody>
                <tr className="border-b border-base-content/10">
                  <td className="font-semibold w-2/5 py-2">📅 Month</td>
                  <td className="py-2">
                    <span className="badge badge-primary badge-md px-3">
                      {summary.month}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-base-content/10">
                  <td className="font-semibold py-2">👤 Calculated By</td>
                  <td className="py-2 font-medium">{summary.madeBy}</td>
                </tr>
                <tr className="border-b border-base-content/10">
                  <td className="font-semibold py-2">👥 Total Members</td>
                  <td className="py-2">
                    <span className="badge badge-secondary badge-md">
                      {summary.totalMembers}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">🕒 Issued</td>
                  <td className="text-xs opacity-70 py-2">
                    {summary.issueTime}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Utilities Breakdown */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-base-content/80 mb-3 flex items-center gap-2">
              <FaChartLine />
              UTILITIES BREAKDOWN
            </h3>

            <div className="space-y-3">
              {summary.billDetails.length > 0 ? (
                summary.billDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-base-200 to-base-100 rounded-lg p-4 border border-base-content/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="badge badge-success gap-2 px-3 py-3">
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {detail.utility}
                      </div>
                      <span className="font-bold text-lg text-secondary">
                        ৳{detail.totalAmount}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm font-medium opacity-80">
                      {detail.sources.map((source, sIndex) => (
                        <li key={sIndex} className="flex justify-between">
                          <span>• {source.meterName}</span>
                          <span className="text-base-content/70">
                            ৳{source.amount}
                          </span>
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
          </div>

          {/* Totals Section - Enhanced */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-5 mb-6 border border-primary/20">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-base-content/80">
                Total Bill:
              </span>
              <span className="text-xl font-bold text-primary">
                ৳{summary.totalBill}
              </span>
            </div>
            <div className="divider my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-base-content">
                Bill per Person:
              </span>
              <span className="text-2xl font-bold text-success">
                ৳{summary.billPerPerson}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="btn btn-primary btn-lg w-full gap-2 transition-all"
            >
              <IoIosSave className="text-xl" />
              Save Bill
            </button>
            <button
              onClick={clearSummary}
              className="btn btn-outline btn-error w-full gap-2 transition-all"
            >
              <MdDeleteForever className="text-xl" />
              Clear Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
