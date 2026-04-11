import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError(t('reset_password.missing_token', 'Invalid reset link. Please request a new password reset.'));
        }
    }, [token, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password.trim() || !confirmPassword.trim()) {
            setError(t('reset_password.password_required', 'Please enter and confirm your new password'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('reset_password.password_mismatch', 'Passwords do not match'));
            return;
        }

        if (password.length < 6) {
            setError(t('reset_password.password_too_short', 'Password must be at least 6 characters long'));
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token: token,
                newPassword: password
            });
            setSuccess(true);
        } catch (error: any) {
            console.error('Password reset failed:', error);
            const errorData = error.response?.data;
            let errorMessage;
            if (errorData?.errorCode) {
                errorMessage = t(`errors.${errorData.errorCode}`, errorData.message);
            } else {
                errorMessage = errorData?.message || t('reset_password.error_resetting', 'Failed to reset password. Please try again.');
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('reset_password.success_title', 'Password Reset Successful')}</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {t('reset_password.success_message', 'Your password has been successfully reset. You can now log in with your new password.')}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        {t('reset_password.back_to_login', 'Go to Login')}
                    </button>
                </div>
            </div>
        );
    }

    if (tokenValid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('reset_password.invalid_token_title', 'Invalid Reset Link')}</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {t('reset_password.invalid_token_message', 'This password reset link is invalid or has expired. Please request a new one.')}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            {t('reset_password.request_new_link', 'Request New Link')}
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                        >
                            {t('reset_password.back_to_login', 'Back to Login')}
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
                        <Lock size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('reset_password.title', 'Reset Password')}</h2>
                    <p className="text-slate-500 text-sm">
                        {t('reset_password.subtitle', 'Enter your new password below')}
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('reset_password.new_password', 'New Password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} className="text-slate-400" />
                                ) : (
                                    <Eye size={20} className="text-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('reset_password.confirm_password', 'Confirm New Password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} className="text-slate-400" />
                                ) : (
                                    <Eye size={20} className="text-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{t('common.loading', 'Resetting...')}</span>
                            </>
                        ) : (
                            t('reset_password.reset_password_button', 'Reset Password')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
