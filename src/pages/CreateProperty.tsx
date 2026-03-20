import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Info, MapPin, Home as HomeIcon, Image as ImageIcon, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div>
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
                        <input
                            type="checkbox"
                            id="showContactInfo"
                            name="showContactInfo"
                            checked={formData.showContactInfo}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-slate-900"
                        />
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
                        className="px-6 py-2.5 bg-[#1a56db] text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                    >
                        {t('create_property.submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProperty;
