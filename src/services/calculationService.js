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
// --- New Calculation Functions ---
// Calculate PMT is already defined above as PMT(rate, nper, pv)
// If needed, you can alias it as pmt for consistency:
const pmt = PMT;

/**
 * Calculates values for the Lift-Off Loan Schedule.
 * @param {number} userMonthlyDeposit - The monthly deposit from user input.
 * @param {number} inputG3 - Input value (for example, from cell G3).
 * @returns {object} Computed values for a loan schedule row.
 */
export function calculateLiftOffLoan(userMonthlyDeposit, inputG3) {
  // StartingBalance = if(G3 > 0, G3, 0)
  const startingBalance = inputG3 > 0 ? inputG3 : 0;
  // You Paid = if(StartingBalance > 0.0001, PMT(15%, 20, -userMonthlyDeposit*24), 0)
  const youPaid = startingBalance > 0.0001 ? pmt(0.15, 20, -userMonthlyDeposit * 24) : 0;
  // Interest = StartingBalance * 15%
  const interest = startingBalance * 0.15;
  // Principal = You Paid - Interest
  const principal = youPaid - interest;
  // EndingBalance = StartingBalance - Principal (not negative)
  let endingBalance = startingBalance - principal;
  if (endingBalance < 0) endingBalance = 0;
  // Finance Charge (constant)
  const financeCharge = 3000.0;
  
  return {
    startingBalance: parseFloat(startingBalance.toFixed(2)),
    youPaid: parseFloat(youPaid.toFixed(2)),
    interest: parseFloat(interest.toFixed(2)),
    principal: parseFloat(principal.toFixed(2)),
    endingBalance: parseFloat(endingBalance.toFixed(2)),
    financeCharge: financeCharge
  };
}

/**
 * Calculates values for the Accumulation table.
 * @param {number} userMonthlyDeposit - The user's monthly deposit.
 * @param {number} beginningCashValue - The beginning cash value (from previous row or initial value).
 * @param {number} customerDeposits - Amount deposited by customer.
 * @param {number} policyCredit - The policy credit rate (e.g., 0.12 for 12%).
 * @returns {object} Computed values for an accumulation row.
 */
export function calculateAccumulation(userMonthlyDeposit, beginningCashValue, customerDeposits, policyCredit) {
  // Vie Deposits = monthly deposit * 12
  const vieDeposits = userMonthlyDeposit * 12;
  // Amount Credited = Beginning Cash Value * Policy Credit
  const amountCredited = beginningCashValue * policyCredit;
  // Policy Cash Value = Beginning Cash Value + Vie Deposits + Customer Deposits + Amount Credited
  const policyCashValue = beginningCashValue + vieDeposits + customerDeposits + amountCredited;
  // Amount Deposited by Customer = Customer Deposits + Policy Cash Value (adjust if needed)
  const amountDepositedByCustomer = customerDeposits + policyCashValue;
  
  return {
    beginningCashValue: parseFloat(beginningCashValue.toFixed(2)),
    vieDeposits: parseFloat(vieDeposits.toFixed(2)),
    customerDeposits: parseFloat(customerDeposits.toFixed(2)),
    policyCredit,
    amountCredited: parseFloat(amountCredited.toFixed(2)),
    policyCashValue: parseFloat(policyCashValue.toFixed(2)),
    amountDepositedByCustomer: parseFloat(amountDepositedByCustomer.toFixed(2))
  };
}

/**
 * Calculates values for the Customer Spending table.
 * @param {number} beginningBalance - The beginning balance (e.g., from cell F3).
 * @param {number} userMonthlyDeposit - The monthly deposit from user input.
 * @returns {object} Computed values for a customer spending row.
 */
export function calculateCustomerSpending(beginningBalance, userMonthlyDeposit) {
  // Spent = monthly deposit * 12
  const spent = userMonthlyDeposit * 12;
  // Loan Rate is fixed at 4%
  const loanRate = 0.04;
  // Loan Interest = (Beginning Balance + Spent) * Loan Rate
  const loanInterest = (beginningBalance + spent) * loanRate;
  // End Loan Balance = Beginning Balance + Spent + Loan Interest
  const endLoanBalance = beginningBalance + spent + loanInterest;
  // Amount Spent by Customer = Spent + (assumed additional amount; adjust as needed)
  const amountSpentByCustomer = spent + spent;
  
  return {
    beginningBalance: parseFloat(beginningBalance.toFixed(2)),
    spent: parseFloat(spent.toFixed(2)),
    loanRate,
    loanInterest: parseFloat(loanInterest.toFixed(2)),
    endLoanBalance: parseFloat(endLoanBalance.toFixed(2)),
    amountSpentByCustomer: parseFloat(amountSpentByCustomer.toFixed(2))
  };
}

/**
 * Calculates values for the Asset Value table.
 * @param {number} policyCashValue - The Policy Cash Value from the Accumulation table.
 * @param {number} endLoanBalance - The End Loan Balance from the Customer Spending table.
 * @param {number} owedOnLiftOffLoan - The amount owed on the lift-off loan.
 * @returns {object} Computed values for an asset value row.
 */
export function calculateAssetValue(policyCashValue, endLoanBalance, owedOnLiftOffLoan) {
  // Asset Value = Policy Cash Value - End Loan Balance (for YR00, adjust if needed)
  const assetValue = policyCashValue - endLoanBalance;
  // Avail. for Managed Investing = Asset Value (or could be adjusted further)
  const availForManagedInvesting = assetValue;
  // Avail. for Spending = if(Asset Value - Owed on Lift-Off Loan > 0, Asset Value - Owed on Lift-Off Loan, 0)
  const availForSpending = (assetValue - owedOnLiftOffLoan) > 0 ? assetValue - owedOnLiftOffLoan : 0;
  
  return {
    assetValue: parseFloat(assetValue.toFixed(2)),
    owedOnLiftOffLoan: parseFloat(owedOnLiftOffLoan.toFixed(2)),
    availForManagedInvesting: parseFloat(availForManagedInvesting.toFixed(2)),
    availForSpending: parseFloat(availForSpending.toFixed(2))
  };
}
