import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Home, Search, CheckCircle, XCircle, Trash2, Plus, Edit2, Star, ShieldCheck, UserCheck, Award, Users, Globe, MoreVertical } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import api, { propertyApi } from '../services/api';
import PropertyEditModal from '../components/PropertyEditModal';

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

    // Confirmation Modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'refuse', id: number } | null>(null);

    // Property Edit Modal
    const [showPropertyEditModal, setShowPropertyEditModal] = useState(false);
    const [currentPropertyForEdit, setCurrentPropertyForEdit] = useState<any | null>(null);

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
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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

    const executeConfirmAction = async () => {
        if (!confirmAction) return;
        try {
            await api.post(`/admin/properties/${confirmAction.id}/${confirmAction.type}`);
            setShowConfirmModal(false);
            setConfirmAction(null);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleApprove = (id: number) => {
        setConfirmAction({ type: 'approve', id });
        setShowConfirmModal(true);
    };

    const handleRefuse = (id: number) => {
        setConfirmAction({ type: 'refuse', id });
        setShowConfirmModal(true);
    };

    const handleStatusChange = async (propertyId: number, newStatus: string) => {
        try {
            await api.put(`/admin/properties/${propertyId}/status`, null, { params: { status: newStatus } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSavePropertyEdit = async (editedProperty: any) => {
        try {
            await api.put(`/properties/${editedProperty.id}`, editedProperty);
            setShowPropertyEditModal(false);
            setCurrentPropertyForEdit(null);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('您确定要删除此项吗？')) return;
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
        { id: 'properties', label: '房源', icon: <Home size={18} /> },
        { id: 'users', label: '用户', icon: <Users size={18} /> },
        { id: 'notaries', label: '公证员', icon: <ShieldCheck size={18} /> },
        { id: 'inspectors', label: '房屋检查员', icon: <Search size={18} /> },
        { id: 'agents', label: '经纪人', icon: <UserCheck size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar — Desktop only */}
            <div className="hidden md:flex md:flex-col w-72 bg-[#0b1221] text-white p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-black tracking-tight text-xl">后台管理面板</span>
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
                        {activeTab === 'properties' ? '房源' : activeTab === 'users' ? '用户' : activeTab === 'notaries' ? '公证员' : activeTab === 'inspectors' ? '房屋检查员' : '经纪人'} 管理
                    </h1>
                    {activeTab !== 'properties' && activeTab !== 'users' && (
                        <button
                            onClick={() => {
                                setCurrentEntity({ name: '', address: '', phone: '', email: '', languages: [], rating: 5 });
                                setShowModal(true);
                            }}
                            className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 self-start"
                        >
                            <Plus size={16} /> 添加新{activeTab === 'notaries' ? '公证员' : activeTab === 'inspectors' ? '房屋检查员' : '经纪人'}
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
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">筛选状态:</span>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-900 cursor-pointer w-full"
                                        >
                                            <option value="">全部状态</option>
                                            <option value="PENDING">审核中</option>
                                            <option value="APPROVED">已通过</option>
                                            <option value="EXPIRED">已过期</option>
                                            <option value="REFUSED">审核未通过</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left min-w-[600px]">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">房源</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">用户邮箱</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">类型</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
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
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-700">{p.user?.email || '—'}</span>
                                                                <span className="text-[10px] text-slate-400 font-medium">{p.user?.firstName} {p.user?.lastName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest">{p.type}</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <select
                                                                value={p.status}
                                                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                                className={`px-3 py-1 outline-none text-[10px] font-black rounded-full uppercase tracking-widest cursor-pointer ${p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : p.status === 'REFUSED' ? 'bg-rose-50 text-rose-600' : p.status === 'EXPIRED' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'}`}
                                                            >
                                                                <option value="PENDING">审核中</option>
                                                                <option value="APPROVED">已通过</option>
                                                                <option value="REFUSED">审核未通过</option>
                                                                <option value="EXPIRED">已过期</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-4 md:px-8 py-4 md:py-6 text-right relative">
                                                            <div className="flex justify-end">
                                                                <button 
                                                                    onClick={() => setActiveDropdown(activeDropdown === p.id ? null : p.id)}
                                                                    className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                                                                >
                                                                    <MoreVertical size={20} />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {activeDropdown === p.id && (
                                                                        <>
                                                                            <div 
                                                                                className="fixed inset-0 z-[100]" 
                                                                                onClick={() => setActiveDropdown(null)}
                                                                            />
                                                                            <motion.div
                                                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                                className="absolute right-8 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[101] overflow-hidden"
                                                                            >
                                                                                {p.status === 'PENDING' && (
                                                                                    <>
                                                                                        <button 
                                                                                            onClick={() => { handleApprove(p.id); setActiveDropdown(null); }}
                                                                                            className="w-full flex items-center gap-3 px-4 py-3 text-emerald-600 hover:bg-emerald-50 transition-colors text-xs font-black uppercase tracking-widest"
                                                                                        >
                                                                                            <CheckCircle size={16} /> 批准房源
                                                                                        </button>
                                                                                        <button 
                                                                                            onClick={() => { handleRefuse(p.id); setActiveDropdown(null); }}
                                                                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-black uppercase tracking-widest border-b border-slate-50"
                                                                                        >
                                                                                            <XCircle size={16} /> 拒绝房源
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                                <button 
                                                                                    onClick={() => { setCurrentPropertyForEdit(p); setShowPropertyEditModal(true); setActiveDropdown(null); }}
                                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors text-xs font-black uppercase tracking-widest"
                                                                                >
                                                                                    <Edit2 size={16} /> 编辑修改
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => { handleOpenScoreModal(p); setActiveDropdown(null); }}
                                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-amber-600 hover:bg-amber-50 transition-colors text-xs font-black uppercase tracking-widest"
                                                                                >
                                                                                    <Award size={16} /> 房源评分
                                                                                </button>
                                                                            </motion.div>
                                                                        </>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {properties.length === 0 && <div className="text-center py-20 text-slate-400 font-bold">未找到房源。</div>}

                                    {/* Pagination UI */}
                                    {totalPages > 1 && (
                                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                第 {currentPage + 1} 页，共 {totalPages} 页
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={currentPage === 0}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    上一页
                                                </button>
                                                <button
                                                    disabled={currentPage >= totalPages - 1}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    下一页
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
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">用户ID</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">邮箱</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态 / 角色</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
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
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">活跃</span>
                                                            {u.role && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">{u.role === 'ADMIN' ? '管理员' : u.role === 'USER' ? '普通用户' : u.role}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button onClick={() => handleDelete(u.id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="删除用户">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && <div className="text-center py-20 text-slate-400 font-bold">未找到用户。</div>}
                            </div>
                        ) : (
                            /* Professional Table List */
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">姓名</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'agents' ? '所属公司' : '律所/公司'}</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">电话</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">邮箱</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">语言</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">评分</th>
                                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {((activeTab as string) === 'notaries' ? notaries : (activeTab as string) === 'inspectors' ? inspectors : agents).map((entity) => (
                                                <tr key={entity.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                                                {(activeTab as string) === 'notaries' ? <ShieldCheck size={18} /> : (activeTab as string) === 'inspectors' ? <Search size={18} /> : <UserCheck size={18} />}
                                                            </div>
                                                            <span className="font-black text-slate-900 text-sm">{entity.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-sm font-bold text-slate-500">{entity.firm || entity.agency || '—'}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-sm font-bold text-slate-600">{entity.phone}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-sm font-bold text-slate-600 truncate max-w-[180px] block">{entity.email}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-wrap gap-1">
                                                            {entity.languages.map(lang => (
                                                                <span key={lang} className="px-2.5 py-0.5 bg-blue-50 text-[10px] font-black text-blue-600 rounded-full uppercase tracking-widest">{lang}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} className={i < Math.floor(entity.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                                                            ))}
                                                            <span className="text-xs font-black text-slate-600 ml-1">{entity.rating}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <button onClick={() => { setCurrentEntity(entity); setShowModal(true); }} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="编辑">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(entity.id!)} className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="删除">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {((activeTab as string) === 'notaries' ? notaries : (activeTab as string) === 'inspectors' ? inspectors : agents).length === 0 && <div className="text-center py-20 text-slate-400 font-bold">暂无数据。</div>}
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
                                    {currentEntity?.id ? '编辑' : '添加新'} {activeTab === 'notaries' ? '公证员' : activeTab === 'inspectors' ? '房屋检查员' : '经纪人'}
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">全名</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentEntity?.name}
                                            onChange={e => setCurrentEntity(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            placeholder="输入姓名..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{activeTab === 'agents' ? '所属公司' : '律所/公司'}</label>
                                            <input
                                                type="text"
                                                value={activeTab === 'agents' ? currentEntity?.agency : currentEntity?.firm}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, [activeTab === 'agents' ? 'agency' : 'firm']: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">评分 (1-5)</label>
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">电子邮箱</label>
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">电话</label>
                                            <input
                                                type="tel"
                                                required
                                                value={currentEntity?.phone}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">地址</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentEntity?.address}
                                                onChange={e => setCurrentEntity(prev => prev ? { ...prev, address: e.target.value } : null)}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Multi-select Languages */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                            <Globe size={12} /> 语言能力
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {['EN', 'FR', 'ZH', 'ES', 'AR', 'PT'].map(lang => {
                                                const selected = currentEntity?.languages?.includes(lang);
                                                const langLabels: Record<string, string> = { EN: '英语', FR: '法语', ZH: '中文', ES: '西班牙语', AR: '阿拉伯语', PT: '葡萄牙语' };
                                                return (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        onClick={() => {
                                                            setCurrentEntity(prev => {
                                                                if (!prev) return null;
                                                                const langs = prev.languages || [];
                                                                return {
                                                                    ...prev,
                                                                    languages: selected ? langs.filter(l => l !== lang) : [...langs, lang]
                                                                };
                                                            });
                                                        }}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                                            selected
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                                                : 'bg-slate-50 text-slate-400 border-transparent hover:border-blue-200 hover:text-blue-600'
                                                        }`}
                                                    >
                                                        {lang} · {langLabels[lang]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-12">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        保存更改
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
                                    房源评分
                                </h2>
                                <p className="text-sm font-bold text-slate-500 mb-8">{currentPropertyForScore.title}</p>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                                            价格合理度 (0-2 分)
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
                                            报酬率 (0-2 分)
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
                                            卖家动机 (0-2 分)
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
                                            房屋状况 (0-2 分)
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
                                            交易复杂度 (0-2 分)
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
                                        <span className="text-sm font-black text-blue-600 uppercase tracking-widest">总评分</span>
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
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        保存评分
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <PropertyEditModal
                isOpen={showPropertyEditModal}
                onClose={() => setShowPropertyEditModal(false)}
                onSave={handleSavePropertyEdit}
                property={currentPropertyForEdit}
            />

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" onClick={() => setShowConfirmModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[3rem] shadow-2xl z-[201] overflow-hidden">
                            <div className="p-8 text-center">
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${confirmAction?.type === 'approve' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {confirmAction?.type === 'approve' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{confirmAction?.type === 'approve' ? '确定批准？' : '确定拒绝？'}</h2>
                                <p className="text-sm font-bold text-slate-500 mb-8">此操作将会更新该房源的审核状态。</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={executeConfirmAction}
                                        className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${confirmAction?.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'}`}
                                    >
                                        确定
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
