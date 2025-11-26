import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

/**
 * Connection Test Page
 * Tests all API endpoints and displays real-time connection status
 */
const ConnectionTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Health Check
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      results.health = { status: '✅ PASS', data };
    } catch (error) {
      results.health = { status: '❌ FAIL', error: error.message };
    }

    // Test 2: Get Current User
    try {
      const userData = await apiService.getCurrentUser();
      results.currentUser = { status: '✅ PASS', data: userData };
    } catch (error) {
      results.currentUser = { status: '❌ FAIL', error: error.message };
    }

    // Test 3: Get Classrooms
    try {
      const classrooms = await apiService.getClassrooms();
      results.classrooms = { 
        status: '✅ PASS', 
        count: Array.isArray(classrooms) ? classrooms.length : 0,
        data: classrooms 
      };
    } catch (error) {
      results.classrooms = { status: '❌ FAIL', error: error.message };
    }

    // Test 4: Get Submissions
    try {
      const submissions = await apiService.getSubmissions();
      results.submissions = { 
        status: '✅ PASS', 
        count: Array.isArray(submissions) ? submissions.length : 0,
        data: submissions 
      };
    } catch (error) {
      results.submissions = { status: '❌ FAIL', error: error.message };
    }

    // Test 5: Get Notifications
    try {
      const notifications = await apiService.getNotifications();
      results.notifications = { 
        status: '✅ PASS', 
        count: Array.isArray(notifications) ? notifications.length : 0,
        data: notifications 
      };
    } catch (error) {
      results.notifications = { status: '❌ FAIL', error: error.message };
    }

    // Test 6: Get Repository Items
    try {
      const items = await apiService.getRepositoryItems();
      results.repository = { 
        status: '✅ PASS', 
        count: Array.isArray(items) ? items.length : 0,
        data: items 
      };
    } catch (error) {
      results.repository = { status: '❌ FAIL', error: error.message };
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Not Authenticated</h2>
          <p className="text-gray-600 mb-6">Please login to test API connections</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔌 Connection Test</h1>
              <p className="text-gray-600 mt-2">Testing full-stack integration</p>
            </div>
            <button
              onClick={runTests}
              disabled={testing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {testing ? '🔄 Testing...' : '🔄 Retest All'}
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Current User</h3>
            <div className="text-sm text-blue-800">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length === 0 && !testing && (
            <div className="text-center py-12 text-gray-500">
              Click "Retest All" to run connection tests
            </div>
          )}

          {testing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Running tests...</p>
            </div>
          )}

          {Object.keys(testResults).length > 0 && !testing && (
            <div className="space-y-4">
              {Object.entries(testResults).map(([testName, result]) => (
                <div
                  key={testName}
                  className={`p-4 rounded-lg border ${
                    result.status.includes('✅')
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {testName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <span className={`text-lg ${
                      result.status.includes('✅') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.status}
                    </span>
                  </div>

                  {result.count !== undefined && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Count:</strong> {result.count} items
                    </p>
                  )}

                  {result.error && (
                    <p className="text-sm text-red-600">
                      <strong>Error:</strong> {result.error}
                    </p>
                  )}

                  {result.data && !result.error && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {Object.keys(testResults).length > 0 && !testing && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-semibold">
                    ✅ Passed:{' '}
                    {Object.values(testResults).filter(r => r.status.includes('✅')).length}
                  </span>
                </div>
                <div>
                  <span className="text-red-600 font-semibold">
                    ❌ Failed:{' '}
                    {Object.values(testResults).filter(r => r.status.includes('❌')).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 What's Being Tested</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ <strong>Health Check:</strong> Backend server is running</li>
            <li>✓ <strong>Current User:</strong> Authentication token is valid</li>
            <li>✓ <strong>Classrooms:</strong> Database query works, data is returned</li>
            <li>✓ <strong>Submissions:</strong> Student can fetch their submissions</li>
            <li>✓ <strong>Notifications:</strong> Notification system is working</li>
            <li>✓ <strong>Repository:</strong> Repository items can be fetched</li>
          </ul>
        </div>

        {/* Backend Info */}
        <div className="mt-6 bg-gray-800 text-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">🔧 Connection Info</h3>
          <div className="space-y-2 text-sm font-mono">
            <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</p>
            <p><strong>Backend Port:</strong> 5000</p>
            <p><strong>Frontend Port:</strong> 5173</p>
            <p><strong>Database:</strong> MongoDB (campus-archive)</p>
            <p><strong>Auth Token:</strong> {localStorage.getItem('authToken') ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
