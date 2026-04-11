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
        navigate(`/payment?plan=${plan.toUpperCase()}`);
    };

    const plans = [
        {
            key: 'free',
            type: 'FREE',
            icon: Star,
            iconColor: (active: boolean) => active ? 'text-blue-500' : 'text-gray-400',
            borderColor: (active: boolean) => active ? 'border-2 border-blue-500 ring-2 ring-blue-100' : 'border border-gray-200',
            title: t('nav.plan_free'),
            desc: t('membership.free_desc'),
            price: t('nav.plan_free'),
            features: [
                t('membership.free_listings'),
                t('membership.free_images'),
                t('membership.free_duration'),
                t('membership.free_summary'),
                t('membership.free_calculator'),
                t('membership.free_seo'),
                t('membership.free_disclosure')
            ],
            buttonColor: (active: boolean) => active ? 'bg-blue-600 text-white cursor-default' : 'bg-slate-600 text-white hover:bg-slate-700'
        },
        {
            key: 'basic',
            type: 'BASIC',
            icon: Hexagon,
            iconColor: (active: boolean) => active ? 'text-green-600' : 'text-green-500',
            borderColor: (active: boolean) => active ? 'border-2 border-green-500 ring-2 ring-green-100' : 'border border-gray-200',
            title: t('nav.plan_basic'),
            desc: t('membership.basic_desc'),
            price: t('membership.basic_price'),
            period: t('membership.basic_period'),
            features: [
                t('membership.basic_listings'),
                t('membership.basic_images'),
                t('membership.basic_duration'),
                t('membership.basic_featured'),
                t('membership.basic_summary'),
                t('membership.basic_offer'),
                t('membership.basic_compliance'),
                t('membership.basic_gain'),
                t('membership.basic_pdf')
            ],
            buttonColor: (active: boolean) => active ? 'bg-green-600 text-white cursor-default' : 'bg-[#00a651] text-white hover:bg-green-700'
        },
        {
            key: 'plus',
            type: 'PLUS',
            icon: Zap,
            iconColor: (active: boolean) => active ? 'text-blue-600' : 'text-blue-500',
            borderColor: (active: boolean) => active ? 'border-2 border-blue-500 ring-2 ring-blue-100' : 'border border-gray-200',
            title: t('nav.plan_plus'),
            desc: t('membership.plus_desc'),
            price: t('membership.plus_price'),
            period: t('membership.plus_period'),
            features: [
                t('membership.plus_listings'),
                t('membership.plus_images'),
                t('membership.plus_duration'),
                t('membership.plus_featured'),
                t('membership.plus_summary'),
                t('membership.plus_offer'),
                t('membership.plus_compliance'),
                t('membership.plus_gain'),
                t('membership.plus_pdf')
            ],
            buttonColor: (active: boolean) => active ? 'bg-blue-700 text-white cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
        },
        {
            key: 'pro',
            type: 'PRO',
            icon: Shield,
            iconColor: (active: boolean) => active ? 'text-purple-600' : 'text-purple-500',
            borderColor: (active: boolean) => active ? 'border-2 border-purple-500 ring-2 ring-purple-100' : 'border border-purple-200',
            title: t('nav.plan_pro'),
            desc: t('membership.pro_desc'),
            price: t('membership.pro_price'),
            period: t('membership.pro_period'),
            features: [
                t('membership.pro_listings'),
                t('membership.pro_images'),
                t('membership.pro_duration'),
                t('membership.pro_featured'),
                t('membership.pro_summary'),
                t('membership.pro_offer'),
                t('membership.pro_compliance'),
                t('membership.pro_gain'),
                t('membership.pro_pdf'),
                t('membership.pro_support'),
                t('membership.pro_documents')
            ],
            buttonColor: (active: boolean) => active ? 'bg-purple-700 text-white cursor-default' : 'bg-purple-600 text-white hover:bg-purple-700'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="text-yellow-500" size={32} />
                        <h1 className="text-3xl font-bold text-gray-900 bg-gray-200 px-2">{t('membership.title')}</h1>
                    </div>
                    <p className="text-gray-500">{t('membership.subtitle')}</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {plans.map((plan) => {
                        const IconComponent = plan.icon;
                        const isActive = user?.planType === plan.type;
                        return (
                            <div key={plan.key} className={`bg-white rounded-xl p-6 flex flex-col ${plan.borderColor(isActive)}`}>
                                <div className="flex items-center gap-2 mb-2 relative">
                                    {isActive && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                            <Check size={12} /> {t('nav.current_plan')}
                                        </div>
                                    )}
                                    <IconComponent className={plan.iconColor(isActive)} size={20} />
                                    <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-6 h-8">{plan.desc}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-sm text-gray-500"> {plan.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check size={16} className={isActive ? 'text-blue-500 mt-0.5 shrink-0' : 'text-gray-400 mt-0.5 shrink-0'} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSelectPlan(plan.key)}
                                    className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${plan.buttonColor(isActive)}`}
                                    disabled={isActive}
                                >
                                    {isActive ? t('nav.current_plan') : t('fsbo.register_btn')}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Plan Comparison */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-center text-gray-900 mb-8">{t('membership.comparison_title')}</h2>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[500px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-900">{t('membership.comparison_feature')}</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 text-center">{t('nav.plan_basic')}</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 text-center bg-blue-50/50">{t('nav.plan_plus')}</th>
                                        <th className="px-6 py-4 font-semibold text-gray-900 text-center">{t('nav.plan_pro')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_listings')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">3 rental + 2 sale</td>
                                        <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">6 rental + 4 sale</td>
                                        <td className="px-6 py-4 text-center text-gray-900">12 rental + 8 sale</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_images')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">5</td>
                                        <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">10</td>
                                        <td className="px-6 py-4 text-center text-gray-900">{t('common.unlimited', 'Unlimited')}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_duration')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">30 {t('common.days', 'days')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900 bg-blue-50/50">30 {t('common.days', 'days')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">30 {t('common.days', 'days')}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_homepage')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900"><Check size={16} className="text-green-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_investment')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900"><Check size={16} className="text-green-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_offer')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900"><Check size={16} className="text-green-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_compliance')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900"><Check size={16} className="text-green-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_gain')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900"><Check size={16} className="text-green-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50"><Check size={16} className="text-blue-500 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_pdf')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">-</td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50">-</td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_priority')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">-</td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50">-</td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-600">{t('membership.feature_documents')}</td>
                                        <td className="px-6 py-4 text-center text-gray-900">-</td>
                                        <td className="px-6 py-4 text-center bg-blue-50/50">-</td>
                                        <td className="px-6 py-4 text-center"><Check size={16} className="text-purple-500 mx-auto" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
