import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Car, FileCheck, CheckCircle2, Navigation } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('commuter');
  const [step, setStep] = useState(1);
  
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'driver' && step < 3) {
      nextStep();
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const payload = { ...formData, role };
      if (!payload.email) delete payload.email;
      
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
    <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Navigation className="mx-auto h-10 w-10 text-brand" />
        <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-gray-900">
          Join MoveFlow
        </h2>
        
        <div className="mt-4 flex justify-center border-b border-gray-200">
          <button
            className={`pb-3 px-6 text-sm font-bold ${role === 'commuter' ? 'border-b-2 border-brand text-brand' : 'text-gray-400 hover:text-gray-700'}`}
            onClick={() => { setRole('commuter'); setStep(1); }}
          >
            Commuter
          </button>
          <button
            className={`pb-3 px-6 text-sm font-bold ${role === 'driver' ? 'border-b-2 border-brand text-brand' : 'text-gray-400 hover:text-gray-700'}`}
            onClick={() => setRole('driver')}
          >
            Driver Partner
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          {role === 'driver' && (
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-gray-100 text-gray-400'}`}>1</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-gray-100 text-gray-400'}`}>2</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-gray-100 text-gray-400'}`}>3</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
            
            {/* STEP 1 / COMMUTER FORM */}
            {(step === 1 || role === 'commuter') && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">Full Name</label>
                  <div className="mt-2">
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">Phone Number</label>
                  <div className="mt-2">
                    <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">Password</label>
                  <div className="mt-2">
                    <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {role === 'driver' && step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-bold text-gray-900">Vehicle Information</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">License Number</label>
                  <div className="mt-2">
                    <input type="text" name="license_number" required value={formData.license_number} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50 uppercase" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold leading-6 text-gray-700">Vehicle Number</label>
                  <div className="mt-2">
                    <input type="text" name="vehicle_number" required value={formData.vehicle_number} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50 uppercase" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold leading-6 text-gray-700">Type</label>
                    <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50">
                      <option value="e_rickshaw">🛺 E-Rickshaw</option>
                      <option value="auto">🚕 Auto</option>
                      <option value="shared_auto">🚐 Shared Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold leading-6 text-gray-700">Capacity</label>
                    <div className="mt-2">
                      <input type="number" name="vehicle_capacity" min="1" max="10" required value={formData.vehicle_capacity} onChange={handleChange} className="block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {role === 'driver' && step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="w-5 h-5 text-brand" />
                  <h3 className="text-lg font-bold text-gray-900">Verification</h3>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
                  <p className="font-bold mb-1">Almost there!</p>
                  <p>In a production app, you would upload your driving license and RC book here.</p>
                </div>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand" />
                  <span className="text-sm text-gray-600 font-medium">I confirm all details are accurate and I agree to the MoveFlow Driver terms of service.</span>
                </label>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              {role === 'driver' && step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 justify-center rounded-xl bg-white px-3 py-3 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center rounded-xl bg-brand px-3 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 ${role === 'driver' && step > 1 ? 'flex-[2]' : 'w-full'}`}
              >
                {loading ? 'Processing...' : (role === 'driver' && step < 3 ? 'Continue →' : 'Complete Registration')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand hover:text-brand-dark transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
