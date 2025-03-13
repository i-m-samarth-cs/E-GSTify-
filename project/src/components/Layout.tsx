import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, BarChart2, CheckCircle2, MessageSquare, Newspaper } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart2 },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Verification', href: '/verification', icon: CheckCircle2 },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Support', href: '/support', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">GST Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};