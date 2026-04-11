import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarClock, ShieldCheck, ChevronLeft, User, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import api from '../services/api';

interface ToolsModalsProps {
    activeModal: 'mortgage' | 'notary' | 'inspector' | 'buyerAgent' | 'sellerAgent' | 'purchaseOffer' | 'disclosure' | null;
    onClose: () => void;
    defaultPrice?: number;
}

export const ToolsModals: React.FC<ToolsModalsProps> = ({ activeModal, onClose, defaultPrice = 0 }) => {
    const { t } = useTranslation();

    // Mortgage calculator state
    const [mortgagePrice, setMortgagePrice] = useState(defaultPrice);
    const [downPaymentMode, setDownPaymentMode] = useState<'percent' | 'dollar'>('percent');
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [downPaymentDollar, setDownPaymentDollar] = useState(defaultPrice * 0.2);
    const [interestRate, setInterestRate] = useState('5.5');
    const [amortization, setAmortization] = useState('25');
    const [paymentFrequency, setPaymentFrequency] = useState('monthly');
    const [paymentResult, setPaymentResult] = useState<number | null>(null);

    // Form states
    const [formDate, setFormDate] = useState('');
    const [formTime, setFormTime] = useState('');
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formNotes, setFormNotes] = useState('');

    const [success, setSuccess] = useState(false);
    const [selectedPro, setSelectedPro] = useState<any | null>(null);

    const resetForm = () => {
        setFormDate(''); setFormTime(''); setFormName(''); setFormPhone(''); setFormEmail(''); setFormNotes('');
        setSuccess(false); setSelectedPro(null);
    };

    const handleClose = () => {
        resetForm();
        setPaymentResult(null);
        onClose();
    };

    const [notaries, setNotaries] = useState<any[]>([]);
    const [inspectors, setInspectors] = useState<any[]>([]);
    const [agents, setAgents] = useState<any[]>([]);

    React.useEffect(() => {
        if (activeModal === 'notary' && notaries.length === 0) {
            api.get('/admin/notaries').then(res => setNotaries(res.data)).catch(console.error);
        } else if (activeModal === 'inspector' && inspectors.length === 0) {
            api.get('/admin/inspectors').then(res => setInspectors(res.data)).catch(console.error);
        } else if ((activeModal === 'buyerAgent' || activeModal === 'sellerAgent') && agents.length === 0) {
            api.get('/admin/agents').then(res => setAgents(res.data)).catch(console.error);
        }
    }, [activeModal]);

    let prosList: any[] = [];
    let titleKey = '';
    let selectTitleKey = '';
    let successKey = '';
    let Icon = CalendarClock;
    let baseTheme = 'purple';

    if (activeModal === 'notary') {
        prosList = notaries;
        titleKey = 'detail.notary_title';
        selectTitleKey = 'detail.notary_select_title';
        successKey = 'detail.notary_success';
        Icon = CalendarClock;
        baseTheme = 'purple';
    } else if (activeModal === 'inspector') {
        prosList = inspectors;
        titleKey = 'detail.inspector_title';
        selectTitleKey = 'detail.inspector_select_title';
        successKey = 'detail.inspector_success';
        Icon = ShieldCheck;
        baseTheme = 'blue';
    } else if (activeModal === 'buyerAgent' || activeModal === 'sellerAgent') {
        prosList = agents;
        titleKey = activeModal === 'buyerAgent' ? 'nav.book_buyer_agent' : 'nav.book_seller_agent';
        selectTitleKey = titleKey;
        successKey = 'detail.notary_success'; // Fallback
        Icon = User;
        baseTheme = 'emerald';
    }

    const tcss = {
        purple: { text: 'text-purple-600', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', border: 'border-purple-100', hoverBorder: 'hover:border-purple-200', shadow: 'hover:shadow-purple-50', borderDark: 'border-purple-200', bgLight: 'bg-purple-100' },
        blue: { text: 'text-blue-600', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', border: 'border-blue-100', hoverBorder: 'hover:border-blue-200', shadow: 'hover:shadow-blue-50', borderDark: 'border-blue-200', bgLight: 'bg-blue-100' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-200', shadow: 'hover:shadow-emerald-50', borderDark: 'border-emerald-200', bgLight: 'bg-emerald-100' },
    }[baseTheme] || { text: 'text-purple-600', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', border: 'border-purple-100', hoverBorder: 'hover:border-purple-200', shadow: 'hover:shadow-purple-50', borderDark: 'border-purple-200', bgLight: 'bg-purple-100' };

    const renderProModal = () => {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto mx-4"
            >
                <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {selectedPro && !success && (
                            <button
                                onClick={() => setSelectedPro(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                            >
                                <ChevronLeft size={16} className="text-slate-500" />
                            </button>
                        )}
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {success ? t(titleKey) : selectedPro ? t(titleKey) : t(selectTitleKey)}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                    >
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-6">
                            <div className={`w-16 h-16 rounded-full ${tcss.bg} border-2 ${tcss.borderDark} flex items-center justify-center mx-auto mb-4`}>
                                <Icon size={28} className={tcss.text} />
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">{t(successKey)}</p>
                            <button
                                onClick={handleClose}
                                className="mt-6 px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all"
                            >
                                OK
                            </button>
                        </div>
                    ) : !selectedPro ? (
                        /* Step 1: Selection List */
                        <div className="space-y-3">
                            <p className="text-xs text-slate-400 mb-4">{t('detail.notary_select_desc')}</p>
                            {prosList.map((pro) => (
                                <button
                                    key={pro.id}
                                    onClick={() => setSelectedPro(pro)}
                                    className={`w-full text-left p-4 border-2 border-slate-100 rounded-2xl ${tcss.hoverBorder} hover:shadow-md ${tcss.shadow} transition-all group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${tcss.bg} border ${tcss.border} flex items-center justify-center shrink-0 ${tcss.hoverBg} transition-colors`}>
                                            {activeModal === 'notary' ? (
                                                <span className={`${tcss.text} font-black text-sm`}>{pro.name.split(' ').pop()?.charAt(0)}</span>
                                            ) : (
                                                <Icon size={20} className={tcss.text} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black text-sm text-slate-900 truncate">{pro.name}</h4>
                                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                                    <span className="text-amber-400 text-xs">★</span>
                                                    <span className="text-xs font-bold text-slate-600">{pro.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{pro.firm}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin size={10} className="text-slate-400" />
                                                <p className="text-[10px] text-slate-400 truncate">{pro.address}</p>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Phone size={10} className="text-slate-400" />
                                                <p className="text-[10px] text-slate-400">{pro.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Mail size={10} className="text-slate-400" />
                                                <p className="text-[10px] text-slate-400 truncate">{pro.email}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                {pro.languages.map((lang: string) => (
                                                    <span key={lang} className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase">{lang}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Step 2: Schedule Form */
                        <div>
                            {/* Selected Pro Info */}
                            <div className={`p-4 ${tcss.bg} border ${tcss.border} rounded-2xl mb-5`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${tcss.bgLight} border ${tcss.borderDark} flex items-center justify-center`}>
                                        {activeModal === 'notary' ? (
                                            <span className={`${tcss.text} font-black text-sm`}>{selectedPro.name.split(' ').pop()?.charAt(0)}</span>
                                        ) : (
                                            <Icon size={18} className={tcss.text} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-slate-900">{selectedPro.name}</h4>
                                        <p className="text-xs text-slate-500">{selectedPro.firm}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="space-y-4">
                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_date')}</label>
                                        <input
                                            type="date"
                                            required
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_time')}</label>
                                        <input
                                            type="time"
                                            required
                                            value={formTime}
                                            onChange={(e) => setFormTime(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_your_name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                    />
                                </div>

                                {/* Phone & Email */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_phone')}</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formPhone}
                                            onChange={(e) => setFormPhone(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_email')}</label>
                                        <input
                                            type="email"
                                            required
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_notes')}</label>
                                    <textarea
                                        rows={3}
                                        value={formNotes}
                                        onChange={(e) => setFormNotes(e.target.value)}
                                        placeholder={t('detail.notary_notes_placeholder')}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1a1a6d] transition-colors resize-none"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPro(null)}
                                        className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        {t('detail.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-[#1a1a6d] text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                    >
                                        <Icon size={14} />
                                        {t('detail.notary_submit')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderMortgageModal = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('detail.mortgage_title')}</h2>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                    >
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                {/* Price of property */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_price')}</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={mortgagePrice}
                            onChange={(e) => setMortgagePrice(Number(e.target.value))}
                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    </div>
                </div>

                {/* Down payment */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_down_payment')}</label>
                    <div className="flex gap-2">
                        <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden">
                            <button
                                onClick={() => setDownPaymentMode('dollar')}
                                className={`px-3 py-2 text-xs font-black transition-colors ${downPaymentMode === 'dollar' ? 'bg-[#1a1a6d] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                            >$</button>
                            <button
                                onClick={() => setDownPaymentMode('percent')}
                                className={`px-3 py-2 text-xs font-black transition-colors ${downPaymentMode === 'percent' ? 'bg-[#1a1a6d] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                            >%</button>
                        </div>
                        {downPaymentMode === 'dollar' ? (
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    value={downPaymentDollar}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setDownPaymentDollar(val);
                                        if (mortgagePrice > 0) setDownPaymentPercent(Math.round((val / mortgagePrice) * 100 * 100) / 100);
                                    }}
                                    className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                            </div>
                        ) : (
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    value={downPaymentPercent}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setDownPaymentPercent(val);
                                        setDownPaymentDollar(Math.round(mortgagePrice * val / 100));
                                    }}
                                    className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mortgage amount */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_amount')}</label>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={new Intl.NumberFormat('en-CA').format(Math.max(0, mortgagePrice - (downPaymentMode === 'dollar' ? downPaymentDollar : Math.round(mortgagePrice * downPaymentPercent / 100))))}
                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    </div>
                </div>

                {/* Interest rate + Amortization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_interest_rate')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{t('detail.mortgage_required')}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_amortization')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amortization}
                                onChange={(e) => setAmortization(e.target.value)}
                                className="w-full px-4 py-3 pr-10 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{t('detail.mortgage_years')}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{t('detail.mortgage_required')}</p>
                    </div>
                </div>

                {/* Payment frequency */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_frequency')}</label>
                    <select
                        value={paymentFrequency}
                        onChange={(e) => setPaymentFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors bg-white appearance-none cursor-pointer"
                    >
                        <option value="monthly">{t('detail.mortgage_freq_monthly')}</option>
                        <option value="bimonthly">{t('detail.mortgage_freq_bimonthly')}</option>
                        <option value="biweekly">{t('detail.mortgage_freq_biweekly')}</option>
                        <option value="weekly">{t('detail.mortgage_freq_weekly')}</option>
                    </select>
                </div>

                {/* Calculate button */}
                <button
                    onClick={() => {
                        const rate = parseFloat(interestRate);
                        const years = parseInt(amortization);
                        if (!rate || !years || rate <= 0 || years <= 0) return;
                        const dp = downPaymentMode === 'dollar' ? downPaymentDollar : Math.round(mortgagePrice * downPaymentPercent / 100);
                        const principal = Math.max(0, mortgagePrice - dp);
                        const freqMap: Record<string, number> = { monthly: 12, bimonthly: 24, biweekly: 26, weekly: 52 };
                        const periodsPerYear = freqMap[paymentFrequency] || 12;
                        const r = rate / 100 / periodsPerYear;
                        const n = years * periodsPerYear;
                        if (r === 0) {
                            setPaymentResult(Math.round(principal / n * 100) / 100);
                        } else {
                            const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                            setPaymentResult(Math.round(payment * 100) / 100);
                        }
                    }}
                    className="w-full py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 mb-4"
                >
                    {t('detail.mortgage_calculate')}
                </button>

                {/* Payment result */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_payment_amount')}</label>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={paymentResult !== null ? new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paymentResult) : ''}
                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    </div>
                </div>

                {/* Chart button */}
                <button className="w-full py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all">
                    {t('detail.mortgage_chart')}
                </button>
            </div>
        </motion.div>
    );

    const renderDocumentModal = () => {
        const isPurchase = activeModal === 'purchaseOffer';
        const docTitle = isPurchase ? t('nav.download_purchase_agreement') : t('nav.download_disclosure');
        const docDesc = isPurchase
            ? t('detail.download_purchase_desc', 'Download a standard, generic purchase agreement template to help you prepare your offer. Note: This template is not tied to a specific property.')
            : t('detail.download_disclosure_desc', 'Download a standard seller disclosure template to document the state of your property. This document is required for all listings.');

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[201] p-8 text-center"
            >
                <div className="absolute top-4 right-4">
                    <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} className="text-blue-600" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                    {docTitle}
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    {docDesc}
                </p>

                <button
                    onClick={() => {
                        // In a real app, this would trigger a file download
                        alert('Downloading template... (Placeholder)');
                        handleClose();
                    }}
                    className="w-full py-4 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                    {t('detail.download')}
                </button>
            </motion.div>
        );
    };

    if (!activeModal) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                onClick={handleClose}
            />
            {activeModal === 'mortgage' ? renderMortgageModal() :
                (activeModal === 'purchaseOffer' || activeModal === 'disclosure') ? renderDocumentModal() :
                    renderProModal()}
        </AnimatePresence>
    );
};
