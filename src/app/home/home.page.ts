import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { BrowserDbService } from '../services/browser-db';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../services/database.service';
import { ExportService } from '../services/export.service';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonText,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  transactions: Transaction[] = [];

  type = 'income';
  amount: number | null = null;
  description = '';
  category = '';

  startDate = '';
  endDate = '';

  loading = true;

  constructor(
    private exportService: ExportService,
    private platform: Platform,
    private sqliteDb: DatabaseService,
    private browserDb: BrowserDbService,
  ) {}

  get db() {
    return this.platform.is('hybrid')
      ? this.sqliteDb // real device
      : this.browserDb; // browser
  }

  async ngOnInit(): Promise<void> {
    await this.db.init();
    await this.loadAll();
    this.loading = false;
  }

  async loadAll(): Promise<void> {
    this.transactions = await this.db.getAllTransactions();
  }

  async saveTransaction(): Promise<void> {
    if (!this.type || this.amount === null || this.amount <= 0) {
      return;
    }

    await this.db.addTransaction({
      type: this.type,
      amount: this.amount,
      date: Date.now(),
      description: this.description.trim(),
      category: this.category.trim(),
    });

    this.amount = null;
    this.description = '';
    this.category = '';

    await this.loadAll();
  }

  private toStartTimestamp(dateStr: string): number {
    return new Date(`${dateStr}T00:00:00`).getTime();
  }

  private toEndTimestamp(dateStr: string): number {
    return new Date(`${dateStr}T23:59:59.999`).getTime();
  }

  async filterByRange(): Promise<void> {
    if (!this.startDate || !this.endDate) return;

    const startTs = this.toStartTimestamp(this.startDate);
    const endTs = this.toEndTimestamp(this.endDate);

    this.transactions = await this.db.getTransactionsByDateRange(
      startTs,
      endTs,
    );
  }

  async exportFiltered(): Promise<void> {
    if (!this.startDate || !this.endDate) return;

    const startTs = this.toStartTimestamp(this.startDate);
    const endTs = this.toEndTimestamp(this.endDate);

    const rows = await this.db.getTransactionsByDateRange(startTs, endTs);
    this.exportService.exportTransactionsToExcel(
      rows,
      'mama-bertha-ledger.xlsx',
    );
  }
}
