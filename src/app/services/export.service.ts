import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportTransactionsToExcel(
    rows: Transaction[],
    fileName = 'smallbiz-ledger.xlsx',
  ): void {
    const data = rows.map((row) => ({
      ID: row.id,
      Type: row.type,
      Amount: row.amount,
      Date: new Date(row.date).toLocaleString(),
      Description: row.description,
      Category: row.category,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, fileName);
  }
}
