import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(() => {
        // Initialize state from localStorage (lazy initialization)
        const savedData = localStorage.getItem('registerFormData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error('Failed to parse saved form data', e);
            }
        }
        return {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            planType: 'FREE',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        };
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const isFirstRender = useRef(true);

    // Save form data to localStorage whenever it changes (skip first render)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        localStorage.setItem('registerFormData', JSON.stringify(formData));
    }, [formData]);

    // Clear saved data on successful registration
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            alert(t('register.password_mismatch'));
            return;
        }
        if (!formData.agreeTerms) {
            alert(t('register.agree_terms_alert'));
            return;
        }
        try {
            await api.post('/auth/register', formData);
            setShowSuccess(true);
            // Clear saved form data on successful registration
            localStorage.removeItem('registerFormData');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirect after 2 seconds
        } catch (error: any) {
            console.error('Registration failed', error);
            if (error.response?.data?.message === 'Email is already registered') {
                setError(t('register.email_already_registered'));
            } else {
                setError(t('register.registration_failed'));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">、
                {showSuccess && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                        <p className="text-gray-500">Redirecting you to membership plans...</p>
                    </div>
                )}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{t('register.title')}</h2>
                    <p className="mt-2 text-sm text-gray-500">{t('register.subtitle')}</p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.first_name')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder={t('register.first_name_placeholder')}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.last_name')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder={t('register.last_name_placeholder')}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.email')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.email_placeholder')}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('register.phone_placeholder')}
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.plan_type')}</label>
                        <select
                            value={formData.planType}
                            onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="FREE">{t('register.free_plan')}</option>
                            <option value="BASIC">{t('register.basic_plan')}</option>
                            <option value="PLUS">{t('register.plus_plan')}</option>
                            <option value="PRO">{t('register.pro_plan')}</option>
                        </select>
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.password')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder=""
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{t('register.password_hint')}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.confirm_password')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder=""
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="agree-terms"
                            name="agree-terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.agreeTerms}
                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        />
                        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                            {t('register.agree_terms_prefix')} <Link to={t('register.terms_url')} className="text-blue-600 hover:underline">{t('register.terms')}</Link> {t('register.agree_terms_and')} <Link to={t('register.privacy_url')} className="text-blue-600 hover:underline">{t('register.privacy')}</Link>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {t('register.register_btn')}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        {t('register.already_have_account')} <Link to="/login" className="font-medium text-blue-600 hover:underline">{t('register.sign_in')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
