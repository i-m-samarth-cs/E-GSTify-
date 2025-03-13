import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types/invoice';
import { getChatbotResponse } from '../utils/mockData';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I can help you with GST-related queries. Ask me about GST rates, IRN generation, reconciliation, or filing deadlines.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getChatbotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="bg-white shadow rounded-lg h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          GST Support Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};