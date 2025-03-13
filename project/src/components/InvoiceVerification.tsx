import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Upload } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { validateInvoice, generateIRN } from '../utils/mockData';

export const InvoiceVerification: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'success' | 'error';
    message: string;
    invoice?: Invoice;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!invoiceNumber) return;

    setLoading(true);
    try {
      // Simulate MasterGST API call
      const response = await fetch('https://api.mastergst.com/v1/invoice/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_MASTERGST_API_KEY'
        },
        body: JSON.stringify({ invoiceNumber })
      });

      if (!response.ok) {
        throw new Error('Failed to verify invoice');
      }

      const mockInvoice: Invoice = {
        invoiceNumber,
        invoiceDate: '01/03/2024',
        customerGSTIN: '29AAAAA0000A1Z5',
        totalAmount: 50000,
        gstAmount: 9000,
        status: 'pending',
        reconciliationStatus: 'pending',
        validationErrors: [],
        items: [
          {
            name: 'Test Item',
            quantity: 1,
            rate: 50000,
            amount: 50000,
            gstRate: 18,
            gstAmount: 9000
          }
        ]
      };

      const errors = validateInvoice(mockInvoice);

      if (errors.length > 0) {
        setVerificationResult({
          status: 'error',
          message: errors.join(', '),
          invoice: mockInvoice
        });
        return;
      }

      const { irn } = await generateIRN(mockInvoice);
      setVerificationResult({
        status: 'success',
        message: `Invoice verified successfully. IRN: ${irn}`,
        invoice: { ...mockInvoice, irn, status: 'processed' }
      });
    } catch (error) {
      setVerificationResult({
        status: 'error',
        message: 'Failed to verify invoice with MasterGST API',
        invoice: undefined
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Invoice Verification
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Enter Invoice Number"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleVerification}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {verificationResult && (
          <div className={`mt-4 rounded-md p-4 ${
            verificationResult.status === 'success' 
              ? 'bg-green-50' 
              : 'bg-red-50'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {verificationResult.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  verificationResult.status === 'success'
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {verificationResult.message}
                </h3>
                {verificationResult.invoice && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Invoice Details
                    </h4>
                    <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Invoice Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {verificationResult.invoice.invoiceDate}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          GSTIN
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {verificationResult.invoice.customerGSTIN}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Total Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          ₹{verificationResult.invoice.totalAmount.toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          GST Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          ₹{verificationResult.invoice.gstAmount.toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OCR Upload Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Invoice for OCR Verification</h3>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
            <Upload className="w-8 h-8" />
            <span className="mt-2 text-base">Select Invoice PDF</span>
            <input type='file' className="hidden" accept=".pdf" />
          </label>
        </div>
      </div>
    </div>
  );
};