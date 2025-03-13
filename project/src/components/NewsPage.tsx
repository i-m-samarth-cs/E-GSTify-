import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

interface TaxDocument {
  title: string;
  description: string;
  url: string;
}

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const taxDocuments: TaxDocument[] = [
    {
      title: "GST Rate Schedule",
      description: "Complete list of GST rates for different categories of goods and services",
      url: "https://cbic-gst.gov.in/pdf/gst-rate-schedule.pdf"
    },
    {
      title: "GSTR-1 Filing Guide",
      description: "Step by step guide for filing GSTR-1 returns",
      url: "https://cbic-gst.gov.in/pdf/gstr1-guide.pdf"
    },
    {
      title: "GSTR-3B Filing Guide",
      description: "Comprehensive guide for filing GSTR-3B returns",
      url: "https://cbic-gst.gov.in/pdf/gstr3b-guide.pdf"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using NewsAPI for GST-related news
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=GST+India+tax&language=en&sortBy=publishedAt&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
        );
        setNews(response.data.articles.slice(0, 10));
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback mock data
        setNews([
          {
            title: "GST Council Announces New Tax Rates",
            description: "The GST Council has announced revised tax rates for several categories of goods and services...",
            url: "#",
            publishedAt: new Date().toISOString()
          },
          {
            title: "E-invoicing Mandatory for Businesses",
            description: "E-invoicing under GST will be mandatory for businesses with turnover exceeding ₹5 crore...",
            url: "#",
            publishedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="space-y-8">
      {/* Latest News Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest GST News</h2>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {item.title}
                    <ExternalLink className="inline-block ml-2 h-4 w-4" />
                  </a>
                </h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tax Documents Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Tax Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxDocuments.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};