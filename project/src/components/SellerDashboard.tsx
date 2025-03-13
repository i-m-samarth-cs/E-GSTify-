import React, { useState } from 'react';
import { BarChart2, DollarSign, AlertCircle, CheckCircle2, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getGSTStatistics } from '../utils/mockData';
import { GSTCalculator } from './GSTCalculator';

export const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState(getGSTStatistics());
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOcrResult({
        invoiceNumber: 'INV-001',
        date: '2024-03-15',
        amount: 5000,
        gstin: '29ABCDE1234F1Z5',
        errors: ['Missing seller address', 'Invalid GST rate']
      });
    }
  };

  const updateDashboardStats = (newInvoice: any) => {
    setStats(prev => ({
      ...prev,
      totalGSTCollected: prev.totalGSTCollected + newInvoice.gstAmount,
      monthlyGSTCollection: prev.monthlyGSTCollection + newInvoice.gstAmount,
      invoicesGenerated: (prev.invoicesGenerated || 0) + 1,
      lastUpdated: new Date()
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total GST Collected
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{stats.totalGSTCollected.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Monthly Collection
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{stats.monthlyGSTCollection.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Invoices Generated
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.invoicesGenerated || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Last Updated
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {format(stats.lastUpdated, 'dd MMM yyyy')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Upload Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Invoice for Verification</h3>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
            <Upload className="w-8 h-8" />
            <span className="mt-2 text-base">Select Invoice PDF</span>
            <input type='file' className="hidden" onChange={handleFileUpload} accept=".pdf" />
          </label>
        </div>
        
        {ocrResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">OCR Results</h4>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
                <dd className="text-sm text-gray-900">{ocrResult.invoiceNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="text-sm text-gray-900">{ocrResult.date}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="text-sm text-gray-900">₹{ocrResult.amount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">GSTIN</dt>
                <dd className="text-sm text-gray-900">{ocrResult.gstin}</dd>
              </div>
            </dl>
            {ocrResult.errors.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-red-600">Validation Errors</h5>
                <ul className="mt-2 text-sm text-red-500">
                  {ocrResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GST Calculator Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Generate Invoice</h3>
          <button
            onClick={() => setShowInvoiceGenerator(!showInvoiceGenerator)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showInvoiceGenerator ? 'Hide Calculator' : 'Show Calculator'}
          </button>
        </div>
        {showInvoiceGenerator && (
          <GSTCalculator onInvoiceGenerated={updateDashboardStats} />
        )}
      </div>

      {/* Filing Deadlines */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Filing Deadlines
          </h3>
          <div className="mt-5">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Upcoming Deadlines
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>GSTR-1: 11th of next month</p>
                    <p>GSTR-3B: 20th of next month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};