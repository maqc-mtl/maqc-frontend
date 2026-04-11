import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Home, Search, CheckCircle, XCircle, Trash2, Plus, Edit2, Phone, Mail, MapPin, Star, ShieldCheck, UserCheck, Award, Users } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import api, { propertyApi } from '../services/api';

type Tab = 'properties' | 'users' | 'notaries' | 'inspectors' | 'agents';

interface Professional {
    id?: number;
    name: string;
    firm?: string;
    agency?: string;
    address: string;
    phone: string;
    email: string;
    languages: string[];
    rating: number;
}

const AdminDashboard: React.FC = () => {
    // const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('properties');
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Professionals states
    const [notaries, setNotaries] = useState<Professional[]>([]);
    const [inspectors, setInspectors] = useState<Professional[]>([]);
    const [agents, setAgents] = useState<Professional[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Pagination & Filter states for properties
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal states for CRUD
    const [showModal, setShowModal] = useState(false);
    const [currentEntity, setCurrentEntity] = useState<Professional | null>(null);

    // Scoring modal states
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [currentPropertyForScore, setCurrentPropertyForScore] = useState<any | null>(null);
    const [scoreForm, setScoreForm] = useState({
        priceReasonablenessScore: 0,
        rentalPerformanceScore: 0,
        sellerMotivationScore: 0,
        propertyConditionScore: 0,
        transactionComplexityScore: 0
    });

    useEffect(() => {
        setCurrentPage(0);
    }, [activeTab, statusFilter]);

    useEffect(() => {
        fetchData();
    }, [activeTab, statusFilter, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'properties') {
                const res = await api.get('/admin/properties/search', {
                    params: {
                        status: statusFilter || undefined,
                        page: currentPage,
                        size: 8
                    }
                });
                setProperties(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } else {
                const res = await api.get(`/admin/${activeTab}`);
                if (activeTab === 'notaries') setNotaries(res.data);
                if (activeTab === 'inspectors') setInspectors(res.data);
                if (activeTab === 'agents') setAgents(res.data);
                if (activeTab === 'users') setUsers(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.post(`/admin/properties/${id}/approve`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleRefuse = async (id: number) => {
        try {
            await api.post(`/admin/properties/${id}/refuse`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        try {
            await api.delete(`/admin/${activeTab}/${id}`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleOpenScoreModal = (property: any) => {
        setCurrentPropertyForScore(property);
        setScoreForm({
            priceReasonablenessScore: property.priceReasonablenessScore || 0,
            rentalPerformanceScore: property.rentalPerformanceScore || 0,
            sellerMotivationScore: property.sellerMotivationScore || 0,
            propertyConditionScore: property.propertyConditionScore || 0,
            transactionComplexityScore: property.transactionComplexityScore || 0
        });
        setShowScoreModal(true);
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        setScoreForm(prev => ({
            ...prev,
            [name]: numValue
        }));
    };

    const handleSaveScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPropertyForScore) return;
        try {
            await propertyApi.updateScore(currentPropertyForScore.id, scoreForm);
            setShowScoreModal(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSaveEntity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEntity) return;
        try {
            if (currentEntity.id) {
                await api.put(`/admin/${activeTab}/${currentEntity.id}`, currentEntity);
            } else {
                await api.post(`/admin/${activeTab}`, currentEntity);
            }
            setShowModal(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const tabConfig = [
        { id: 'properties', label: 'Properties', icon: <Home size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'notaries', label: 'Notaries', icon: <ShieldCheck size={18} /> },
        { id: 'inspectors', label: 'Inspectors', icon: <Search size={18} /> },
        { id: 'agents', label: 'Agents', icon: <UserCheck size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar — Desktop only */}
            <div className="hidden md:flex md:flex-col w-72 bg-[#0b1221] text-white p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-black tracking-tight text-xl">ADMIN PANEL</span>
                </div>
                <nav className="space-y-2">
                    {tabConfig.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-bold text-sm tracking-wide uppercase">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile Tab Bar */}
            <div className="md:hidden bg-[#0b1221] text-white px-2 py-2 sticky top-0 z-10">
                <div className="flex overflow-x-auto gap-1 scrollbar-hide">
                    {tabConfig.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-xs font-black uppercase tracking-wide ${activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-10 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                        {activeTab} Management
                    </h1>
                    {activeTab !== 'properties' && activeTab !== 'users' && (
                        <button
                            onClick={() => {
                                setCurrentEntity({ name: '', address: '', phone: '', email: '', languages: ['EN', 'FR'], rating: 5 });
                                setShowModal(true);
                            }}
                            className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 self-start"
                        >
                            <Plus size={16} /> Add New {activeTab.slice(0, -1)}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {activeTab === 'properties' ? (
                            <div className="space-y-6">
                                {/* Filters Row */}
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 min-w-[240px]">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Filter Status:</span>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-900 cursor-pointer w-full"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="PENDING">Pending Approval</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="EXPIRED">Expired </option>
                                            <option value="REFUSED">Refused</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left min-w-[600px]">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {properties.map((p) => (
                                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                                    {p.imageUrls?.[0] && <img src={p.imageUrls[0]} className="w-full h-full object-cover" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-900 text-sm truncate max-w-xs">{p.title}</p>
                                                                    <p className="text-xs text-slate-400 font-medium">{p.address}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest">{p.type}</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : p.status === 'REFUSED' ? 'bg-rose-50 text-rose-600' : p.status === 'EXPIRED' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                                                                }`}>
                                                                {p.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 md:px-8 py-4 md:py-6 text-right space-x-1 md:space-x-2">
                                                            {p.status === 'PENDING' && (
                                                                <>
                                                                    <button onClick={() => handleApprove(p.id)} className="p-2 md:p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Approve">
                                                                        <CheckCircle size={18} />
                                                                    </button>
                                                                    <button onClick={() => handleRefuse(p.id)} className="p-2 md:p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Refuse">
                                                                        <XCircle size={18} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button onClick={() => handleOpenScoreModal(p)} className="p-2 md:p-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Score Property">
                                                                <Award size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {properties.length === 0 && <div className="text-center py-20 text-slate-400 font-bold">No properties found.</div>}

                                    {/* Pagination UI */}
                                    {totalPages > 1 && (
                                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                Page {currentPage + 1} of {totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={currentPage === 0}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={currentPage >= totalPages - 1}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'users' ? (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Role</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <span className="font-black text-slate-900 text-sm">#{u.id}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                                                                {u.email ? u.email.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            <span className="font-bold text-slate-700 text-sm">{u.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex gap-2">
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Active</span>
                                                            {u.role && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">{u.role}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button onClick={() => handleDelete(u.id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete User">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && <div className="text-center py-20 text-slate-400 font-bold">No users found.</div>}
                            </div>
                        ) : (
                            /* Professional Grid List */
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {((activeTab as string) === 'notaries' ? notaries : (activeTab as string) === 'inspectors' ? inspectors : agents).map((entity) => (
                                    <div key={entity.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-5">
                                                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shrink-0 transform group-hover:scale-110 transition-transform">
                                                    {(activeTab as string) === 'notaries' ? <ShieldCheck size={28} /> : (activeTab as string) === 'inspectors' ? <Search size={28} /> : <UserCheck size={28} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{entity.name}</h3>
                                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{entity.firm || entity.agency}</p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} className={i < Math.floor(entity.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                                                        ))}
                                                        <span className="text-xs font-black text-slate-600 ml-1">{entity.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setCurrentEntity(entity); setShowModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(entity.id!)} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <Phone size={14} className="text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold">{entity.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <Mail size={14} className="text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold truncate">{entity.email}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-slate-600 col-span-2">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <MapPin size={14} className="text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold leading-relaxed">{entity.address}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-2">
                                            {entity.languages.map(lang => (
                                                <span key={lang} className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest">{lang}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Entity CRUD Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" onClick={() => setShowModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] shadow-2xl z-[201] overflow-hidden">
                            <form onSubmit={handleSaveEntity} className="p-10">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">
                                    {currentEntity?.id ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentEntity?.name}
                                            onChange={e => setCurrentEntity(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            placeholder="Enter name..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{activeTab === 'agents' ? 'Agency' : 'Firm'}</label>
                                            <input
                                                type="text"
                                                value={activeTab === 'agents' ? currentEntity?.agency : currentEntity?.firm}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, [activeTab === 'agents' ? 'agency' : 'firm']: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Rating (1-5)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                max="5"
                                                value={currentEntity?.rating}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, rating: parseFloat(e.target.value) } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={currentEntity?.email}
                                            onChange={e => setCurrentEntity(prev => prev ? { ...prev, email: e.target.value } : null)}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Phone</label>
                                            <input
                                                type="tel"
                                                required
                                                value={currentEntity?.phone}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Address</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentEntity?.address}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, address: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-12">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Scoring Modal */}
            <AnimatePresence>
                {showScoreModal && currentPropertyForScore && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" onClick={() => setShowScoreModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-[201] overflow-hidden">
                            <form onSubmit={handleSaveScore} className="p-10">
                                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                    Score Property
                                </h2>
                                <p className="text-sm font-bold text-slate-500 mb-8">{currentPropertyForScore.title}</p>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            Price Reasonableness (0-2 points)
                                        </label>
                                        <input
                                            type="number"
                                            name="priceReasonablenessScore"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            required
                                            value={scoreForm.priceReasonablenessScore}
                                            onChange={handleScoreChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            Rental Performance (0-2 points)
                                        </label>
                                        <input
                                            type="number"
                                            name="rentalPerformanceScore"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            required
                                            value={scoreForm.rentalPerformanceScore}
                                            onChange={handleScoreChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            Seller Motivation (0-2 points)
                                        </label>
                                        <input
                                            type="number"
                                            name="sellerMotivationScore"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            required
                                            value={scoreForm.sellerMotivationScore}
                                            onChange={handleScoreChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            Property Condition (0-2 points)
                                        </label>
                                        <input
                                            type="number"
                                            name="propertyConditionScore"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            required
                                            value={scoreForm.propertyConditionScore}
                                            onChange={handleScoreChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            Transaction Complexity (0-2 points)
                                        </label>
                                        <input
                                            type="number"
                                            name="transactionComplexityScore"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            required
                                            value={scoreForm.transactionComplexityScore}
                                            onChange={handleScoreChange}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Overall Score</span>
                                        <span className="text-2xl font-black text-blue-600">
                                            {(scoreForm.priceReasonablenessScore + scoreForm.rentalPerformanceScore + scoreForm.sellerMotivationScore + scoreForm.propertyConditionScore + scoreForm.transactionComplexityScore).toFixed(1)} / 10
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowScoreModal(false)}
                                        className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        Save Score
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
