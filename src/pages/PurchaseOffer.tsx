import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Printer, Globe } from 'lucide-react';
import api from '../services/api';
import { purchaseOfferTranslations } from './PurchaseOfferTranslations';

const PurchaseOffer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const formRef = useRef<HTMLDivElement>(null);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const initialLang = ['en', 'fr', 'zh'].includes(i18n.language.split('-')[0]) ? i18n.language.split('-')[0] : 'en';
    const [docLang, setDocLang] = useState<'en' | 'fr' | 'zh'>(initialLang as any);
    const d = purchaseOfferTranslations[docLang];

    useEffect(() => {
        if (!id) {
            setProperty({
                price: 0,
                address: '',
                area: '',
                province: '',
                postalCode: '',
                type: '',
                bedrooms: 0,
                bathrooms: 0,
                user: { firstName: '', lastName: '', phoneNumber: '' }
            });
            setLoading(false);
            return;
        }

        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/public/${id}`);
                setProperty(response.data);
            } catch (error) {
                console.error('Failed to fetch property', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const formattedPrice = property && property.price > 0 ? new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(property.price).replace('$', '').trim() + ' $' : '';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">{t('detail.not_found')}</h2>
                    <Link to="/" className="text-blue-600 font-bold hover:underline">{t('detail.back_previous')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Action Bar - hidden when printing */}
            <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        to={id ? `/properties/${id}` : "/"}
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {t('detail.back_previous')}
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200 focus-within:ring-2 ring-blue-500/20 transition-all">
                            <Globe size={14} className="text-slate-400 ml-2" />
                            <select
                                value={docLang}
                                onChange={(e) => setDocLang(e.target.value as any)}
                                className="bg-transparent text-slate-700 text-sm font-bold pl-2 pr-4 py-1.5 outline-none cursor-pointer appearance-none"
                            >
                                <option value="en">English (EN)</option>
                                <option value="fr">Français (FR)</option>
                                <option value="zh">中文 (ZH)</option>
                            </select>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a6d] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Printer size={14} />
                            {t('detail.tools_download_offer')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Printable Form */}
            <div ref={formRef} className="max-w-[900px] mx-auto px-6 py-8 print:px-12 print:py-6 print:max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:rounded-none">
                    {/* Form Header */}
                    <div className="border-b-2 border-[#1a1a6d] p-8 print:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-[#1a1a6d] tracking-tight mb-1">
                                    {d.title}
                                </h1>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{d.companyCode}</div>
                                <div className="text-xs text-slate-400">{d.fsboInfo}</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg print:rounded-none">
                            <p className="text-[10px] text-amber-700 leading-relaxed">
                                <strong>{d.importantTitle}</strong> {d.importantDesc}
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Parties */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec1Title}</h3>

                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">{d.buyerTitle}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.lastName}</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.firstName}</span>
                                        <div className="h-5"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1 col-span-2">
                                        <span className="text-[10px] text-slate-400">{d.address}</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.phone}</span>
                                        <div className="h-5"></div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1 mt-3">
                                    <span className="text-[10px] text-slate-400">{d.email}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <label className="text-xs font-bold text-slate-600 block mb-1">{d.sellerTitle}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.lastName}</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user ? property.user.lastName : ''}</div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.firstName}</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user ? property.user.firstName : ''}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1 col-span-2">
                                        <span className="text-[10px] text-slate-400">{d.address}</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">{d.phone}</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user?.phoneNumber || ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Property Description */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec2Title}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.civicAddress}</span>
                                <div className="text-sm text-slate-700 font-medium">{property.address}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.city}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.area || ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.province}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.province || 'Québec'}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.postalCode}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.postalCode || ''}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.propType}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.type}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.lotNumber}</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.cadastral}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.bedrooms}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.bedrooms > 0 ? property.bedrooms : ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.bathrooms}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.bathrooms > 0 ? property.bathrooms : ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.yearBuilt}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.yearBuilt || ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.areaSqft}</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.squareFootage || ''}</div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.maqcNo}</span>
                                <div className="text-sm text-slate-700 font-medium">{property.id ? `#${property.id}` : ''}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Price and Payment */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec3Title}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.listedPrice}</span>
                                    <div className="text-sm text-slate-700 font-bold">{formattedPrice}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.offeredPrice}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.amountWords}</span>
                                <div className="h-5"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.depositAmount}</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.depositHeld}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.balancePayable}</span>
                                <div className="h-5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Conditions */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec4Title}</h3>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>{d.condFinancingTitle}</strong> {d.condFinancingDesc}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>{d.condInspectionTitle}</strong> {d.condInspectionDesc}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>{d.condSaleTitle}</strong> {d.condSaleDesc}
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.condOther}</span>
                                <div className="h-16"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Deed of Sale */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec5Title}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.dateSigning}</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.dateOccupancy}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.notaryInfo}</span>
                                <div className="h-5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Inclusions/Exclusions */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec6Title}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.inclusions}</span>
                                <div className="h-16"></div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">{d.exclusions}</span>
                                <div className="h-10"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Declarations */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-4">{d.sec7Title}</h3>

                        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
                            <p>{d.decl1}</p>
                            <p>{d.decl2}</p>
                        </div>
                    </div>

                    {/* Section 8: Validity */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">{d.sec8Title}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                {d.irrevocableDesc}
                            </div>
                        </div>
                    </div>

                    {/* Section 9: Signatures */}
                    <div className="p-8 print:p-6">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-6">{d.sec9Title}</h3>

                        <div className="grid grid-cols-2 gap-12">
                            {/* Buyer Signature */}
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">{d.buyerRole}</div>
                                <div className="border-b-2 border-slate-300 pb-1 mt-8">
                                    <span className="text-[10px] text-slate-400">{d.signature}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.printedName}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>

                            {/* Seller Signature */}
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">{d.sellerRole}</div>
                                <div className="border-b-2 border-slate-300 pb-1 mt-8">
                                    <span className="text-[10px] text-slate-400">{d.signature}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.printedName}</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                        </div>

                        {/* Acceptance section */}
                        <div className="mt-8 pt-6 border-t-2 border-[#1a1a6d]/20">
                            <h4 className="text-xs font-black text-[#1a1a6d] uppercase tracking-wider mb-4">
                                {d.acceptTitle}
                            </h4>
                            <div className="text-xs text-slate-600 leading-relaxed mb-4">
                                {d.acceptDesc}
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0"></div>
                                <span className="text-xs text-slate-600">{d.iAccept}</span>
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0 ml-6"></div>
                                <span className="text-xs text-slate-600">{d.iRefuse}</span>
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0 ml-6"></div>
                                <span className="text-xs text-slate-600">{d.counterOffer}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="border-b-2 border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.sellerSig}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                    <div className="h-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-center print:bg-white">
                        <p className="text-[9px] text-slate-400">
                            {d.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOffer;
