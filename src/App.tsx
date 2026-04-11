import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Phone, MapPin, LogIn, UserPlus, PlusCircle, FileText, Crown, LogOut, Info, AlertTriangle, Heart, Wrench, User, Calculator, Menu, X as XIcon } from 'lucide-react';
import logo from '../logo.jpg';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import Membership from './pages/Membership';
import { ToolsModals } from './components/ToolsModals';
import Payment from './pages/Payment';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Favorites from './pages/Favorites';
import PurchaseOffer from './pages/PurchaseOffer';
import AdminDashboard from './pages/AdminDashboard';
import SellerDisclosure from './pages/SellerDisclosure';
import MyAds from './pages/MyAds';
import ResetPassword from './pages/ResetPassword';
import ScrollToTop from './components/ScrollToTop';

// import Payment from './pages/Payment';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeToolModal, setActiveToolModal] = useState<'mortgage' | 'notary' | 'inspector' | 'buyerAgent' | 'sellerAgent' | 'purchaseOffer' | 'disclosure' | null>(null);
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isAdminPage = location.pathname === '/admin';

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const toggleLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const currentLang = i18n.language.split('-')[0];

    const languages = [
        // { code: 'en', label: 'English', short: 'EN' },
        { code: 'fr', label: 'Français', short: 'FR' },
        { code: 'zh', label: '中文', short: 'ZH' }
    ];

    const hasPaidPlan = ['BASIC', 'PLUS', 'PRO'].includes(user?.planType || '');

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-16 md:h-24 flex justify-between items-center">
                    {/* Logo */}
                    <Link to={isAdminPage ? "/admin" : "/"} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-2 md:gap-3 group">
                        <div className="w-9 h-9 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-slate-900/10">
                            <img src={logo} alt="MAQC" className="w-15 h-15 object-contain" />
                        </div>
                        <span className="tracking-[-0.05em] uppercase">MAQC</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Tools Dropdown */}
                        {!isAdminPage && isAuthenticated && hasPaidPlan && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                                    className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 group"
                                >
                                    <Wrench size={18} className={`text-slate-400 group-hover:text-blue-600 transition-colors ${isToolsOpen ? 'text-blue-600' : ''}`} />
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        {t('nav.tools')}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isToolsOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsToolsOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-3 z-20 overflow-hidden"
                                            >
                                                <div className="mb-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">{t('nav.seller_tools')}</p>
                                                    <Link to="/properties/seller-disclosure" onClick={() => setIsToolsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <FileText size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.download_disclosure')}</span>
                                                    </Link>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveToolModal('sellerAgent'); setIsToolsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <User size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.book_seller_agent')}</span>
                                                    </a>
                                                </div>
                                                <div className="pt-3 border-t border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">{t('nav.buyer_tools')}</p>
                                                    <Link to="/properties/purchase-offer" onClick={() => setIsToolsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <FileText size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.download_purchase_agreement')}</span>
                                                    </Link>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveToolModal('mortgage'); setIsToolsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <Calculator size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.mortgage_calculator')}</span>
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveToolModal('notary'); setIsToolsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <User size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.book_notary')}</span>
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveToolModal('inspector'); setIsToolsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <User size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.book_home_inspector')}</span>
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveToolModal('buyerAgent'); setIsToolsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                        <User size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{t('nav.book_buyer_agent')}</span>
                                                    </a>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Language Switcher */}
                        {!isAdminPage && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 group"
                                >
                                    <Globe size={18} className={`text-slate-400 group-hover:text-blue-600 transition-colors ${isLangOpen ? 'text-blue-600' : ''}`} />
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        {languages.find(l => l.code === currentLang)?.short || 'FR'}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-20 overflow-hidden"
                                            >
                                                <div className="p-3 mb-2">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Language</p>
                                                </div>
                                                {languages.map((lng) => (
                                                    <button
                                                        key={lng.code}
                                                        onClick={() => toggleLanguage(lng.code)}
                                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all group ${currentLang === lng.code
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                            }`}
                                                    >
                                                        <span>{lng.label}</span>
                                                        <span className={`text-[9px] uppercase tracking-widest ${currentLang === lng.code ? 'text-blue-100' : 'text-slate-300'}`}>{lng.short}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                {!isAdminPage && (
                                    <button
                                        onClick={() => {
                                            // if (user?.planType === 'FREE') {
                                            //     navigate('/membership');
                                            // } else {
                                            navigate('/create-property');
                                            // }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#1a56db] text-white rounded-lg text-sm font-medium transition-colors hover:bg-blue-700"
                                    >
                                        <PlusCircle size={18} />
                                        {t('nav.publish_ad')}
                                    </button>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-3 focus:outline-none hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-[#00a651] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {user?.email ? user.email.charAt(0).toLowerCase() : 'u'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 font-medium text-sm">{user?.email?.split('@')[0] || 'user'}</span>
                                            {!isAdminPage && user?.planType && (
                                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                    {t(`nav.plan_${user.planType.toLowerCase()}`)}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-slate-100">
                                                        <p className="text-sm font-medium text-slate-900">{user?.email?.split('@')[0] || 'user'}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                                    </div>
                                                    <div className="py-2">
                                                        {isAdminPage ? (
                                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                                <LogOut size={18} className="text-slate-400" />
                                                                {t('nav.logout')}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <Link to="/favorites" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                                    <Heart size={18} className="text-slate-400" />
                                                                    {t('nav.my_favorites', 'My Favorites')}
                                                                </Link>
                                                                <Link to="/my-ads1" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                                    {/* phrase3 <Link to="/my-ads" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"> */}
                                                                    <FileText size={18} className="text-slate-400" />
                                                                    {t('nav.my_ads')}
                                                                </Link>
                                                                <Link to="/membership1" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                                    {/* phrase3 <Link to="/membership" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"> */}
                                                                    <Crown size={18} className="text-slate-400" />
                                                                    {t('nav.subscriptions')}
                                                                </Link>
                                                                <div className="border-t border-slate-100 py-2">
                                                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                                        <LogOut size={18} className="text-slate-400" />
                                                                        {t('nav.logout')}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : !isAuthPage ? (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="flex items-center gap-2 text-slate-900 font-medium text-[15px] hover:text-[#00a651] transition-colors px-2">
                                    <LogIn size={20} className="text-slate-900" />
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register" className="flex items-center gap-2 px-5 py-2.5 bg-[#00a651] text-white rounded-lg text-[15px] font-medium transition-all hover:bg-[#008f45] shadow-sm">
                                    <UserPlus size={20} />
                                    {t('nav.register')}
                                </Link>
                            </div>
                        ) : null}
                    </div>

                    {/* Mobile Right Side */}
                    <div className="flex md:hidden items-center gap-3">
                        {isAuthenticated && !isAdminPage && (
                            <button
                                onClick={() => {
                                    if (user?.planType === 'FREE') navigate('/membership');
                                    else navigate('/create-property');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a56db] text-white rounded-lg text-xs font-bold transition-colors hover:bg-blue-700"
                            >
                                <PlusCircle size={15} />
                                <span className="hidden xs:inline">{t('nav.publish_ad')}</span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            {isMobileMenuOpen ? <XIcon size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-100 overflow-hidden bg-white"
                        >
                            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                                {isAuthenticated ? (
                                    <>
                                        {/* User info */}
                                        <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-2xl">
                                            <div className="w-10 h-10 bg-[#00a651] rounded-full flex items-center justify-center text-white font-bold">
                                                {user?.email ? user.email.charAt(0).toLowerCase() : 'u'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user?.email?.split('@')[0]}</p>
                                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{user?.email}</p>
                                            </div>
                                        </div>

                                        {!isAdminPage && (
                                            <>
                                                <Link to="/favorites" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                    <Heart size={18} className="text-slate-400" />
                                                    {t('nav.my_favorites', 'My Favorites')}
                                                </Link>
                                                <Link to="/my-ads" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                    <FileText size={18} className="text-slate-400" />
                                                    {t('nav.my_ads')}
                                                </Link>
                                                <Link to="/membership" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                    <Crown size={18} className="text-slate-400" />
                                                    {t('nav.subscriptions')}
                                                </Link>

                                                {/* Tools section */}
                                                {hasPaidPlan && (
                                                    <>
                                                        <div className="pt-3 pb-1 px-4">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nav.tools')}</p>
                                                        </div>
                                                        <Link to="/properties/seller-disclosure" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                            <FileText size={18} className="text-slate-400" />
                                                            {t('nav.download_disclosure')}
                                                        </Link>
                                                        <Link to="/properties/purchase-offer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                            <FileText size={18} className="text-slate-400" />
                                                            {t('nav.download_purchase_agreement')}
                                                        </Link>
                                                        <button onClick={() => { setActiveToolModal('mortgage'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                            <Calculator size={18} className="text-slate-400" />
                                                            {t('nav.mortgage_calculator')}
                                                        </button>
                                                        <button onClick={() => { setActiveToolModal('notary'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                            <User size={18} className="text-slate-400" />
                                                            {t('nav.book_notary')}
                                                        </button>
                                                        <button onClick={() => { setActiveToolModal('inspector'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                            <User size={18} className="text-slate-400" />
                                                            {t('nav.book_home_inspector')}
                                                        </button>
                                                        <button onClick={() => { setActiveToolModal('buyerAgent'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                                                            <User size={18} className="text-slate-400" />
                                                            {t('nav.book_buyer_agent')}
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {/* Language */}
                                        <div className="pt-3 pb-1 px-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                                        </div>
                                        <div className="flex gap-2 px-4">
                                            {languages.map(lng => (
                                                <button
                                                    key={lng.code}
                                                    onClick={() => toggleLanguage(lng.code)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${currentLang === lng.code ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {lng.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100">
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold">
                                                <LogOut size={18} />
                                                {t('nav.logout')}
                                            </button>
                                        </div>
                                    </>
                                ) : !isAuthPage ? (
                                    <>
                                        <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                            <LogIn size={18} className="text-slate-400" />
                                            {t('nav.login')}
                                        </Link>
                                        <Link to="/register" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#00a651] text-white hover:bg-[#008f45] transition-colors">
                                            <UserPlus size={18} />
                                            {t('nav.register')}
                                        </Link>
                                        <div className="pt-3 pb-1 px-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                                        </div>
                                        <div className="flex gap-2 px-4">
                                            {languages.map(lng => (
                                                <button
                                                    key={lng.code}
                                                    onClick={() => toggleLanguage(lng.code)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${currentLang === lng.code ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {lng.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
            {/* Tools Modals */}
            <ToolsModals activeModal={activeToolModal} onClose={() => setActiveToolModal(null)} defaultPrice={500000} />
        </>
    );
};

function App() {
    const { t } = useTranslation();
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
                <Header />
                <main className="flex-grow pt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/properties/:id" element={<PropertyDetail />} />
                        <Route path="/properties/:id/purchase-offer" element={<PurchaseOffer />} />
                        <Route path="/properties/purchase-offer" element={<PurchaseOffer />} />
                        <Route path="/properties/:id/seller-disclosure" element={<SellerDisclosure />} />
                        <Route path="/properties/seller-disclosure" element={<SellerDisclosure />} />
                        <Route path="/membership" element={<Membership />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/create-property" element={<CreateProperty />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/my-ads" element={<MyAds />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                    </Routes>
                </main>

                {/* White Info Section */}
                <div className="bg-white py-8 md:py-12 px-4 md:px-8 text-center border-t border-slate-200">
                    <h3 className="text-lg md:text-[18px] font-bold text-slate-800 mb-3 md:mb-4">{t('footer.info_title')}</h3>
                    <p className="text-xs md:text-[18px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        {t('footer.info_desc')}
                    </p>
                </div>

                {/* Yellow Warning Banner */}
                <div className="bg-[#ff9900] py-2 md:py-3 text-center text-slate-900 font-medium text-xs md:text-[18px] flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 px-4">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="md:hidden" /> <Info size={20} className="hidden md:block" />
                        {t('footer.warning_not_broker')}
                    </div>
                    <div className="hidden md:block text-slate-900/40">•</div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="md:hidden" /> <AlertTriangle size={20} className="hidden md:block" />
                        {t('footer.warning_no_advice')}
                    </div>
                    <div className="hidden md:block text-slate-900/40">•</div>
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="md:hidden" /> <FileText size={20} className="hidden md:block" />
                        {t('footer.warning_no_trade')}
                    </div>
                </div>

                <footer className="bg-[#0b1221] text-white pt-12 md:pt-16 pb-8 px-4 md:px-10 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <Link to="/" className="text-lg md:text-[18px] font-black tracking-tighter flex items-center gap-1">
                                <span className="text-[#00b4d8]">MAQC</span><span className="text-slate-400 text-lg md:text-[18px]">.ca</span>
                            </Link>
                            <p className="text-slate-400 text-sm md:text-[18px] leading-relaxed">
                                {t('footer.about_desc')}
                            </p>
                        </div>

                        {/* Legal Info */}
                        <div>
                            <h4 className="font-bold text-base md:text-[18px] text-white mb-4 md:mb-6">{t('footer.legal_info')}</h4>
                            <ul className="space-y-2 md:space-y-3 text-sm md:text-[18px] text-slate-400">
                                <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.link_terms')}</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.link_privacy')}</Link></li>
                                {/* <li><Link to="/disclaimer" className="hover:text-white transition-colors">{t('footer.link_disclaimer')}</Link></li> */}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-bold text-base md:text-[18px] text-white mb-4 md:mb-6">{t('footer.contact_us')}</h4>
                            <ul className="space-y-3 md:space-y-4 text-sm md:text-[18px] text-slate-400">
                                <li className="flex items-center gap-3">
                                    <Mail size={16} className="md:hidden" /> <Mail size={20} className="hidden md:block text-[#00b4d8]" />
                                    <a href="mailto:info@maqc.ca" className="hover:text-white transition-colors">info@maqc.ca</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="md:hidden" /> <Phone size={20} className="hidden md:block text-[#00a651]" />
                                    <span>+1-514-XXX-XXXX</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="md:hidden text-red-500 shrink-0" /> <MapPin size={20} className="hidden md:block text-red-500 shrink-0" />
                                    <span>Montréal, Québec<br />Canada</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="max-w-[1400px] mx-auto mt-12 md:mt-16 pt-4 md:pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-[18px] text-slate-500 px-4 md:px-0">
                        <span className="text-center md:text-left">{t('footer.rights_reserved')}</span>
                        <span className="text-center md:text-left">{t('footer.disclaimer_bottom')}</span>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
