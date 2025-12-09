import InvoiceRepo from './invoice-repo';
import {
  IssuerCompany,
  Invoice,
  InvoiceItem,
  RecipientCompany,
  RecipientIndividual,
  calculateVat,
  calculateTotal,
} from './invoice-types';

/**
 * Generate sample data with 10 invoices for testing purposes
 */
export default function generateSampleData(): InvoiceRepo {
  // Define the issuer company
  const issuerCompany: IssuerCompany = {
    name: 'TechFlow Solutions Ltd.',
    id: '0776618',
    taxId: 'BG0776618',
    address: '123 Tech Street, Sofia, Bulgaria',
    manager: 'Ivan Petrov',
    iban: 'BG89STSA00000000000123',
  };

  // Create repo with default 20% VAT
  const repo = new InvoiceRepo({
    defaultVatRate: 20,
    invoiceIssuer: issuerCompany,
  });

  // Add sample recipients
  const recipientCompany1 = repo.addRecipient({
    name: 'Global Retail Inc',
    id: '1234567',
    taxId: 'BG1234567',
    address: '456 Commerce Ave, Sofia, Bulgaria',
    manager: 'Mariya Kovacheva',
  });

  const recipientCompany2 = repo.addRecipient({
    name: 'Nordic Design Group',
    id: '9876543',
    taxId: 'BG9876543',
    address: '789 Design Park, Plovdiv, Bulgaria',
    manager: 'Georgi Nikolov',
  });

  const recipientCompany3 = repo.addRecipient({
    name: 'Mediterranean Trade Ltd',
    id: '5555555',
    taxId: 'BG5555555',
    address: '321 Trade Street, Burgas, Bulgaria',
    manager: 'Elena Stoeva',
  });

  const recipientIndividual1 = repo.addRecipient({
    name: 'John Smith',
    nationalIdNumber: '1234567890',
  });

  const recipientIndividual2 = repo.addRecipient({
    name: 'Maria Garcia',
    nationalIdNumber: '0987654321',
  });

  // Helper function to create invoice items
  const createInvoiceItems = (
    products: Array<{
      name: string;
      quantity: number;
      unit: 'pcs' | 'kg' | 'liters' | 'meters';
      price: number;
    }>
  ): InvoiceItem[] => {
    return products.map((p) => {
      const valueWithoutVat = p.quantity * p.price;
      return {
        product: p.name,
        quantity: p.quantity,
        unit: p.unit,
        price: p.price,
        vatRate: 20,
        valueWithoutVat,
      };
    });
  };

  // Helper function to calculate invoice totals
  const calculateInvoiceTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.valueWithoutVat, 0);
    const vat = items.reduce((sum, item) => sum + calculateVat(item.valueWithoutVat, item.vatRate), 0);
    return {
      subtotal,
      vat,
      total: calculateTotal(subtotal, vat),
    };
  };

  // Invoice 1: Software License
  const items1 = createInvoiceItems([
    { name: 'Annual Software License', quantity: 1, unit: 'pcs', price: 4250 },
  ]);
  const totals1 = calculateInvoiceTotals(items1);
  const invoice1: Invoice = {
    id: 'INV-2025-001',
    date: new Date('2025-01-15'),
    issuer: issuerCompany,
    recipient: recipientCompany1,
    items: items1,
    subtotalAmount: totals1.subtotal,
    vatAmount: totals1.vat,
    totalAmount: totals1.total,
  };
  repo.addInvoice(invoice1);

  // Invoice 2: Cloud Services
  const items2 = createInvoiceItems([
    { name: 'Cloud Storage (100GB)', quantity: 1, unit: 'pcs', price: 8000 },
  ]);
  const totals2 = calculateInvoiceTotals(items2);
  const invoice2: Invoice = {
    id: 'INV-2025-002',
    date: new Date('2025-01-20'),
    issuer: issuerCompany,
    recipient: recipientCompany2,
    items: items2,
    subtotalAmount: totals2.subtotal,
    vatAmount: totals2.vat,
    totalAmount: totals2.total,
  };
  repo.addInvoice(invoice2);

  // Invoice 3: Web Development
  const items3 = createInvoiceItems([
    { name: 'Web Development Services', quantity: 1, unit: 'pcs', price: 1800 },
  ]);
  const totals3 = calculateInvoiceTotals(items3);
  const invoice3: Invoice = {
    id: 'INV-2025-003',
    date: new Date('2025-02-01'),
    issuer: issuerCompany,
    recipient: recipientCompany3,
    items: items3,
    subtotalAmount: totals3.subtotal,
    vatAmount: totals3.vat,
    totalAmount: totals3.total,
  };
  repo.addInvoice(invoice3);

  // Invoice 4: Consulting Services (Individual)
  const items4 = createInvoiceItems([
    { name: 'Business Consulting', quantity: 1, unit: 'pcs', price: 1000 },
  ]);
  const totals4 = calculateInvoiceTotals(items4);
  const invoice4: Invoice = {
    id: 'INV-2025-004',
    date: new Date('2025-02-10'),
    issuer: issuerCompany,
    recipient: recipientIndividual1,
    items: items4,
    subtotalAmount: totals4.subtotal,
    vatAmount: totals4.vat,
    totalAmount: totals4.total,
  };
  repo.addInvoice(invoice4);

  // Invoice 5: Training Program
  const items5 = createInvoiceItems([
    { name: 'Training Program', quantity: 1, unit: 'pcs', price: 1200 },
  ]);
  const totals5 = calculateInvoiceTotals(items5);
  const invoice5: Invoice = {
    id: 'INV-2025-005',
    date: new Date('2025-02-15'),
    issuer: issuerCompany,
    recipient: recipientIndividual2,
    items: items5,
    subtotalAmount: totals5.subtotal,
    vatAmount: totals5.vat,
    totalAmount: totals5.total,
  };
  repo.addInvoice(invoice5);

  // Invoice 6: Hardware Setup
  const items6 = createInvoiceItems([
    { name: 'Server Setup', quantity: 2, unit: 'pcs', price: 3000 },
    { name: 'Network Configuration', quantity: 1, unit: 'pcs', price: 800 },
    { name: 'Installation & Testing', quantity: 4, unit: 'pcs', price: 250 },
  ]);
  const totals6 = calculateInvoiceTotals(items6);
  const invoice6: Invoice = {
    id: 'INV-2025-006',
    date: new Date('2025-03-01'),
    issuer: issuerCompany,
    recipient: recipientCompany2,
    items: items6,
    subtotalAmount: totals6.subtotal,
    vatAmount: totals6.vat,
    totalAmount: totals6.total,
  };
  repo.addInvoice(invoice6);

  // Invoice 7: Maintenance Services
  const items7 = createInvoiceItems([
    { name: 'Monthly Maintenance', quantity: 1, unit: 'pcs', price: 1500 },
    { name: 'Bug Fixes', quantity: 10, unit: 'pcs', price: 100 },
  ]);
  const totals7 = calculateInvoiceTotals(items7);
  const invoice7: Invoice = {
    id: 'INV-2025-007',
    date: new Date('2025-03-05'),
    issuer: issuerCompany,
    recipient: recipientCompany3,
    items: items7,
    subtotalAmount: totals7.subtotal,
    vatAmount: totals7.vat,
    totalAmount: totals7.total,
  };
  repo.addInvoice(invoice7);

  // Invoice 8: Marketing Services (Individual)
  const items8 = createInvoiceItems([
    { name: 'SEO Optimization', quantity: 1, unit: 'pcs', price: 2500 },
    { name: 'Content Creation', quantity: 20, unit: 'pcs', price: 150 },
  ]);
  const totals8 = calculateInvoiceTotals(items8);
  const invoice8: Invoice = {
    id: 'INV-2025-008',
    date: new Date('2025-03-10'),
    issuer: issuerCompany,
    recipient: recipientIndividual2,
    items: items8,
    subtotalAmount: totals8.subtotal,
    vatAmount: totals8.vat,
    totalAmount: totals8.total,
  };
  repo.addInvoice(invoice8);

  // Invoice 9: Data Analysis
  const items9 = createInvoiceItems([
    { name: 'Data Analysis Project', quantity: 1, unit: 'pcs', price: 4500 },
    { name: 'Report & Visualization', quantity: 1, unit: 'pcs', price: 1000 },
  ]);
  const totals9 = calculateInvoiceTotals(items9);
  const invoice9: Invoice = {
    id: 'INV-2025-009',
    date: new Date('2025-03-15'),
    issuer: issuerCompany,
    recipient: recipientCompany1,
    items: items9,
    subtotalAmount: totals9.subtotal,
    vatAmount: totals9.vat,
    totalAmount: totals9.total,
  };
  repo.addInvoice(invoice9);

  // Invoice 10: Security Audit
  const items10 = createInvoiceItems([
    { name: 'Security Audit', quantity: 1, unit: 'pcs', price: 5000 },
    { name: 'Vulnerability Assessment', quantity: 1, unit: 'pcs', price: 2000 },
    { name: 'Implementation Support', quantity: 8, unit: 'pcs', price: 300 },
  ]);
  const totals10 = calculateInvoiceTotals(items10);
  const invoice10: Invoice = {
    id: 'INV-2025-010',
    date: new Date('2025-03-20'),
    issuer: issuerCompany,
    recipient: recipientCompany2,
    items: items10,
    subtotalAmount: totals10.subtotal,
    vatAmount: totals10.vat,
    totalAmount: totals10.total,
  };
  repo.addInvoice(invoice10);

  return repo;
}
