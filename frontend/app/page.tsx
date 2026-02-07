'use client';

import { useState } from 'react';
import axios from 'axios';

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

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai-query`, {
        question: question,
      });

      setAnswer(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      alert('Backend connected: ' + JSON.stringify(response.data));
    } catch (err) {
      alert('Backend connection failed!');
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
