export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerGSTIN: string;
  totalAmount: number;
  gstAmount: number;
  irn?: string;
  qrCode?: string;
  status: 'pending' | 'processed' | 'error';
  reconciliationStatus: 'pending' | 'reconciled';
  validationErrors: string[];
  items: InvoiceItem[];
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  gstAmount: number;
}

export interface GSTPayload {
  Version: string;
  TranDtls: {
    TaxSch: string;
    SupTyp: string;
    RegRev: string;
    EcmGstin: string | null;
    IgstOnIntra: string;
  };
  DocDtls: {
    Typ: string;
    No: string;
    Dt: string;
  };
  SellerDtls: {
    Gstin: string;
    LglNm: string;
    TrdNm: string;
    Addr1: string;
    Addr2: string;
    Loc: string;
    Pin: number;
    Stcd: string;
  };
  BuyerDtls: {
    Gstin: string;
    LglNm: string;
    TrdNm: string;
    Pos: string;
    Addr1: string;
    Addr2: string;
    Loc: string;
    Pin: number;
    Stcd: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}