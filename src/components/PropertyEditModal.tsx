import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Property {
    id: number;
    title: string;
    price: number;
    address: string;
    description?: string;
    squareFootage?: number;
    type: string;
    listingType: string;
    area?: string;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    units?: number;
    moveInDate?: string;
    hasTerrace?: boolean;
    hasPool?: boolean;
    hasYard?: boolean;
    hasStove?: boolean;
    indoorParking?: number;
    outdoorParking?: number;
    annualRevenue?: number;
    annualExpenses?: number;
    businessType?: string;
}

interface PropertyEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (property: Property) => Promise<void>;
    property: Property | null;
}

const PropertyEditModal: React.FC<PropertyEditModalProps> = ({ isOpen, onClose, onSave, property }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Property | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (property) {
            setFormData({ ...property });
        }
    }, [property]);

    if (!isOpen || !formData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save property', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
            };
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl z-[201]"
                >
                    <form onSubmit={handleSubmit} className="p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                {t('create_property.edit_property', '编辑房源')}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                                    {t('create_property.basic_info', '基本信息')}
                                </h3>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('create_property.ad_title', '标题')}
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.property_type', '物业类型')}
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        >
                                            <option value="HOUSE">{t('home.type_house')}</option>
                                            <option value="CONDO">{t('home.type_condo')}</option>
                                            <option value="PLEX">{t('home.type_plex')}</option>
                                            <option value="COMMERCIAL">{t('home.type_commercial')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.transaction_type', '交易类型')}
                                        </label>
                                        <select
                                            name="listingType"
                                            value={formData.listingType || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        >
                                            <option value="FOR_SALE">{t('create_property.for_sale')}</option>
                                            <option value="FOR_RENT">{t('create_property.for_rent')}</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.type === 'COMMERCIAL' && (
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.business_type', '业务类型')}
                                        </label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        >
                                            <option value="">{t('create_property.select_business_type')}</option>
                                            <option value="RESTAURANT">{t('create_property.business_type_restaurant')}</option>
                                            <option value="STORE">{t('create_property.business_type_store')}</option>
                                            <option value="OFFICE">{t('create_property.business_type_office')}</option>
                                            <option value="RETAIL">{t('create_property.business_type_retail')}</option>
                                            <option value="INDUSTRIAL">{t('create_property.business_type_industrial')}</option>
                                            <option value="MEDICAL">{t('create_property.business_type_medical')}</option>
                                            <option value="OTHER">{t('create_property.business_type_other')}</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('create_property.description', '描述')}
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                                    {t('create_property.location', '位置')}
                                </h3>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('create_property.address', '地址')}
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('create_property.region', '地区')}
                                    </label>
                                    <select
                                        name="area"
                                        value={formData.area || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                    >
                                        <option value="">{t('home.all_areas')}</option>
                                        <option value="Montreal Region">{t('home.area_montreal')}</option>
                                        <option value="Quebec City Region">{t('home.area_quebec')}</option>
                                        <option value="Sherbrooke Region">{t('home.area_sherbrooke')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                                    {t('create_property.property_details', '详细参数')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.price', '价格')}
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            value={formData.price || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.square_footage', '面积 (sqft)')}
                                        </label>
                                        <input
                                            type="number"
                                            name="squareFootage"
                                            value={formData.squareFootage || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.rooms', '总房间数')}
                                        </label>
                                        <input
                                            type="number"
                                            name="rooms"
                                            value={formData.rooms || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.bedrooms', '卧室数量')}
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.bathrooms', '浴室数量')}
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.year_built', '建造年份')}
                                        </label>
                                        <input
                                            type="number"
                                            name="yearBuilt"
                                            value={formData.yearBuilt || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.units', '单元数 (Plex)')}
                                        </label>
                                        <input
                                            type="number"
                                            name="units"
                                            value={formData.units || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.move_in_date', '入住日期')}
                                        </label>
                                        <input
                                            type="date"
                                            name="moveInDate"
                                            value={formData.moveInDate || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amenities / Features */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                                    {t('create_property.amenities', '设施与特点')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="hasTerrace"
                                            checked={formData.hasTerrace || false}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('create_property.has_terrace')}</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="hasPool"
                                            checked={formData.hasPool || false}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('create_property.has_pool')}</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="hasYard"
                                            checked={formData.hasYard || false}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('create_property.has_yard')}</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="hasStove"
                                            checked={formData.hasStove || false}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('create_property.has_stove')}</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.indoor_parking', '室内车位')}
                                        </label>
                                        <input
                                            type="number"
                                            name="indoorParking"
                                            value={formData.indoorParking || 0}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.outdoor_parking', '室外车位')}
                                        </label>
                                        <input
                                            type="number"
                                            name="outdoorParking"
                                            value={formData.outdoorParking || 0}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financials */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                                    {t('create_property.financials', '财务参数')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.annual_revenue', '年收入')}
                                        </label>
                                        <input
                                            type="number"
                                            name="annualRevenue"
                                            value={formData.annualRevenue || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            {t('create_property.annual_expenses', '年开销')}
                                        </label>
                                        <input
                                            type="number"
                                            name="annualExpenses"
                                            value={formData.annualExpenses || ''}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border-2 border-slate-100"
                            >
                                {t('create_property.cancel', '取消')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? t('common.loading', '正在保存...') : t('common.save_changes', '保存更改')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PropertyEditModal;
