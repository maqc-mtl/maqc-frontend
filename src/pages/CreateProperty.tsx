import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Info, MapPin, Home as HomeIcon, Image as ImageIcon, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


const CreateProperty: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        propertyType: '',
        transactionType: 'sale',
        description: '',
        address: '',
        streetNumber: '',
        streetName: '',
        postalCode: '',
        hideStreetNumber: false,
        price: '',
        squareFootage: '',
        units: '',
        bedrooms: '',
        bathrooms: '',
        annualTax: '',
        monthlyRent: '',
        area: '',
        businessType: '',
        contactName: user
            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
            : '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || '',
        showContactInfo: true
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                contactName: prev.contactName || user.email.split('@')[0],
                email: prev.email || user.email,
                phone: prev.phoneNumber || user.phoneNumber
            }));
        }
    }, [user]);

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

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
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                address: formData.address,
                area: formData.area,
                postalCode: formData.postalCode,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                squareFootage: parseFloat(formData.squareFootage) || 0,
                type: formData.propertyType,
                businessType: formData.businessType || null,
                listingType: formData.transactionType === 'sale' ? 'FOR_SALE' : 'FOR_RENT',
                // images are mock for now as per project state
                imageUrls: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"]
            };

            await api.post('/properties', payload);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error creating property:', error);
            alert('Failed to create property. Please check your inputs.');
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


    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">{t('create_property.title')}</h1>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.property_type')}</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="HOUSE">House</option>
                                    <option value="CONDO">Condo</option>
                                    <option value="PLEX">Plex</option>
                                    <option value="COMMERCIAL">Commercial</option>
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
                                    <option value="sale">À vendre</option>
                                    <option value="rent">À louer</option>
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

                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.street_number')}</label>
                                <input
                                    type="text"
                                    name="streetNumber"
                                    value={formData.streetNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.street_name')}</label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={formData.streetName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.postal_code')}</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="H2X 1Y4"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.region')}</label>
                            <select
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">{t('home.all_areas')}</option>
                                <option value="Montreal Region">{t('home.area_montreal')}</option>
                                <option value="Quebec City Region">{t('home.area_quebec')}</option>
                                <option value="Sherbrooke Region">{t('home.area_sherbrooke')}</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="hideStreetNumber"
                                name="hideStreetNumber"
                                checked={formData.hideStreetNumber}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="hideStreetNumber" className="text-sm text-slate-700">
                                {t('create_property.hide_street_number')}
                            </label>
                        </div> */}
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <HomeIcon size={20} />
                        <h2 className="text-lg font-semibold">{t('create_property.property_details')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.annual_tax')}</label>
                            <input
                                type="number"
                                name="annualTax"
                                value={formData.annualTax}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('create_property.monthly_rent')}</label>
                            <input
                                type="number"
                                name="monthlyRent"
                                value={formData.monthlyRent}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-800">
                        <ImageIcon size={20} />
                        <h2 className="text-lg font-semibold">{t('create_property.images')}</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{t('create_property.images_desc')}</p>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload size={32} className="mb-3 text-slate-400" />
                        <span className="text-sm font-medium">{t('create_property.click_to_upload')}</span>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Phone size={20} />
                        <h2 className="text-lg font-semibold">{t('create_property.contact_info')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                                value={formData.phoneNumber}
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
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#1a56db] text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                        {t('create_property.submit')}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CreateProperty;
