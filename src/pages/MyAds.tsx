import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Edit2 } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyEditModal from '../components/PropertyEditModal';
import { useAuth } from '../context/AuthContext';

const MyAds: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProperties, setTotalProperties] = useState(0);

    // Edit Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProperty, setCurrentProperty] = useState<any | null>(null);

    const fetchProperties = useCallback(async (isNextPage = false) => {
        if (!user || (!user as any).id) return;
        if (!isNextPage) setLoading(true);
        try {
            const response = await api.get(`/properties/user/${(user as any).id}`, {
                params: {
                    page: isNextPage ? page : 0,
                    size: 12,
                }
            });

            const newProperties = response.data.content;
            setTotalPages(response.data.totalPages);
            setTotalProperties(response.data.totalElements);
            if (isNextPage) {
                setProperties(prev => [...prev, ...newProperties]);
            } else {
                setProperties(newProperties);
                setPage(0);
            }
        } catch (error) {
            console.error('Failed to fetch user properties', error);
            if (!isNextPage) setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [page, user]);

    const handleEdit = (property: any) => {
        setCurrentProperty(property);
        setShowEditModal(true);
    };

    const handleSaveProperty = async (editedProperty: any) => {
        try {
            await api.put(`/properties/${editedProperty.id}`, editedProperty);
            fetchProperties();
        } catch (error) {
            console.error('Failed to update property', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    useEffect(() => {
        if (page > 0) {
            fetchProperties(true);
        }
    }, [page]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-blue-500" size={32} />
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {t('my_ads.title', 'My Ads')}
                        </h1>
                    </div>
                    <p className="text-slate-500">
                        {totalProperties} {t('my_ads.count', 'properties')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                                <div className="absolute inset-0 rounded-full border-t-blue-600 animate-spin"></div>
                            </div>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                {t('common.loading', 'Loading...')}
                            </p>
                        </div>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <FileText className="text-slate-300 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {t('my_ads.empty_title', 'No Ads Yet')}
                        </h2>
                        <p className="text-slate-500 max-w-md">
                            {t('my_ads.empty_message', 'You have not published any properties yet.')}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Properties Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {properties.map((property) => (
                                <div key={property.id} className="flex flex-col gap-3">
                                    <div className="relative">
                                        <PropertyCard property={property} />
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full shadow-lg backdrop-blur-md ${
                                                property.status === 'APPROVED' ? 'bg-emerald-500/90 text-white' :
                                                property.status === 'REFUSED' ? 'bg-rose-500/90 text-white' :
                                                property.status === 'EXPIRED' ? 'bg-slate-500/90 text-white' :
                                                'bg-amber-500/90 text-white'
                                            }`}>
                                                {String(t(`status.${property.status.toLowerCase()}`, property.status))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {(property.status === 'PENDING' || property.status === 'REFUSED') ? (
                                            <button
                                                onClick={() => handleEdit(property)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                                            >
                                                <Edit2 size={14} className="group-hover:text-blue-500 transition-colors" />
                                                {t('common.edit', 'Edit')}
                                            </button>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">
                                                {t('common.locked', 'Locked')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        {page < totalPages - 1 && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                                >
                                    {t('common.load_more', 'Load More')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PropertyEditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveProperty}
                property={currentProperty}
            />
        </div>
    );
};

export default MyAds;
