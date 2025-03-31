//
//  calculationService.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//


// src/services/calculationService.js

/**
 * PMT function calculates a loan payment based on constant payments and a fixed interest rate.
 * Formula: PMT = (rate * pv) / (1 - (1 + rate)^(-nper))
 */
export function PMT(rate, nper, pv) {
  return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
}

/**
 * Calculates dashboard data based on our spreadsheet logic.
 * - Accumulation Tab (YR00 to YR25) using exact growth rate sequence.
 * - Lift-Off Loan Tab (YR01 to YR20) with precise financial formulas.
 * - Asset Value Tab computed from accumulation and loan schedule.
 *
 * @param {number} monthlyDeposit - The user input.
 * @returns {object} Data for accumulation, loanSchedule, and assetValueTab.
 */
export function fetchDashboardData(monthlyDeposit) {
  const accumulationYears = 26; // YR00 to YR25
  const growthRates = [
    0,    // YR00
    0.12, // YR01
    0.08, // YR02
    0.04, // YR03
    0,    // YR04
    0.08, // YR05
    0.12, // YR06
    0.12, // YR07
    0,    // YR08
    0.08, // YR09
    0.08, // YR10
    0.12, // YR11
    0.08, // YR12
    0,    // YR13
    0.08, // YR14
    0.12, // YR15
    0.08, // YR16
    0.12, // YR17
    0.04, // YR18
    0.08, // YR19
    0.12, // YR20
    0,    // YR21
    0.12, // YR22
    0.08, // YR23
    0,    // YR24
    0.12  // YR25
  ];

  let accumulation = [];
  const initialCash = 0;
  for (let i = 0; i < accumulationYears; i++) {
    const id = i === 0 ? "YR00" : `YR${String(i).padStart(2, '0')}`;
    const beginningCashValue = i === 0 ? initialCash : accumulation[i - 1].policyCashValue;
    const vieDeposits = 0;
    const customerDeposits = monthlyDeposit * 12;
    const policyCredit = growthRates[i];
    const amountCredited = beginningCashValue * policyCredit;
    const policyCashValue = beginningCashValue + vieDeposits + customerDeposits + amountCredited;
    const amountDepositedByCustomer = customerDeposits + policyCashValue;

    accumulation.push({
      id,
      beginningCashValue: parseFloat(beginningCashValue.toFixed(2)),
      vieDeposits: parseFloat(vieDeposits.toFixed(2)),
      customerDeposits: parseFloat(customerDeposits.toFixed(2)),
      policyCredit,
      amountCredited: parseFloat(amountCredited.toFixed(2)),
      policyCashValue: parseFloat(policyCashValue.toFixed(2)),
      amountDepositedByCustomer: parseFloat(amountDepositedByCustomer.toFixed(2))
    });
  }

  const loanScheduleYears = 20;
  const loanAmount = monthlyDeposit * 24;
  const loanRate = 0.15;
  const totalLoanYears = 20;
  const annualPaymentCalc = PMT(loanRate, totalLoanYears, -loanAmount);

  let loanSchedule = [];
  for (let i = 1; i <= loanScheduleYears; i++) {
    const accRow = accumulation[i];
    const startingBalance = accRow.policyCashValue > 0 ? accRow.policyCashValue : 0;
    const youPaid = startingBalance > 0.0001 ? PMT(loanRate, totalLoanYears, -loanAmount) : 0;
    const interest = startingBalance * loanRate;
    const principal = youPaid - interest;
    let endingBalance = startingBalance - principal;
    if (endingBalance < 0) endingBalance = 0;

    loanSchedule.push({
      id: accRow.id,
      startingBalance: parseFloat(startingBalance.toFixed(2)),
      youPaid: parseFloat(youPaid.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      principal: parseFloat(principal.toFixed(2)),
      endingBalance: parseFloat(endingBalance.toFixed(2)),
      financeCharge: 3000.00
    });
  }

  let assetValueTab = [];
  for (let i = 0; i < loanSchedule.length; i++) {
    const accRow = accumulation[i + 1]; // Corresponds to YR01 and beyond
    const loanRow = loanSchedule[i];
    const assetValue = accRow.policyCashValue - loanRow.endingBalance;
    const owedOnLiftOffLoan = assetValue - (loanRow.youPaid + loanRow.financeCharge);
    const availForManagedInvesting = assetValue;
    const availForSpending = assetValue - owedOnLiftOffLoan > 0 ? assetValue - owedOnLiftOffLoan : 0;

    assetValueTab.push({
      id: loanRow.id,
      assetValue: parseFloat(assetValue.toFixed(2)),
      owedOnLiftOffLoan: parseFloat(owedOnLiftOffLoan.toFixed(2)),
      availForManagedInvesting: parseFloat(availForManagedInvesting.toFixed(2)),
      availForSpending: parseFloat(availForSpending.toFixed(2))
    });
  }

  return {
    accumulation,
    loanSchedule,
    assetValueTab
  };
}