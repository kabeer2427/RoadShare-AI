import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navigation } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { user } = await login({ email, password });
      
      if (user?.role === 'commuter' || user?.role === 'passenger') {
        navigate('/commuter');
      } else {
        navigate('/driver');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Navigation className="mx-auto h-12 w-12 text-brand" />
        <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Sign in to access your MoveFlow dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold leading-6 text-gray-700">Email Address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold leading-6 text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-brand hover:text-brand-dark">
                    Forgot password?
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-brand px-3 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand hover:text-brand-dark transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
