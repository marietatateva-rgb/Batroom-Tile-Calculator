import generateSampleData from '../invoice-repo-sample-data';

describe('generateSampleData', () => {
  let repo = generateSampleData();

  describe('Repository Initialization', () => {
    it('should return an InvoiceRepo instance', () => {
      expect(repo).toBeDefined();
      expect(repo.getSettings).toBeDefined();
      expect(repo.getAllInvoices).toBeDefined();
      expect(repo.getAllRecipients).toBeDefined();
    });

    it('should have correct issuer settings', () => {
      const issuer = repo.getInvoiceIssuer();
      expect(issuer.name).toBe('TechFlow Solutions Ltd.');
      expect(issuer.id).toBe('0776618');
      expect(issuer.taxId).toBe('BG0776618');
    });

    it('should have 20% default VAT rate', () => {
      expect(repo.getDefaultVatRate()).toBe(20);
    });

    it('should have issuer with all required fields', () => {
      const issuer = repo.getInvoiceIssuer();
      expect(issuer.name).toBeDefined();
      expect(issuer.id).toBeDefined();
      expect(issuer.taxId).toBeDefined();
      expect(issuer.address).toBeDefined();
      expect(issuer.manager).toBeDefined();
      expect(issuer.iban).toBeDefined();
    });
  });

  describe('Sample Recipients', () => {
    it('should load 5 sample recipients', () => {
      const recipients = repo.getAllRecipients();
      expect(recipients.length).toBe(5);
    });

    it('should have company recipients with required fields', () => {
      const digitalInnovations = repo.findRecipientsByName('Digital');
      expect(digitalInnovations.length).toBeGreaterThan(0);
      const company = digitalInnovations[0] as any;
      expect(company.name).toBeDefined();
      expect(company.id).toBeDefined();
      expect(company.taxId).toBeDefined();
    });

    it('should have individual recipients', () => {
      const individuals = repo.findRecipientsByName('Smith');
      expect(individuals.length).toBeGreaterThan(0);
    });

    it('should be able to find recipients by name', () => {
      const digital = repo.findRecipientsByName('Digital');
      expect(digital.length).toBeGreaterThan(0);
    });

    it('should have 3 company recipients', () => {
      const companies = [
        repo.findRecipientsByName('Digital'),
        repo.findRecipientsByName('CloudNet'),
        repo.findRecipientsByName('WebDev'),
      ];
      const totalCompanies = companies.reduce((sum, comp) => sum + comp.length, 0);
      expect(totalCompanies).toBe(3);
    });

    it('should have 2 individual recipients', () => {
      const smith = repo.findRecipientsByName('Smith');
      const johnson = repo.findRecipientsByName('Johnson');
      expect(smith.length + johnson.length).toBe(2);
    });
  });

  describe('Sample Invoices', () => {
    it('should load 10 sample invoices', () => {
      const invoices = repo.getAllInvoices();
      expect(invoices.length).toBe(10);
    });

    it('should have invoices with sequential IDs', () => {
      const invoices = repo.getAllInvoices();
      for (let i = 0; i < invoices.length; i++) {
        expect(invoices[i].id).toBe(`INV-2025-${String(i + 1).padStart(3, '0')}`);
      }
    });

    it('should have invoices with correct issuer', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.issuer.name).toBe('TechFlow Solutions Ltd.');
      });
    });

    it('should have invoices with recipients', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.recipient).toBeDefined();
        expect(invoice.recipient.name).toBeDefined();
      });
    });

    it('should have invoices with items', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.items.length).toBeGreaterThan(0);
      });
    });

    it('should have invoices with correct VAT calculations', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        const expectedVat = (invoice.subtotalAmount * 20) / 100;
        expect(invoice.vatAmount).toBeCloseTo(expectedVat, 2);
      });
    });

    it('should have invoices with correct totals', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        const expectedTotal = invoice.subtotalAmount + invoice.vatAmount;
        expect(invoice.totalAmount).toBeCloseTo(expectedTotal, 2);
      });
    });

    it('should have invoices dated between January and March 2025', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.date.getFullYear()).toBe(2025);
        expect(invoice.date.getMonth()).toBeGreaterThanOrEqual(0);
        expect(invoice.date.getMonth()).toBeLessThanOrEqual(2);
      });
    });

    it('should have reasonable invoice amounts', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.totalAmount).toBeGreaterThan(0);
        expect(invoice.subtotalAmount).toBeGreaterThan(0);
        expect(invoice.vatAmount).toBeGreaterThan(0);
      });
    });

    it('should have invoices with product items', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(item.product).toBeDefined();
          expect(item.quantity).toBeGreaterThan(0);
          expect(item.unit).toBeDefined();
          expect(item.price).toBeGreaterThan(0);
          expect(item.vatRate).toBe(20);
        });
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have total amounts that are positive', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.totalAmount).toBeGreaterThan(0);
      });
    });

    it('should have subtotal less than or equal to total', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        expect(invoice.subtotalAmount).toBeLessThanOrEqual(invoice.totalAmount);
      });
    });

    it('should have reasonable VAT amounts', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        // VAT should be between 0 and 50% of subtotal for 20% VAT rate
        expect(invoice.vatAmount).toBeGreaterThanOrEqual(0);
        expect(invoice.vatAmount).toBeLessThanOrEqual(invoice.subtotalAmount * 0.5);
      });
    });

    it('should calculate aggregate amounts correctly', () => {
      const invoices = repo.getAllInvoices();
      const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const totalVat = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);

      expect(repo.getTotalAmount()).toBeCloseTo(totalAmount, 2);
      expect(repo.getTotalVat()).toBeCloseTo(totalVat, 2);
    });

    it('should have expected total revenue range', () => {
      // Based on sample data, total should be in a reasonable range
      const total = repo.getTotalAmount();
      expect(total).toBeGreaterThan(50000); // More than 50k
      expect(total).toBeLessThan(100000); // Less than 100k
    });

    it('should have expected total VAT range', () => {
      const vat = repo.getTotalVat();
      expect(vat).toBeGreaterThan(8000); // More than 8k
      expect(vat).toBeLessThan(20000); // Less than 20k
    });
  });

  describe('Invoice Item Details', () => {
    it('should have items with valid quantities', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(item.quantity).toBeGreaterThan(0);
          expect(Number.isInteger(item.quantity) || item.quantity % 1 !== 0).toBe(true);
        });
      });
    });

    it('should have items with valid prices', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(item.price).toBeGreaterThan(0);
        });
      });
    });

    it('should calculate item values correctly', () => {
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          const expectedValue = item.quantity * item.price;
          expect(item.valueWithoutVat).toBeCloseTo(expectedValue, 2);
        });
      });
    });

    it('should have valid product units', () => {
      const validUnits = ['pcs', 'kg', 'liters', 'meters'];
      const invoices = repo.getAllInvoices();
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          expect(validUnits).toContain(item.unit);
        });
      });
    });
  });
});
