# Invoice Web App - Implementation Plan

## Overview
Build a professional web application for managing invoices using Vite + TypeScript + HTML + CSS (no frameworks).

## Architecture & Structure

```
invoice-web-app/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── style.css               # Global styles
│   ├── index.html              # Single HTML page
│   ├── utils/
│   │   ├── dom.ts              # DOM manipulation utilities
│   │   ├── formatter.ts        # Format data (currency, dates)
│   │   └── validation.ts       # Form validation
│   ├── components/
│   │   ├── header.ts           # App header/navigation
│   │   ├── invoiceList.ts      # Invoice list view
│   │   ├── invoiceDetail.ts    # Invoice view/edit form
│   │   ├── invoiceForm.ts      # Create/edit invoice modal
│   │   ├── recipientList.ts    # Recipient management
│   │   └── modal.ts            # Reusable modal component
│   └── types/
│       └── app.ts              # App-specific types
├── public/                      # Static assets
├── dist/                        # Build output
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── index.html                  # HTML entry point
├── package.json
└── README.md
```

## Key Features to Implement

### 1. **View Invoices**
   - Display list of all invoices in a table
   - Show invoice ID, date, recipient, total amount
   - Search/filter by invoice ID or recipient name
   - Sort by date, amount, or recipient

### 2. **View Invoice Details**
   - Display complete invoice information
   - Show all line items with product, quantity, price
   - Display calculations: subtotal, VAT, total
   - Action buttons: Edit, Delete, PDF export

### 3. **Create Invoice**
   - Modal form to create new invoice
   - Select recipient (existing or create new)
   - Add line items dynamically
   - Auto-calculate totals and VAT
   - Validation for required fields

### 4. **Edit Invoice**
   - Edit existing invoice details
   - Modify line items, quantities, prices
   - Update recipient information
   - Auto-recalculate amounts

### 5. **Manage Recipients**
   - View list of all recipients
   - Search recipients by name
   - Add new recipient
   - Edit existing recipient
   - Delete recipient (if no invoices)

### 6. **View Settings**
   - Display default VAT rate
   - Show issuer company information
   - Update VAT rate if needed

## UI Components

### Main Layout
- **Header**: Logo, app title, navigation menu
- **Sidebar**: Navigation links (Invoices, Recipients, Settings)
- **Main Content**: Dynamic view area
- **Footer**: Copyright, version info

### Views

#### Dashboard/Invoice List View
```
┌─────────────────────────────────────────┐
│ Invoices (10 total)  [+New] [Search]   │
├─────────────────────────────────────────┤
│ ID      | Date     | Recipient | Amount │
├─────────────────────────────────────────┤
│ INV-001 | Jan 15   | Company A | $1,200 │
│ INV-002 | Jan 20   | Company B | $3,240 │
│ ...                                     │
└─────────────────────────────────────────┘
```

#### Invoice Detail View
```
┌─────────────────────────────────────────┐
│ Invoice INV-001      [Edit] [Delete]   │
├─────────────────────────────────────────┤
│ Date: Jan 15, 2025                     │
│ Recipient: Digital Innovations Ltd.    │
│ ─────────────────────────────────────── │
│ Product        | Qty | Price | Total  │
│ Consulting     | 10  | $100  | $1,000 │
│ ─────────────────────────────────────── │
│ Subtotal:              $1,000          │
│ VAT (20%):              $200           │
│ Total:                 $1,200          │
└─────────────────────────────────────────┘
```

#### Create/Edit Invoice Modal
```
┌─────────────────────────────────────────┐
│ New Invoice              [X]            │
├─────────────────────────────────────────┤
│ Recipient: [Select dropdown]            │
│ [Add new recipient button]              │
│                                         │
│ Line Items:                             │
│ [Product] [Qty] [Price] [Unit] [VAT%] │
│ [Add Item] [Remove]                    │
│                                         │
│ Calculated:                             │
│ Subtotal: $1,000  VAT: $200  Total: ... │
│                                         │
│ [Cancel] [Save Invoice]                │
└─────────────────────────────────────────┘
```

## Technology Stack

### Dependencies
- **vite** - Build tool and dev server
- **typescript** - Type-safe JavaScript
- **invoice-repo** - Invoice data management library

### Dev Dependencies
- **@types/node** - Node.js type definitions
- **@vite/plugin-basic-ssl** - HTTPS support (optional)

## State Management

Since we're not using a framework, we'll use:
- **Local variables** for view state
- **LocalStorage** for persisting selected invoices
- **In-memory** invoice data from invoice-repo
- **Event-driven** architecture using DOM events

## Styling Strategy

- **CSS Custom Properties** for theming
- **Flexbox/Grid** for layouts
- **Mobile-first** responsive design
- **BEM naming** convention for CSS classes

```css
/* Example structure */
.invoice-list { }
.invoice-list__header { }
.invoice-list__item { }
.invoice-list__item--active { }
.invoice-list__item__amount { }
```

## Integration with invoice-repo

```typescript
import { generateSampleData, InvoiceRepo } from 'invoice-repo';

// Initialize with sample data
const repo = generateSampleData();

// Use throughout the app
const invoices = repo.getAllInvoices();
const recipients = repo.getAllRecipients();
repo.addInvoice(newInvoice);
// etc.
```

## Implementation Steps

### Phase 1: Setup (Step 1-3)
- [ ] Initialize Vite project with TypeScript
- [ ] Configure vite.config.ts
- [ ] Setup tsconfig.json

### Phase 2: Base UI (Step 4-5)
- [ ] Create index.html structure
- [ ] Create CSS styling (global, components)
- [ ] Create utility modules

### Phase 3: Components (Step 6-8)
- [ ] Implement invoice list view
- [ ] Implement invoice detail view
- [ ] Implement create/edit forms

### Phase 4: Testing & Polish (Step 9+)
- [ ] Test locally with dev server
- [ ] Test invoice CRUD operations
- [ ] Test responsive design
- [ ] Build for production

## Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
tsc --noEmit
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support required

## Next Steps
Ready to implement Phase 1 - initialize Vite project!
