"use client";
import { useState } from "react";
import BillSummary from "../components/BillSummary";
import CalculatorForm from "../components/CalculatorForm";
import Swal from "sweetalert2";

// Configuration for utilities (used to populate the initial state if desired,
// but the CalculatorForm handles the dynamic adding now, so we remove the old hardcoded list.)

export default function BillCalculator() {
  const [summary, setSummary] = useState(null);
  // A dummy formData state is NOT needed as CalculatorForm manages it internally.
  const calculateBill = (formDataFromForm) => {
    // Use the data received from the CalculatorForm
    const dataToCalculate = formDataFromForm;

    // 1. Calculate Total Bill
    const totalBill = dataToCalculate.utilities.reduce(
      (sum, util) => sum + util.totalAmount,
      0,
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
      Swal.fire({
        title: "Empty Bill",
        text: "The total bill is ৳0. Please enter amounts for meters before calculating.",
        icon: "warning",
      });
    }

    setSummary(summaryData);
  };

  const clearSummary = () => {
    setSummary(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title with enhanced styling */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3 animate-slide-up">
            Bill Manager
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto animate-slide-up delay-200">
            Calculate and manage your utility bills with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Calculator Form Section */}
          <div className="lg:col-span-2">
            <CalculatorForm
              calculateBill={calculateBill}
              setSummary={setSummary}
            />
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            {summary ? (
              <BillSummary summary={summary} clearSummary={clearSummary} />
            ) : (
              <div className="sticky top-24 h-fit">
                <div className="card bg-gradient-to-br from-base-300 to-base-200 border border-base-content/10 backdrop-blur-sm">
                  <div className="card-body items-center text-center p-8 sm:p-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 sm:h-12 sm:w-12 text-primary"
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
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2 animate-fade-in delay-300">
                      Ready to Calculate
                    </h3>
                    <p className="text-sm sm:text-base text-base-content/60 animate-fade-in delay-400">
                      Enter your utility information and calculate the total
                      bill amount per person
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
