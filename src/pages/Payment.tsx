import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader2, CheckCircle, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import api from '../services/api';

const GST_RATE = 0.05;
const QST_RATE = 0.09975;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount);
};

const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
};

const Payment: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan') || 'standard';
    const navigate = useNavigate();
    const { user, updatePlanType } = useAuth();
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmingServer, setIsConfirmingServer] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<number | null>(null);

    const pollingTimeoutRef = useRef<any>(null);

    const [formData, setFormData] = useState({
        name: ''
    });

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, []);

    const hasInitialized = useRef(false);

    // Fetch PaymentIntent clientSecret on mount
    useEffect(() => {
        if (!user || hasInitialized.current) return;

        const createIntent = async () => {
            hasInitialized.current = true;
            try {
                const response = await api.post('/payments/create-payment-intent', {
                    planType: plan,
                    email: user.email
                });
                setClientSecret(response.data.clientSecret);
                setTransactionId(response.data.transactionId);
            } catch (err: any) {
                console.error('Failed to create payment intent:', err);
                setError('Failed to initialize payment. Please refresh.');
                hasInitialized.current = false; // Allow retry on error if needed
            }
        };
        createIntent();
    }, [plan, user]);

    const getPlanPrice = (planName: string): string => {
        switch (planName.toLowerCase()) {
            case 'free': return '$0';
            case 'basic': return '$99';
            case 'plus': return '$199';
            case 'pro': return '$399';
            default: return '$0';
        }
    };

    const getPlanLabel = (planName: string): string => {
        switch (planName.toLowerCase()) {
            case 'free': return t('create_property.plan_free');
            case 'basic': return t('create_property.plan_basic');
            case 'plus': return t('create_property.plan_plus');
            case 'pro': return t('create_property.plan_pro');
            default: return planName;
        }
    };

    const priceDetails = useMemo(() => {
        const basePriceStr = getPlanPrice(plan);
        const basePrice = parsePrice(basePriceStr);

        const gst = basePrice * GST_RATE;
        const qst = basePrice * QST_RATE;
        const total = basePrice + gst + qst;

        return {
            base: basePrice,
            gst,
            qst,
            total
        };
    }, [plan]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const pollTransactionStatus = async (id: number) => {
        try {
            const response = await api.get(`/payments/transaction/${id}/status`);
            const status = response.data.status;

            if (status === 'SUCCESS') {
                setIsConfirmingServer(false);
                setIsSuccess(true);
                updatePlanType(plan);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else if (status === 'FAILED') {
                setIsConfirmingServer(false);
                setError('Server failed to confirm payment. Please contact support.');
            } else {
                // Keep polling if still PENDING
                pollingTimeoutRef.current = setTimeout(() => pollTransactionStatus(id), 2000);
            }
        } catch (err) {
            console.error('Polling error:', err);
            // Retry polling after error
            pollingTimeoutRef.current = setTimeout(() => pollTransactionStatus(id), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret || !transactionId) {
            return;
        }

        setError(null);
        setIsProcessing(true);

        try {
            if (!user) {
                throw new Error('Please log in to complete the purchase');
            }

            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) throw new Error('Card element not found');

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        name: formData.name,
                        email: user.email,
                    },
                },
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            if (result.paymentIntent?.status === 'succeeded') {
                setIsProcessing(false);
                setIsConfirmingServer(true);
                // Start polling the backend for webhook result
                pollTransactionStatus(transactionId);
            }

        } catch (err: any) {
            setIsProcessing(false);
            setError(err.message || 'Payment failed. Please try again.');
        }
    };

    // Premium styling for Stripe elements
    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#0f172a', // slate-900
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                    color: '#94a3b8', // slate-400
                },
            },
            invalid: {
                color: '#ef4444', // red-500
                iconColor: '#ef4444',
            },
        },
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center transform transition-all">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                        {t('payment.success.title')}
                    </h2>
                    <p className="text-slate-500 mb-8 text-lg">
                        {t('payment.success.message')}
                    </p>
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
                        <h2 className="text-2xl font-black mb-2">
                            {t('payment.summary.orderSummary')}
                        </h2>
                        <p className="text-slate-400 mb-8">
                            {t('payment.subtitle')}
                        </p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <div>
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">
                                        {t('payment.summary.plan')}
                                    </p>
                                    <p className="text-xl font-bold capitalize">
                                        {getPlanLabel(plan)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">
                                        {t('payment.summary.price')}
                                    </p>
                                    <p className="text-xl font-bold">{formatCurrency(priceDetails.base)}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-300 mb-4 pb-4 border-b border-white/10">
                                <div className="flex justify-between items-center">
                                    <span>{t('payment.summary.gst')}</span>
                                    <span>{formatCurrency(priceDetails.gst)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t('payment.summary.qst')}</span>
                                    <span>{formatCurrency(priceDetails.qst)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">
                                    {t('payment.summary.total')}
                                </span>
                                <span className="text-3xl font-black text-white">
                                    {formatCurrency(priceDetails.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <ShieldCheck size={20} className="text-emerald-400" />
                            <span>{t('payment.summary.secure')}</span>
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
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-black text-slate-900">
                                {t('payment.title')}
                            </h2>
                            <div className="flex gap-2">
                                <div className="h-6 w-10 flex items-center justify-center">
                                    <svg viewBox="0 0 50 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.841 1.054L20.48 10.82h3.297l1.36-9.766h-3.296zM33.623 1.054l-3.328 6.745-.352-1.688c-.602-2.11-2.484-4.22-4.633-5.057l.984 9.766h3.469l5.18-9.766h-1.32zm-18.43 0h-2.546c-.61 0-1.125.352-1.36 1.055L6.46 10.82h3.469l.688-1.933h4.226l.407 1.933h3.047l-2.672-9.766h-2.21zm-1.875 5.45l1.055-3.024.601 3.024h-1.656zM48.172 1.054h-3.18c-.547 0-.96.282-1.203.774l-4.57 6.54-1.36-7.314h-3.36l2.07 9.766h3.282l4.89-6.96v6.96h3.188v-9.766h-.243z" fill="#1434CB" />
                                    </svg>
                                </div>
                                <div className="h-6 w-10 flex items-center justify-center">
                                    <svg viewBox="0 0 36 22" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.5 11c0-3.375-1.5-6.375-3.875-8.375-2.375 2-3.875 5-3.875 8.375s1.5 6.375 3.875 8.375C21 17.375 22.5 14.375 22.5 11z" fill="#FF5F00" />
                                        <path d="M14.75 11c0 3.375 1.5 6.375 3.875 8.375 3.25-1.125 5.625-4.25 5.625-8.375s-2.375-7.25-5.625-8.375C16.25 4.625 14.75 7.625 14.75 11z" fill="#EB001B" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500">{t('payment.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                <CreditCard size={14} className="text-slate-400" />
                                {t('payment.nameOnCard')}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder={t('payment.placeholder.nameOnCard')}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                <CreditCard size={14} className="text-slate-400" />
                                {t('payment.cardNumber')}
                            </label>
                            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
                                <CardNumberElement options={elementOptions} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    {t('payment.expiryDate')}
                                </label>
                                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
                                    <CardExpiryElement options={elementOptions} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <Lock size={14} className="text-slate-400" />
                                    {t('payment.cvc')}
                                </label>
                                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
                                    <CardCvcElement options={elementOptions} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isProcessing || isConfirmingServer || !stripe || !clientSecret}
                                className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing || isConfirmingServer ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        {t('payment.button.processing')}
                                    </>
                                ) : (
                                    t('payment.button.pay', { amount: formatCurrency(priceDetails.total) })
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/membership" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                {t('payment.button.cancel')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;