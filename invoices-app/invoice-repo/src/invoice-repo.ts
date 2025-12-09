import {
  Invoice,
  Recipient,
  InvoiceRepoSettings,
  IssuerCompany,
} from './invoice-types';

/**
 * InvoiceRepo manages invoices and recipients
 * Holds shared settings like default VAT rate and invoice issuer
 */
export default class InvoiceRepo {
  private settings: InvoiceRepoSettings;
  private recipients: Map<string, Recipient> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private recipientIdCounter: number = 1;

  /**
   * Initialize InvoiceRepo with settings
   */
  constructor(settings: InvoiceRepoSettings) {
    this.settings = settings;
  }

  /**
   * Get current settings
   */
  getSettings(): InvoiceRepoSettings {
    return this.settings;
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<InvoiceRepoSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  /**
   * Get default VAT rate
   */
  getDefaultVatRate(): number {
    return this.settings.defaultVatRate;
  }

  /**
   * Get invoice issuer
   */
  getInvoiceIssuer(): IssuerCompany {
    return this.settings.invoiceIssuer;
  }

  /**
   * Add a recipient
   * Generates an internal ID if not provided
   */
  addRecipient(recipient: Recipient): Recipient {
    // Generate a simple ID if it's not already present
    const recipientWithId: any = { ...recipient };
    if (!recipientWithId.id) {
      recipientWithId.id = `REC-${this.recipientIdCounter++}`;
    }
    this.recipients.set(recipientWithId.id, recipientWithId);
    return recipientWithId;
  }

  /**
   * Find recipient by ID
   */
  findRecipientById(id: string): Recipient | undefined {
    return this.recipients.get(id);
  }

  /**
   * Find recipients by name (case-insensitive partial match)
   */
  findRecipientsByName(name: string): Recipient[] {
    const searchName = name.toLowerCase();
    return Array.from(this.recipients.values()).filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(searchName)
    );
  }

  /**
   * Delete a recipient by ID
   */
  deleteRecipient(id: string): boolean {
    return this.recipients.delete(id);
  }

  /**
   * Update a recipient by ID
   */
  updateRecipient(id: string, updates: Partial<Recipient>): Recipient | undefined {
    const existing = this.recipients.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...updates };
    this.recipients.set(id, updated);
    return updated;
  }

  /**
   * Get all recipients
   */
  getAllRecipients(): Recipient[] {
    return Array.from(this.recipients.values());
  }

  /**
   * Add an invoice
   */
  addInvoice(invoice: Invoice): Invoice {
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  /**
   * Find invoice by ID
   */
  findInvoiceById(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  /**
   * Delete invoice by ID
   */
  deleteInvoice(id: string): boolean {
    return this.invoices.delete(id);
  }

  /**
   * Get all invoices
   */
  getAllInvoices(): Invoice[] {
    return Array.from(this.invoices.values());
  }

  /**
   * Get invoices by recipient ID
   */
  getInvoicesByRecipient(recipientId: string): Invoice[] {
    return Array.from(this.invoices.values()).filter(
      (invoice) =>
        (invoice.recipient as any).id === recipientId
    );
  }

  /**
   * Get invoices by date range
   */
  getInvoicesByDateRange(startDate: Date, endDate: Date): Invoice[] {
    return Array.from(this.invoices.values()).filter(
      (invoice) =>
        invoice.date >= startDate && invoice.date <= endDate
    );
  }

  /**
   * Get total amount from all invoices
   */
  getTotalAmount(): number {
    return Array.from(this.invoices.values()).reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );
  }

  /**
   * Get total VAT from all invoices
   */
  getTotalVat(): number {
    return Array.from(this.invoices.values()).reduce(
      (sum, invoice) => sum + invoice.vatAmount,
      0
    );
  }
}
