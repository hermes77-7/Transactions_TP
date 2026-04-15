# SmallBiz Ledger

## Overview

SmallBiz Ledger is an offline-first financial tracking application built for Mama Bertha’s Wholesale. It uses a local SQLite database to store transaction data reliably on the device, even when the app is closed or the device is restarted.

The application allows users to record transactions, filter them by date range, and export selected records to Excel format.

## Features

### Transaction Management
- Add income and expense transactions
- Store transaction description and category
- Automatically save transaction dates as timestamps

### SQLite Data Persistence
- Uses a native SQLite database through Capacitor
- Data remains available across app restarts and device reboots
- Supports structured relational storage for financial records

### Date Range Filtering
- Select a start date and end date
- Fetch matching transactions using SQL `BETWEEN`
- Retrieve filtered data efficiently for reporting

### Excel Export
- Export filtered transaction data to `.xlsx`
- Uses the `xlsx` library
- Generates a spreadsheet report that can be opened in Excel or compatible software

### Browser Development Support
- Includes a temporary browser fallback for development and testing
- Allows the app to run with `ionic serve` while keeping SQLite for mobile devices

## Technology Stack

- Ionic
- Angular
- TypeScript
- Capacitor SQLite
- xlsx

## Database Schema

### Table: transactions

| Column | Type | Description |
|---|---|---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Unique transaction identifier |
| type | TEXT | Transaction type such as income or expense |
| amount | REAL | Transaction amount |
| date | INTEGER | Timestamp stored in milliseconds |
| description | TEXT | Transaction description |
| category | TEXT | Transaction category |

## How It Works

The app stores transactions in a relational SQLite database. When a user adds a transaction, the data is inserted into the `transactions` table using SQL. When the user selects a date range, the app runs a query using `BETWEEN` to return only matching records. Those records can then be exported into an Excel file.

## Installation

### Clone the repository
```bash
git clone <your-repo-url>
cd smallbiz-ledger