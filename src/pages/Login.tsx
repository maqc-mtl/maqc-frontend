import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation: Check if both email and password are provided
        if (!email.trim() || !password) {
            setError(t('login.fill_all_fields', 'Please enter both email and password'));
            return;
        }

        try {
            const response = await api.post('/auth/authenticate', { email, password });
            login(
                response.data.id,
                response.data.email,
                response.data.phoneNumber,
                response.data.role,
                response.data.firstName,
                response.data.lastName,
                response.data.planType
            );
            if (response.data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            console.error('Login failed', error);
            const errorData = error.response?.data;
            let errorMessage;
            if (errorData?.errorCode) {
                errorMessage = t(`errors.${errorData.errorCode}`, errorData.message);
            } else {
                errorMessage = errorData?.message || t('login.invalid_credentials', 'Invalid email or password');
            }
            setError(errorMessage);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 md:mb-8 text-slate-800">{t('login.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">{t('login.email_label')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">{t('login.password_label')}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition transform hover:scale-[1.02]"
                    >
                        {t('login.sign_in')}
                    </button>
                </form>
                <div className="mt-6 text-center space-y-3">
                    <p className="text-sm text-slate-600">
                        {t('login.no_account')} <Link to="/register" className="text-blue-600 font-bold">{t('login.sign_up')}</Link>
                    </p>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        {t('login.forgot_password', 'Forgot Password?')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
