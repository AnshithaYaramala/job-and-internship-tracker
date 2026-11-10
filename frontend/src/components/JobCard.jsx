import React from 'react';
import { MapPin, DollarSign, Trash2, Edit } from 'lucide-react';

const statusStyles = {
  Selected: 'bg-[#dcfce7] border-[#86efac] text-[#166534]', // Soft pastel green
  Interview: 'bg-[#e0e7ff] border-[#a5b4fc] text-[#3730a3]', // Soft pastel blue/indigo
  Applied: 'bg-[#fef9c3] border-[#fde047] text-[#854d0e]',   // Soft pastel yellow
  Rejected: 'bg-[#ffe4e6] border-[#fca5a5] text-[#9f1239]'   // Soft pastel pink/red
};

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
  const style = statusStyles[job.status] || 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <div className={`p-5 rounded-2xl border ${style} shadow-sm transition hover:shadow-md flex flex-col justify-between`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold opacity-75">
            {new Date(job.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          <select
            value={job.status}
            onChange={(e) => onStatusChange(job._id, e.target.value)}
            className="text-xs font-bold px-2 py-1 rounded-full border bg-white/80 cursor-pointer outline-none"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{job.company}</p>
        <h3 className="text-lg font-bold text-slate-900 mb-3">{job.role}</h3>

        <div className="flex flex-wrap gap-2 text-xs mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-white/70 font-semibold">{job.jobType}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/70 font-semibold">{job.workMode}</span>
          {job.salary && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/70 font-semibold flex items-center gap-1">
              <DollarSign size={12} /> {job.salary}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-black/10 mt-2">
        <span className="text-xs flex items-center gap-1 opacity-80">
          <MapPin size={13} /> {job.location || 'Remote'}
        </span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(job)} className="p-1.5 hover:bg-white/60 rounded-lg text-slate-700">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(job._id)} className="p-1.5 hover:bg-white/60 rounded-lg text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
