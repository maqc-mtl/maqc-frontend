import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Payment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan') || 'standard';
    const navigate = useNavigate();
    const { user, updatePlanType } = useAuth();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const getPlanPrice = (planName: string) => {
        switch (planName.toLowerCase()) {
            case 'basic': return '$0.00';
            case 'premium': return '$49.99';
            case 'pro': return '$99.99';
            default: return '$29.99';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Simple formatting for card number
        if (name === 'cardNumber') {
            const formatted = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
            setFormData({ ...formData, [name]: formatted });
        }
        // Simple formatting for expiry
        else if (name === 'expiry') {
            const formatted = value.replace(/\D/g, '').substring(0, 4);
            if (formatted.length > 2) {
                setFormData({ ...formData, [name]: `${formatted.substring(0, 2)}/${formatted.substring(2, 4)}` });
            } else {
                setFormData({ ...formData, [name]: formatted });
            }
        }
        // Simple formatting for CVC
        else if (name === 'cvc') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '').substring(0, 4) });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            // Validate user is logged in
            if (!user) {
                throw new Error('Please log in to complete the purchase');
            }

            // Call backend payment endpoint
            await api.post('/payments/process', {
                planType: plan,
                cardholderName: formData.name,
                cardNumber: formData.cardNumber,
                expiry: formData.expiry,
                cvc: formData.cvc,
                email: user.email
            });

            setIsProcessing(false);
            setIsSuccess(true);

            updatePlanType(plan);

            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err: any) {
            setIsProcessing(false);
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center transform transition-all">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h2>
                    <p className="text-slate-500 mb-8 text-lg">Your transaction has been completed. Redirecting to login...</p>
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Order Summary */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-2">Order Summary</h2>
                        <p className="text-slate-400 mb-8">Complete your purchase to activate your membership.</p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <div>
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Plan</p>
                                    <p className="text-xl font-bold capitalize">{plan} Membership</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Price</p>
                                    <p className="text-xl font-bold">{getPlanPrice(plan)}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
                                <span>Subtotal</span>
                                <span>{getPlanPrice(plan)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-300 mb-4 pb-4 border-b border-white/10">
                                <span>Tax (0%)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-3xl font-black text-white">{getPlanPrice(plan)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <ShieldCheck size={20} className="text-emerald-400" />
                            <span>Secure 256-bit SSL encryption.</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Details</h2>
                        <p className="text-slate-500">We accept Visa and Mastercard.</p>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <div className="h-12 w-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2">
                            <svg viewBox="0 0 50 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.841 1.054L20.48 10.82h3.297l1.36-9.766h-3.296zM33.623 1.054l-3.328 6.745-.352-1.688c-.602-2.11-2.484-4.22-4.633-5.057l.984 9.766h3.469l5.18-9.766h-1.32zm-18.43 0h-2.546c-.61 0-1.125.352-1.36 1.055L6.46 10.82h3.469l.688-1.933h4.226l.407 1.933h3.047l-2.672-9.766h-2.21zm-1.875 5.45l1.055-3.024.601 3.024h-1.656zM48.172 1.054h-3.18c-.547 0-.96.282-1.203.774l-4.57 6.54-1.36-7.314h-3.36l2.07 9.766h3.282l4.89-6.96v6.96h3.188v-9.766h-.243z" fill="#1434CB" />
                            </svg>
                        </div>
                        <div className="h-12 w-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2">
                            <svg viewBox="0 0 36 22" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.5 11c0-3.375-1.5-6.375-3.875-8.375-2.375 2-3.875 5-3.875 8.375s1.5 6.375 3.875 8.375C21 17.375 22.5 14.375 22.5 11z" fill="#FF5F00" />
                                <path d="M14.75 11c0 3.375 1.5 6.375 3.875 8.375 3.25-1.125 5.625-4.25 5.625-8.375s-2.375-7.25-5.625-8.375C16.25 4.625 14.75 7.625 14.75 11z" fill="#EB001B" />
                                <path d="M24.25 11c0 4.125-2.375 7.25-5.625 8.375C21.875 21.5 25.75 23 30 23c6.625 0 12-5.375 12-12s-5.375-12-12-12c-4.25 0-8.125 1.5-11.375 3.625C21.875 3.75 24.25 6.875 24.25 11z" fill="#F79E1B" />
                                <path d="M11.75 11c0-4.125 2.375-7.25 5.625-8.375C14.125.5 10.25-1 6-1-1.625-1-7 4.375-7 11s5.375 12 13 12c4.25 0 8.125-1.5 11.375-3.625C14.125 18.25 11.75 15.125 11.75 11z" fill="#EB001B" />
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Name on Card</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium font-mono"
                                />
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">CVC</label>
                                <input
                                    type="text"
                                    name="cvc"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="123"
                                    maxLength={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium font-mono"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ${getPlanPrice(plan)}`
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/membership" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                Cancel and return to plans
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;

