
'use client';

import { useState } from 'react';
import axios from 'axios';

// Fallback API URL if environment variable is not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer(null);

    console.log('Submitting question:', question);
    console.log('API URL:', `${API_URL}/ai-query`);

    try {
      const response = await axios.post(
        `${API_URL}/ai-query`,
        { question: question },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response.data);
      setAnswer(response.data);
    } catch (err: any) {
      console.error('Error details:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'An error occurred';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      console.log('Testing backend at:', `${API_URL}/health`);
      const response = await axios.get(`${API_URL}/health`);
      console.log('Backend response:', response.data);
      alert('Backend connected: ' + JSON.stringify(response.data));
    } catch (err: any) {
      console.error('Backend test failed:', err);
      alert('Backend connection failed! Check console for details. API URL: ' + API_URL);
    }
  };

  const sampleQuestions = [
    'How many users ordered in the last month?',
    'What is the total revenue from all orders?',
    'Show me all users who placed orders',
    'How many orders are completed?',
    'What is the average order amount?',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            NL Query System
          </h1>
          <p className="text-gray-600">
            Ask questions about your database in natural language
          </p>
          <button
            onClick={testBackend}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Test Backend Connection
          </button>
          <p className="text-xs text-gray-500 mt-2">API URL: {API_URL}</p>
        </div>

        {/* Query Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask a question:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How many users ordered in the last month?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Processing...' : 'Get Answer'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Check browser console (F12) for more details
            </p>
          </div>
        )}

        {/* Answer Display */}
        {answer && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Answer:
            </h2>
            
            {/* Natural Language Answer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 text-lg">{answer.answer}</p>
            </div>

            {/* SQL Query Used */}
            {answer.sql && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">SQL Query Generated:</h3>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  {answer.sql}
                </pre>
                {answer.explanation && (
                  <p className="text-sm text-gray-600 mt-2 italic">{answer.explanation}</p>
                )}
              </div>
            )}

            {/* Data Results */}
            {answer.data && answer.data.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Data ({answer.rowCount} rows):
                </h3>
                <div className="bg-gray-50 rounded p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(answer.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Model Info */}
            {answer.model && (
              <div className="mt-4 text-xs text-gray-500">
                Powered by: {answer.model}
              </div>
            )}
          </div>
        )}

        {/* Sample Questions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Sample Questions to Try:
          </h3>
          <div className="space-y-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(q)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-gray-700 hover:text-blue-700"
              >
                <span className="text-sm">💬 {q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
