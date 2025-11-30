"use client";
import { useState } from "react";

const SELECTABLE_UTILITIES = ["Electric Bill", "Water Bill", "Extra", "Others"];

// Helper to check utility type
const isElectric = (label) => label === "Electric Bill";

const getInitialState = (defaultName = "Admin User") => ({
  month: new Date().toISOString().slice(0, 7),
  madeBy: defaultName,
  totalMembers: 0,
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
      alert(`Utility "${utilityName}" already added.`);
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
            !formData.utilities.some((u) => u.label === n) && n !== utilityName
        ) || "",
    });
  };

  const handleUtilityRemoval = (index) => {
    const newUtilities = formData.utilities.filter((_, i) => i !== index);
    setFormData({ ...formData, utilities: newUtilities });
    setSummary(null);
  };

  return (
    <div className="card bg-base-300 shadow-lg p-8">
      <h2 className="card-title  border-b-2 border-gray-400 pb-2 text-2xl mb-6">
        Bill Input Form
      </h2>

      {/* General Inputs */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Bill Month</span>
          </label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleOtherInputChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Calculated By</span>
          </label>
          <input
            type="text"
            name="madeBy"
            value={formData.madeBy}
            onChange={handleOtherInputChange}
            className="input input-bordered w-full"
            placeholder="Your Name"
          />
        </div>
      </div>

      {/* Total Members */}
      <div className="form-control mb-8">
        <label className="label">
          <span className="label-text text-lg font-semibold ">
            Total Members
          </span>
        </label>
        <input
          type="number"
          name="totalMembers"
          value={formData.totalMembers}
          onChange={handleOtherInputChange}
          className="input input-bordered input-primary text-lg font-semibold w-full"
        />
      </div>

      {/* Add Utility Section */}
      <div className="flex gap-3 mb-6">
        <select
          className="select select-bordered grow"
          value={formData.newUtilityName}
          onChange={(e) =>
            setFormData({ ...formData, newUtilityName: e.target.value })
          }
        >
          {SELECTABLE_UTILITIES.filter(
            (n) => !formData.utilities.some((u) => u.label === n)
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
          className="btn btn-primary"
        >
          + Add
        </button>
      </div>

      {/* Utilities Section */}
      {formData.utilities.length === 0 && (
        <p className="text-center text-gray-500 my-6">
          Use “Add” to begin adding utilities.
        </p>
      )}

      {formData.utilities.map((utility, uIndex) => (
        <div
          key={utility.name + uIndex}
          className="card bg-base-100 shadow-sm mb-6 p-6 relative"
        >
          <button
            type="button"
            onClick={() => handleUtilityRemoval(uIndex)}
            className="btn btn-sm btn-circle btn-error absolute top-2 right-2"
          >
            ✕
          </button>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md text-white bg-green-500 py-1 px-4 rounded-full font-semibold">
              {utility.label}
            </h3>
            {isElectric(utility.label) && (
              <div className="form-control w-40">
                <label className="label">
                  <span className="label-text text-sm">Meters</span>
                </label>
                <select
                  value={utility.sources.length}
                  onChange={(e) =>
                    handleUtilitySourcesChange(uIndex, e.target.value)
                  }
                  className="select select-bordered select-sm"
                >
                  {[...Array(3).keys()].map((i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Sources / Amount Inputs */}
          {isElectric(utility.label) ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {utility.sources.map((source, sIndex) => (
                <div key={sIndex} className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {source.meterName} Amount (৳)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={source.amount}
                    onChange={(e) =>
                      handleSourceAmountChange(uIndex, sIndex, e.target.value)
                    }
                    className="input input-bordered"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount (৳)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={utility.totalAmount}
                  onChange={(e) =>
                    handleUtilityAmountChange(uIndex, e.target.value)
                  }
                  className="input input-bordered"
                />
              </div>
            </div>
          )}

          <div className="mt-4 border-t pt-3 text-right text-lg font-bold text-secondary">
            Total: ৳{utility.totalAmount.toFixed(2)}
          </div>
        </div>
      ))}

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={formData.utilities.length === 0}
        className="btn btn-success w-full text-lg font-bold mt-6"
      >
        CALCULATE
      </button>
    </div>
  );
}
