import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import { Plus, Search, LogOut, CheckCircle, Clock, Award, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, statusCounts: {} });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get(`/jobs?search=${search}&status=${filterStatus}`),
        api.get('/jobs/stats')
      ]);
      setJobs(jobsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, filterStatus]);

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, jobData);
      } else {
        await api.post('/jobs', jobData);
      }
      setIsModalOpen(false);
      setEditingJob(null);
      fetchData();
    } catch (err) {
      alert('Error saving job application');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      await api.delete(`/jobs/${id}`);
      fetchData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await api.put(`/jobs/${id}`, { status: newStatus });
    fetchData();
  };

  const handleSeedDemoData = async () => {
    try {
      setIsSeeding(true);
      await api.post('/jobs/seed');
      await fetchData();
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            💼 Job<span className="text-indigo-600">trakr</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Welcome back, {user?.name}!</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDemoData}
            disabled={isSeeding}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition"
            title="Load sample applications to test"
          >
            <Sparkles size={14} className="text-indigo-600" />
            {isSeeding ? 'Loading...' : 'Load Sample Data'}
          </button>
          <button
            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus size={16} /> Add Application
          </button>
          <button
            onClick={logout}
            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Applications</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.total || 0}</h3>
          </div>
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/50 shadow-sm">
            <p className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
              <Clock size={14} /> Applied
            </p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">{stats.statusCounts?.Applied || 0}</h3>
          </div>
          <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200/50 shadow-sm">
            <p className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1">
              <CheckCircle size={14} /> Interviews
            </p>
            <h3 className="text-2xl font-black text-indigo-900 mt-1">{stats.statusCounts?.Interview || 0}</h3>
          </div>
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/50 shadow-sm">
            <p className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1">
              <Award size={14} /> Selected / Offers
            </p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">{stats.statusCounts?.Selected || 0}</h3>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          {/* Status Pills */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {['All', 'Applied', 'Interview', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Job Cards Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-sm">No job applications match your filters.</p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                + Add an application
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleSeedDemoData}
                className="text-xs font-bold text-slate-600 hover:underline"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={(j) => { setEditingJob(j); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        editingJob={editingJob}
      />
    </div>
  );
}
