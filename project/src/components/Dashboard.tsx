import React from 'react';
import { Invoice } from '../types/invoice';
import { FileCheck2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  invoices: Invoice[];
}

export const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  return (
    <div className="p-6">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-semibold flex items-center gap-2">
            <FileCheck2 size={20} />
            Total Invoices
          </h3>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-700 font-semibold flex items-center gap-2">
            <CheckCircle2 size={20} />
            Processed
          </h3>
          <p className="text-2xl font-bold">
            {invoices.filter(i => i.status === 'processed').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-yellow-700 font-semibold flex items-center gap-2">
            <Clock size={20} />
            Pending
          </h3>
          <p className="text-2xl font-bold">
            {invoices.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-700 font-semibold flex items-center gap-2">
            <AlertCircle size={20} />
            Errors
          </h3>
          <p className="text-2xl font-bold">
            {invoices.filter(i => i.status === 'error').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSTIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reconciliation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IRN
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.invoiceNumber}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.invoiceDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.customerGSTIN}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${invoice.status === 'processed' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'error' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${invoice.reconciliationStatus === 'reconciled' ? 
                        'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {invoice.reconciliationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.irn || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};