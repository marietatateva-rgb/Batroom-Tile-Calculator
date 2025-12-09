import InvoiceRepo from '../invoice-repo';
import { IssuerCompany, Invoice, InvoiceItem } from '../invoice-types';

describe('InvoiceRepo', () => {
  let repo: InvoiceRepo;
  let issuer: IssuerCompany;

  beforeEach(() => {
    issuer = {
      name: 'Test Company',
      id: '123456',
      taxId: 'BG123456',
      address: '123 Test St',
      manager: 'Test Manager',
      iban: 'BG89STSA00000000000001',
    };

    repo = new InvoiceRepo({
      defaultVatRate: 20,
      invoiceIssuer: issuer,
    });
  });

  describe('Settings Management', () => {
    it('should initialize with correct settings', () => {
      const settings = repo.getSettings();
      expect(settings.defaultVatRate).toBe(20);
      expect(settings.invoiceIssuer.name).toBe('Test Company');
    });

    it('should get default VAT rate', () => {
      expect(repo.getDefaultVatRate()).toBe(20);
    });

    it('should get invoice issuer', () => {
      expect(repo.getInvoiceIssuer()).toBe(issuer);
    });

    it('should update settings', () => {
      repo.updateSettings({ defaultVatRate: 25 });
      expect(repo.getDefaultVatRate()).toBe(25);
    });

    it('should update issuer in settings', () => {
      const newIssuer: IssuerCompany = {
        ...issuer,
        name: 'New Company',
      };
      repo.updateSettings({ invoiceIssuer: newIssuer });
      expect(repo.getInvoiceIssuer().name).toBe('New Company');
    });

    it('should preserve other settings when updating partial settings', () => {
      repo.updateSettings({ defaultVatRate: 15 });
      expect(repo.getInvoiceIssuer().name).toBe('Test Company');
    });
  });

  describe('Recipient Management', () => {
    it('should add a recipient', () => {
      const recipient = repo.addRecipient({ name: 'Customer A' });
      expect(recipient.name).toBe('Customer A');
      expect((recipient as any).id).toBeDefined();
    });

    it('should generate unique IDs for recipients', () => {
      const recipient1 = repo.addRecipient({ name: 'Customer A' });
      const recipient2 = repo.addRecipient({ name: 'Customer B' });
      expect((recipient1 as any).id).not.toBe((recipient2 as any).id);
    });

    it('should find recipient by ID', () => {
      const added = repo.addRecipient({ name: 'Customer A' });
      const found = repo.findRecipientById((added as any).id);
      expect(found?.name).toBe('Customer A');
    });

    it('should return undefined for non-existent recipient', () => {
      const found = repo.findRecipientById('non-existent');
      expect(found).toBeUndefined();
    });

    it('should find recipients by name', () => {
      repo.addRecipient({ name: 'Digital Innovations' });
      repo.addRecipient({ name: 'Tech Solutions' });
      repo.addRecipient({ name: 'Another Company' });

      const found = repo.findRecipientsByName('Digital');
      expect(found.length).toBe(1);
      expect(found[0].name).toBe('Digital Innovations');
    });

    it('should find recipients by partial name match', () => {
      repo.addRecipient({ name: 'Digital Innovations' });
      repo.addRecipient({ name: 'Digital Tech' });
      repo.addRecipient({ name: 'Another Company' });

      const found = repo.findRecipientsByName('Digital');
      expect(found.length).toBe(2);
    });

    it('should find recipients case-insensitively', () => {
      repo.addRecipient({ name: 'Digital Innovations' });

      const found = repo.findRecipientsByName('DIGITAL');
      expect(found.length).toBe(1);
    });

    it('should return empty array for non-matching name', () => {
      repo.addRecipient({ name: 'Digital Innovations' });

      const found = repo.findRecipientsByName('NonExistent');
      expect(found.length).toBe(0);
    });

    it('should delete recipient by ID', () => {
      const added = repo.addRecipient({ name: 'Customer A' });
      const deleted = repo.deleteRecipient((added as any).id);
      expect(deleted).toBe(true);
      expect(repo.findRecipientById((added as any).id)).toBeUndefined();
    });

    it('should return false when deleting non-existent recipient', () => {
      const deleted = repo.deleteRecipient('non-existent');
      expect(deleted).toBe(false);
    });

    it('should get all recipients', () => {
      repo.addRecipient({ name: 'Customer A' });
      repo.addRecipient({ name: 'Customer B' });
      repo.addRecipient({ name: 'Customer C' });

      const all = repo.getAllRecipients();
      expect(all.length).toBe(3);
    });

    it('should get empty array when no recipients', () => {
      const all = repo.getAllRecipients();
      expect(all.length).toBe(0);
    });
  });

  describe('Invoice Management', () => {
    let testInvoice: Invoice;

    beforeEach(() => {
      testInvoice = {
        id: 'INV-001',
        date: new Date('2025-01-15'),
        issuer,
        recipient: { name: 'Customer A' },
        items: [
          {
            product: 'Service A',
            quantity: 10,
            unit: 'pcs',
            price: 100,
            vatRate: 20,
            valueWithoutVat: 1000,
          },
        ],
        subtotalAmount: 1000,
        vatAmount: 200,
        totalAmount: 1200,
      };
    });

    it('should add an invoice', () => {
      repo.addInvoice(testInvoice);
      const found = repo.findInvoiceById('INV-001');
      expect(found).toBeDefined();
      expect(found?.totalAmount).toBe(1200);
    });

    it('should find invoice by ID', () => {
      repo.addInvoice(testInvoice);
      const found = repo.findInvoiceById('INV-001');
      expect(found?.id).toBe('INV-001');
      expect(found?.recipient.name).toBe('Customer A');
    });

    it('should return undefined for non-existent invoice', () => {
      const found = repo.findInvoiceById('non-existent');
      expect(found).toBeUndefined();
    });

    it('should delete invoice by ID', () => {
      repo.addInvoice(testInvoice);
      const deleted = repo.deleteInvoice('INV-001');
      expect(deleted).toBe(true);
      expect(repo.findInvoiceById('INV-001')).toBeUndefined();
    });

    it('should return false when deleting non-existent invoice', () => {
      const deleted = repo.deleteInvoice('non-existent');
      expect(deleted).toBe(false);
    });

    it('should get all invoices', () => {
      repo.addInvoice(testInvoice);
      repo.addInvoice({ ...testInvoice, id: 'INV-002' });
      repo.addInvoice({ ...testInvoice, id: 'INV-003' });

      const all = repo.getAllInvoices();
      expect(all.length).toBe(3);
    });

    it('should get empty array when no invoices', () => {
      const all = repo.getAllInvoices();
      expect(all.length).toBe(0);
    });

    it('should get invoices by recipient ID', () => {
      const recipient = repo.addRecipient({ name: 'Customer A', id: 'REC-001' });
      const invoice1 = { ...testInvoice, id: 'INV-001', recipient };
      const invoice2 = { ...testInvoice, id: 'INV-002', recipient };

      repo.addInvoice(invoice1);
      repo.addInvoice(invoice2);

      const found = repo.getInvoicesByRecipient('REC-001');
      expect(found.length).toBe(2);
    });

    it('should return empty array for recipient with no invoices', () => {
      const found = repo.getInvoicesByRecipient('non-existent');
      expect(found.length).toBe(0);
    });

    it('should get invoices by date range', () => {
      const invoice1 = { ...testInvoice, id: 'INV-001', date: new Date('2025-01-15') };
      const invoice2 = { ...testInvoice, id: 'INV-002', date: new Date('2025-02-15') };
      const invoice3 = { ...testInvoice, id: 'INV-003', date: new Date('2025-03-15') };

      repo.addInvoice(invoice1);
      repo.addInvoice(invoice2);
      repo.addInvoice(invoice3);

      const found = repo.getInvoicesByDateRange(
        new Date('2025-02-01'),
        new Date('2025-02-28')
      );
      expect(found.length).toBe(1);
      expect(found[0].id).toBe('INV-002');
    });

    it('should include boundary dates in date range', () => {
      const invoice = { ...testInvoice, id: 'INV-001', date: new Date('2025-02-01') };
      repo.addInvoice(invoice);

      const found = repo.getInvoicesByDateRange(
        new Date('2025-02-01'),
        new Date('2025-02-01')
      );
      expect(found.length).toBe(1);
    });

    it('should return empty array for date range with no invoices', () => {
      const found = repo.getInvoicesByDateRange(
        new Date('2025-12-01'),
        new Date('2025-12-31')
      );
      expect(found.length).toBe(0);
    });
  });

  describe('Aggregation Methods', () => {
    it('should calculate total amount from all invoices', () => {
      repo.addInvoice({
        id: 'INV-001',
        date: new Date(),
        issuer,
        recipient: { name: 'Customer A' },
        items: [],
        subtotalAmount: 1000,
        vatAmount: 200,
        totalAmount: 1200,
      });

      repo.addInvoice({
        id: 'INV-002',
        date: new Date(),
        issuer,
        recipient: { name: 'Customer B' },
        items: [],
        subtotalAmount: 500,
        vatAmount: 100,
        totalAmount: 600,
      });

      expect(repo.getTotalAmount()).toBe(1800);
    });

    it('should return 0 for total amount with no invoices', () => {
      expect(repo.getTotalAmount()).toBe(0);
    });

    it('should calculate total VAT from all invoices', () => {
      repo.addInvoice({
        id: 'INV-001',
        date: new Date(),
        issuer,
        recipient: { name: 'Customer A' },
        items: [],
        subtotalAmount: 1000,
        vatAmount: 200,
        totalAmount: 1200,
      });

      repo.addInvoice({
        id: 'INV-002',
        date: new Date(),
        issuer,
        recipient: { name: 'Customer B' },
        items: [],
        subtotalAmount: 500,
        vatAmount: 100,
        totalAmount: 600,
      });

      expect(repo.getTotalVat()).toBe(300);
    });

    it('should return 0 for total VAT with no invoices', () => {
      expect(repo.getTotalVat()).toBe(0);
    });
  });
});
