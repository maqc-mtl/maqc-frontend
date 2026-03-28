import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Favorites: React.FC = () => {
    const { t } = useTranslation();
    const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalFavorites, setTotalFavorites] = useState(0);

    const fetchFavorites = useCallback(async (isNextPage = false) => {
        if (!isNextPage) setLoading(true);
        try {
            const response = await api.get('/properties/favorites', {
                params: {
                    page: isNextPage ? page : 0,
                    size: 12,
                }
            });

            const newProperties = response.data.content;
            setTotalPages(response.data.totalPages);
            setTotalFavorites(response.data.totalElements);
            if (isNextPage) {
                setFavoriteProperties(prev => [...prev, ...newProperties]);
            } else {
                setFavoriteProperties(newProperties);
                setPage(0);
            }
        } catch (error) {
            console.error('Failed to fetch favorites', error);
            if (!isNextPage) setFavoriteProperties([]);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    useEffect(() => {
        if (page > 0) {
            fetchFavorites(true);
        }
    }, [page]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="text-red-500" size={32} fill="#ef4444" />
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {t('favorites.title', 'My Favorites')}
                        </h1>
                    </div>
                    <p className="text-slate-500">
                        {totalFavorites} {t('favorites.count', 'properties')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                            </div>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                {t('common.loading')}
                            </p>
                        </div>
                    </div>
                ) : favoriteProperties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="text-slate-300 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {t('favorites.empty_title', 'No Favorites Yet')}
                        </h2>
                        <p className="text-slate-500 max-w-md">
                            {t('favorites.empty_message', 'Start exploring properties and click the heart icon to add them to your favorites.')}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Properties Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoriteProperties.map((property) => (
                                <div key={property.id}>
                                    <PropertyCard property={property} />
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
        </div>
    );
};

export default Favorites;
