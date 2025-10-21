"use client";
import { useState } from "react";
import BillSummary from "../components/BillSummary";
import CalculatorForm from "../components/CalculatorForm";

// Configuration for utilities (used to populate the initial state if desired,
// but the CalculatorForm handles the dynamic adding now, so we remove the old hardcoded list.)

// Initial state for the entire application (Must use YYYY-MM format for the month input)
const getInitialState = (defaultName = "Admin User") => ({
  // FIX 1: Change month format to YYYY-MM for the input type="month"
  month: new Date().toISOString().slice(0, 7),
  madeBy: defaultName,
  totalMembers: 4,

  // FIX 2: START WITH AN EMPTY UTILITIES ARRAY
  // The CalculatorForm will manage adding utilities dynamically via its internal state.
  utilities: [],

  // We can also remove the 'utilities' array from here, but since the CalculatorForm
  // manages its own state now, we just ensure we pass the correct functions.
  // NOTE: If you stick to the old hardcoded list, the CalculatorForm MUST NOT be the one
  // I fixed in the previous step. We'll proceed assuming you're using the DYNAMIC FORM.
});

export default function BillCalculator() {
  // We will let CalculatorForm manage its own formData and only worry about the summary here.
  const [summary, setSummary] = useState(null);

  // NOTE: Your provided code relies on the parent managing formData, but the
  // CalculatorForm provided earlier manages formData internally.
  // Let's assume the CalculatorForm now manages its state internally
  // and sends the data back via the calculateBill function.

  // A dummy formData state is needed if you want to pass setSummary to the child
  // which is not directly used for rendering here, but for demonstration:
  const [formData, setFormData] = useState(getInitialState());

  // FIX 3: Update calculateBill to accept data, as the CalculatorForm component
  // needs to send its internal state (formData) when the button is clicked.
  // (This ensures separation of concerns.)
  const calculateBill = (formDataFromForm) => {
    // Use the data received from the CalculatorForm
    const dataToCalculate = formDataFromForm;

    // 1. Calculate Total Bill
    const totalBill = dataToCalculate.utilities.reduce(
      (sum, util) => sum + util.totalAmount,
      0
    );

    // Ensure totalMembers is at least 1 to avoid division by zero
    const members =
      dataToCalculate.totalMembers > 0 ? dataToCalculate.totalMembers : 1;

    // 2. Calculate Bill Per Person
    const billPerPerson = totalBill / members;

    // 3. Prepare Summary Data
    const summaryData = {
      month: dataToCalculate.month || new Date().toISOString().slice(0, 7),
      issueTime: new Date().toLocaleString(),
      madeBy: dataToCalculate.madeBy,
      totalMembers: members,
      totalBill: totalBill.toFixed(2),
      billPerPerson: billPerPerson.toFixed(2),

      // Filter out utilities with zero cost for a cleaner summary
      billDetails: dataToCalculate.utilities
        .filter((u) => u.totalAmount > 0)
        .map((u) => ({
          utility: u.label,
          totalAmount: u.totalAmount,
          sources: u.sources.map((s) => ({
            meterName: s.meterName,
            amount: s.amount,
          })),
        })),
    };

    if (totalBill === 0) {
      alert(
        "The total bill is ৳0. Please enter amounts for meters before calculating."
      );
    }

    setSummary(summaryData);
  };

  const clearSummary = () => {
    setSummary(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl  lg:text-5xl font-semibold text-base-content mb-8 underline text-center ">
        Bill Manager
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CalculatorForm
            calculateBill={calculateBill}
            setSummary={setSummary}
          />
        </div>

        {/* === SUMMARY SECTION (1/3 width) === */}
        <div className="lg:col-span-1">
          {summary ? (
            <BillSummary summary={summary} clearSummary={clearSummary} />
          ) : (
            <div className="h-full flex items-center justify-center p-6 bg-yellow-50 rounded-xl shadow-md border-l-4 border-yellow-400">
              <p className="text-lg text-gray-600 font-medium">
                Click **CALCULATE** to view the breakdown and save the bill.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
