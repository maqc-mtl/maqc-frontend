import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Camera, Eye, Heart, Maximize2, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
    property: {
        id: number;
        title: string;
        price: number;
        address: string;
        area?: string;
        bedrooms: number;
        bathrooms: number;
        squareFootage: number;
        type: string;
        listingType: string;
        imageUrls?: string[];
        publishDate?: string;
        favoriteCount?: number;
        viewCount?: number;
        annualRevenue?: number;
        annualExpenses?: number;
        capRate?: number;
        recommendationScore?: number;
    };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // const [isFavorite, setIsFavorite] = useState(false);

    const formattedPrice = new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(property.price).replace('$', '').trim() + ' $';

    // // Get localized city name
    // const getCityName = (cityKey: string) => {
    //     const cityMap: Record<string, string> = {
    //         'montreal': t('home.city_montreal'),
    //         'quebec': t('home.city_quebec'),
    //         'sherbrooke': t('home.city_sherbrooke')
    //     };
    //     return cityMap[cityKey.toLowerCase()] || cityKey;
    // };

    // Get localized area name
    const getAreaName = (areaKey?: string) => {
        console.log("areaKey" + areaKey)
        if (!areaKey) return '';
        const areaMap: Record<string, string> = {
            'Montreal Region': t('home.area_montreal'),
            'Quebec City Region': t('home.area_quebec'),
            'Sherbrooke Region': t('home.area_sherbrooke')
        };
        return areaMap[areaKey] || areaKey;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(`/properties/${property.id}`)}
            className="group cursor-pointer flex flex-col h-full bg-white transition-all duration-300"
        >
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                        src={property.imageUrls[0]}
                        alt={property.title}
                        className="w-full h-full object-cover transition duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Camera size={48} />
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

                {/* Photo Count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-slate-900/60 backdrop-blur-md rounded-md text-white text-[10px] font-bold">
                    <span>{property.imageUrls?.length || 0}</span>
                    <Camera size={12} strokeWidth={2.5} />
                </div>

                {/* Status Badges */}
                {/* <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {property.id % 3 === 0 && (
                        <div className="px-3 py-1 bg-[#1a3a6d] text-white text-[10px] font-bold rounded shadow-lg uppercase tracking-wider">
                            {t('properties.new_listing')}
                        </div>
                    )}
                </div> */}

                {/* Interactive Overlays */}
                <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-2">
                        <Maximize2 size={12} />
                        {t('properties.virtual_tour')}
                    </div>
                </div>

                {/* Favorite Toggle */}
                {/* <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-all text-white drop-shadow-lg"
                >
                    <Heart size={20} fill={isFavorite ? "#ef4444" : "rgba(0,0,0,0.1)"} className={isFavorite ? "text-red-500" : "text-white"} />
                </button> */}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow px-1">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {formattedPrice}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3 ml-auto text-slate-500">
                        {property.recommendationScore && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-black text-amber-600">{property.recommendationScore.toFixed(1)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Eye size={14} className="text-slate-300" />
                            <span className="text-xs sm:text-sm font-bold">{property.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart size={14} className="text-slate-300" />
                            <span className="text-xs sm:text-sm font-bold">{property.favoriteCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">
                    {t(`home.type_${property.type.toLowerCase()}`)} {t('common.to_sale')}
                </div>

                <div className="text-xs sm:text-[13px] text-slate-500 font-medium leading-snug mb-2 line-clamp-2">
                    {property.address}
                </div>

                {property.area && (
                    <div className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 md:mb-4">
                        {getAreaName(property.area)}
                    </div>
                )}

                {/* Publish Date & Cap Rate */}
                <div className="flex items-center gap-4 mb-3 md:mb-4 flex-wrap">
                    {property.publishDate && (
                        <div className="text-xs text-slate-400 font-medium">
                            {t('properties.published')}: {new Date(property.publishDate).toLocaleDateString()}
                        </div>
                    )}
                    {property.listingType === 'FOR_SALE' && property.capRate && (
                        <div className="text-xs font-bold text-green-600">
                            {t('detail.cap_rate')}: {property.capRate.toFixed(2)}%
                        </div>
                    )}
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 mt-auto pt-3 md:pt-4 border-t border-slate-50 text-slate-600 font-bold text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                        <Bed size={14} strokeWidth={2.5} className="text-slate-400" />
                        <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath size={14} strokeWidth={2.5} className="text-slate-400" />
                        <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40 ml-auto">
                        <MapPin size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
