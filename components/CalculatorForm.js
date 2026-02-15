"use client";
import { useState } from "react";

const SELECTABLE_UTILITIES = ["Electric Bill", "Water Bill", "Extra", "Others"];
import Swal from "sweetalert2";

// Helper to check utility type
const isElectric = (label) => label === "Electric Bill";

const getInitialState = (defaultName = "Tonoy") => ({
  month: new Date().toISOString().slice(0, 7),
  madeBy: defaultName,
  totalMembers: 1, // Fixed: Start with 1 member instead of 0
  utilities: [],
  newUtilityName: SELECTABLE_UTILITIES[0],
});

export default function CalculatorForm({ calculateBill, setSummary }) {
  const [formData, setFormData] = useState(getInitialState());

  const handleCalculate = () => calculateBill(formData);

  const handleSourceAmountChange = (utilityIndex, sourceIndex, value) => {
    const newUtilities = [...formData.utilities];
    const newSources = [...newUtilities[utilityIndex].sources];
    const amount = Number(value) >= 0 ? Number(value) : 0;
    newSources[sourceIndex].amount = amount;
    const totalAmount = newSources.reduce((sum, s) => sum + s.amount, 0);
    newUtilities[utilityIndex].sources = newSources;
    newUtilities[utilityIndex].totalAmount = totalAmount;
    setFormData({ ...formData, utilities: newUtilities });
  };

  // For non-electric utilities: single amount field
  const handleUtilityAmountChange = (utilityIndex, value) => {
    const newUtilities = [...formData.utilities];
    const amount = Number(value) >= 0 ? Number(value) : 0;
    newUtilities[utilityIndex].sources = [{ meterName: "Total", amount }];
    newUtilities[utilityIndex].totalAmount = amount;
    setFormData({ ...formData, utilities: newUtilities });
  };

  const handleUtilitySourcesChange = (utilityIndex, newSourceCount) => {
    const count = Number(newSourceCount) > 0 ? Number(newSourceCount) : 1;
    const newUtilities = [...formData.utilities];
    const utility = newUtilities[utilityIndex];
    const newSources = Array(count)
      .fill()
      .map((_, i) => ({
        meterName: `Meter ${i + 1}`,
        amount: utility.sources[i] ? utility.sources[i].amount : 0,
      }));
    utility.sources = newSources;
    utility.totalAmount = newSources.reduce((sum, s) => sum + s.amount, 0);
    setFormData({ ...formData, utilities: newUtilities });
  };

  const handleOtherInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "totalMembers" ? Number(value) || 0 : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleAddNewUtility = () => {
    const utilityName = formData.newUtilityName;
    if (formData.utilities.some((u) => u.label === utilityName)) {
      Swal.fire({
        title: "Already Added",
        text: `Utility "${utilityName}" is already in your list.`,
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    const newUtility = {
      name: utilityName.toLowerCase().replace(/\s/g, "_"),
      label: utilityName,
      sources: isElectric(utilityName)
        ? [{ meterName: "Meter 1", amount: 0 }]
        : [{ meterName: "Total", amount: 0 }],
      totalAmount: 0,
    };
    setFormData({
      ...formData,
      utilities: [...formData.utilities, newUtility],
      newUtilityName:
        SELECTABLE_UTILITIES.find(
          (n) =>
            !formData.utilities.some((u) => u.label === n) && n !== utilityName,
        ) || "",
    });
  };

  const handleUtilityRemoval = (index) => {
    const newUtilities = formData.utilities.filter((_, i) => i !== index);
    setFormData({ ...formData, utilities: newUtilities });
    setSummary(null);
  };

  return (
    <div className="card bg-base-100 border border-base-content/10 transition-all duration-300">
      <div className="card-body p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
            Bill Input Form
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        {/* General Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">
                📅 Bill Month
              </span>
            </label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleOtherInputChange}
              className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base">
                👤 Calculated By
              </span>
            </label>
            <input
              type="text"
              name="madeBy"
              value={formData.madeBy}
              onChange={handleOtherInputChange}
              className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Total Members - Highlighted */}
        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text text-lg font-bold text-base-content flex items-center gap-2">
              👥 Total Members
              <span className="badge badge-primary badge-sm">Required</span>
            </span>
          </label>
          <input
            type="number"
            name="totalMembers"
            value={formData.totalMembers}
            onChange={handleOtherInputChange}
            className="input input-bordered input-lg input-primary text-xl font-semibold w-full focus:ring-2 focus:ring-primary/50 transition-all"
            min="1"
          />
        </div>

        {/* Utilities Section Header */}
        <div className="divider divider-start font-semibold text-base-content/80">
          <span className="flex items-center gap-2">
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
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Utilities
          </span>
        </div>

        {/* Add Utility Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            className="select select-bordered select-primary flex-1 focus:ring-2 focus:ring-primary/50 transition-all"
            value={formData.newUtilityName}
            onChange={(e) =>
              setFormData({ ...formData, newUtilityName: e.target.value })
            }
          >
            {SELECTABLE_UTILITIES.filter(
              (n) => !formData.utilities.some((u) => u.label === n),
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddNewUtility}
            disabled={formData.utilities.length === SELECTABLE_UTILITIES.length}
            className="btn btn-primary btn-md sm:btn-wide gap-2"
          >
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Utility
          </button>
        </div>

        {/* Empty State */}
        {formData.utilities.length === 0 && (
          <div className="alert mb-6 bg-base-200 border border-base-content/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-sm sm:text-base">
              Click &quot;Add Utility&quot; to start adding bills.
            </span>
          </div>
        )}

        {/* Utilities List */}
        <div className="space-y-4 mb-6">
          {formData.utilities.map((utility, uIndex) => (
            <div
              key={utility.name + uIndex}
              className="card bg-gradient-to-br from-base-200 to-base-100 border border-base-content/10 transition-all duration-300"
            >
              <div className="card-body p-4 sm:p-6 relative">
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleUtilityRemoval(uIndex)}
                  className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 hover:btn-error transition-all"
                >
                  ✕
                </button>

                {/* Utility Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <div className="badge badge-lg badge-primary gap-2 px-4 py-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                    {utility.label}
                  </div>
                  {isElectric(utility.label) && (
                    <div className="form-control w-full sm:w-40">
                      <label className="label py-0">
                        <span className="label-text text-xs font-medium">
                          Number of Meters
                        </span>
                      </label>
                      <select
                        value={utility.sources.length}
                        onChange={(e) =>
                          handleUtilitySourcesChange(uIndex, e.target.value)
                        }
                        className="select select-bordered select-sm focus:ring-2 focus:ring-primary/50"
                      >
                        {[...Array(3).keys()].map((i) => (
                          <option key={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Amount Inputs */}
                {isElectric(utility.label) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {utility.sources.map((source, sIndex) => (
                      <div key={sIndex} className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs sm:text-sm font-medium">
                            {source.meterName}
                          </span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={source.amount}
                          onChange={(e) =>
                            handleSourceAmountChange(
                              uIndex,
                              sIndex,
                              e.target.value,
                            )
                          }
                          className="input input-bordered input-sm sm:input-md focus:ring-2 focus:ring-primary/50"
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-sm font-medium">
                        Amount (৳)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={utility.totalAmount}
                      onChange={(e) =>
                        handleUtilityAmountChange(uIndex, e.target.value)
                      }
                      className="input input-bordered focus:ring-2 focus:ring-primary/50"
                      placeholder="0.00"
                    />
                  </div>
                )}

                {/* Total Display */}
                <div className="mt-4 pt-4 border-t border-base-content/10 flex justify-between items-center">
                  <span className="text-sm font-medium text-base-content/70">
                    Subtotal:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-secondary">
                    ৳{utility.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={formData.utilities.length === 0}
          className="btn btn-success btn-lg w-full text-lg font-bold transition-all gap-2 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          CALCULATE BILL
        </button>
      </div>
    </div>
  );
}
