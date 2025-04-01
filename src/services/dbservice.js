// src/services/dbService.js
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using your environment variables.
// Make sure these are set in your .env file (and loaded via a library like react-native-dotenv or expo-constants).
const supabaseUrl = process.env.SUPABASE_URL; // e.g., "https://your-project.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Your service role key
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Inserts a simulation record and related data into Supabase.
 *
 * @param {number} monthlyDeposit - The user's monthly deposit input.
 * @param {object} simulationData - An object containing:
 *   - accumulation: Array of accumulation data objects.
 *   - loanSchedule: Array of loan schedule data objects.
 *   - assetValueTab: Array of asset value data objects.
 * @returns {Promise<string>} The new simulation's ID.
 */
export async function createSimulation(monthlyDeposit, simulationData) {
  // Insert the overall simulation data into the "simulations" table.
  const { data: simData, error: simError } = await supabase
    .from('simulations')
    .insert([{ monthly_deposit: monthlyDeposit }])
    .single();
  
  if (simError) {
    console.error('Error inserting simulation:', simError);
    throw simError;
  }
  
  const simulationId = simData.id;
  
  // Insert accumulation data.
  const accumulationRows = simulationData.accumulation.map(item => ({
    simulation_id: simulationId,
    year: item.year,
    beginning_cash_value: item.beginningCashValue,
    vie_deposits: item.vieDeposits,
    customer_deposits: item.customerDeposits,
    policy_credit: item.policyCredit,
    amount_credited: item.amountCredited,
    policy_cash_value: item.policyCashValue,
    amount_deposited_by_customer: item.amountDepositedByCustomer
  }));
  
  const { error: accError } = await supabase
    .from('accumulation')
    .insert(accumulationRows);
  if (accError) {
    console.error('Error inserting accumulation data:', accError);
    throw accError;
  }
  
  // Insert loan schedule data.
  const loanScheduleRows = simulationData.loanSchedule.map(item => ({
    simulation_id: simulationId,
    year: item.year,
    starting_balance: item.startingBalance,
    you_paid: item.youPaid,
    interest: item.interest,
    principal: item.principal,
    ending_balance: item.endingBalance,
    finance_charge: item.financeCharge
  }));
  
  const { error: loanError } = await supabase
    .from('loan_schedule')
    .insert(loanScheduleRows);
  if (loanError) {
    console.error('Error inserting loan schedule data:', loanError);
    throw loanError;
  }
  
  // Insert asset value data.
  const assetValueRows = simulationData.assetValueTab.map(item => ({
    simulation_id: simulationId,
    year: item.year,
    asset_value: item.assetValue,
    owed_on_lift_off_loan: item.owedOnLiftOffLoan,
    avail_for_managed_investing: item.availForManagedInvesting,
    avail_for_spending: item.availForSpending
  }));
  
  const { error: assetError } = await supabase
    .from('asset_value')
    .insert(assetValueRows);
  if (assetError) {
    console.error('Error inserting asset value data:', assetError);
    throw assetError;
  }
  
  return simulationId;
}