import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Globe, Mail, Phone, MapPin, LogIn, UserPlus, PlusCircle, FileText, Crown, LogOut, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import Membership from './pages/Membership';
import Payment from './pages/Payment';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
// import Payment from './pages/Payment';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const handleLogout = () => {
        logout();
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


    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
        >
            <div className="max-w-[1600px] mx-auto px-10 h-24 flex justify-between items-center">
                <Link to="/" className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-slate-900/10">
                        <Zap size={24} className="text-white fill-current" />
                    </div>
                    <span className="tracking-[-0.05em] uppercase">MAQC</span>
                </Link>

                <div className="flex items-center gap-6">
                    {/* Modern Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 group"
                        >
                            <Globe size={18} className={`text-slate-400 group-hover:text-blue-600 transition-colors ${isLangOpen ? 'text-blue-600' : ''}`} />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                {languages.find(l => l.code === currentLang)?.short || 'EN'}
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

                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => {
                                    if (user?.planType === 'FREE') {
                                        navigate('/membership');
                                    } else {
                                        navigate('/create-property');
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1a56db] text-white rounded-lg text-sm font-medium transition-colors hover:bg-blue-700"
                            >
                                <PlusCircle size={18} />
                                {t('nav.publish_ad')}
                            </button>

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
                                        {user?.planType && (
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
                                                    {/* <Link to="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <User size={18} className="text-slate-400" />
                                                        {t('nav.my_account')}
                                                    </Link> */}
                                                    <Link to="/my-ads" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <FileText size={18} className="text-slate-400" />
                                                        {t('nav.my_ads')}
                                                    </Link>
                                                    <Link to="/subscriptions" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <Crown size={18} className="text-slate-400" />
                                                        {t('nav.subscriptions')}
                                                    </Link>
                                                </div>

                                                <div className="border-t border-slate-100 py-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                                                    >
                                                        <LogOut size={18} className="text-slate-400" />
                                                        {t('nav.logout')}
                                                    </button>
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
            </div>
        </motion.header>
    );
};

function App() {
    const { t } = useTranslation();
    return (
        <Router>
            <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
                <Header />
                <main className="flex-grow pt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/properties/:id" element={<PropertyDetail />} />
                        <Route path="/membership" element={<Membership />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/create-property" element={<CreateProperty />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                    </Routes>
                </main>

                {/* White Info Section */}
                <div className="bg-white py-12 px-8 text-center border-t border-slate-200">
                    <h3 className="text-[18px] font-bold text-slate-800 mb-4">{t('footer.info_title')}</h3>
                    <p className="text-[18px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        {t('footer.info_desc')}
                    </p>
                </div>

                {/* Yellow Warning Banner */}
                <div className="bg-[#ff9900] py-3 text-center text-slate-900 font-medium text-[18px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
                    <div className="flex items-center gap-2">
                        <Info size={20} /> {t('footer.warning_not_broker')}
                    </div>
                    <div className="hidden md:block text-slate-900/40">•</div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={20} /> {t('footer.warning_no_advice')}
                    </div>
                    <div className="hidden md:block text-slate-900/40">•</div>
                    <div className="flex items-center gap-2">
                        <FileText size={20} /> {t('footer.warning_no_trade')}
                    </div>
                </div>

                <footer className="bg-[#0b1221] text-white pt-16 pb-8 px-10 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-12 relative z-10">
                        {/* Company Info */}
                        <div className="lg:col-span-5">
                            <Link to="/" className="text-[18px] font-black tracking-tighter mb-6 flex items-center gap-1">
                                <span className="text-[#00b4d8]">MAQC</span><span className="text-slate-400 text-[18px]">.ca</span>
                            </Link>
                            <p className="text-slate-400 text-[18px] leading-relaxed mb-6">
                                {t('footer.about_desc')}
                            </p>
                            {/* <div className="flex gap-4">
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                            </div> */}
                        </div>

                        {/* Quick Links */}
                        {/* <div className="lg:col-span-2">
                            <h4 className="font-bold text-[18px] text-white mb-6">{t('footer.quick_links')}</h4>
                            <ul className="space-y-3 text-[18px] text-slate-400">
                                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.link_home')}</Link></li>
                                <li><Link to="/properties" className="hover:text-white transition-colors">{t('footer.link_properties')}</Link></li>
                                <li><Link to="/create-ad" className="hover:text-white transition-colors">{t('footer.link_create_ad')}</Link></li>
                                <li><Link to="/tools" className="hover:text-white transition-colors">{t('footer.link_tools')}</Link></li>
                                <li><Link to="/membership" className="hover:text-white transition-colors">{t('footer.link_membership')}</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">{t('footer.link_contact_us')}</Link></li>
                            </ul>
                        </div> */}

                        {/* Legal Info */}
                        <div className="lg:col-span-3">
                            <h4 className="font-bold text-[18px] text-white mb-6">{t('footer.legal_info')}</h4>
                            <ul className="space-y-3 text-[18px] text-slate-400">
                                <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.link_terms')}</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.link_privacy')}</Link></li>
                                {/* <li><Link to="/disclaimer" className="hover:text-white transition-colors">{t('footer.link_disclaimer')}</Link></li> */}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-4">
                            <h4 className="font-bold text-[18px] text-white mb-6">{t('footer.contact_us')}</h4>
                            <ul className="space-y-4 text-[18px] text-slate-400">
                                <li className="flex items-center gap-3">
                                    <Mail size={20} className="text-[#00b4d8]" />
                                    <a href="mailto:info@maqc.ca" className="hover:text-white transition-colors">info@maqc.ca</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={20} className="text-[#00a651]" />
                                    <span>+1-514-XXX-XXXX</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin size={20} className="text-red-500 shrink-0" />
                                    <span>Montréal, Québec<br />Canada</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[18px] text-slate-500">
                        <span>{t('footer.rights_reserved')}</span>
                        <span>{t('footer.disclaimer_bottom')}</span>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
