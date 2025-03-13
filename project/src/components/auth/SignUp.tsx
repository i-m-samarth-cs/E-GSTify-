import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Building2, Briefcase } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { UserRole, SignUpData } from '../../types/auth';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    role: 'customer',
    gstin: '',
    company_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateGSTIN = (gstin: string): boolean => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.role === 'seller') {
        if (!formData.gstin || !formData.company_name) {
          throw new Error('GSTIN and Company Name are required for sellers');
        }
        if (!validateGSTIN(formData.gstin)) {
          throw new Error('Invalid GSTIN format');
        }
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            email: formData.email,
            role: formData.role,
            ...(formData.role === 'seller' && {
              gstin: formData.gstin,
              company_name: formData.company_name
            })
          }]);

        if (profileError) throw profileError;

        if (formData.role === 'seller') {
          navigate('/dashboard');
        } else {
          navigate('/verification');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
            </div>

            {formData.role === 'seller' && (
              <>
                <div>
                  <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
                    GSTIN
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="gstin"
                      name="gstin"
                      type="text"
                      required
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="29AAAAA0000A1Z5"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};