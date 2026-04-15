export interface Transaction {
  id?: number;
  type: string;
  amount: number;
  date: number; // Unix ms timestamp
  description: string;
  category: string;
}
