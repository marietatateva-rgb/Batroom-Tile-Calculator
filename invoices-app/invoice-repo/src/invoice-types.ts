/**
 * Product unit types for invoice items
 */
export type ProductUnit = 'pcs' | 'kg' | 'liters' | 'meters';

/**
 * Issuer company details
 * All properties are mandatory
 */
export interface IssuerCompany {
  name: string;
  id: string;
  taxId: string;
  address: string;
  manager: string;
  iban: string;
}

/**
 * Recipient company details
 * Only name is mandatory
 */
export interface RecipientCompany {
  name: string;
  id?: string;
  taxId?: string;
  address?: string;
  manager?: string;
}

/**
 * Recipient individual (person) details
 */
export interface RecipientIndividual {
  name: string;
  nationalIdNumber?: string;
}

/**
 * Recipient can be either a company or an individual
 */
export type Recipient = RecipientCompany | RecipientIndividual;

/**
 * Checks if a recipient is a company
 */
export function isRecipientCompany(recipient: Recipient): recipient is RecipientCompany {
  return 'id' in recipient || 'taxId' in recipient || 'address' in recipient || 'manager' in recipient;
}

/**
 * Checks if a recipient is an individual
 */
export function isRecipientIndividual(recipient: Recipient): recipient is RecipientIndividual {
  return !isRecipientCompany(recipient);
}

/**
 * Invoice item details
 */
export interface InvoiceItem {
  product: string;
  quantity: number;
  unit: ProductUnit;
  price: number; // Price per unit
  vatRate: number; // VAT rate as percentage (e.g., 20 for 20%)
  valueWithoutVat: number; // Total value without VAT
}

/**
 * Invoice details
 */
export interface Invoice {
  id: string;
  date: Date;
  issuer: IssuerCompany;
  recipient: Recipient;
  items: InvoiceItem[];
  subtotalAmount: number; // Sum of all items without VAT
  vatAmount: number; // Total VAT
  totalAmount: number; // Total with VAT
}

/**
 * Invoice repo settings
 */
export interface InvoiceRepoSettings {
  defaultVatRate: number; // Default VAT rate as percentage
  invoiceIssuer: IssuerCompany;
}

/**
 * Helper function to calculate VAT amount
 */
export function calculateVat(amount: number, vatRate: number): number {
  return (amount * vatRate) / 100;
}

/**
 * Helper function to calculate total amount including VAT
 */
export function calculateTotal(subtotal: number, vatAmount: number): number {
  return subtotal + vatAmount;
}
