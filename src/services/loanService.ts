import { LoanApplication } from '../types';

export const defaultLoanRequest: LoanApplication = {
  id: 'loan_app_2026_0901',
  borrowerId: 'usr_ahmed_ba_2026',
  borrowerName: 'Ahmed Ben Ali',
  amount: 1000,
  currency: 'TND',
  purpose: 'Laptop for freelance work',
  termDays: 90,
  interestRateAnnual: 4.5,
  monthlyRepayment: 337,
  collateral: 'None',
  status: 'DRAFT',
  principalHbar: 5,
  installmentCount: 3,
  installmentsPaid: 0,
  installmentAmountHbar: 1.67,
  repayments: []
};

export class LoanService {
  private static STORAGE_KEY = 'trustline_active_loan_v1';

  public static getActiveLoan(): LoanApplication {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored loan', e);
      }
    }
    return { ...defaultLoanRequest };
  }

  public static saveLoan(loan: LoanApplication): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(loan));
  }

  public static resetLoan(): LoanApplication {
    const fresh = { ...defaultLoanRequest };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}
