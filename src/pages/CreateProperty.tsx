import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Upload, Info, MapPin, Home as HomeIcon, Image as ImageIcon, Phone, CheckCircle, X, AlertCircle, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


const CreateProperty: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        propertyType: '',
        transactionType: '',
        description: '',
        address: '',
        streetNumber: '',
        streetName: '',
        hideStreetNumber: false,
        price: '',
        squareFootage: '',
        units: '',
        bedrooms: '',
        bathrooms: '',
        annualTax: '',
        monthlyRent: '',
        area: '',
        yearBuilt: '', // Added
        rooms: '', // Added
        moveInDate: '', // Added
        hasTerrace: false, // Added
        hasPool: false, // Added
        hasYard: false, // Added
        indoorParking: '0',
        outdoorParking: '0',
        hasStove: false,
        annualRevenue: '', // Added
        annualExpenses: '', // 
        businessType: '',
        contactName: user
            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
            : '',
        phone: user?.phoneNumber || '',
        email: user?.email || '',
        showContactInfo: true
    });
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    // const [activeListingsCount, setActiveListingsCount] = useState(0);
    const [validation, setValidation] = useState<{ listingsOk: boolean; imagesOk: boolean; currentListings: number; maxListings: number; imageCount: number; maxImages: number } | null>(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState<'listings' | 'images' | null>(null);


    useEffect(() => {
        console.log("setFormData")
        if (user) {
            setFormData(prev => ({
                ...prev,
                contactName: prev.contactName || user.email.split('@')[0],
                email: prev.email || user.email,
                phone: prev.phone || user.phoneNumber
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user?.id && formData.transactionType !== '') {
            validateLimits();
        }
    }, [user?.id, formData.transactionType, selectedImages.length]);

    useEffect(() => {
        if (validation && !validation.listingsOk) {
            setUpgradeReason('listings');
            setShowUpgradeModal(true);
        }
    }, [validation]);

    const validateLimits = async () => {
        if (!user || !user.id) return;
        try {
            const listingType = formData.transactionType === 'rent' ? 'FOR_RENT' : 'FOR_SALE';
            const response = await api.get(`/properties/user/${user.id}/validate-limits`, {
                params: {
                    listingType: listingType,
                    imageCount: selectedImages.length
                }
            });
            setValidation(response.data);
            // setActiveListingsCount(response?.data?.currentListings);
        } catch (error) {
            console.error('Error validating limits:', error);
        }
    };


    // const [hasShownUpgradeModal, setHasShownUpgradeModal] = useState(false);

    // // Auto-show upgrade modal when transaction type changes and limit is exceeded
    // useEffect(() => {
    //     console.log(showUpgradeModal)
    //     console.log("listsOK:" + validation?.listingsOk)

    //     if (validation && !validation.listingsOk) {
    //         setShowUpgradeModal(true);
    //     }
    // }, [formData.transactionType]);

    // Plan limits configuration
    interface PlanLimit {
        maxRental: number;
        maxSale: number;
        maxImages: number;
    }

    const planLimits: Record<string, PlanLimit> = {
        FREE: { maxRental: 2, maxSale: 1, maxImages: 2 },
        BASIC: { maxRental: 3, maxSale: 2, maxImages: 5 },
        PLUS: { maxRental: 6, maxSale: 4, maxImages: 10 },
        PRO: { maxRental: 12, maxSale: 10, maxImages: 10 }
    };

    const getCurrentPlanLimits = (): PlanLimit | null => {
        if (!user || !user.planType) return null;
        console.log("getCurrentPlanLimits" + user.planType)
        return planLimits[user.planType as keyof typeof planLimits] || null;
    };

    // const getListingTypeLimit = () => {
    //     const limits = getCurrentPlanLimits();
    //     if (!limits) return 0;
    //     return formData.transactionType === 'rent' ? limits.maxRental : limits.maxSale;
    // };

    const getImageLimit = () => {
        const limits = getCurrentPlanLimits();
        return limits ? limits.maxImages : 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxImages = getImageLimit();
            const totalImages = selectedImages.length + files.length;

            console.log("handleImageChange" + totalImages + ", " + maxImages)
            if (totalImages > maxImages) {
                setUpgradeReason('images');
                setShowUpgradeModal(true);
                return
            }

            setSelectedImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formDataToSubmit = new FormData();

            const propertyData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                address: formData.address,
                area: formData.area,
                rooms: parseInt(formData.rooms) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                yearBuilt: parseInt(formData.yearBuilt) || 0,
                squareFootage: parseFloat(formData.squareFootage) || 0,
                hasTerrace: formData.hasTerrace,
                hasPool: formData.hasPool,
                hasYard: formData.hasYard,
                indoorParking: parseInt(formData.indoorParking) || 0,
                outdoorParking: parseInt(formData.outdoorParking) || 0,
                hasStove: formData.hasStove,
                annualRevenue: parseFloat(formData.annualRevenue) || (parseFloat(formData.monthlyRent) * 12) || 0,
                annualExpenses: parseFloat(formData.annualExpenses) || 0,
                moveInDate: formData.moveInDate || null,
                type: formData.propertyType,
                businessType: formData.businessType || null,
                listingType: formData.transactionType === 'sale' ? 'FOR_SALE' : 'FOR_RENT',
                email: formData.email
            };

            formDataToSubmit.append('property', JSON.stringify(propertyData));

            selectedImages.forEach((file) => {
                formDataToSubmit.append('files', file);
            });

            await api.post('/properties', formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsSuccess(true);
        } catch (error: any) {
            console.error('Error creating property:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create property. Please check your inputs.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                    {t('create_property.success_title', 'Ad Created Successfully!')}
                </h1>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                    {t('create_property.success_pending', 'Your ad has been created and is now pending administrator approval. It will be visible to the public once approved.')}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        {t('nav.home', 'Back to Home')}
                    </button>
                </div>
            </div>
        );
    }


    // Upgrade Plan Modal
    const renderUpgradeModal = () => {
        console.log("renderUpgradeModal" + validation);
        if (!showUpgradeModal) return null;

        // const listingType = formData.transactionType === 'rent' ? t('create_property.rentals', 'rentals') : t('create_property.sales', 'properties for sale');

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                    <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <X size={24} />
                    </button>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertCircle size={22} className="text-red-600" />
                            <h1 className="font-semibold text-red-900 text-xl">
                                {t('create_property.limit_reached_title', "You've reached your limit")}
                            </h1>
                        </div>

                        {/* ✅ Show different message based on reason */}
                        {upgradeReason === 'listings' && validation && (
                            <p className="text-slate-600 text-center">
                                {t('create_property.current_plan')} <span className="font-bold">{t(`create_property.plan_${user?.planType.toLowerCase()}`)}</span>,
                                <br />
                                {t('create_property.limit_count')}: <span className="font-bold">{validation.maxListings} ({validation.currentListings} {t('create_property.published')})</span>
                                <br />
                                <span className="font-bold">{t('create_property.please_upgrade')}</span>
                            </p>
                        )}

                        {upgradeReason === 'images' && (
                            <p className="text-slate-600 text-center">
                                {t('create_property.current_plan')} <span className="font-bold">{t(`create_property.plan_${user?.planType.toLowerCase()}`)}</span>,
                                <br />
                                {t('create_property.max_images_per_listing')}: <span className="font-bold">{getImageLimit()} ({selectedImages.length} {t('create_property.selected')})</span>
                                <br />
                                <span className="font-bold">{t('create_property.please_upgrade')}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/membership')}
                            className="w-full px-6 py-3 bg-[#1a56db] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Crown size={20} />
                            {t('create_property.upgrade_plans', 'Upgrade Plans')}
                        </button>
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            {t('create_property.close', 'Close')}
                        </button>
                    </div>
                </div>
            </div >
        );
    };

    return (
        <>  {/*Fragment wraps everything */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">{t('create_property.title')}</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">{t('create_property.error_title', 'Error')}</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Info size={20} />
                            <h2 className="text-lg font-semibold">{t('create_property.basic_info')}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.ad_title')}</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder={t('create_property.ad_title_placeholder')}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.property_type')}</label>
                                    <select
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        required
                                    >
                                        <option value="">{t('create_property.select_type')}</option>
                                        <option value="HOUSE">{t('home.type_house')}</option>
                                        <option value="CONDO">{t('home.type_condo')}</option>
                                        <option value="PLEX">{t('home.type_plex')}</option>
                                        <option value="COMMERCIAL">{t('home.type_commercial')}</option>
                                    </select>
                                </div>
                                {formData.propertyType === 'COMMERCIAL' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.business_type')}</label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        >
                                            <option value="">{t('create_property.select_business_type', 'Select business type')}</option>
                                            <option value="RESTAURANT">{t('create_property.business_type_restaurant', 'Restaurant')}</option>
                                            <option value="STORE">{t('create_property.business_type_store', 'Store')}</option>
                                            <option value="OFFICE">{t('create_property.business_type_office', 'Office')}</option>
                                            <option value="RETAIL">{t('create_property.business_type_retail', 'Retail')}</option>
                                            <option value="INDUSTRIAL">{t('create_property.business_type_industrial', 'Industrial')}</option>
                                            <option value="MEDICAL">{t('create_property.business_type_medical', 'Medical')}</option>
                                            <option value="OTHER">{t('create_property.business_type_other', 'Other')}</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.transaction_type')}</label>
                                    <select
                                        name="transactionType"
                                        value={formData.transactionType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="">{t('create_property.select_type')}</option>
                                        <option value="sale">{t('create_property.for_sale')}</option>
                                        <option value="rent">{t('create_property.for_rent')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.description')}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder={t('create_property.description_placeholder')}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <MapPin size={20} />
                            <h2 className="text-lg font-semibold">{t('create_property.location')}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.address')}</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder={t('create_property.address_placeholder')}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.region', 'Region')}</label>
                                <select
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="">{t('home.all_areas', 'All Areas')}</option>
                                    <option value="Montreal Region">{t('home.area_montreal', 'Montreal')}</option>
                                    <option value="Quebec City Region">{t('home.area_quebec', 'Quebec City')}</option>
                                    <option value="Sherbrooke Region">{t('home.area_sherbrooke', 'Sherbrooke')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <HomeIcon size={20} />
                            <h2 className="text-lg font-semibold">{t('create_property.property_details')}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.price')}</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.square_footage')}</label>
                                <input
                                    type="number"
                                    name="squareFootage"
                                    value={formData.squareFootage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.units')}</label>
                                <input
                                    type="number"
                                    name="units"
                                    value={formData.units}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.bedrooms')}</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.bathrooms')}</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.year_built')}</label>
                                    <input
                                        type="number"
                                        name="yearBuilt"
                                        value={formData.yearBuilt}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.move_in_date')}</label>
                                    <input
                                        type="date"
                                        name="moveInDate"
                                        value={formData.moveInDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasTerrace"
                                        checked={formData.hasTerrace}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">{t('create_property.has_terrace')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasPool"
                                        checked={formData.hasPool}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">{t('create_property.has_pool')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasYard"
                                        checked={formData.hasYard}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">{t('create_property.has_yard')}</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasStove"
                                        checked={formData.hasStove}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">{t('create_property.has_stove')}</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.indoor_parking')}</label>
                                    <input
                                        type="number"
                                        name="indoorParking"
                                        value={formData.indoorParking}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.outdoor_parking')}</label>
                                    <input
                                        type="number"
                                        name="outdoorParking"
                                        value={formData.outdoorParking}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.annual_revenue')}</label>
                                    <input
                                        type="number"
                                        name="annualRevenue"
                                        value={formData.annualRevenue}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.annual_expenses')}</label>
                                    <input
                                        type="number"
                                        name="annualExpenses"
                                        value={formData.annualExpenses}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-slate-800">
                            <ImageIcon size={20} />
                            <h2 className="text-lg font-semibold">{t('create_property.images')}</h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{t('create_property.images_desc')} {getImageLimit()}</p>

                        {/* Image limit indicator */}
                        {/* {getCurrentPlanLimits() && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>{t('create_property.max_images', 'Maximum images')}:</strong> {getImageLimit()}
                                    <span className="ml-2 text-blue-600">
                                        ({selectedImages.length} / {getImageLimit()} {t('create_property.selected', 'selected')})
                                    </span>
                                </p>
                            </div>
                        )} */}

                        <div className="space-y-4">
                            <div
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer"
                            >
                                <Upload size={32} className="mb-3 text-slate-400" />
                                <span className="text-sm font-medium">{t('create_property.click_to_upload')}</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Phone size={20} />
                            <h2 className="text-lg font-semibold">{t('create_property.contact_info')}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.contact_name')}</label>
                                <input
                                    type="text"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.phone')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <input
                            type="checkbox"
                            id="showContactInfo"
                            name="showContactInfo"
                            checked={formData.showContactInfo}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-slate-900"
                        /> */}
                            <label htmlFor="showContactInfo" className="text-sm text-slate-700 font-medium">
                                {t('create_property.show_contact')}
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            {t('create_property.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (validation !== null && (!validation.listingsOk || !validation.imagesOk))}
                            className="px-6 py-2.5 bg-[#1a56db] text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            title={validation && !validation.listingsOk ? "Listing limit exceeded" :
                                validation && !validation.imagesOk ? "Image limit exceeded" : ""}
                        >
                            {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                            {t('create_property.submit')}
                        </button>

                    </div>
                </form>
            </div>

            {renderUpgradeModal()}
        </>
    );
};

export default CreateProperty;
