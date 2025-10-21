"use client";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../config/api";
import { IoIosSave } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";

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
      const response = await fetch(`${API_BASE_URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error("Failed to save bill on the server.");

      alert("✅ Bill saved successfully!");
      clearSummary();
      router.push("/dashboard/bills");
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Error saving bill: " + error.message);
    }
  };

  return (
    <div className="card bg-base-300 shadow-sm ">
      <div className="card-body">
        {/* Title */}
        <div className="text-center">
          <h2 className="card-title text-3xl font-bold border-b-2 pb-3 border-gray-300  mb-2 ">
            🧾Bill Summary
          </h2>
        </div>

        {/* Header Info (Now in Table Format) */}
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="font-semibold w-40">📅 Month</td>
                <td>
                  <span className="badge badge-outline badge-primary text-base px-3 py-1">
                    {summary.month}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold">👤 Calculated By</td>
                <td>{summary.madeBy}</td>
              </tr>
              <tr>
                <td className="font-semibold">👥 Total Members</td>
                <td>{summary.totalMembers}</td>
              </tr>
              <tr>
                <td className="font-semibold">🕒 Issued</td>
                <td className="text-xs opacity-70">{summary.issueTime}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Utilities Breakdown */}
        <div className="mt-3 space-y-3">
          <h3 className="text-lg font-semibold text-base-content/80 flex items-center gap-2">
            <FaChartLine /> Utilities Breakdown
          </h3>

          {summary.billDetails.length > 0 ? (
            summary.billDetails.map((detail, index) => (
              <div
                key={index}
                className="card bg-base-100  rounded-md p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm text-white bg-green-500 py-1 px-4 rounded-full font-semibold">
                    {detail.utility}
                  </h4>
                  <span className="badge badge-lg badge-secondary text-base px-3">
                    ৳{detail.totalAmount}
                  </span>
                </div>
                <ul className="mt-2 text-sm font-semibold opacity-80 space-y-1">
                  {detail.sources.map((source, sIndex) => (
                    <li key={sIndex}>
                      • {source.meterName}: ৳{source.amount}
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

        {/* Totals Section */}
        <div className="bg-base-100  rounded-md p-5 shadow-md mt-4">
          <h3 className="text-lg font-bold ">
            Total Bill: ৳{summary.totalBill}
          </h3>
          <h3 className="text-xl font-bold  mt-2">
            Bill per person: ৳{summary.billPerPerson}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="card-actions mt-6 flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="btn btn-primary w-full text-lg "
          >
            <IoIosSave />
            Save Bill
          </button>
          <button
            onClick={clearSummary}
            className="btn btn-outline btn-error w-full font-semibold"
          >
            <MdDeleteForever /> Clear Summary
          </button>
        </div>
      </div>
    </div>
  );
}
