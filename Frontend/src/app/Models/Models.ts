export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: Date;
  userId: string;
}

export interface ExpenseResponse {
  count: number;
  results: Expense[];
}

export interface Category {
  id: number;
  userId: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}
