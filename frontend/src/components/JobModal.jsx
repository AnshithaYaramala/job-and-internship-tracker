import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function JobModal({ isOpen, onClose, onSave, editingJob }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    jobType: 'Full-time',
    workMode: 'Remote',
    location: '',
    salary: '',
    notes: ''
  });

  useEffect(() => {
    if (editingJob) {
      setFormData(editingJob);
    } else {
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        jobType: 'Full-time',
        workMode: 'Remote',
        location: '',
        salary: '',
        notes: ''
      });
    }
  }, [editingJob, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {editingJob ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Company Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Netflix"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Role / Position *</label>
              <input
                required
                type="text"
                placeholder="e.g. Frontend Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm bg-white outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm bg-white outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Work Mode</label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm bg-white outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $90,000 - $110,000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Notes & Interview Details</label>
            <textarea
              rows="2"
              placeholder="Rounds, interviewer notes, or job URL..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-xl text-sm outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md"
            >
              {editingJob ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
