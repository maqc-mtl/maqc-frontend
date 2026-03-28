import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Printer } from 'lucide-react';
import api from '../services/api';

const PurchaseOffer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const formRef = useRef<HTMLDivElement>(null);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const formattedPrice = property ? new Intl.NumberFormat('fr-CA', {
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
        <div className="min-h-screen bg-slate-50">
            {/* Action Bar - hidden when printing */}
            <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        to={`/properties/${id}`}
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {t('detail.back_previous')}
                    </Link>
                    <div className="flex items-center gap-3">
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
                                    PROMISE TO PURCHASE
                                </h1>
                                <h2 className="text-lg font-bold text-slate-500 italic">
                                    Promesse d'achat
                                </h2>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">MAQC.ca</div>
                                <div className="text-xs text-slate-400">FSBO — For Sale By Owner</div>
                                <div className="text-xs text-slate-400 italic">À vendre par le propriétaire</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg print:rounded-none">
                            <p className="text-[10px] text-amber-700 leading-relaxed">
                                <strong>IMPORTANT / IMPORTANT:</strong> This is a template for informational purposes only. MAQC is not a real estate broker and does not provide legal advice. Consult a legal professional before signing. /
                                <em> Ce formulaire est un modèle à titre informatif seulement. MAQC n'est pas un courtier immobilier et ne fournit pas de conseils juridiques. Consultez un professionnel du droit avant de signer.</em>
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Parties */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">1. IDENTIFICATION OF THE PARTIES / <span className="font-bold italic text-slate-500 normal-case">Identification des parties</span></h3>

                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">BUYER(S) / <span className="italic text-slate-400 font-medium">Acheteur(s)</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">Last name / Nom</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">First name / Prénom</span>
                                        <div className="h-5"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1 col-span-2">
                                        <span className="text-[10px] text-slate-400">Address / Adresse</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">Phone / Téléphone</span>
                                        <div className="h-5"></div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1 mt-3">
                                    <span className="text-[10px] text-slate-400">Email / Courriel</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <label className="text-xs font-bold text-slate-600 block mb-1">SELLER(S) / <span className="italic text-slate-400 font-medium">Vendeur(s)</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">Last name / Nom</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user ? property.user.lastName : ''}</div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">First name / Prénom</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user ? property.user.firstName : ''}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1 col-span-2">
                                        <span className="text-[10px] text-slate-400">Address / Adresse</span>
                                        <div className="h-5"></div>
                                    </div>
                                    <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                        <span className="text-[10px] text-slate-400">Phone / Téléphone</span>
                                        <div className="h-5 text-sm text-slate-700 font-medium">{property.user?.phoneNumber || ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Property Description */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">2. DESCRIPTION OF THE IMMOVABLE / <span className="font-bold italic text-slate-500 normal-case">Description de l'immeuble</span></h3>

                        <div className="mt-4 space-y-3">
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Civic address / Adresse civique</span>
                                <div className="text-sm text-slate-700 font-medium">{property.address}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">City / Ville</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.area || ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Province</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.province || 'Québec'}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Postal code / Code postal</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.postalCode || ''}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Property type / Type de propriété</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.type}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Lot number / Numéro de lot</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Cadastre designation / Désignation cadastrale</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Bedrooms / Chambres</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.bedrooms}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Bathrooms / Salles de bain</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.bathrooms}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Year built / Année de construction</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.yearBuilt || ''}</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Area (sq ft) / Superficie (pi²)</span>
                                    <div className="text-sm text-slate-700 font-medium">{property.squareFootage || ''}</div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">MAQC Listing No. / No d'inscription MAQC</span>
                                <div className="text-sm text-slate-700 font-medium">#{property.id}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Price and Payment */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">3. PRICE AND TERMS OF PAYMENT / <span className="font-bold italic text-slate-500 normal-case">Prix et modalités de paiement</span></h3>

                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Listed price / Prix affiché</span>
                                    <div className="text-sm text-slate-700 font-bold">{formattedPrice} CAD</div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Offered price / Prix offert</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Amount offered in words / Montant offert en lettres</span>
                                <div className="h-5"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Deposit amount / Montant de l'acompte</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Deposit held by / Acompte détenu par</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Balance of purchase price payable on signing of deed of sale / Solde du prix d'achat payable à la signature de l'acte de vente</span>
                                <div className="h-5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Conditions */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">4. CONDITIONS / <span className="font-bold italic text-slate-500 normal-case">Conditions</span></h3>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>Financing / Financement:</strong> This promise is conditional upon the Buyer obtaining mortgage financing approval within <span className="border-b border-dotted border-slate-400 inline-block w-12 text-center">&nbsp;</span> days of acceptance. /
                                    <em className="text-slate-400"> Cette promesse est conditionnelle à l'obtention par l'acheteur d'un financement hypothécaire dans les <span className="border-b border-dotted border-slate-400 inline-block w-12 text-center">&nbsp;</span> jours suivant l'acceptation.</em>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>Inspection / Inspection:</strong> This promise is conditional upon a satisfactory building inspection within <span className="border-b border-dotted border-slate-400 inline-block w-12 text-center">&nbsp;</span> days of acceptance. /
                                    <em className="text-slate-400"> Cette promesse est conditionnelle à la réalisation d'une inspection du bâtiment satisfaisante dans les <span className="border-b border-dotted border-slate-400 inline-block w-12 text-center">&nbsp;</span> jours suivant l'acceptation.</em>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded mt-0.5 shrink-0"></div>
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <strong>Sale of buyer's property / Vente de la propriété de l'acheteur:</strong> This promise is conditional upon the sale of the buyer's current property. /
                                    <em className="text-slate-400"> Cette promesse est conditionnelle à la vente de la propriété actuelle de l'acheteur.</em>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Other conditions / Autres conditions</span>
                                <div className="h-16"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Deed of Sale */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">5. DEED OF SALE AND OCCUPANCY / <span className="font-bold italic text-slate-500 normal-case">Acte de vente et occupation</span></h3>

                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Date of signing of deed of sale / Date de signature de l'acte de vente</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Date of occupancy / Date d'occupation</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Name and address of notary / Nom et adresse du notaire</span>
                                <div className="h-5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Inclusions/Exclusions */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">6. INCLUSIONS AND EXCLUSIONS / <span className="font-bold italic text-slate-500 normal-case">Inclusions et exclusions</span></h3>

                        <div className="mt-4 space-y-3">
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Inclusions (appliances, fixtures, etc.) / Inclusions (appareils, accessoires, etc.)</span>
                                <div className="h-16"></div>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                <span className="text-[10px] text-slate-400">Exclusions</span>
                                <div className="h-10"></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Declarations */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-4">7. DECLARATIONS OF THE BUYER / <span className="font-bold italic text-slate-500 normal-case">Déclarations de l'acheteur</span></h3>

                        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
                            <p>
                                The Buyer declares having examined the immovable and being satisfied with its condition, subject to the conditions stated above. /
                                <em className="text-slate-400"> L'acheteur déclare avoir examiné l'immeuble et être satisfait de son état, sous réserve des conditions indiquées ci-dessus.</em>
                            </p>
                            <p>
                                The Buyer acknowledges that this promise to purchase constitutes a legal obligation once accepted by the Seller. /
                                <em className="text-slate-400"> L'acheteur reconnaît que cette promesse d'achat constitue une obligation légale une fois acceptée par le vendeur.</em>
                            </p>
                        </div>
                    </div>

                    {/* Section 8: Validity */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-1">8. IRREVOCABILITY AND ACCEPTANCE / <span className="font-bold italic text-slate-500 normal-case">Irrévocabilité et acceptation</span></h3>

                        <div className="mt-4 space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                This promise to purchase is irrevocable until <span className="border-b-2 border-dotted border-slate-300 inline-block w-20 text-center">&nbsp;</span> hours on <span className="border-b-2 border-dotted border-slate-300 inline-block w-32 text-center">&nbsp;</span> (date), after which it becomes null and void if not accepted. /
                                <em className="text-slate-400"> Cette promesse d'achat est irrévocable jusqu'à <span className="border-b-2 border-dotted border-slate-300 inline-block w-20 text-center">&nbsp;</span> heures le <span className="border-b-2 border-dotted border-slate-300 inline-block w-32 text-center">&nbsp;</span> (date), après quoi elle devient nulle et non avenue si elle n'est pas acceptée.</em>
                            </div>
                        </div>
                    </div>

                    {/* Section 9: Signatures */}
                    <div className="p-8 print:p-6">
                        <h3 className="text-sm font-black text-[#1a1a6d] uppercase tracking-wider mb-6">9. SIGNATURES</h3>

                        <div className="grid grid-cols-2 gap-12">
                            {/* Buyer Signature */}
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Buyer / Acheteur</div>
                                <div className="border-b-2 border-slate-300 pb-1 mt-8">
                                    <span className="text-[10px] text-slate-400">Signature</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Date</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Printed name / Nom en caractères d'imprimerie</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>

                            {/* Seller Signature */}
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Seller / Vendeur</div>
                                <div className="border-b-2 border-slate-300 pb-1 mt-8">
                                    <span className="text-[10px] text-slate-400">Signature</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Date</span>
                                    <div className="h-5"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Printed name / Nom en caractères d'imprimerie</span>
                                    <div className="h-5"></div>
                                </div>
                            </div>
                        </div>

                        {/* Acceptance section */}
                        <div className="mt-8 pt-6 border-t-2 border-[#1a1a6d]/20">
                            <h4 className="text-xs font-black text-[#1a1a6d] uppercase tracking-wider mb-4">
                                ACCEPTANCE OF THE SELLER / <span className="font-bold italic text-slate-500 normal-case">Acceptation du vendeur</span>
                            </h4>
                            <div className="text-xs text-slate-600 leading-relaxed mb-4">
                                I/we, the undersigned Seller(s), accept the above promise to purchase under all the terms and conditions set forth. /
                                <em className="text-slate-400"> Je/nous, vendeur(s) soussigné(s), accepte(ons) la promesse d'achat ci-dessus selon toutes les conditions énoncées.</em>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0"></div>
                                <span className="text-xs text-slate-600">I accept / J'accepte</span>
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0 ml-6"></div>
                                <span className="text-xs text-slate-600">I refuse / Je refuse</span>
                                <div className="w-4 h-4 border-2 border-slate-300 rounded shrink-0 ml-6"></div>
                                <span className="text-xs text-slate-600">Counter-offer / Contre-offre</span>
                            </div>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="border-b-2 border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Seller's signature / Signature du vendeur</span>
                                    <div className="h-12"></div>
                                </div>
                                <div className="border-b-2 border-dotted border-slate-300 pb-1">
                                    <span className="text-[10px] text-slate-400">Date</span>
                                    <div className="h-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-center print:bg-white">
                        <p className="text-[9px] text-slate-400">
                            MAQC.ca — FSBO (For Sale By Owner) Platform / Plateforme AVPP (À Vendre Par le Propriétaire) — This form is provided as a template only / Ce formulaire est fourni en tant que modèle uniquement
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOffer;
