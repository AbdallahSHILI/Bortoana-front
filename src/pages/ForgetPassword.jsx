import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Request Code, Step 2: Reset Password
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const source = location.state?.source || 'login';

    const handleRequestCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/user/forgot-password', { email });
            setMessage(response.data.message);
            setError('');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const response = await axios.post('http://localhost:5001/api/user/forgot-password', { email });
            setMessage('Verification code resent successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code');
            setMessage('');
        } finally {
            setIsResending(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/user/reset-password', {
                email,
                code,
                newPassword: password,
            });
            setMessage(response.data.message);
            setError('');
            if (source === 'profile') {
              console.log('Navigating to home from profile');
              navigate('/home'); // If from profile, go home immediately
          } else {
              console.log('Navigating to login page');
              // If from login, first show success message then go to login
              setTimeout(() => {
                  navigate('/newbortoaana'); // Make sure you have a '/login' route
              }, 2000);
          }

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1F1F1F] p-4">
            <div className="w-full max-w-md bg-[#4B4B4B] rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 bg-white text-[#1F1F1F] rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Send Verification Code
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white">Verification Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="mt-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? 'Resending...' : 'Resend'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 bg-white text-[#1F1F1F] rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                {message && (
                    <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const token = window.location.pathname.split('/').pop();
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5001/api/user/reset-password', {
                token,
                newPassword: password,
            });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };
  
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1F1F1F] p-4">
            <div className="w-full max-w-md bg-[#4B4B4B] rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
    
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                            required
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium text-white">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                            required
                        />
                    </div>
    
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 bg-white text-[#1F1F1F] rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                        Reset Password
                    </button>
                </form>
    
                {message && (
                    <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
                        {message}
                    </div>
                )}
    
                {error && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export { ForgotPassword, ResetPassword };