import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@resiliencenet.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { email, password });

    try {
      // Validate demo credentials
      if (email === 'admin@resiliencenet.com' && password === 'admin123') {
        console.log('Demo credentials valid, generating mock token');

        // Create a mock JWT token (for testing without backend)
        // Format: header.payload.signature
        // Payload contains: { sub: "admin", exp: future_timestamp }
        const mockPayload = {
          sub: 'admin',
          email: email,
          exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 hours from now
        };

        // In production, backend would return this token
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                         btoa(JSON.stringify(mockPayload)) + 
                         '.mock_signature';

        console.log('Mock token generated:', mockToken);

        // Call parent component's login handler
        onLoginSuccess(mockToken);

        // Navigate to dashboard
        console.log('Navigating to /admin');
        navigate('/admin');
      } else {
        console.log('Invalid credentials');
        setError('Invalid email or password. Use demo credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">Resilience</span>
            <span className="text-blue-400">Net</span>
          </h1>
          <p className="text-blue-300 text-sm uppercase tracking-wide">Mumbai Disaster Network</p>
          <p className="text-gray-400 text-sm mt-2">Admin Control Panel</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs font-semibold text-blue-300 mb-3">Demo Credentials</p>
            <div className="space-y-2">
              <p className="text-xs text-blue-200">Email: admin@resiliencenet.com</p>
              <p className="text-xs text-blue-200">Password: admin123</p>
            </div>
            <p className="text-xs text-gray-400 mt-3">Use these credentials to test the admin dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}