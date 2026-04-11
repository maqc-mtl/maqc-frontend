import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError(t('forgot_password.email_required', 'Please enter your email address'));
            return;
        }

        setLoading(true);
        try {
            // Call backend endpoint to request password reset
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (error: any) {
            console.error('Password reset request failed:', error);
            const errorData = error.response?.data;
            let errorMessage;
            if (errorData?.errorCode) {
                errorMessage = t(`errors.${errorData.errorCode}`, errorData.message);
            } else {
                errorMessage = errorData?.message || t('forgot_password.error_sending', 'Failed to send reset email. Please try again.');
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('forgot_password.success_title', 'Check Your Email')}</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {t('forgot_password.success_message', 'We have sent a password reset link to your email address. Please check your inbox and follow the instructions.')}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            {t('forgot_password.back_to_login', 'Back to Login')}
                        </button>
                        <button
                            onClick={() => setSuccess(false)}
                            className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                        >
                            {t('forgot_password.try_another_email', 'Try another email')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">{t('common.back', 'Back')}</span>
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('forgot_password.title', 'Forgot Password?')}</h2>
                    <p className="text-slate-500 text-sm">
                        {t('forgot_password.subtitle', 'Enter your email address and we will send you a link to reset your password.')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <div className="text-red-500 shrink-0 mt-0.5">⚠</div>
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('login.email_label')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{t('common.loading', 'Sending...')}</span>
                            </>
                        ) : (
                            t('forgot_password.send_reset_link', 'Send Reset Link')
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-600 text-sm">
                    {t('forgot_password.remember_password', 'Remember your password?')}{' '}
                    <Link to="/login" className="text-blue-600 font-bold">{t('login.sign_in')}</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
