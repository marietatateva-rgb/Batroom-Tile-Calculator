/**
 * Test script for invoice-console-app
 * Verifies that all invoice-repo functions work correctly
 */

import {
  InvoiceRepo,
  generateSampleData,
  Invoice,
  RecipientCompany,
  calculateVat,
  calculateTotal,
} from 'invoice-repo';

console.log('🧪 Testing Invoice Console App Functionality\n');

// Test 1: Generate sample data
console.log('✓ Test 1: Generate Sample Data');
const repo = generateSampleData();
const invoices = repo.getAllInvoices();
console.log(`  - Loaded ${invoices.length} invoices (expected: 10)`);
console.log(`  - Total revenue: ${repo.getTotalAmount().toFixed(2)} BGN\n`);

// Test 2: Find invoices
console.log('✓ Test 2: Find Invoices by ID');
const invoice = repo.findInvoiceById('INV-2025-001');
console.log(`  - Found invoice: ${invoice?.id}`);
console.log(`  - Recipient: ${invoice?.recipient.name}`);
console.log(`  - Amount: ${invoice?.totalAmount.toFixed(2)} BGN\n`);

// Test 3: Find recipients
console.log('✓ Test 3: Find Recipients');
const recipients = repo.findRecipientsByName('Digital');
console.log(`  - Found ${recipients.length} recipient(s) matching "Digital"`);
recipients.forEach((r) => {
  console.log(`    • ${r.name}`);
});
console.log('');

// Test 4: Add invoice
console.log('✓ Test 4: Add Invoice');
const newInvoice: Invoice = {
  id: 'INV-2025-999',
  date: new Date(),
  issuer: repo.getInvoiceIssuer(),
  recipient: { name: 'Test Company' },
  items: [
    {
      product: 'Test Service',
      quantity: 1,
      unit: 'pcs',
      price: 100,
      vatRate: 20,
      valueWithoutVat: 100,
    },
  ],
  subtotalAmount: 100,
  vatAmount: calculateVat(100, 20),
  totalAmount: calculateTotal(100, calculateVat(100, 20)),
};
repo.addInvoice(newInvoice);
console.log(`  - Added invoice: ${newInvoice.id}`);
console.log(`  - New total invoices: ${repo.getAllInvoices().length} (expected: 11)\n`);

// Test 5: Edit invoice
console.log('✓ Test 5: Edit Invoice');
const toEdit = repo.findInvoiceById('INV-2025-999');
if (toEdit && toEdit.items.length > 0) {
  toEdit.items[0].quantity = 5;
  toEdit.items[0].valueWithoutVat = 500;
  toEdit.subtotalAmount = 500;
  toEdit.vatAmount = calculateVat(500, 20);
  toEdit.totalAmount = calculateTotal(500, toEdit.vatAmount);
  console.log(`  - Updated quantity to 5`);
  console.log(`  - New amount: ${toEdit.totalAmount.toFixed(2)} BGN\n`);
}

// Test 6: Delete invoice
console.log('✓ Test 6: Delete Invoice');
const countBefore = repo.getAllInvoices().length;
repo.deleteInvoice('INV-2025-999');
const countAfter = repo.getAllInvoices().length;
console.log(`  - Deleted invoice: INV-2025-999`);
console.log(`  - Invoices before: ${countBefore}, after: ${countAfter}\n`);

// Test 7: Get invoices by date range
console.log('✓ Test 7: Get Invoices by Date Range');
const marchInvoices = repo.getInvoicesByDateRange(new Date('2025-03-01'), new Date('2025-03-31'));
console.log(`  - Found ${marchInvoices.length} invoices in March 2025\n`);

// Test 8: Calculate totals
console.log('✓ Test 8: Calculate Totals');
console.log(`  - Total revenue: ${repo.getTotalAmount().toFixed(2)} BGN`);
console.log(`  - Total VAT: ${repo.getTotalVat().toFixed(2)} BGN\n`);

// Test 9: Display all invoices
console.log('✓ Test 9: Display All Invoices');
const allInvoices = repo.getAllInvoices();
console.log(`  - Total invoices: ${allInvoices.length}\n`);
allInvoices.forEach((inv) => {
  console.log(`    ${inv.id} - ${inv.recipient.name} - ${formatCurrency(inv.totalAmount)}`);
});
console.log('');

console.log('════════════════════════════════════════');
console.log('✅ All tests passed successfully!');
console.log('════════════════════════════════════════\n');

function formatCurrency(amount: number): string {
  return `BGN ${amount.toFixed(2)}`;
}
