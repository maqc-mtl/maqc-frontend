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
    annualRevenue?: number;
    // Add other fields as needed
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
        setFormData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
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

                        <div className="space-y-6">
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
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('create_property.property_type', '类型')}
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                    >
                                        <option value="HOUSE">House</option>
                                        <option value="CONDO">Condo</option>
                                        <option value="PLEX">Plex</option>
                                        <option value="COMMERCIAL">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                        {t('detail.annual_revenue', '年收入')}
                                    </label>
                                    <input
                                        type="number"
                                        name="annualRevenue"
                                        value={formData.annualRevenue || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                    />
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
