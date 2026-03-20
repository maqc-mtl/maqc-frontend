import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, Bed, Bath, MapPin, Phone, Mail,
    Globe, X, ChevronLeft, ChevronRight, Home as HomeIcon,
    Ruler, FileText, Map, Send
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    address: string;
    area?: string;
    province?: string;
    postalCode?: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    type: string;
    listingType: string;
    imageUrls?: string[];
    createdAt?: string;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        photoUrl?: string;
        agency?: string;
    };
}

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    // const [isFavorite, setIsFavorite] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Contact form state
    const [contactForm, setContactForm] = useState({
        subject: 'info',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    useEffect(() => {
        // Scroll to top when component mounts or id changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);


    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/properties/public/${id}`);
                setProperty(response.data);
                // Set default contact message
                if (response.data) {
                    setContactForm(prev => ({
                        ...prev,
                        message: t('detail.default_message', {
                            address: response.data.address,
                            id: response.data.id
                        })
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch property', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const formattedPrice = property ? new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(property.price).replace('$', '').trim() + ' $' : '';

    const listingTypeLabel = property?.listingType === 'FOR_SALE'
        ? t('detail.for_sale')
        : t('detail.for_rent');

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!property) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await api.post(`/properties/${property.id}/contact`, {
                subject: contactForm.subject,
                firstName: contactForm.firstName,
                lastName: contactForm.lastName,
                email: contactForm.email,
                phone: contactForm.phone,
                message: contactForm.message
            });

            alert(t('detail.message_sent'));
            setShowContactModal(false);
            // Reset form
            setContactForm({
                subject: 'info',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error: any) {
            console.error('Failed to send message:', error);
            setSubmitError(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">{t('detail.not_found')}</h2>
                    <Link to="/" className="text-blue-600 font-bold hover:underline">{t('detail.back_home')}</Link>
                </div>
            </div>
        );
    }

    const images = property.imageUrls && property.imageUrls.length > 0
        ? property.imageUrls
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'];

    // Generate additional gallery images for visual richness
    const galleryImages = images.length === 1
        ? [
            images[0],
            images[0].replace('w=800', 'w=600') + '&sat=-50',
            images[0].replace('w=800', 'w=600') + '&blur=1',
            images[0].replace('w=800', 'w=600') + '&bri=10',
        ]
        : images;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Link to="/" className="hover:text-blue-600 transition-colors">{t('detail.breadcrumb_home')}</Link>
                    <span>/</span>
                    {/* <Link to="/properties" className="hover:text-blue-600 transition-colors">{t('detail.breadcrumb_properties')}</Link>
                    <span>/</span> */}
                    <span className="text-slate-600 font-bold">{property.title}</span>
                </div>
            </div>

            {/* Header Section */}
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                            {property.title}
                        </h1>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <MapPin size={14} className="text-blue-600" />
                                <span>{property.address}</span>
                            </div>
                            {property.area && (
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    <span>{property.area}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-black text-blue-700 tracking-tight">{formattedPrice}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                {t(`home.type_${property.type.toLowerCase()}`)} — {listingTypeLabel}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all">
                                <Share2 size={16} className="text-slate-500" />
                            </button>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isFavorite ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-200'}`}
                            >
                                <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} className={isFavorite ? 'text-red-500' : 'text-slate-500'} />
                            </button> */}
                            {/* <button
                                onClick={() => setShowContactModal(true)}
                                className="px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                            >
                                {t('detail.contact_owner')}
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Image Gallery - Centris Style Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-2">
                    {/* Main Image */}
                    <div
                        className="lg:col-span-2 lg:row-span-2 relative cursor-pointer group"
                        onClick={() => { setSelectedImageIndex(0); setLightboxOpen(true); }}
                    >
                        <img
                            src={galleryImages[0]}
                            alt={property.title}
                            className="w-full h-[300px] lg:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </div>
                    {/* Thumbnail Images */}
                    {galleryImages.slice(1, 5).map((img, index) => (
                        <div
                            key={index}
                            className="relative cursor-pointer group hidden lg:block"
                            onClick={() => { setSelectedImageIndex(index + 1); setLightboxOpen(true); }}
                        >
                            <img
                                src={img}
                                alt={`${property.title} ${index + 2}`}
                                className="w-full h-[226px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                        </div>
                    ))}
                </div>

                {/* Image action buttons */}
                <div className="flex justify-end gap-2 mb-8">
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
                        <Maximize2 size={14} />
                        {t('detail.virtual_tour')}
                    </button> */}
                    <button
                        onClick={() => setLightboxOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
                    >
                        <span>{galleryImages.length}</span>
                        <Camera size={14} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 border-b border-slate-200">
                    {[
                        { key: 'details', label: t('detail.tab_details'), icon: <FileText size={16} /> },
                        { key: 'map', label: t('detail.tab_map'), icon: <Map size={16} /> },
                        { key: 'streetview', label: t('detail.tab_streetview'), icon: <Globe size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 -mb-[2px] ${activeTab === tab.key
                                ? 'border-[#1a1a6d] text-[#1a1a6d] bg-blue-50/50'
                                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'details' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                {/* Characteristics */}
                                <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight">{t('detail.characteristics')}</h2>

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <HomeIcon size={18} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.lifestyle')}</div>
                                            <div className="text-sm font-bold text-slate-900">{t(`home.type_${property.type.toLowerCase()}`)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <Bed size={18} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.bedrooms')}</div>
                                            <div className="text-sm font-bold text-slate-900">{property.bedrooms} {t('detail.rooms')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <Bath size={18} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.bathrooms')}</div>
                                            <div className="text-sm font-bold text-slate-900">{property.bathrooms}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <Ruler size={18} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.area')}</div>
                                            <div className="text-sm font-bold text-slate-900">{property.squareFootage || '—'} pc</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 mb-10">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.building_style')}</div>
                                        <div className="text-sm font-bold text-slate-700">{t(`home.type_${property.type.toLowerCase()}`)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.year_built')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.living_area')}</div>
                                        <div className="text-sm font-bold text-slate-700">{property.squareFootage || '—'} pc</div>
                                    </div>
                                    {/* <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.lot_size')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div> */}
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.parking')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.fireplace')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div>
                                    {/* <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.additional')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div> */}
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.move_in_date')}</div>
                                        <div className="text-sm font-bold text-slate-700">—</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">{t('detail.description')}</h2>
                                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                        {property.description}
                                    </p>
                                    <div className="mt-4 text-xs text-slate-400 font-medium">
                                        No MAQC {property.id}
                                    </div>
                                </div>

                                {/* More Details CTA */}
                                {/* <div className="bg-[#1a1a6d]/5 border border-[#1a1a6d]/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-black text-sm text-slate-900 mb-1">{t('detail.need_more')}</h3>
                                        <p className="text-xs text-slate-500">{t('detail.need_more_desc')}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2"
                                    >
                                        {t('detail.contact_owner')}
                                    </button>
                                </div> */}
                            </motion.div>
                        )}

                        {activeTab === 'map' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-100 rounded-2xl h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <Map size={48} className="text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold text-sm">{t('detail.map_placeholder')}</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'streetview' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-100 rounded-2xl h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <Globe size={48} className="text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold text-sm">{t('detail.streetview_placeholder')}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Owner Info */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            {/* Owner Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                        {property.user?.photoUrl ? (
                                            <img src={property.user.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-black text-xl">
                                                {property.user?.firstName?.charAt(0) || 'P'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm">
                                            {property.user ? `${property.user.firstName} ${property.user.lastName}` : t('detail.owner')}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium">{t('detail.owner_role')}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone size={14} className="text-blue-600" />
                                        <span className="font-medium">{property.user?.phoneNumber || '+1 514-XXX-XXXX'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail size={14} className="text-blue-600" />
                                        <span className="font-medium">{property.user?.email || 'contact@maqc.ca'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="w-full py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    {t('detail.contact_owner')}
                                </button>
                            </div>

                            {/* Quick Summary */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                <h4 className="font-black text-xs text-slate-400 uppercase tracking-wider mb-4">{t('detail.summary')}</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">{t('detail.price_label')}</span>
                                        <span className="font-black text-slate-900">{formattedPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">{t('detail.type_label')}</span>
                                        <span className="font-bold text-slate-700">{t(`home.type_${property.type.toLowerCase()}`)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">{t('detail.bedrooms')}</span>
                                        <span className="font-bold text-slate-700">{property.bedrooms}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">{t('detail.bathrooms')}</span>
                                        <span className="font-bold text-slate-700">{property.bathrooms}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">ID</span>
                                        <span className="font-bold text-slate-700">#{property.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                            onClick={() => setShowContactModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {t('detail.contact_title')} {property.user ? `${property.user.firstName} ${property.user.lastName}` : t('detail.owner')}
                                </h2>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                >
                                    <X size={16} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Error Message */}
                            {submitError && (
                                <div className="px-6 py-3 bg-red-50 border-b border-red-100">
                                    <p className="text-sm text-red-600 font-medium">{submitError}</p>
                                </div>
                            )}

                            {/* Modal Body */}
                            <form onSubmit={handleContactSubmit} className="p-6">
                                {/* Subject */}
                                <div className="mb-4">
                                    <select
                                        value={contactForm.subject}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                                    >
                                        <option value="info">{t('detail.subject_info')}</option>
                                        <option value="visit">{t('detail.subject_visit')}</option>
                                        <option value="offer">{t('detail.subject_offer')}</option>
                                        <option value="other">{t('detail.subject_other')}</option>
                                    </select>
                                </div>

                                {/* Name Row */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder={t('detail.first_name')}
                                        value={contactForm.firstName}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('detail.last_name')}
                                        value={contactForm.lastName}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                        required
                                    />
                                </div>

                                {/* Contact Row */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <input
                                        type="email"
                                        placeholder={t('detail.email_placeholder')}
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder={t('detail.phone_placeholder')}
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    />
                                </div>

                                {/* Message */}
                                <div className="mb-4">
                                    <textarea
                                        rows={4}
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                                        placeholder={t('detail.message_placeholder')}
                                    />
                                </div>

                                {/* Disclaimer */}
                                <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
                                    {t('detail.consent_text')}
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowContactModal(false)}
                                        className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        {t('detail.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-[#1a1a6d] text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                {t('detail.send')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Owner Info in Modal */}
                            {/* <div className="border-t border-slate-100 p-6 bg-slate-50/80 rounded-b-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {property.user?.photoUrl ? (
                                            <img src={property.user.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-black text-xl">
                                                {property.user?.firstName?.charAt(0) || 'P'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-900 text-sm">
                                            {property.user ? `${property.user.firstName} ${property.user.lastName}` : t('detail.owner')}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium">{t('detail.owner_role')}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Phone size={14} className="text-blue-600" />
                                            <Globe size={14} className="text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Image Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/95 z-[300]"
                            onClick={() => setLightboxOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[301] flex items-center justify-center p-8"
                        >
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                            >
                                <X size={20} />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev > 0 ? prev - 1 : galleryImages.length - 1); }}
                                className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <img
                                src={galleryImages[selectedImageIndex]}
                                alt=""
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev < galleryImages.length - 1 ? prev + 1 : 0); }}
                                className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                            >
                                <ChevronRight size={24} />
                            </button>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
                                {selectedImageIndex + 1} / {galleryImages.length}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PropertyDetail;
