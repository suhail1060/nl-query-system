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
      // For now, we'll just echo the question back
      // Later, this will call the AI agent
      setAnswer({
        question: question,
        response: 'AI agent not connected yet. This will generate SQL and fetch results.',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
            <div className="bg-gray-50 rounded p-4">
              <p className="text-gray-700 mb-2">
                <strong>Your Question:</strong> {answer.question}
              </p>
              <p className="text-gray-700">
                <strong>Response:</strong> {answer.response}
              </p>
            </div>
          </div>
        )}

        {/* Sample Questions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Sample Questions to Try:
          </h3>
          <ul className="space-y-2">
            {[
              'How many users ordered in the last month?',
              'What is the total revenue from orders?',
              'Show me all users who placed orders',
              'How many orders are pending?',
            ].map((q, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setQuestion(q)}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}