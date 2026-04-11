import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, MapPin, Phone, Mail,
    Globe, X, ChevronLeft, ChevronRight, Home as HomeIcon,
    Ruler, FileText, Map, Send,
    Heart, Share2, Calendar, Home,
    Lock, Download, Calculator, CalendarClock, ShieldCheck, User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api, { propertyApi } from '../services/api';
import { ToolsModals } from '../components/ToolsModals';

interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    address: string;
    area?: string;
    province?: string;
    postalCode?: string;
    rooms?: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt?: number;
    squareFootage: number;
    hasTerrace?: boolean;
    hasPool?: boolean;
    hasYard?: boolean;
    indoorParking?: number;
    outdoorParking?: number;
    hasStove?: boolean;
    annualRevenue?: number;
    annualExpenses?: number;
    capRate?: number;
    type: string;
    listingType: string;
    businessType?: string;
    imageUrls?: string[];
    publishDate?: string;
    createdAt?: string;
    favoriteCount?: number;
    viewCount?: number;
    moveInDate?: string;
    isFavorite?: boolean;
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
    const { isAuthenticated, user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    // Tools modals state
    const [showMortgageModal, setShowMortgageModal] = useState(false);
    const [showNotaryModal, setShowNotaryModal] = useState(false);
    const [showInspectorModal, setShowInspectorModal] = useState(false);
    const [activeGlobalModal, setActiveGlobalModal] = useState<'buyerAgent' | 'sellerAgent' | null>(null);

    // Mortgage calculator state
    const [mortgagePrice, setMortgagePrice] = useState(0);
    const [downPaymentMode, setDownPaymentMode] = useState<'percent' | 'dollar'>('percent');
    const [downPaymentPercent, setDownPaymentPercent] = useState(0);
    const [downPaymentDollar, setDownPaymentDollar] = useState(0);
    const [interestRate, setInterestRate] = useState('');
    const [amortization, setAmortization] = useState('');
    const [paymentFrequency, setPaymentFrequency] = useState('monthly');
    const [paymentResult, setPaymentResult] = useState<number | null>(null);

    // Notary form state
    const [notaryForm, setNotaryForm] = useState({
        date: '', time: '', name: '', phone: '', email: '', notes: ''
    });
    const [notarySuccess, setNotarySuccess] = useState(false);
    const [selectedNotary, setSelectedNotary] = useState<{ id: number; name: string; firm: string; address: string; phone: string; email: string; languages: string[]; rating: number } | null>(null);

    // Inspector form state
    const [inspectorForm, setInspectorForm] = useState({
        date: '', time: '', name: '', phone: '', email: '', notes: ''
    });
    const [inspectorSuccess, setInspectorSuccess] = useState(false);
    const [selectedInspector, setSelectedInspector] = useState<{ id: number; name: string; firm: string; address: string; phone: string; email: string; languages: string[]; rating: number } | null>(null);

    // Notary list data
    const notaries = [
        { id: 1, name: 'Me Sophie Tremblay', firm: 'Tremblay & Associés Notaires', address: '1200 Rue Sherbrooke O, Montréal, QC', phone: '+1 514-555-0101', email: 'sophie@tremblaynotaires.ca', languages: ['FR', 'EN'], rating: 4.9 },
        { id: 2, name: 'Me Jean-Philippe Lavoie', firm: 'Lavoie Notaires Inc.', address: '3450 Rue Stanley, Montréal, QC', phone: '+1 514-555-0202', email: 'jp@lavoienotaires.ca', languages: ['FR', 'EN', 'ES'], rating: 4.8 },
        { id: 3, name: 'Me Catherine Wang', firm: 'Cabinet Notarial Wang', address: '888 Boul. René-Lévesque, Québec, QC', phone: '+1 418-555-0303', email: 'catherine@wangnotaire.ca', languages: ['FR', 'EN', 'ZH'], rating: 4.7 },
        { id: 4, name: 'Me André Bergeron', firm: 'Bergeron, Roy & Notaires', address: '550 Rue King O, Sherbrooke, QC', phone: '+1 819-555-0404', email: 'andre@bergeronroy.ca', languages: ['FR'], rating: 4.9 },
        { id: 5, name: 'Me Isabelle Martin', firm: 'Martin Notaires SENCRL', address: '2100 Boul. de Maisonneuve, Montréal, QC', phone: '+1 514-555-0505', email: 'isabelle@martinnotaires.ca', languages: ['FR', 'EN'], rating: 4.6 },
    ];

    // Home Inspector list data
    const inspectors = [
        { id: 1, name: 'Marc-André Lefebvre', firm: 'Inspection Pro MTL', address: '4560 Rue Beaubien E, Montréal, QC', phone: '+1 514-555-8801', email: 'marc@inspectionpromtl.ca', languages: ['FR', 'EN'], rating: 4.9 },
        { id: 2, name: 'Sarah Miller', firm: 'Miller Home Inspections', address: '2200 Chemin d\'Aylmer, Gatineau, QC', phone: '+1 819-555-8802', email: 'sarah@millerhome.ca', languages: ['EN', 'FR'], rating: 4.7 },
        { id: 3, name: 'Lu Wei Ying', firm: 'SafeHome Inspections', address: '777 Rue Saint-Jacques, Montréal, QC', phone: '+1 514-555-8803', email: 'lu@safehome.ca', languages: ['ZH', 'EN'], rating: 4.8 },
        { id: 4, name: 'Jacques Villeneuve', firm: 'Villeneuve Inspections Inc.', address: '123 Boul. Laurier, Québec, QC', phone: '+1 418-555-8804', email: 'jacques@inspectionsquebec.ca', languages: ['FR'], rating: 4.9 },
        { id: 5, name: 'Emily Clark', firm: 'Clark Heritage Inspections', address: '550 Rue Sherbrooke O, Montréal, QC', phone: '+1 514-555-8805', email: 'emily@clarkheritage.ca', languages: ['EN'], rating: 4.6 },
    ];


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
                // Initialize favorite state from property data
                setIsFavorite(response.data.isFavorite || false);
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
    }, [id, user?.id]);

    // Increment view count when property is loaded
    useEffect(() => {
        const incrementView = async () => {
            if (property && property.id) {
                try {
                    await propertyApi.incrementViewCount(property.id);
                    // Update local view count
                    setProperty(prev => prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : null);
                } catch (error) {
                    console.error('Failed to increment view count:', error);
                }
            }
        };
        incrementView();
    }, [property?.id]);

    const formattedPrice = property ? new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(property.price).replace('$', '').trim() + ' $' : '';

    const listingTypeLabel = property?.listingType === 'FOR_SALE'
        ? t('detail.for_sale')
        : t('detail.for_rent');

    const handleToggleFavorite = async () => {
        if (!property || !isAuthenticated) return;

        try {
            const response = await api.post(`/properties/${user?.id}/${property.id}/favorite`);
            setProperty(response.data);
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

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
                    <Link to="/" className="text-blue-600 font-bold hover:underline">{t('detail.back_previous')}</Link>
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
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">#{property.id}</span>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {property.title}
                            </h1>

                        </div>
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
                            <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all">
                                <Share2 size={16} className="text-slate-500" />
                            </button>
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        setShowLoginPopup(true);
                                    } else {
                                        handleToggleFavorite();
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isFavorite ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-200'}`}
                            >
                                <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} className={isFavorite ? 'text-red-500' : 'text-slate-500'} />
                                {/* <span className={`text-sm font-bold ${isFavorite ? 'text-red-500' : 'text-slate-600'}`}> */}
                                {/* {property.favoriteCount || 0} */}
                                {/* </span> */}
                            </button>
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

                                {property.type === 'COMMERCIAL' ? (
                                    // Commercial Property - Show only business type and description
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                                            <h3 className="text-sm font-black text-slate-900 mb-4">{t('detail.commercial_info')}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.commercial_type')}</div>
                                                    <div className="text-sm font-bold text-slate-700">{t(`home.type_${property.type.toLowerCase()}`)}</div>
                                                </div> */}
                                                {property.businessType && (
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.business_type')}</div>
                                                        <div className="text-sm font-bold text-slate-700">{t(`detail.business_type_${property.businessType.toLowerCase()}`)}</div>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.area')}</div>
                                                    <div className="text-sm font-bold text-slate-700">{property.squareFootage || '—'} pc</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                                            <h3 className="text-sm font-black text-slate-900 mb-4">{t('detail.commercial_description')}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                {property.description}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Residential Property - Show full details
                                    <>
                                        {/* Quick Stats Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                                    <HomeIcon size={18} className="text-slate-500" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.house_type')}</div>
                                                    <div className="text-sm font-bold text-slate-900">{t(`home.type_${property.type.toLowerCase()}`)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                                    <Home size={18} className="text-slate-500" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.rooms')}</div>
                                                    <div className="text-sm font-bold text-slate-900">{property.rooms || property.bedrooms || '—'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                                    <Calendar size={18} className="text-slate-500" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('detail.year_built')}</div>
                                                    <div className="text-sm font-bold text-slate-900">{property.yearBuilt || '—'}</div>
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
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.bedrooms')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.bedrooms}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.bathrooms')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.bathrooms}</div>
                                            </div>
                                            {/* <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.year_built')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.yearBuilt || '—'}</div>
                                            </div> */}
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.terrace')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.hasTerrace ? '✓' : '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.pool')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.hasPool ? '✓' : '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.yard')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.hasYard ? '✓' : '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.indoor_parking')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.indoorParking || '0'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.outdoor_parking')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.outdoorParking || '0'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.stove')}</div>
                                                <div className="text-sm font-bold text-slate-700">{property.hasStove ? '✓' : '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.fireplace')}</div>
                                                <div className="text-sm font-bold text-slate-700">—</div>
                                            </div>
                                            {/* Investment-related fields - only show for FOR_SALE listings */}
                                            {property.listingType === 'FOR_SALE' && (
                                                <>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.annual_revenue')}</div>
                                                        <div className="text-sm font-bold text-slate-700">
                                                            {property.annualRevenue ? new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(property.annualRevenue).replace('$', '').trim() + ' $' : '—'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.annual_expenses')}</div>
                                                        <div className="text-sm font-bold text-slate-700">
                                                            {property.annualExpenses ? new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(property.annualExpenses).replace('$', '').trim() + ' $' : '—'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.cap_rate')}</div>
                                                        <div className="text-sm font-bold text-slate-700">
                                                            {property.capRate ? property.capRate.toFixed(2) + '%' : '—'}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('detail.days_listed')}</div>
                                                <div className="text-sm font-bold text-slate-700">
                                                    {property.publishDate
                                                        ? Math.max(0, Math.floor((new Date().getTime() - new Date(property.publishDate).getTime()) / (1000 * 60 * 60 * 24)))
                                                        : '—'}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{t('properties.move_in_date')}</div>
                                                <div className="text-sm font-bold text-slate-700">
                                                    {property.moveInDate ? new Date(property.moveInDate).toLocaleDateString() : '-'}
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}

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

                                {/* Tools Section */}
                                <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">{t('detail.tools_title')}</h2>
                                {isAuthenticated && user?.planType !== 'FREE' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        {/* Download Purchase Offer */}
                                        <Link
                                            to={`/properties/${property.id}/purchase-offer`}
                                            className="group bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <Download size={22} className="text-blue-600" />
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 mb-1">{t('detail.tools_download_offer')}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">{t('detail.tools_download_offer_desc')}</p>
                                        </Link>

                                        {/* Mortgage Calculator */}
                                        <button
                                            onClick={() => {
                                                setMortgagePrice(property.price || 0);
                                                setDownPaymentPercent(0);
                                                setDownPaymentDollar(0);
                                                setDownPaymentMode('percent');
                                                setInterestRate('');
                                                setAmortization('');
                                                setPaymentFrequency('monthly');
                                                setPaymentResult(null);
                                                setShowMortgageModal(true);
                                            }}
                                            className="group bg-white border-2 border-slate-100 rounded-2xl p-6 text-left hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                                <Calculator size={22} className="text-emerald-600" />
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 mb-1">{t('detail.tools_mortgage')}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">{t('detail.tools_mortgage_desc')}</p>
                                        </button>

                                        {/* Schedule Notary */}
                                        <button
                                            onClick={() => {
                                                setNotaryForm({ date: '', time: '', name: '', phone: '', email: '', notes: '' });
                                                setNotarySuccess(false);
                                                setSelectedNotary(null);
                                                setShowNotaryModal(true);
                                            }}
                                            className="group bg-white border-2 border-slate-100 rounded-2xl p-6 text-left hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                                <CalendarClock size={22} className="text-purple-600" />
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 mb-1">{t('detail.tools_notary')}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">{t('detail.tools_notary_desc')}</p>
                                        </button>

                                        {/* Schedule Home Inspector */}
                                        <button
                                            onClick={() => {
                                                setInspectorForm({ date: '', time: '', name: '', phone: '', email: '', notes: '' });
                                                setInspectorSuccess(false);
                                                setSelectedInspector(null);
                                                setShowInspectorModal(true);
                                            }}
                                            className="group bg-white border-2 border-slate-100 rounded-2xl p-6 text-left hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <ShieldCheck size={22} className="text-blue-600" />
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 mb-1">{t('detail.tools_inspector')}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">{t('detail.tools_inspector_desc')}</p>
                                        </button>

                                        {/* Buyer Agent */}
                                        <button
                                            onClick={() => setActiveGlobalModal('buyerAgent')}
                                            className="group bg-white border-2 border-slate-100 rounded-2xl p-6 text-left hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                                <User size={22} className="text-emerald-600" />
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 mb-1">{t('nav.book_buyer_agent')}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">{t('detail.tools_buyer_agent_desc', 'Connect with a trusted expert.')}</p>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 mb-8 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                                            <Lock size={24} className="text-slate-400" />
                                        </div>
                                        <h3 className="font-black text-base text-slate-900 mb-2">{t('detail.tools_locked_title')}</h3>
                                        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">{t('detail.tools_locked_message')}</p>
                                        <Link
                                            to={isAuthenticated ? '/membership' : '/register'}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                                        >
                                            {t('detail.tools_upgrade')}
                                        </Link>
                                    </div>
                                )}
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

            {/* Login Popup for Favorites */}
            <AnimatePresence>
                {showLoginPopup && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400]"
                            onClick={() => setShowLoginPopup(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[401] p-8"
                        >
                            {/* Modal Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                    {t('detail.favorites_login_title')}
                                </h2>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {t('detail.favorites_login_message')}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/register"
                                    onClick={() => setShowLoginPopup(false)}
                                    className="w-full py-4 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 text-center"
                                >
                                    {t('detail.sign_up')}
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setShowLoginPopup(false)}
                                    className="w-full py-4 border-2 border-[#1a1a6d] text-[#1a1a6d] rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all text-center"
                                >
                                    {t('detail.log_in')}
                                </Link>
                                <button
                                    onClick={() => setShowLoginPopup(false)}
                                    className="w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-medium transition-all"
                                >
                                    {t('detail.cancel')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mortgage Calculator Modal */}
            <AnimatePresence>
                {showMortgageModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                            onClick={() => setShowMortgageModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('detail.mortgage_title')}</h2>
                                    <button
                                        onClick={() => setShowMortgageModal(false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                    >
                                        <X size={16} className="text-slate-500" />
                                    </button>
                                </div>

                                {/* Price of property */}
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_price')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={mortgagePrice}
                                            onChange={(e) => setMortgagePrice(Number(e.target.value))}
                                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    </div>
                                </div>

                                {/* Down payment */}
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_down_payment')}</label>
                                    <div className="flex gap-2">
                                        <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden">
                                            <button
                                                onClick={() => setDownPaymentMode('dollar')}
                                                className={`px-3 py-2 text-xs font-black transition-colors ${downPaymentMode === 'dollar' ? 'bg-[#1a1a6d] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                            >$</button>
                                            <button
                                                onClick={() => setDownPaymentMode('percent')}
                                                className={`px-3 py-2 text-xs font-black transition-colors ${downPaymentMode === 'percent' ? 'bg-[#1a1a6d] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                            >%</button>
                                        </div>
                                        {downPaymentMode === 'dollar' ? (
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    value={downPaymentDollar}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setDownPaymentDollar(val);
                                                        if (mortgagePrice > 0) setDownPaymentPercent(Math.round((val / mortgagePrice) * 100 * 100) / 100);
                                                    }}
                                                    className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                            </div>
                                        ) : (
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    value={downPaymentPercent}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setDownPaymentPercent(val);
                                                        setDownPaymentDollar(Math.round(mortgagePrice * val / 100));
                                                    }}
                                                    className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mortgage amount */}
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_amount')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={new Intl.NumberFormat('en-CA').format(Math.max(0, mortgagePrice - (downPaymentMode === 'dollar' ? downPaymentDollar : Math.round(mortgagePrice * downPaymentPercent / 100))))}
                                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    </div>
                                </div>

                                {/* Interest rate + Amortization */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_interest_rate')}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(e.target.value)}
                                                className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">{t('detail.mortgage_required')}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_amortization')}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amortization}
                                                onChange={(e) => setAmortization(e.target.value)}
                                                className="w-full px-4 py-3 pr-10 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{t('detail.mortgage_years')}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">{t('detail.mortgage_required')}</p>
                                    </div>
                                </div>

                                {/* Payment frequency */}
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_frequency')}</label>
                                    <select
                                        value={paymentFrequency}
                                        onChange={(e) => setPaymentFrequency(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1a1a6d] transition-colors bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="monthly">{t('detail.mortgage_freq_monthly')}</option>
                                        <option value="bimonthly">{t('detail.mortgage_freq_bimonthly')}</option>
                                        <option value="biweekly">{t('detail.mortgage_freq_biweekly')}</option>
                                        <option value="weekly">{t('detail.mortgage_freq_weekly')}</option>
                                    </select>
                                </div>

                                {/* Calculate button */}
                                <button
                                    onClick={() => {
                                        const rate = parseFloat(interestRate);
                                        const years = parseInt(amortization);
                                        if (!rate || !years || rate <= 0 || years <= 0) return;
                                        const dp = downPaymentMode === 'dollar' ? downPaymentDollar : Math.round(mortgagePrice * downPaymentPercent / 100);
                                        const principal = Math.max(0, mortgagePrice - dp);
                                        const freqMap: Record<string, number> = { monthly: 12, bimonthly: 24, biweekly: 26, weekly: 52 };
                                        const periodsPerYear = freqMap[paymentFrequency] || 12;
                                        const r = rate / 100 / periodsPerYear;
                                        const n = years * periodsPerYear;
                                        if (r === 0) {
                                            setPaymentResult(Math.round(principal / n * 100) / 100);
                                        } else {
                                            const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                                            setPaymentResult(Math.round(payment * 100) / 100);
                                        }
                                    }}
                                    className="w-full py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 mb-4"
                                >
                                    {t('detail.mortgage_calculate')}
                                </button>

                                {/* Payment result */}
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.mortgage_payment_amount')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={paymentResult !== null ? new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paymentResult) : ''}
                                            className="w-full px-4 py-3 pr-8 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    </div>
                                </div>

                                {/* Chart button */}
                                <button className="w-full py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all">
                                    {t('detail.mortgage_chart')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Notary Appointment Modal */}
            <AnimatePresence>
                {showNotaryModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                            onClick={() => setShowNotaryModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedNotary && !notarySuccess && (
                                        <button
                                            onClick={() => setSelectedNotary(null)}
                                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                        >
                                            <ChevronLeft size={16} className="text-slate-500" />
                                        </button>
                                    )}
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                        {notarySuccess ? t('detail.notary_title') : selectedNotary ? t('detail.notary_title') : t('detail.notary_select_title')}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowNotaryModal(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                >
                                    <X size={16} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {notarySuccess ? (
                                    <div className="text-center py-6">
                                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
                                            <CalendarClock size={28} className="text-emerald-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">{t('detail.notary_success')}</p>
                                        <button
                                            onClick={() => setShowNotaryModal(false)}
                                            className="mt-6 px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all"
                                        >
                                            OK
                                        </button>
                                    </div>
                                ) : !selectedNotary ? (
                                    /* Step 1: Notary Selection List */
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-400 mb-4">{t('detail.notary_select_desc')}</p>
                                        {notaries.map((notary) => (
                                            <button
                                                key={notary.id}
                                                onClick={() => setSelectedNotary(notary)}
                                                className="w-full text-left p-4 border-2 border-slate-100 rounded-2xl hover:border-purple-200 hover:shadow-md hover:shadow-purple-50 transition-all group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                                                        <span className="text-purple-600 font-black text-sm">{notary.name.split(' ').pop()?.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-black text-sm text-slate-900 truncate">{notary.name}</h4>
                                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                <span className="text-amber-400 text-xs">★</span>
                                                                <span className="text-xs font-bold text-slate-600">{notary.rating}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium">{notary.firm}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <MapPin size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400 truncate">{notary.address}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Phone size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400">{notary.phone}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Mail size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400 truncate">{notary.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            {notary.languages.map((lang) => (
                                                                <span key={lang} className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase">{lang}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    /* Step 2: Schedule Form with selected notary */
                                    <div>
                                        {/* Selected Notary Info */}
                                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                                                    <span className="text-purple-600 font-black text-sm">{selectedNotary.name.split(' ').pop()?.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm text-slate-900">{selectedNotary.name}</h4>
                                                    <p className="text-xs text-slate-500">{selectedNotary.firm}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={(e) => { e.preventDefault(); setNotarySuccess(true); }} className="space-y-4">
                                            {/* Date & Time */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_date')}</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={notaryForm.date}
                                                        onChange={(e) => setNotaryForm(prev => ({ ...prev, date: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_time')}</label>
                                                    <input
                                                        type="time"
                                                        required
                                                        value={notaryForm.time}
                                                        onChange={(e) => setNotaryForm(prev => ({ ...prev, time: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_your_name')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={notaryForm.name}
                                                    onChange={(e) => setNotaryForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                />
                                            </div>

                                            {/* Phone & Email */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_phone')}</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={notaryForm.phone}
                                                        onChange={(e) => setNotaryForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_email')}</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={notaryForm.email}
                                                        onChange={(e) => setNotaryForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.notary_notes')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={notaryForm.notes}
                                                    onChange={(e) => setNotaryForm(prev => ({ ...prev, notes: e.target.value }))}
                                                    placeholder={t('detail.notary_notes_placeholder')}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1a1a6d] transition-colors resize-none"
                                                />
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedNotary(null)}
                                                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
                                                >
                                                    {t('detail.cancel')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-3 bg-[#1a1a6d] text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                                >
                                                    <CalendarClock size={14} />
                                                    {t('detail.notary_submit')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Home Inspector Appointment Modal */}
            <AnimatePresence>
                {showInspectorModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                            onClick={() => setShowInspectorModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[201] max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedInspector && !inspectorSuccess && (
                                        <button
                                            onClick={() => setSelectedInspector(null)}
                                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                        >
                                            <ChevronLeft size={16} className="text-slate-500" />
                                        </button>
                                    )}
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                        {inspectorSuccess ? t('detail.inspector_title') : selectedInspector ? t('detail.inspector_title') : t('detail.inspector_select_title')}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowInspectorModal(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                                >
                                    <X size={16} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {inspectorSuccess ? (
                                    <div className="text-center py-6">
                                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck size={28} className="text-emerald-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">{t('detail.inspector_success')}</p>
                                        <button
                                            onClick={() => setShowInspectorModal(false)}
                                            className="mt-6 px-6 py-3 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all"
                                        >
                                            OK
                                        </button>
                                    </div>
                                ) : !selectedInspector ? (
                                    /* Step 1: Inspector Selection List */
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-400 mb-4">{t('detail.inspector_select_desc')}</p>
                                        {inspectors.map((inspector) => (
                                            <button
                                                key={inspector.id}
                                                onClick={() => setSelectedInspector(inspector)}
                                                className="w-full text-left p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                        <ShieldCheck size={20} className="text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-black text-sm text-slate-900 truncate">{inspector.name}</h4>
                                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                <span className="text-amber-400 text-xs">★</span>
                                                                <span className="text-xs font-bold text-slate-600">{inspector.rating}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium">{inspector.firm}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <MapPin size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400 truncate">{inspector.address}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Phone size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400">{inspector.phone}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Mail size={10} className="text-slate-400" />
                                                            <p className="text-[10px] text-slate-400 truncate">{inspector.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            {inspector.languages.map((lang) => (
                                                                <span key={lang} className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase">{lang}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    /* Step 2: Schedule Form with selected inspector */
                                    <div>
                                        {/* Selected Inspector Info */}
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                                                    <ShieldCheck size={18} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm text-slate-900">{selectedInspector.name}</h4>
                                                    <p className="text-xs text-slate-500">{selectedInspector.firm}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={(e) => { e.preventDefault(); setInspectorSuccess(true); }} className="space-y-4">
                                            {/* Date & Time */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_date')}</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={inspectorForm.date}
                                                        onChange={(e) => setInspectorForm(prev => ({ ...prev, date: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_time')}</label>
                                                    <input
                                                        type="time"
                                                        required
                                                        value={inspectorForm.time}
                                                        onChange={(e) => setInspectorForm(prev => ({ ...prev, time: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_name')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={inspectorForm.name}
                                                    onChange={(e) => setInspectorForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                />
                                            </div>

                                            {/* Phone & Email */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_phone')}</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={inspectorForm.phone}
                                                        onChange={(e) => setInspectorForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_email')}</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={inspectorForm.email}
                                                        onChange={(e) => setInspectorForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1a1a6d] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">{t('detail.inspector_notes')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={inspectorForm.notes}
                                                    onChange={(e) => setInspectorForm(prev => ({ ...prev, notes: e.target.value }))}
                                                    placeholder={t('detail.inspector_notes_placeholder')}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1a1a6d] transition-colors resize-none"
                                                />
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedInspector(null)}
                                                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all"
                                                >
                                                    {t('detail.cancel')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-3 bg-[#1a1a6d] text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                                >
                                                    <CalendarClock size={14} />
                                                    {t('detail.inspector_submit')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
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

            <ToolsModals
                activeModal={activeGlobalModal}
                onClose={() => setActiveGlobalModal(null)}
            />
        </div >
    );
};

export default PropertyDetail;
