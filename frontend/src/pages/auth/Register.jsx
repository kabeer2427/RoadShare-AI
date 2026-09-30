import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('commuter');
  
  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole === 'driver') setRole('driver');
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    license_number: '',
    vehicle_number: '',
    vehicle_type: 'e_rickshaw',
    vehicle_capacity: 4
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicle_capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const payload = { ...formData, role };
      if (role !== 'driver') {
        delete payload.license_number;
        delete payload.vehicle_number;
        delete payload.vehicle_type;
        delete payload.vehicle_capacity;
      }
      
      const user = await register(payload);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
        
        <div className="mt-4 flex justify-center border-b border-gray-200">
          <button
            className={`pb-2 px-4 text-sm font-medium ${role === 'commuter' ? 'border-b-2 border-brand-DEFAULT text-brand-DEFAULT' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('commuter')}
          >
            Commuter
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${role === 'driver' ? 'border-b-2 border-brand-DEFAULT text-brand-DEFAULT' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('driver')}
          >
            Driver
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <div className="mt-2">
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
            <div className="mt-2">
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email (Optional)</label>
            <div className="mt-2">
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="mt-2">
              <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
            </div>
          </div>

          {role === 'driver' && (
            <div className="space-y-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Vehicle Details</h3>
              
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">License Number</label>
                <div className="mt-2">
                  <input type="text" name="license_number" required value={formData.license_number} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Vehicle Number</label>
                <div className="mt-2">
                  <input type="text" name="vehicle_number" required value={formData.vehicle_number} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Vehicle Type</label>
                  <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-DEFAULT sm:text-sm sm:leading-6">
                    <option value="e_rickshaw">E-Rickshaw</option>
                    <option value="auto">Auto</option>
                    <option value="shared_auto">Shared Auto</option>
                    <option value="taxi">Taxi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Capacity</label>
                  <div className="mt-2">
                    <input type="number" name="vehicle_capacity" min="1" max="10" required value={formData.vehicle_capacity} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-DEFAULT sm:text-sm sm:leading-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-brand-DEFAULT px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-DEFAULT transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-brand-DEFAULT hover:text-brand-dark">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
