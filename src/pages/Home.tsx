import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// /import { Search, Map, FileText, TrendingUp, Users, Home as HomeIcon, LayoutGrid, ArrowRight, ChevronDown, Zap, Star, SlidersHorizontal, Globe, Loader2 } from 'lucide-react';
import { Search, TrendingUp, Home as HomeIcon, LayoutGrid, ChevronDown, Zap, Star, SlidersHorizontal, Globe, Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { useDebounce } from '../hooks/useDebounce';

const Home: React.FC = () => {
    // const navigate = useNavigate();
    const { t } = useTranslation();
    // const [searchQuery, setSearchQuery] = useState('');
    const [transactionType, setTransactionType] = useState<'FOR_SALE' | 'FOR_RENT'>('FOR_SALE');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [latestProperties, setLatestProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProperty, setTotalProperty] = useState(0);
    const [sortOrder, setSortOrder] = useState<string>('');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);


    // Debounce price values to avoid too many API calls
    const debouncedMinPrice = useDebounce(minPrice, 1000);
    const debouncedMaxPrice = useDebounce(maxPrice, 1000);

    const lastPropertyElementRef = useCallback((node: any) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages - 1) {
                setPage(prevPage => prevPage + 1);
            }
        });
        console.log('lastPropertyElementRef page', page);
        console.log('lastPropertyElementRef totalPages', totalPages);
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, page, totalPages]);

    const fetchProperties = useCallback(async (isNextPage = false) => {
        if (!isNextPage) setLoading(true);
        else setLoadingMore(true);
        try {
            // Ensure max price is not less than min price
            let finalMinPrice = debouncedMinPrice;
            let finalMaxPrice = debouncedMaxPrice;

            if (finalMinPrice && finalMaxPrice && Number(finalMinPrice) > Number(finalMaxPrice)) {
                finalMaxPrice = finalMinPrice;
            }

            const response = await api.get('/properties/public/search', {
                params: {
                    listingType: transactionType,
                    // keyword: searchQuery || undefined,
                    area: selectedArea || undefined,
                    type: selectedType || undefined,
                    minPrice: finalMinPrice || undefined,
                    maxPrice: finalMaxPrice || undefined,
                    page: isNextPage ? page : 0,
                    size: 12,
                    sort: sortOrder ? (sortOrder === 'price_asc' ? 'price,asc' : 'price,desc') : undefined
                }
            });

            const newProperties = response.data.content;
            setTotalPages(response.data.totalPages);
            setTotalProperty(response.data.totalElements);
            if (isNextPage) {
                setLatestProperties(prev => [...prev, ...newProperties]);
            } else {
                setLatestProperties(newProperties);
                setPage(0);
            }
            console.log('fetchProperties isNextPage', isNextPage);
            console.log('fetchProperties page', page);
            console.log('fetchProperties totalPages', totalPages);
        } catch (error) {
            console.error('Failed to fetch properties', error);
            if (!isNextPage) setLatestProperties([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
        //}, [transactionType, searchQuery, debouncedMinPrice, debouncedMaxPrice, selectedArea, selectedType, page, sortOrder]);
    }, [transactionType, debouncedMinPrice, debouncedMaxPrice, selectedArea, selectedType, page, sortOrder]);

    useEffect(() => {
        fetchProperties();
        //}, [transactionType, debouncedMinPrice, debouncedMaxPrice, selectedArea, selectedType, searchQuery, sortOrder]);
    }, [transactionType, debouncedMinPrice, debouncedMaxPrice, selectedArea, selectedType, sortOrder]);

    useEffect(() => {
        console.log('useEffect page', page);
        if (page > 0) {
            fetchProperties(true);
        }
    }, [page]);

    // const handleSearch = () => {
    //     setPage(0);
    //     fetchProperties();
    // };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Centris-Style Hero Section */}
            <section className="relative min-h-[650px] lg:h-[80vh] flex items-center justify-center overflow-hidden py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero Backdrop"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 w-full max-w-5xl px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                            {t('home.hero_title')}
                        </h1>
                        <p className="text-lg text-white/90 font-medium tracking-wide">
                            {t('home.hero_subtitle')}
                        </p>
                    </motion.div>

                    <div className="flex flex-col items-center">
                        {/* Transaction Toggle - Centered Pill Style */}
                        <div className="flex bg-slate-100/30 backdrop-blur-md p-1.5 rounded-2xl mb-4 self-center border border-white/20">
                            <button
                                onClick={() => setTransactionType('FOR_SALE')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${transactionType === 'FOR_SALE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/40'}`}
                            >
                                <HomeIcon size={18} />
                                {t('home.buy')}
                            </button>
                            <button
                                onClick={() => setTransactionType('FOR_RENT')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${transactionType === 'FOR_RENT' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/40'}`}
                            >
                                <Zap size={18} />
                                {t('home.rent')}
                            </button>
                        </div>

                        {/* Multi-Column Search Card */}
                        <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden">
                            <div className="p-8 pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    {/* Keyword Input */}
                                    {/* <div className="md:col-span-4 space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                                            {t('home.label_keyword')}
                                        </label>
                                        <div className="relative group">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder={t('home.search_placeholder')}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div> */}

                                    {/* Area Select */}
                                    <div className="md:col-span-4 space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                                            {t('home.label_area')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all cursor-pointer truncate"
                                                value={selectedArea}
                                                onChange={(e) => setSelectedArea(e.target.value)}
                                            >
                                                <option value="">{t('home.all_areas')}</option>
                                                <option value="Montreal Region">{t('home.area_montreal')}</option>
                                                <option value="Quebec City Region">{t('home.area_quebec')}</option>
                                                <option value="Sherbrooke Region">{t('home.area_sherbrooke')}</option>
                                            </select>
                                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* Type Select */}
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                                            {t('home.label_type')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all cursor-pointer"
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                            >
                                                <option value="">{t('home.all_types')}</option>
                                                <option value="HOUSE">{t('home.type_house')}</option>
                                                <option value="CONDO">{t('home.type_condo')}</option>
                                                <option value="PLEX">{t('home.type_plex')}</option>
                                                <option value="COMMERCIAL">{t('home.type_commercial')}</option>
                                            </select>
                                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="md:col-span-5 space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                                            {t('home.label_price_range')}
                                        </label>
                                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-xl group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all">
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder={t('home.min_price')}
                                                className="w-full pl-3 pr-1 py-3 bg-transparent font-bold text-slate-900 outline-none text-xs"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                            <div className="text-slate-300 font-bold text-xs px-1">-</div>
                                            <input
                                                type="number"
                                                min={minPrice || 0}
                                                placeholder={t('home.max_price')}
                                                className="w-full pl-1 pr-3 py-3 bg-transparent font-bold text-slate-900 outline-none text-xs"
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    const newMaxPrice = e.target.value;
                                                    // // If max price is less than min price, adjust it
                                                    // if (newMaxPrice && minPrice && Number(newMaxPrice) < Number(minPrice)) {
                                                    //     setMaxPrice(minPrice);
                                                    // } else {
                                                    setMaxPrice(newMaxPrice);
                                                    // }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    {/* <div className="md:col-span-12 mt-4">
                                        <button
                                            onClick={handleSearch}
                                            className="w-full h-[58px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                                        >
                                            <Search size={20} />
                                            {t('home.search_button')}
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 font-bold text-xs uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-blue-400" />
                            75,432 {t('home.stats_active')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-blue-400" />
                            1,240 {t('home.stats_advisors')}
                        </div>
                        <div className="flex items-center gap-2">
                            <HomeIcon size={16} className="text-blue-400" />
                            243 {t('home.stats_new')}
                        </div>
                    </div> */}
                </div>
            </section>

            {/* Property Gallery Section - Centris Style */}
            <section className="py-12 bg-slate-50 relative">
                <div className="max-w-[1400px] mx-auto px-8">
                    {/* View Controls & Metadata */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-1 mb-6 md:mb-0">
                            <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-sm tracking-tight transition-all">
                                <LayoutGrid size={18} strokeWidth={2.5} />
                                {t('properties.grid_view')}
                            </button>
                            {/* <button className="flex items-center gap-2 px-6 py-4 text-slate-500 font-bold text-sm tracking-tight hover:text-slate-600 transition-colors">
                                <Map size={18} />
                                {t('properties.map_view')}
                            </button>
                            <button className="flex items-center gap-2 px-6 py-4 text-slate-500 font-bold text-sm tracking-tight hover:text-slate-600 transition-colors">
                                <FileText size={18} />
                                {t('common.summary')}
                            </button> */}
                        </div>

                        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 order-2">
                            <span className="text-sm font-bold text-slate-600 tracking-tight">
                                <span className="font-black text-slate-900">{totalProperty}</span> {t('properties.found')}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 order-1 lg:order-3 relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
                            >
                                {sortOrder === 'price_desc' ? t('common.price_high_low') : sortOrder === 'price_asc' ? t('common.price_low_high') : t('common.sort_by')}
                                <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => { setSortOrder(''); setIsSortOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortOrder === '' ? 'font-bold text-blue-600' : 'text-slate-700'}`}
                                            >
                                                {t('common.default_sort')}
                                            </button>
                                            <button
                                                onClick={() => { setSortOrder('price_desc'); setIsSortOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortOrder === 'price_desc' ? 'font-bold text-blue-600' : 'text-slate-700'}`}
                                            >
                                                {t('common.price_high_low')}
                                            </button>
                                            <button
                                                onClick={() => { setSortOrder('price_asc'); setIsSortOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${sortOrder === 'price_asc' ? 'font-bold text-blue-600' : 'text-slate-700'}`}
                                            >
                                                {t('common.price_low_high')}
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Property Grid */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="flex justify-center py-32">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                                </div>
                            </div>
                        ) : latestProperties.length === 0 ? (
                            <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-8">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                    {t('properties.no_results')}
                                </h3>
                                <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                                    {t('properties.no_results_desc')}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                                {/* Use simple div for grid layout stability */}
                                {latestProperties.map((property, index) => {
                                    if (latestProperties.length === index + 1) {
                                        return (
                                            <div ref={lastPropertyElementRef} key={property.id}>
                                                <PropertyCard property={property} />
                                            </div>
                                        );
                                    } else {
                                        return <PropertyCard key={property.id} property={property} />;
                                    }
                                })}
                            </div>
                        )}
                    </AnimatePresence>

                    {loadingMore && (
                        <div className="flex justify-center items-center gap-3 py-10 text-slate-500 font-bold uppercase tracking-widest text-xs">
                            <Loader2 size={20} className="animate-spin text-blue-600" />
                            {t('common.loading_more')}
                        </div>
                    )}

                    {!loading && !loadingMore && page < totalPages - 1 && (
                        <div className="text-center mt-24">
                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                className="inline-flex items-center gap-4 px-14 py-5 bg-white border border-slate-200 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm hover:shadow-2xl active:scale-95"
                            >
                                {t('home.view_more')} <ChevronDown size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose MAQC & How It Works - Redesigned Section */}
            <section className="relative overflow-hidden pt-32 pb-40">
                {/* Vibrant Blue Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800" />
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-white/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-blue-400/20 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-[1400px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[11px] font-black uppercase tracking-widest mb-6 border border-white/10">
                            <TrendingUp size={12} />
                            {t('home.network_badge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                            {t('fsbo.why_title')}
                        </h2>
                        <p className="text-blue-100 text-lg font-medium opacity-80">
                            {t('fsbo.why_subtitle')}
                        </p>
                    </div>

                    {/* Why Choose Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                        {[
                            { icon: <TrendingUp size={24} />, title: 'card_zero_title', desc: 'card_zero_desc' },
                            { icon: <Star size={24} />, title: 'card_support_title', desc: 'card_support_desc' },
                            { icon: <Zap size={24} />, title: 'card_fast_title', desc: 'card_fast_desc' },
                            { icon: <Globe size={24} />, title: 'card_exposure_title', desc: 'card_exposure_desc' }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] text-white hover:bg-white/15 transition-all"
                            >
                                <div className="text-blue-200 mb-8">{card.icon}</div>
                                <h4 className="text-lg font-black mb-2">{t(`fsbo.${card.title}`)}</h4>
                                <p className="text-sm text-blue-100/70 font-medium leading-relaxed">{t(`fsbo.${card.desc}`)}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* How It Works - Steps Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-16">
                        <div className="text-center mb-16">
                            <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t('fsbo.steps_title')}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                            {/* Connection Lines (Hidden on Mobile) */}
                            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[1px] bg-white/10" />

                            {[
                                { step: 1, title: 'step1_title', desc: 'step1_desc' },
                                { step: 2, title: 'step2_title', desc: 'step2_desc' },
                                { step: 3, title: 'step3_title', desc: 'step3_desc' },
                                { step: 4, title: 'step4_title', desc: 'step4_desc' }
                            ].map((s, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-black shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                                        {s.step}
                                    </div>
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest mb-3">{t(`fsbo.${s.title}`)}</h5>
                                    <p className="text-blue-100/60 text-xs font-medium leading-relaxed px-4">{t(`fsbo.${s.desc}`)}</p>
                                </div>
                            ))}
                        </div>

                        {/* <div className="mt-16 text-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-black/10"
                            >
                                {t('fsbo.register_btn')} <ArrowRight size={18} />
                            </button>
                        </div> */}
                    </div>

                    {/* Platform Description below section */}
                    <div className="mt-20 text-center max-w-4xl mx-auto border-t border-white/10 pt-20 pb-10">
                        <h4 className="text-white font-black text-xl mb-6 uppercase tracking-wider">{t('fsbo.footer_about')}</h4>
                        <p className="text-blue-100/60 text-sm font-medium leading-loose">
                            {t('fsbo.footer_desc')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
