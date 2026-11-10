const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please provide the job role or title'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
      default: 'Full-time'
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'Remote'
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote'
    },
    salary: {
      type: String,
      trim: true,
      default: ''
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    jobUrl: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    contactEmail: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexing for rapid search by user and keywords
jobSchema.index({ user: 1, company: 'text', role: 'text' });

module.exports = mongoose.model('Job', jobSchema);
