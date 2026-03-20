import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { termsContent } from '../data/legalContent';

const TermsPage: React.FC = () => {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const content = termsContent[currentLang as keyof typeof termsContent] || termsContent.zh;

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                                <p className="text-gray-500 text-sm mt-1">最后更新：{content.lastUpdated}</p>
                            </div>
                        </div>
                        <Link
                            to="/register"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('register.back_to_register')}
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        {content.sections.map((section, index) => (
                            <section key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    {section.heading}
                                </h2>
                                <div className="text-gray-600 whitespace-pre-line leading-relaxed pl-8">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>如有任何问题，请联系：info@maqc.ca</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
