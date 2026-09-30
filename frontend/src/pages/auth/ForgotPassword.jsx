import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../api/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request, 2: Reset, 3: Success
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await apiClient.post('/auth/forgot-password/request', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await apiClient.post('/auth/forgot-password/reset', { email, token, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The code might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Navigation className="mx-auto h-12 w-12 text-brand" />
        <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-gray-900">
          Account Recovery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          {step === 1 && 'Enter your email to receive a reset code'}
          {step === 2 && 'Enter the reset code sent to your email'}
          {step === 3 && 'Your password has been reset successfully!'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2 mb-6">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleRequest}>
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

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-brand px-3 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-all disabled:opacity-75"
              >
                {loading ? 'Sending...' : 'Send Reset Code'} <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleReset}>
              <div>
                <label className="block text-sm font-bold leading-6 text-gray-700">6-Digit Reset Code (OTP)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50 text-center tracking-widest text-lg"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold leading-6 text-gray-700">New Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-brand px-3 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-all disabled:opacity-75"
              >
                {loading ? 'Resetting...' : 'Reset Password'} <CheckCircle2 size={16} />
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                You can now sign in using your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="flex w-full justify-center rounded-xl bg-brand px-3 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-all"
              >
                Back to Login
              </button>
            </div>
          )}

          {step < 3 && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
