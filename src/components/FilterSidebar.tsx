import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, isOpen, onClose }) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        type: '',
        listingType: '',
        area: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            type: '',
            listingType: '',
            area: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100.1%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100.1%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] z-[160] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                                        <SlidersHorizontal size={24} className="text-blue-600" />
                                        Refine Search
                                    </h2>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Personalize your curation</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                {/* Transaction Type */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transaction Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['FOR_SALE', 'FOR_RENT'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    const newFilters = { ...filters, listingType: filters.listingType === type ? '' : type };
                                                    setFilters(newFilters);
                                                    onFilterChange(newFilters);
                                                }}
                                                className={`py-4 rounded-2xl font-black text-xs transition-all border ${filters.listingType === type
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                                                    }`}
                                            >
                                                {type === 'FOR_SALE' ? 'Purchase' : 'Lease'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Area Filter */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Region</label>
                                    <select
                                        name="area"
                                        value={filters.area}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                                    >
                                        <option value="">{t('home.all_areas')}</option>
                                        <option value="Montreal Region">{t('home.area_montreal')}</option>
                                        <option value="Quebec City Region">{t('home.area_quebec')}</option>
                                        <option value="Sherbrooke Region">{t('home.area_sherbrooke')}</option>
                                    </select>
                                </div>

                                {/* Property Type */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Property Category</label>
                                    <select
                                        name="type"
                                        value={filters.type}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                                    >
                                        <option value="">All Architectures</option>
                                        <option value="HOUSE">House</option>
                                        <option value="CONDO">Condo</option>
                                        <option value="PLEX">Plex</option>
                                        <option value="COMMERCIAL">Commercial</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pricing Spectrum ($)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={handleChange}
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-300"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={handleChange}
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                {/* Rooms */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Beds</label>
                                        <div className="flex bg-slate-50 p-1 rounded-2xl">
                                            {[1, 2, 3, 4, '5+'].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        const val = num.toString().includes('+') ? '5' : num.toString();
                                                        const newFilters = { ...filters, bedrooms: filters.bedrooms === val ? '' : val };
                                                        setFilters(newFilters);
                                                        onFilterChange(newFilters);
                                                    }}
                                                    className={`flex-grow py-3 rounded-xl text-xs font-black transition-all ${filters.bedrooms === (num.toString().includes('+') ? '5' : num.toString())
                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Baths</label>
                                        <div className="flex bg-slate-50 p-1 rounded-2xl">
                                            {[1, 2, 3, 4, '5+'].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        const val = num.toString().includes('+') ? '5' : num.toString();
                                                        const newFilters = { ...filters, bathrooms: filters.bathrooms === val ? '' : val };
                                                        setFilters(newFilters);
                                                        onFilterChange(newFilters);
                                                    }}
                                                    className={`flex-grow py-3 rounded-xl text-xs font-black transition-all ${filters.bathrooms === (num.toString().includes('+') ? '5' : num.toString())
                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleReset}
                                    className="py-5 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={onClose}
                                    className="py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                >
                                    Apply Curations
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;
