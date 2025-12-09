import {
  isRecipientCompany,
  isRecipientIndividual,
  calculateVat,
  calculateTotal,
  RecipientCompany,
  RecipientIndividual,
} from '../invoice-types';

describe('invoice-types', () => {
  describe('isRecipientCompany', () => {
    it('should return true for a company recipient with id', () => {
      const company: RecipientCompany = {
        name: 'Tech Corp',
        id: '123456',
      };
      expect(isRecipientCompany(company)).toBe(true);
    });

    it('should return true for a company recipient with taxId', () => {
      const company: RecipientCompany = {
        name: 'Tech Corp',
        taxId: 'BG123456',
      };
      expect(isRecipientCompany(company)).toBe(true);
    });

    it('should return true for a company recipient with address', () => {
      const company: RecipientCompany = {
        name: 'Tech Corp',
        address: '123 Main St',
      };
      expect(isRecipientCompany(company)).toBe(true);
    });

    it('should return true for a company recipient with manager', () => {
      const company: RecipientCompany = {
        name: 'Tech Corp',
        manager: 'John Doe',
      };
      expect(isRecipientCompany(company)).toBe(true);
    });

    it('should return false for an individual recipient', () => {
      const individual: RecipientIndividual = {
        name: 'John Doe',
        nationalIdNumber: '1234567890',
      };
      expect(isRecipientCompany(individual)).toBe(false);
    });

    it('should return false for a person with only name', () => {
      const individual: RecipientIndividual = {
        name: 'Jane Smith',
      };
      expect(isRecipientCompany(individual)).toBe(false);
    });
  });

  describe('isRecipientIndividual', () => {
    it('should return true for an individual recipient', () => {
      const individual: RecipientIndividual = {
        name: 'John Doe',
        nationalIdNumber: '1234567890',
      };
      expect(isRecipientIndividual(individual)).toBe(true);
    });

    it('should return true for an individual with only name', () => {
      const individual: RecipientIndividual = {
        name: 'Jane Smith',
      };
      expect(isRecipientIndividual(individual)).toBe(true);
    });

    it('should return false for a company recipient', () => {
      const company: RecipientCompany = {
        name: 'Tech Corp',
        id: '123456',
      };
      expect(isRecipientIndividual(company)).toBe(false);
    });
  });

  describe('calculateVat', () => {
    it('should calculate VAT correctly for standard rate', () => {
      const amount = 100;
      const vatRate = 20;
      expect(calculateVat(amount, vatRate)).toBe(20);
    });

    it('should calculate VAT for different rates', () => {
      expect(calculateVat(1000, 10)).toBe(100);
      expect(calculateVat(500, 5)).toBe(25);
      expect(calculateVat(2000, 20)).toBe(400);
    });

    it('should return 0 for zero amount', () => {
      expect(calculateVat(0, 20)).toBe(0);
    });

    it('should return 0 for zero VAT rate', () => {
      expect(calculateVat(100, 0)).toBe(0);
    });

    it('should handle decimal amounts', () => {
      expect(calculateVat(99.99, 20)).toBeCloseTo(19.998);
    });

    it('should handle decimal VAT rates', () => {
      expect(calculateVat(100, 5.5)).toBeCloseTo(5.5);
    });

    it('should handle negative amounts', () => {
      expect(calculateVat(-100, 20)).toBe(-20);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const subtotal = 100;
      const vat = 20;
      expect(calculateTotal(subtotal, vat)).toBe(120);
    });

    it('should handle zero subtotal', () => {
      expect(calculateTotal(0, 20)).toBe(20);
    });

    it('should handle zero VAT', () => {
      expect(calculateTotal(100, 0)).toBe(100);
    });

    it('should handle both zero', () => {
      expect(calculateTotal(0, 0)).toBe(0);
    });

    it('should work with large amounts', () => {
      expect(calculateTotal(1000000, 200000)).toBe(1200000);
    });

    it('should work with decimal amounts', () => {
      const subtotal = 99.99;
      const vat = 19.998;
      expect(calculateTotal(subtotal, vat)).toBeCloseTo(119.988);
    });

    it('should handle negative values', () => {
      expect(calculateTotal(-100, 20)).toBe(-80);
    });
  });
});
