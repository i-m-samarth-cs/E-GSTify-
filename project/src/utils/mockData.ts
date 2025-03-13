import { Invoice, InvoiceItem } from '../types/invoice';
import { format } from 'date-fns';

const generateMockItems = (): InvoiceItem[] => {
  const numItems = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: numItems }, (_, index) => {
    const quantity = Math.floor(Math.random() * 10) + 1;
    const rate = Math.floor(Math.random() * 1000) + 100;
    const amount = quantity * rate;
    const gstRate = [5, 12, 18, 28][Math.floor(Math.random() * 4)];
    const gstAmount = (amount * gstRate) / 100;
    
    return {
      name: `Item ${index + 1}`,
      quantity,
      rate,
      amount,
      gstRate,
      gstAmount
    };
  });
};

export const generateMockInvoice = (): Invoice => {
  const invoiceNumber = `INV${Math.floor(Math.random() * 1000000)}`;
  const today = format(new Date(), 'dd/MM/yyyy');
  const items = generateMockItems();
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = items.reduce((sum, item) => sum + item.gstAmount, 0);
  
  return {
    invoiceNumber,
    invoiceDate: today,
    customerGSTIN: '29AAAAA0000A1Z5',
    totalAmount,
    gstAmount,
    status: 'pending',
    reconciliationStatus: 'pending',
    validationErrors: [],
    items
  };
};

export const validateInvoice = (invoice: Invoice): string[] => {
  const errors: string[] = [];
  
  if (!invoice.invoiceNumber) errors.push('Invoice number is required');
  if (!invoice.invoiceDate) errors.push('Invoice date is required');
  if (!invoice.customerGSTIN) errors.push('Customer GSTIN is required');
  if (!invoice.totalAmount) errors.push('Total amount is required');
  if (!invoice.items.length) errors.push('At least one item is required');
  
  // GSTIN format validation (basic)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(invoice.customerGSTIN)) {
    errors.push('Invalid GSTIN format');
  }

  return errors;
};

export const mockGSTReturn = async (invoice: Invoice): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.random() > 0.3;
};

export const generateIRN = async (invoice: Invoice): Promise<{ irn: string; qrCode: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    irn: `IRN${Math.random().toString(36).substring(2, 15)}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${invoice.invoiceNumber}`
  };
};

export const getGSTStatistics = () => {
  return {
    totalGSTCollected: 125000,
    monthlyGSTCollection: 45000,
    pendingGST: 15000,
    lastUpdated: new Date()
  };
};

export const getChatbotResponse = (query: string): string => {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('gst rate')) {
    return 'GST rates vary by product category: 5%, 12%, 18%, and 28%. For specific items, please check the GST rate finder on the GST portal.';
  }
  
  if (normalizedQuery.includes('irn generation')) {
    return 'IRN (Invoice Reference Number) is generated automatically when you submit a valid invoice. Make sure all required fields are filled and the GSTIN is valid.';
  }
  
  if (normalizedQuery.includes('reconciliation')) {
    return 'Invoice reconciliation happens automatically when you generate an invoice. The system matches it with GST returns data. You can check the status in the Verification page.';
  }
  
  if (normalizedQuery.includes('deadline') || normalizedQuery.includes('due date')) {
    return 'GSTR-1 is due by the 11th of the next month. GSTR-3B is due by the 20th of the next month. Late filing may result in penalties.';
  }
  
  return 'I can help you with GST rates, IRN generation, reconciliation, and filing deadlines. Please ask a specific question about these topics.';
};