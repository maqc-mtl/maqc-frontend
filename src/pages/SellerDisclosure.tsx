import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Printer, Globe } from 'lucide-react';
import api from '../services/api';
import { sellerDisclosureTranslations } from './SellerDisclosureTranslations';

const SellerDisclosure: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const formRef = useRef<HTMLDivElement>(null);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Set initial language to match i18n if supported, otherwise English
    const initialLang = ['en', 'fr', 'zh'].includes(i18n.language.split('-')[0]) ? i18n.language.split('-')[0] : 'en';
    const [docLang, setDocLang] = useState<'en' | 'fr' | 'zh'>(initialLang as any);
    const d = sellerDisclosureTranslations[docLang];

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
                yearBuilt: '',
                user: { firstName: '', lastName: '', phoneNumber: '', email: '' }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin"></div>
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

    const YesNoRadio = () => (
        <div className="flex gap-3">
            <label className="flex items-center gap-1"><input type="radio" className="w-3.5 h-3.5" /><span className="text-xs text-slate-500">{d.yes}</span></label>
            <label className="flex items-center gap-1"><input type="radio" className="w-3.5 h-3.5" /><span className="text-xs text-slate-500">{d.no}</span></label>
        </div>
    );

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
                        <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200 focus-within:ring-2 ring-emerald-500/20 transition-all">
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
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                        >
                            <Printer size={14} />
                            {t('nav.download_disclosure')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Printable Form */}
            <div ref={formRef} className="max-w-[900px] mx-auto px-6 py-8 print:px-12 print:py-6 print:max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:rounded-none">
                    {/* Form Header */}
                    <div className="border-b-2 border-emerald-800 p-8 print:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-xl font-black text-emerald-800 tracking-tight mb-1">
                                    {d.title}
                                </h1>
                                <h2 className="text-md font-bold text-slate-500 italic">
                                    {d.subtitle}
                                </h2>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                                <div className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 inline-block rounded font-bold">{d.fsboInfoSub}</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg print:rounded-none">
                            <p className="text-[10px] text-amber-900 leading-relaxed font-medium">
                                <strong>{d.importantTitle}</strong> {d.importantDesc}
                            </p>
                        </div>
                    </div>

                    {/* D1: Immovable */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD1}</h3>
                        <div className="border-b-2 border-dotted border-slate-300 pb-1 w-full">
                            <span className="text-[10px] text-slate-400">{d.civicAddress}</span>
                            <div className="text-sm text-slate-700 font-medium h-5">{property.address ? `${property.address}, ${property.area || ''}, ${property.province || 'QC'} ${property.postalCode || ''}` : ''}</div>
                        </div>
                    </div>

                    {/* D2: General Info */}
                    <div className="p-8 print:p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                        <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD2}</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-700 font-medium">{d.q_yearBuilt}</span>
                                <div className="w-24 border-b-2 border-dotted border-slate-400 h-6 text-sm text-center font-medium">{property.yearBuilt || ''}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-700 font-medium">{d.q_yearAcquired}</span>
                                <div className="w-24 border-b-2 border-dotted border-slate-400 h-6"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-700 font-medium">{d.q_livedIn}</span>
                                <YesNoRadio />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-700 font-medium">{d.q_rented}</span>
                                <YesNoRadio />
                            </div>
                        </div>
                    </div>

                    {/* Grid for D3 to D14 (2 columns) */}
                    <div className="grid grid-cols-2">
                        {/* Column 1 */}
                        <div className="border-r border-slate-200">
                            {/* D3 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD3}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_soil}</span><YesNoRadio /></div>
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_oilTank}</span><YesNoRadio /></div>
                                </div>
                            </div>

                            {/* D4 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD4}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_waterInfil}</span><YesNoRadio /></div>
                            </div>

                            {/* D5 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD5}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_foundType}</span><div className="w-24 border-b-2 border-dotted border-slate-400 h-6"></div></div>
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_foundCracks}</span><YesNoRadio /></div>
                                </div>
                            </div>

                            {/* D6 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD6}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_animals}</span><YesNoRadio /></div>
                            </div>

                            {/* D7 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD7}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_airCondens}</span><YesNoRadio /></div>
                            </div>

                            {/* D8 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD8}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_roofCover}</span><div className="w-24 border-b-2 border-dotted border-slate-400 h-6"></div></div>
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_roofLeak}</span><YesNoRadio /></div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div>
                            {/* D9 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD9}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_plumbProb}</span><YesNoRadio /></div>
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_waterSource}</span><YesNoRadio /></div>
                                    <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_sewer}</span><YesNoRadio /></div>
                                </div>
                            </div>

                            {/* D10 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD10}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_elec}</span><YesNoRadio /></div>
                            </div>

                            {/* D11 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD11}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_tele}</span><YesNoRadio /></div>
                            </div>

                            {/* D12 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD12}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_heatSource}</span><div className="w-24 border-b-2 border-dotted border-slate-400 h-6"></div></div>
                            </div>

                            {/* D13 */}
                            <div className="p-6 border-b border-slate-200">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD13}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_inspect}</span><YesNoRadio /></div>
                            </div>

                            {/* D14 */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50/50 print:bg-transparent">
                                <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD14}</h3>
                                <div className="flex items-center justify-between"><span className="text-xs text-slate-700">{d.q_other}</span><YesNoRadio /></div>
                            </div>
                        </div>
                    </div>

                    {/* D15: Explanations */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">{d.sysD15}</h3>
                        <p className="text-xs text-slate-600 mb-6 font-bold">{d.additionalNotes}</p>

                        <div className="space-y-8">
                            <div className="border-b-2 border-dotted border-slate-300 w-full h-1"></div>
                            <div className="border-b-2 border-dotted border-slate-300 w-full h-1"></div>
                            <div className="border-b-2 border-dotted border-slate-300 w-full h-1"></div>
                        </div>
                    </div>

                    {/* D16: Signatures */}
                    <div className="p-8 print:p-6">
                        <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-6">{d.sysD16}</h3>

                        <div className="mb-10">
                            <div className="text-xs text-slate-700 font-medium mb-8 bg-slate-50 p-4 border border-slate-200 rounded-lg print:border-none print:p-0 print:bg-transparent">
                                {d.sellerDecl}
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="border-b-2 border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.sellerSig}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.printedName}</span>
                                    <div className="text-sm text-slate-700 font-medium h-12 pt-2">
                                        {property.user ? `${property.user.firstName || ''} ${property.user.lastName || ''}`.trim() : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t-2 border-emerald-800/10">
                            <div className="text-xs text-slate-700 font-medium mb-8 bg-slate-50 p-4 border border-slate-200 rounded-lg print:border-none print:p-0 print:bg-transparent">
                                {d.buyerDecl}
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="border-b-2 border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.buyerSig}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.date}</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">{d.printedName}</span>
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

export default SellerDisclosure;
