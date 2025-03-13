import React, { useState } from 'react';
import { Calculator, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Product {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  gstRate?: number;
  gstAmount?: number;
  totalAmount?: number;
}

interface GSTCalculatorProps {
  onInvoiceGenerated?: (invoice: any) => void;
}

export const GSTCalculator: React.FC<GSTCalculatorProps> = ({ onInvoiceGenerated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 1
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electronics',
    'Furniture',
    'Food Items',
    'Clothing',
    'Books',
    'Pharmaceuticals',
    'Automobiles',
    'Construction Materials',
    'Software Services',
    'Others'
  ];

  const calculateGSTRate = async (product: Product): Promise<number> => {
    // Simulated AI model response
    const categoryRates: { [key: string]: number } = {
      'Electronics': 18,
      'Furniture': 18,
      'Food Items': 5,
      'Clothing': 5,
      'Books': 0,
      'Pharmaceuticals': 12,
      'Automobiles': 28,
      'Construction Materials': 18,
      'Software Services': 18,
      'Others': 18
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    return categoryRates[product.category] || 18;
  };

  const handleAddProduct = async () => {
    if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const gstRate = await calculateGSTRate(currentProduct);
      const gstAmount = (currentProduct.price * currentProduct.quantity * gstRate) / 100;
      const totalAmount = (currentProduct.price * currentProduct.quantity) + gstAmount;

      const newProduct = {
        ...currentProduct,
        gstRate,
        gstAmount,
        totalAmount
      };

      setProducts([...products, newProduct]);
      setCurrentProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        quantity: 1
      });

      // Update dashboard stats
      if (onInvoiceGenerated) {
        onInvoiceGenerated({
          gstAmount,
          totalAmount,
          products: [...products, newProduct]
        });
      }
    } catch (error) {
      console.error('Error calculating GST:', error);
      alert('Error calculating GST rate');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
  };

  const getTotalGST = () => {
    return products.reduce((sum, product) => sum + (product.gstAmount || 0), 0);
  };

  const generateInvoice = async () => {
    const invoiceElement = document.getElementById('invoice');
    if (!invoiceElement) return;

    try {
      const canvas = await html2canvas(invoiceElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Input Form */}
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={currentProduct.quantity}
              onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddProduct}
              disabled={loading}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Calculating...' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      {products.length > 0 && (
        <div id="invoice" className="bg-white rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
            <button
              onClick={generateInvoice}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </button>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gstRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.gstAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.totalAmount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{getTotalGST().toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{getTotalAmount().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};