import React, { useState } from 'react';
import { Mail, User, Lock, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupGoogle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/user/signup', formData);
      setSuccessMessage('Please enter the verification code sent to your email.');
      setShowVerification(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Signup failed. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/user/verify', {
        email: formData.email,
        verificationCode
      });
      
      setSuccessMessage('Account verified successfully! Redirecting to login...');
      
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
      });
      setVerificationCode('');

      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Verification failed. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const renderSignupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="password"
            name="password"
            placeholder="Create password"
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );

  const renderVerificationForm = () => (
    <form onSubmit={handleVerification} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1F1F] p-4">
      <div className="w-full max-w-md bg-[#3A3A3A] text-white rounded-lg shadow-lg">
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-center">
              {showVerification ? 'Verify Your Account' : 'Create an Account'}
            </h2>
            <p className="text-zinc-400 text-sm text-center">
              {showVerification 
                ? 'Enter the verification code sent to your email'
                : 'Enter your information to create your account'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md">
              {successMessage}
            </div>
          )}
          
          {showVerification ? renderVerificationForm() : renderSignupForm()}
        </div>
      </div>
    </div>
  );
};

export default SignupGoogle;