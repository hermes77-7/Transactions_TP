import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService implements IDataService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;
  private readonly dbName = 'smallbiz_ledger';
  private readonly dbVersion = 1;

  private readonly createTableSQL = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date INTEGER NOT NULL,
      description TEXT,
      category TEXT
    );
  `;

  private async ensureDb(): Promise<SQLiteDBConnection> {
    if (this.initialized && this.db) return this.db;

this.db = await this.sqlite.createConnection(
  this.dbName,
  false,
  'no-encryption',
  this.dbVersion,
  false
);

    await this.db.open();
    await this.db.execute(this.createTableSQL);

    this.initialized = true;
    return this.db;
  }

  async init(): Promise<void> {
    await this.ensureDb();
  }

  async addTransaction(tx: Omit<Transaction, 'id'>): Promise<number> {
    const db = await this.ensureDb();

    const sql = `
      INSERT INTO transactions (type, amount, date, description, category)
      VALUES (?, ?, ?, ?, ?)
    `;

    const res = await db.run(sql, [
      tx.type,
      tx.amount,
      tx.date,
      tx.description,
      tx.category,
    ]);

return res.changes?.lastId ?? 0;  }

  async getAllTransactions(): Promise<Transaction[]> {
    const db = await this.ensureDb();

    const res = await db.query(
      `SELECT id, type, amount, date, description, category
       FROM transactions
       ORDER BY date DESC`,
    );

    return (res.values ?? []) as Transaction[];
  }

  async getTransactionsByDateRange(
    startTs: number,
    endTs: number,
  ): Promise<Transaction[]> {
    const db = await this.ensureDb();

    const res = await db.query(
      `SELECT id, type, amount, date, description, category
       FROM transactions
       WHERE date BETWEEN ? AND ?
       ORDER BY date ASC`,
      [startTs, endTs],
    );

    return (res.values ?? []) as Transaction[];
  }

  async deleteTransaction(id: number): Promise<void> {
    const db = await this.ensureDb();
    await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
  }

  async close(): Promise<void> {
    if (!this.db) return;
    await this.sqlite.closeConnection(this.dbName, false);
    this.initialized = false;
  }
}

// data.service.interface.ts
export interface IDataService {

    init(): Promise<void>;

  addTransaction(tx: any): Promise<number>;
  getAllTransactions(): Promise<any[]>;
  getTransactionsByDateRange(start: number, end: number): Promise<any[]>;
}