#!/usr/bin/env node

/**
 * Invoice Console App - Demonstration of invoice-repo functionality
 * 
 * This application demonstrates:
 * - Loading sample data
 * - Adding a new invoice
 * - Finding invoices
 * - Editing an invoice
 * - Deleting an invoice
 */

import {
  InvoiceRepo,
  generateSampleData,
  Invoice,
  Recipient,
  InvoiceItem,
  RecipientCompany,
  calculateVat,
  calculateTotal,
} from 'invoice-repo';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to ask questions
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Format currency
function formatCurrency(amount: number): string {
  return `BGN ${amount.toFixed(2)}`;
}

// Display an invoice
function displayInvoice(invoice: Invoice, index: string = ''): void {
  const indexStr = index ? `[${index}] ` : '';
  console.log(`\n${indexStr}Invoice: ${invoice.id}`);
  console.log(`Date: ${invoice.date.toISOString().split('T')[0]}`);
  console.log(`Recipient: ${invoice.recipient.name}`);
  console.log(`Items: ${invoice.items.length}`);
  invoice.items.forEach((item, i) => {
    console.log(
      `  ${i + 1}. ${item.product} - ${item.quantity} ${item.unit} @ ${formatCurrency(item.price)} = ${formatCurrency(item.valueWithoutVat)}`
    );
  });
  console.log(`Subtotal: ${formatCurrency(invoice.subtotalAmount)}`);
  console.log(`VAT (${invoice.items[0]?.vatRate || 20}%): ${formatCurrency(invoice.vatAmount)}`);
  console.log(`Total: ${formatCurrency(invoice.totalAmount)}`);
}

// Main demo function
async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        Invoice Console App - Demo Application          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Step 1: Load sample data
  console.log('📦 Step 1: Loading sample data...\n');
  const repo = generateSampleData();

  const settings = repo.getSettings();
  console.log(`✓ Loaded invoice repository`);
  console.log(`  Issuer: ${settings.invoiceIssuer.name}`);
  console.log(`  Tax ID: ${settings.invoiceIssuer.taxId}`);
  console.log(`  Default VAT Rate: ${settings.defaultVatRate}%`);

  const allInvoices = repo.getAllInvoices();
  console.log(`\n✓ Loaded ${allInvoices.length} sample invoices`);
  console.log(`  Total revenue: ${formatCurrency(repo.getTotalAmount())}`);
  console.log(`  Total VAT: ${formatCurrency(repo.getTotalVat())}`);

  await question('\n➜ Press Enter to continue to Step 2...');

  // Step 2: Add a new invoice
  console.log('\n📝 Step 2: Adding a new invoice...\n');

  const recipients = repo.getAllRecipients();
  console.log('Available recipients:');
  recipients.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name}`);
  });

  const recipientIndex = parseInt(await question('\nSelect recipient (number): ')) - 1;
  const selectedRecipient = recipients[recipientIndex];

  const newInvoiceData: Invoice = {
    id: `INV-2025-${String(allInvoices.length + 1).padStart(3, '0')}`,
    date: new Date(),
    issuer: settings.invoiceIssuer,
    recipient: selectedRecipient,
    items: [
      {
        product: 'Custom Service',
        quantity: 5,
        unit: 'pcs',
        price: 250,
        vatRate: 20,
        valueWithoutVat: 1250,
      },
    ],
    subtotalAmount: 1250,
    vatAmount: calculateVat(1250, 20),
    totalAmount: calculateTotal(1250, calculateVat(1250, 20)),
  };

  repo.addInvoice(newInvoiceData);
  console.log(`\n✓ Invoice created successfully!`);
  displayInvoice(newInvoiceData);

  await question('\n➜ Press Enter to continue to Step 3...');

  // Step 3: Find invoices
  console.log('\n🔍 Step 3: Finding invoices...\n');

  const searchName = await question('Enter recipient name to search: ');
  const foundRecipients = repo.findRecipientsByName(searchName);

  if (foundRecipients.length === 0) {
    console.log(`No recipients found matching "${searchName}"`);
  } else {
    console.log(`\n✓ Found ${foundRecipients.length} recipient(s):`);
    foundRecipients.forEach((r) => {
      const recipientId = (r as RecipientCompany).id || '';
      const invoices = repo.getInvoicesByRecipient(recipientId);
      console.log(`\n  ${r.name}`);
      if ((r as RecipientCompany).taxId)
        console.log(`    Tax ID: ${(r as RecipientCompany).taxId}`);
      console.log(`    ${invoices.length} invoice(s)`);
      invoices.forEach((inv) => {
        console.log(`      • ${inv.id} (${formatCurrency(inv.totalAmount)})`);
      });
    });
  }

  await question('\n➜ Press Enter to continue to Step 4...');

  // Step 4: Edit an invoice
  console.log('\n✏️  Step 4: Editing an invoice...\n');

  const invoiceId = await question('Enter invoice ID to edit (e.g., INV-2025-001): ');
  const invoiceToEdit = repo.findInvoiceById(invoiceId);

  if (!invoiceToEdit) {
    console.log(`❌ Invoice "${invoiceId}" not found`);
  } else {
    console.log(`\n✓ Found invoice to edit:`);
    displayInvoice(invoiceToEdit);

    console.log('\nWhat would you like to edit?');
    console.log('1. Add item');
    console.log('2. Modify quantity of first item');
    console.log('3. Modify price of first item');

    const editChoice = await question('\nSelect option (1-3): ');

    if (editChoice === '1') {
      const itemName = await question('Item name: ');
      const itemQty = parseInt(await question('Quantity: '));
      const itemPrice = parseFloat(await question('Price per unit: '));

      const newItem: InvoiceItem = {
        product: itemName,
        quantity: itemQty,
        unit: 'pcs',
        price: itemPrice,
        vatRate: 20,
        valueWithoutVat: itemQty * itemPrice,
      };

      invoiceToEdit.items.push(newItem);
      invoiceToEdit.subtotalAmount = invoiceToEdit.items.reduce((sum, item) => sum + item.valueWithoutVat, 0);
      invoiceToEdit.vatAmount = calculateVat(invoiceToEdit.subtotalAmount, 20);
      invoiceToEdit.totalAmount = calculateTotal(invoiceToEdit.subtotalAmount, invoiceToEdit.vatAmount);

      console.log(`\n✓ Item added! Updated invoice:`);
      displayInvoice(invoiceToEdit);
    } else if (editChoice === '2' && invoiceToEdit.items.length > 0) {
      const newQty = parseInt(await question('New quantity: '));
      invoiceToEdit.items[0].quantity = newQty;
      invoiceToEdit.items[0].valueWithoutVat = newQty * invoiceToEdit.items[0].price;

      invoiceToEdit.subtotalAmount = invoiceToEdit.items.reduce((sum, item) => sum + item.valueWithoutVat, 0);
      invoiceToEdit.vatAmount = calculateVat(invoiceToEdit.subtotalAmount, 20);
      invoiceToEdit.totalAmount = calculateTotal(invoiceToEdit.subtotalAmount, invoiceToEdit.vatAmount);

      console.log(`\n✓ Quantity updated! Updated invoice:`);
      displayInvoice(invoiceToEdit);
    } else if (editChoice === '3' && invoiceToEdit.items.length > 0) {
      const newPrice = parseFloat(await question('New price per unit: '));
      invoiceToEdit.items[0].price = newPrice;
      invoiceToEdit.items[0].valueWithoutVat = invoiceToEdit.items[0].quantity * newPrice;

      invoiceToEdit.subtotalAmount = invoiceToEdit.items.reduce((sum, item) => sum + item.valueWithoutVat, 0);
      invoiceToEdit.vatAmount = calculateVat(invoiceToEdit.subtotalAmount, 20);
      invoiceToEdit.totalAmount = calculateTotal(invoiceToEdit.subtotalAmount, invoiceToEdit.vatAmount);

      console.log(`\n✓ Price updated! Updated invoice:`);
      displayInvoice(invoiceToEdit);
    }
  }

  await question('\n➜ Press Enter to continue to Step 5...');

  // Step 5: Delete an invoice
  console.log('\n🗑️  Step 5: Deleting an invoice...\n');

  const invoiceIdToDelete = await question('Enter invoice ID to delete: ');
  const invoiceExists = repo.findInvoiceById(invoiceIdToDelete);

  if (!invoiceExists) {
    console.log(`❌ Invoice "${invoiceIdToDelete}" not found`);
  } else {
    console.log(`\n✓ Found invoice to delete:`);
    displayInvoice(invoiceExists);

    const confirm = await question('\n⚠️  Are you sure you want to delete this invoice? (yes/no): ');

    if (confirm.toLowerCase() === 'yes') {
      repo.deleteInvoice(invoiceIdToDelete);
      console.log(`\n✓ Invoice deleted successfully!`);
    } else {
      console.log(`\n✓ Deletion cancelled`);
    }
  }

  // Final summary
  console.log('\n════════════════════════════════════════════════════════');
  console.log('Final Repository Summary:');
  console.log('════════════════════════════════════════════════════════\n');

  const finalInvoices = repo.getAllInvoices();
  console.log(`Total Invoices: ${finalInvoices.length}`);
  console.log(`Total Recipients: ${repo.getAllRecipients().length}`);
  console.log(`Total Revenue: ${formatCurrency(repo.getTotalAmount())}`);
  console.log(`Total VAT: ${formatCurrency(repo.getTotalVat())}`);

  console.log('\n✓ Demo completed successfully!\n');

  rl.close();
}

// Run the application
main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
