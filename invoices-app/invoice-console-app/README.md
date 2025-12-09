# Invoice Console App

A command-line demonstration application showcasing the capabilities of the `invoice-repo` library, built with TypeScript.

## Overview

This console application provides an interactive walkthrough of the invoice management system, demonstrating:

- **Loading Sample Data** – Load 10 pre-built invoices with sample companies and individuals
- **Adding Invoices** – Create new invoices with custom recipients
- **Finding Invoices** – Search for invoices by recipient name and view their details
- **Editing Invoices** – Modify invoice items, quantities, and prices
- **Deleting Invoices** – Remove invoices from the repository

## Installation & Setup

```bash
cd invoice-console-app
npm install
npm run build
npm start
```

## Available Commands

### Build the Project
```bash
npm run build
```
Compiles TypeScript from `src/` to `dist/` directory.

### Run the Interactive Demo
```bash
npm start
```
Launches the interactive console application.

### Run Tests
```bash
npm test
```
Executes the automated test suite to verify all functionality.

### Development Mode
```bash
npm run dev
```
Runs the TypeScript source directly (requires Node.js 20+).

## Project Structure

```
invoice-console-app/
├── src/
│   ├── index.ts          # Main interactive console app
│   └── test.ts           # Test suite
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Imports from invoice-repo

The app uses correct imports from the invoice-repo library:

```typescript
import {
  InvoiceRepo,
  generateSampleData,
  Invoice,
  Recipient,
  RecipientCompany,
  RecipientIndividual,
  InvoiceItem,
  ProductUnit,
  calculateVat,
  calculateTotal,
} from 'invoice-repo';
```

## Features

### Interactive Steps

The application guides you through 5 main operations:

#### 1. Loading Sample Data
- Displays the default issuer company (TechFlow Solutions Ltd.)
- Shows the default VAT rate (20%)
- Lists the 10 pre-loaded sample invoices
- Displays total revenue and VAT amounts

#### 2. Adding an Invoice
- Select from existing recipients (companies or individuals)
- Create a new invoice with custom items
- Automatically calculates subtotal, VAT, and total amounts
- Invoice is added to the repository with a unique ID

#### 3. Finding Invoices
- Search for recipients by name (case-insensitive, partial match)
- View all invoices for matching recipients
- Display invoice details including amounts and items

#### 4. Editing an Invoice
- Find an invoice by ID
- Choose from editing options:
  - Add a new item to the invoice
  - Modify quantity of the first item
  - Modify price of the first item
- Automatically recalculates totals and VAT

#### 5. Deleting an Invoice
- Find an invoice by ID
- View invoice details before deletion
- Confirm deletion with safety prompt
- Invoice is removed from the repository

### Final Summary
After all operations, the app displays:
- Total number of invoices
- Total number of recipients
- Total revenue (sum of all invoice amounts)
- Total VAT collected

## Example Usage

```bash
$ npm run build
$ npm start

╔════════════════════════════════════════════════════════╗
║        Invoice Console App - Demo Application          ║
╚════════════════════════════════════════════════════════╝

📦 Step 1: Loading sample data...

✓ Loaded invoice repository
  Issuer: TechFlow Solutions Ltd.
  Tax ID: BG0776618
  Default VAT Rate: 20%

✓ Loaded 10 sample invoices
  Total revenue: BGN 72,540.00
  Total VAT: BGN 12,090.00
```

## Test Output

Running `npm test` produces:

```
✓ Test 1: Generate Sample Data
  - Loaded 10 invoices (expected: 10)
  - Total revenue: 72540.00 BGN

✓ Test 2: Find Invoices by ID
  - Found invoice: INV-2025-001
  - Recipient: Digital Innovations Ltd.
  - Amount: 13200.00 BGN

✓ Test 3: Find Recipients
  - Found 1 recipient(s) matching "Digital"
    • Digital Innovations Ltd.

✓ Test 4: Add Invoice
  - Added invoice: INV-2025-999
  - New total invoices: 11 (expected: 11)

✓ Test 5: Edit Invoice
  - Updated quantity to 5
  - New amount: 600.00 BGN

✓ Test 6: Delete Invoice
  - Deleted invoice: INV-2025-999
  - Invoices before: 11, after: 10

✓ Test 7: Get Invoices by Date Range
  - Found 5 invoices in March 2025

✓ Test 8: Calculate Totals
  - Total revenue: 72540.00 BGN
  - Total VAT: 12090.00 BGN

✓ Test 9: Display All Invoices
  - Total invoices: 10
    INV-2025-001 - Digital Innovations Ltd. - BGN 13200.00
    INV-2025-002 - CloudNet Services - BGN 3240.00
    INV-2025-003 - WebDev Studio - BGN 12000.00
    INV-2025-004 - John Smith - BGN 3360.00
    INV-2025-005 - Digital Innovations Ltd. - BGN 3900.00
    INV-2025-006 - CloudNet Services - BGN 9360.00
    INV-2025-007 - WebDev Studio - BGN 3000.00
    INV-2025-008 - Sarah Johnson - BGN 6600.00
    INV-2025-009 - Digital Innovations Ltd. - BGN 6600.00
    INV-2025-010 - CloudNet Services - BGN 11280.00

════════════════════════════════════════
✅ All tests passed successfully!
════════════════════════════════════════
```

## Sample Data Invoices

The app comes with 10 pre-built invoices:

| ID | Recipient | Amount |
|----|-----------|--------|
| INV-2025-001 | Digital Innovations Ltd. | BGN 13,200.00 |
| INV-2025-002 | CloudNet Services | BGN 3,240.00 |
| INV-2025-003 | WebDev Studio | BGN 12,000.00 |
| INV-2025-004 | John Smith | BGN 3,360.00 |
| INV-2025-005 | Digital Innovations Ltd. | BGN 3,900.00 |
| INV-2025-006 | CloudNet Services | BGN 9,360.00 |
| INV-2025-007 | WebDev Studio | BGN 3,000.00 |
| INV-2025-008 | Sarah Johnson | BGN 6,600.00 |
| INV-2025-009 | Digital Innovations Ltd. | BGN 6,600.00 |
| INV-2025-010 | CloudNet Services | BGN 11,280.00 |

**Total Revenue: BGN 72,540.00**  
**Total VAT (20%): BGN 12,090.00**

## Dependencies

- `invoice-repo` – The invoice management library (linked via npm workspaces)
- `@types/node` – TypeScript type definitions for Node.js
- `typescript` – TypeScript compiler

## Usage Notes

- **Invoice IDs** are formatted as `INV-2025-XXX` (e.g., `INV-2025-001`)
- **Currency** is displayed in Bulgarian Levs (BGN)
- **VAT Rate** is fixed at 20% in the sample data
- **Quantities** are typically in pieces (pcs) but can be different units
- **Recipient Search** is case-insensitive and supports partial name matching

## Building the Project

The app depends on the compiled `invoice-repo` library. Make sure to build it first:

```bash
# From invoice-console-app directory
npm run build
npm start

# Or from the root project
npm run build
```

## Error Handling

The application handles:
- Invalid invoice IDs (shows "not found" message)
- Invalid recipient selections
- Malformed input (gracefully handles non-numeric input)
- Missing invoices during edit/delete operations

## TypeScript Configuration

The project uses ES2020 modules and targets ES2020. Key configuration options:

- **Strict mode enabled** for type safety
- **ESM modules** for modern JavaScript
- **Source maps** for debugging
- **Type declarations** exported for library use

## Future Enhancements

Possible improvements:
- Add menu-based navigation instead of linear flow
- Export invoices to PDF or JSON
- Filter invoices by date range
- Add multiple items during invoice creation
- Batch operations on multiple invoices
- Data persistence to file/database
- Command-line arguments for non-interactive mode

## License

ISC
