// browser-db.service.ts
import { Injectable } from '@angular/core';
import { IDataService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class BrowserDbService implements IDataService {
  async init(): Promise<void> {
    return;
    
  }
  private transactions: any[] = [];

  async addTransaction(tx: any): Promise<number> {
    const id = Date.now();
    this.transactions.push({ ...tx, id });
    return id;
  }

  async getAllTransactions(): Promise<any[]> {
    return [...this.transactions].sort((a, b) => b.date - a.date);
  }

  async getTransactionsByDateRange(start: number, end: number): Promise<any[]> {
    return this.transactions
      .filter((t) => t.date >= start && t.date <= end)
      .sort((a, b) => a.date - b.date);
  }
}
