import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Star, Hexagon, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Membership: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    const handleSelectPlan = (plan: string) => {
        navigate(`/payment?plan=${plan}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="text-yellow-500" size={32} />
                        <h1 className="text-3xl font-bold text-gray-900 bg-gray-200 px-2">{t('nav.subscriptions')}</h1>
                    </div>
                    <p className="text-gray-500">{t('fsbo.step1_desc')}</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {/* Free Plan */}
                    <div className={`bg-white rounded-xl p-6 flex flex-col ${user?.planType === 'FREE' ? 'border-2 border-blue-500 ring-2 ring-blue-100' : 'border border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2 relative">
                            {user?.planType === 'FREE' && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                    <Check size={12} /> {t('nav.current_plan')}
                                </div>
                            )}
                            <Star className={user?.planType === 'FREE' ? 'text-blue-500' : 'text-gray-400'} size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">{t('nav.plan_free')}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 h-8">Browse listings, post buy/rent requests</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">{t('nav.plan_free')}</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>Browse all listings</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>Post buy/rent requests</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>Use basic tools</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('free')}
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${user?.planType === 'FREE' ? 'bg-blue-600 text-white cursor-default' : 'bg-slate-600 text-white hover:bg-slate-700'}`}
                            disabled={user?.planType === 'FREE'}
                        >
                            {user?.planType === 'FREE' ? t('nav.current_plan') : t('fsbo.register_btn')}
                        </button>
                    </div>

                    {/* Basic Plan */}
                    <div className={`bg-white rounded-xl p-6 flex flex-col ${user?.planType === 'BASIC' ? 'border-2 border-green-500 ring-2 ring-green-100' : 'border border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2 relative">
                            {user?.planType === 'BASIC' && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                    <Check size={12} /> {t('nav.current_plan')}
                                </div>
                            )}
                            <Hexagon className={user?.planType === 'BASIC' ? 'text-green-600' : 'text-green-500'} size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">{t('nav.plan_basic')}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 h-8">Perfect for first-time sellers</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">$99</span>
                            <span className="text-sm text-gray-500">/listing</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Post 1 listing</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Up to 5 images</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>30 days listing duration</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Download standard templates</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Basic customer support</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('basic')}
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${user?.planType === 'BASIC' ? 'bg-green-600 text-white cursor-default' : 'bg-[#00a651] text-white hover:bg-green-700'}`}
                            disabled={user?.planType === 'BASIC'}
                        >
                            {user?.planType === 'BASIC' ? t('nav.current_plan') : t('fsbo.register_btn')}
                        </button>
                    </div>

                    {/* Plus Plan */}
                    <div className={`bg-white rounded-xl border p-6 flex flex-col ${user?.planType === 'PLUS' ? 'border-2 border-blue-500 ring-2 ring-blue-100' : 'border border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2 relative">
                            {user?.planType === 'PLUS' && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                    <Check size={12} /> {t('nav.current_plan')}
                                </div>
                            )}
                            <Zap className={user?.planType === 'PLUS' ? 'text-blue-600' : 'text-blue-500'} size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">{t('nav.plan_plus')}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 h-8">The choice for professional sellers</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">$199</span>
                            <span className="text-sm text-gray-500">/listing</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Post 1 listing</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Up to 15 images</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>90 days listing duration</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Disclosure statement generator</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Cost calculator</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Priority customer support</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('plus')}
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${user?.planType === 'PLUS' ? 'bg-blue-700 text-white cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            disabled={user?.planType === 'PLUS'}
                        >
                            {user?.planType === 'PLUS' ? t('nav.current_plan') : t('fsbo.register_btn')}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`bg-white rounded-xl p-6 flex flex-col ${user?.planType === 'PRO' ? 'border-2 border-purple-500 ring-2 ring-purple-100' : 'border border-purple-200'}`}>
                        <div className="flex items-center gap-2 mb-2 relative">
                            {user?.planType === 'PRO' && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                    <Check size={12} /> {t('nav.current_plan')}
                                </div>
                            )}
                            <Shield className={user?.planType === 'PRO' ? 'text-purple-600' : 'text-purple-500'} size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">{t('nav.plan_pro')}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 h-8">Best value for multi property sellers</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">$399</span>
                            <span className="text-sm text-gray-500">/listing</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Post up to 3 listings</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Unlimited images</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>180 days listing duration</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Multi language support</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>PDF export feature</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Disclosure statement generator</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Cost calculator</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                <span>Dedicated account manager</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('pro')}
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${user?.planType === 'PRO' ? 'bg-purple-700 text-white cursor-default' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            disabled={user?.planType === 'PRO'}
                        >
                            {user?.planType === 'PRO' ? t('nav.current_plan') : t('fsbo.register_btn')}
                        </button>
                    </div>
                </div>

                {/* Plan Comparison */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-center text-gray-900 mb-8">Plan Comparison</h2>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-900">Feature</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 text-center">Basic</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 text-center bg-blue-50/50">Plus</th>
                                    <th className="px-6 py-4 font-semibold text-gray-900 text-center">Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Listings</td>
                                    <td className="px-6 py-4 text-center text-gray-900">1</td>
                                    <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">1</td>
                                    <td className="px-6 py-4 text-center text-gray-900">3</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Images</td>
                                    <td className="px-6 py-4 text-center text-gray-900">5</td>
                                    <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">15</td>
                                    <td className="px-6 py-4 text-center text-gray-900">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Duration</td>
                                    <td className="px-6 py-4 text-center text-gray-900">30 days</td>
                                    <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">90 days</td>
                                    <td className="px-6 py-4 text-center text-gray-900">180 days</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Disclosure Tool</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                    <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Calculator</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                    <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">Multi-language</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center text-gray-400 bg-blue-50/50">-</td>
                                    <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-gray-600">PDF Export</td>
                                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                                    <td className="px-6 py-4 text-center text-gray-400 bg-blue-50/50">-</td>
                                    <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
