# Invoice Repo

A TypeScript library for managing invoices, recipients, and invoice-related data processing.

## Overview

`invoice-repo` is a Node.js package designed to hold and process invoice data with full type safety. It provides a structured way to manage:

- **Invoices** – Complete invoice records with items, amounts, and VAT calculations
- **Recipients** – Both companies and individuals with their details
- **Settings** – Global configuration like default VAT rates and issuer information
- **Sample Data** – Pre-built test data for development and testing

## Features

- ✅ Full TypeScript support with strict type checking
- ✅ Support for both company and individual recipients
- ✅ Flexible recipient search (by ID, by name)
- ✅ Invoice management with full CRUD operations
- ✅ Automatic VAT and total amount calculations
- ✅ Date range queries for invoices
- ✅ Aggregated reporting (total amounts, total VAT)
- ✅ Sample data generator with 10 realistic invoices

## Installation

```bash
npm install
npm run build
```

## Project Structure

```
invoice-repo/
├── src/
│   ├── invoice-types.ts              # Type definitions and interfaces
│   ├── invoice-repo.ts               # Main InvoiceRepo class
│   ├── invoice-repo-sample-data.ts   # Sample data generator
│   └── index.ts                      # Package exports
├── package.json
├── tsconfig.json
└── README.md
```

## Data Types

### Core Types

#### `IssuerCompany`
Represents the company issuing invoices. All properties are mandatory:
- `name` – Company name
- `id` – Company registration ID
- `taxId` – Tax identification number (format: country code + ID, e.g., "BG0776618")
- `address` – Full business address
- `manager` – Manager/representative name
- `iban` – International Bank Account Number

#### `RecipientCompany`
Represents a company receiving an invoice. Only `name` is mandatory:
- `name` – Company name (required)
- `id` – Company registration ID (optional)
- `taxId` – Tax ID (optional)
- `address` – Address (optional)
- `manager` – Manager name (optional)

#### `RecipientIndividual`
Represents a person receiving an invoice:
- `name` – Person's name
- `nationalIdNumber` – National ID or passport number (optional)

#### `Recipient`
Union type: `RecipientCompany | RecipientIndividual`

Helper functions:
- `isRecipientCompany(recipient)` – Check if recipient is a company
- `isRecipientIndividual(recipient)` – Check if recipient is an individual

#### `ProductUnit`
Type for invoice item units: `'pcs' | 'kg' | 'liters' | 'meters'`

#### `InvoiceItem`
Represents a single line item in an invoice:
- `product` – Product/service name
- `quantity` – Quantity ordered
- `unit` – Unit of measurement
- `price` – Price per unit
- `vatRate` – VAT rate as percentage (e.g., 20 for 20%)
- `valueWithoutVat` – Total value without VAT (quantity × price)

#### `Invoice`
Complete invoice record:
- `id` – Unique invoice identifier
- `date` – Invoice date
- `issuer` – Issuing company details
- `recipient` – Recipient (company or individual)
- `items` – List of invoice items
- `subtotalAmount` – Sum of all items without VAT
- `vatAmount` – Total VAT on all items
- `totalAmount` – Grand total including VAT

#### `InvoiceRepoSettings`
Global repository settings:
- `defaultVatRate` – Default VAT rate as percentage
- `invoiceIssuer` – Default issuing company

## InvoiceRepo Class

The main class for managing invoices and recipients.

### Constructor

```typescript
const repo = new InvoiceRepo(settings: InvoiceRepoSettings);
```

### Settings Management

```typescript
// Get current settings
repo.getSettings(): InvoiceRepoSettings

// Update settings
repo.updateSettings(settings: Partial<InvoiceRepoSettings>): void

// Get default VAT rate
repo.getDefaultVatRate(): number

// Get invoice issuer
repo.getInvoiceIssuer(): IssuerCompany
```

### Recipient Management

```typescript
// Add a recipient (generates ID if not provided)
repo.addRecipient(recipient: Recipient): Recipient

// Find recipient by ID
repo.findRecipientById(id: string): Recipient | undefined

// Find recipients by name (case-insensitive, partial match)
repo.findRecipientsByName(name: string): Recipient[]

// Delete recipient by ID
repo.deleteRecipient(id: string): boolean

// Get all recipients
repo.getAllRecipients(): Recipient[]
```

### Invoice Management

```typescript
// Add an invoice
repo.addInvoice(invoice: Invoice): Invoice

// Find invoice by ID
repo.findInvoiceById(id: string): Invoice | undefined

// Delete invoice by ID
repo.deleteInvoice(id: string): boolean

// Get all invoices
repo.getAllInvoices(): Invoice[]

// Get invoices by recipient ID
repo.getInvoicesByRecipient(recipientId: string): Invoice[]

// Get invoices by date range
repo.getInvoicesByDateRange(startDate: Date, endDate: Date): Invoice[]

// Get total amount from all invoices
repo.getTotalAmount(): number

// Get total VAT from all invoices
repo.getTotalVat(): number
```

## Helper Functions

```typescript
// Calculate VAT amount
calculateVat(amount: number, vatRate: number): number

// Calculate total with VAT
calculateTotal(subtotal: number, vatAmount: number): number
```

## Usage Examples

### Basic Setup

```typescript
import { InvoiceRepo, generateSampleData } from 'invoice-repo';

// Generate sample data with 10 invoices
const repo = generateSampleData();

// Access the issuer
console.log(repo.getInvoiceIssuer().name); // "TechFlow Solutions Ltd."

// Get default VAT rate
console.log(repo.getDefaultVatRate()); // 20
```

### Working with Recipients

```typescript
// Find recipients by name
const matches = repo.findRecipientsByName('Digital');
matches.forEach(recipient => {
  console.log(recipient.name);
});

// Add a new recipient
const newCompany = repo.addRecipient({
  name: 'New Tech Startup',
  id: '1111111',
  taxId: 'BG1111111',
  address: '999 Future Lane, Sofia',
  manager: 'Alex Ivanov'
});
```

### Working with Invoices

```typescript
// Get all invoices
const allInvoices = repo.getAllInvoices();
console.log(`Total invoices: ${allInvoices.length}`); // 10

// Get invoices in a date range
const marchInvoices = repo.getInvoicesByDateRange(
  new Date('2025-03-01'),
  new Date('2025-03-31')
);

// Get total amounts
console.log(`Total Revenue: ${repo.getTotalAmount()}`);
console.log(`Total VAT: ${repo.getTotalVat()}`);

// Find specific invoice
const invoice = repo.findInvoiceById('INV-2025-001');
console.log(invoice?.totalAmount);
```

### Creating Custom Invoices

```typescript
import { Invoice, IssuerCompany, InvoiceItem } from 'invoice-repo';

const issuer: IssuerCompany = {
  name: 'My Company',
  id: '123456',
  taxId: 'BG123456',
  address: '100 Main St',
  manager: 'Manager Name',
  iban: 'BG89STSA00000000000001'
};

const repo = new InvoiceRepo({
  defaultVatRate: 20,
  invoiceIssuer: issuer
});

// Add items
const items: InvoiceItem[] = [
  {
    product: 'Consulting',
    quantity: 10,
    unit: 'pcs',
    price: 100,
    vatRate: 20,
    valueWithoutVat: 1000
  }
];

const vatAmount = items.reduce((sum, item) => 
  sum + calculateVat(item.valueWithoutVat, item.vatRate), 0
);

const invoice: Invoice = {
  id: 'INV-2025-101',
  date: new Date(),
  issuer,
  recipient: { name: 'Customer Name' },
  items,
  subtotalAmount: 1000,
  vatAmount,
  totalAmount: 1000 + vatAmount
};

repo.addInvoice(invoice);
```

## Sample Data

The `generateSampleData()` function creates a pre-populated `InvoiceRepo` with:

- **Issuer**: TechFlow Solutions Ltd. (Bulgarian company)
- **Recipients**: 3 companies and 2 individuals
- **Invoices**: 10 sample invoices from January to March 2025
- **Items**: Various tech services (software, cloud, consulting, etc.)
- **VAT Rate**: 20% (default for all items)

```typescript
import { generateSampleData } from 'invoice-repo';

const repo = generateSampleData();
const invoices = repo.getAllInvoices(); // Returns 10 invoices
```

## Building

```bash
npm run build
```

This compiles TypeScript files from `src/` to `dist/` directory.

## Testing

```bash
npm test
```

Currently a placeholder. Add your test suite here.

## Module Exports

### `invoice-types.ts`
Exports all type definitions:
- Interfaces: `IssuerCompany`, `RecipientCompany`, `RecipientIndividual`, `Invoice`, `InvoiceItem`, `InvoiceRepoSettings`
- Types: `Recipient`, `ProductUnit`
- Functions: `isRecipientCompany`, `isRecipientIndividual`, `calculateVat`, `calculateTotal`

### `invoice-repo.ts`
Default export: `InvoiceRepo` class

### `invoice-repo-sample-data.ts`
Default export: `generateSampleData()` function

### `index.ts`
Re-exports everything from all modules for convenience

## License

ISC
