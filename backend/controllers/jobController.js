const Job = require('../models/Job');

// @desc    Get all jobs for logged-in user (with search, filter, and sorting)
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { search, status, jobType, workMode, sort } = req.query;

    const query = { user: req.user._id };

    // Search filter (company or role)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ company: regex }, { role: regex }, { location: regex }];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Job Type filter
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Work Mode filter
    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    // Sorting
    let sortOptions = { appliedDate: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { appliedDate: 1 };
    } else if (sort === 'company-asc') {
      sortOptions = { company: 1 };
    } else if (sort === 'company-desc') {
      sortOptions = { company: -1 };
    }

    const jobs = await Job.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('getJobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve job applications',
      error: error.message
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Check ownership
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this job' });
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      jobType,
      workMode,
      location,
      salary,
      appliedDate,
      jobUrl,
      notes,
      contactEmail
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both company name and job role'
      });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status: status || 'Applied',
      jobType: jobType || 'Full-time',
      workMode: workMode || 'Remote',
      location: location || 'Remote',
      salary: salary || '',
      appliedDate: appliedDate || Date.now(),
      jobUrl: jobUrl || '',
      notes: notes || '',
      contactEmail: contactEmail || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Job application added successfully',
      data: job
    });
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job application',
      error: error.message
    });
  }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Check ownership
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      data: job
    });
  } catch (error) {
    console.error('updateJob error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job application',
      error: error.message
    });
  }
};

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Check ownership
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Job application removed successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('deleteJob error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete job application',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/jobs/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate statistics
    const allJobs = await Job.find({ user: userId });

    const total = allJobs.length;
    const applied = allJobs.filter((j) => j.status === 'Applied').length;
    const interview = allJobs.filter((j) => j.status === 'Interview').length;
    const selected = allJobs.filter((j) => j.status === 'Selected').length;
    const rejected = allJobs.filter((j) => j.status === 'Rejected').length;

    // Rates
    const interviewRate = total > 0 ? Math.round((interview / total) * 100) : 0;
    const selectedRate = total > 0 ? Math.round((selected / total) * 100) : 0;

    // Type Breakdown
    const jobTypes = {
      'Full-time': allJobs.filter((j) => j.jobType === 'Full-time').length,
      'Internship': allJobs.filter((j) => j.jobType === 'Internship').length,
      'Part-time': allJobs.filter((j) => j.jobType === 'Part-time').length,
      'Contract': allJobs.filter((j) => j.jobType === 'Contract').length
    };

    // Work Mode Breakdown
    const workModes = {
      Remote: allJobs.filter((j) => j.workMode === 'Remote').length,
      'On-site': allJobs.filter((j) => j.workMode === 'On-site').length,
      Hybrid: allJobs.filter((j) => j.workMode === 'Hybrid').length
    };

    return res.status(200).json({
      success: true,
      data: {
        total,
        statusCounts: {
          Applied: applied,
          Interview: interview,
          Selected: selected,
          Rejected: rejected
        },
        rates: {
          interviewRate,
          selectedRate
        },
        jobTypes,
        workModes
      }
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute application statistics',
      error: error.message
    });
  }
};

// @desc    Seed sample job applications for the logged-in user
// @route   POST /api/jobs/seed
// @access  Private
const seedSampleJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Remove existing jobs if requested
    if (req.query.clear === 'true') {
      await Job.deleteMany({ user: userId });
    }

    const sampleJobs = [
      {
        user: userId,
        company: 'Shorthills Tech',
        role: 'Full Stack Developer',
        status: 'Selected',
        jobType: 'Full-time',
        workMode: 'Remote',
        location: 'Remote, US',
        salary: '$85,000 - $105,000',
        appliedDate: new Date('2026-04-02'),
        jobUrl: 'https://shorthills.example.com/careers/dev',
        notes: 'Final round with VP of Engineering went great! Offer letter received.',
        contactEmail: 'talent@shorthillstech.com'
      },
      {
        user: userId,
        company: 'Netflix',
        role: 'Machine Learning Engineer',
        status: 'Applied',
        jobType: 'Full-time',
        workMode: 'Remote',
        location: 'Los Gatos, CA',
        salary: '$190,000 - $240,000',
        appliedDate: new Date('2026-04-01'),
        jobUrl: 'https://jobs.netflix.com/ml-engineer',
        notes: 'Submitted resume via referral. Waiting for recruiter screening.',
        contactEmail: 'recruit@netflix.com'
      },
      {
        user: userId,
        company: 'Meta',
        role: 'Systems Engineer',
        status: 'Interview',
        jobType: 'Full-time',
        workMode: 'Remote',
        location: 'Menlo Park, CA',
        salary: '$160,000 - $190,000',
        appliedDate: new Date('2026-03-31'),
        jobUrl: 'https://metacareers.com/systems',
        notes: 'Passed initial coding assessment. System design interview scheduled next Tuesday.',
        contactEmail: 'engineering-recruiting@meta.com'
      },
      {
        user: userId,
        company: 'Amazon Web Services',
        role: 'Solutions Architect',
        status: 'Selected',
        jobType: 'Full-time',
        workMode: 'On-site',
        location: 'Seattle, WA',
        salary: '$210,000 - $260,000',
        appliedDate: new Date('2026-03-29'),
        jobUrl: 'https://amazon.jobs/sa-role',
        notes: 'Bar raiser interview cleared. Received written offer.',
        contactEmail: 'aws-hiring@amazon.com'
      },
      {
        user: userId,
        company: 'Google DeepMind',
        role: 'Cloud Architect',
        status: 'Applied',
        jobType: 'Full-time',
        workMode: 'Remote',
        location: 'Mountain View, CA',
        salary: '$180,000 - $220,000',
        appliedDate: new Date('2026-03-22'),
        jobUrl: 'https://deepmind.google/careers',
        notes: 'Applied through Google Careers portal for Cloud Infrastructure team.',
        contactEmail: 'careers@deepmind.com'
      },
      {
        user: userId,
        company: 'OpenAI',
        role: 'React Frontend Developer',
        status: 'Interview',
        jobType: 'Contract',
        workMode: 'Hybrid',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        appliedDate: new Date('2026-03-25'),
        jobUrl: 'https://openai.com/careers',
        notes: 'Pair programming round coming up with Frontend lead.',
        contactEmail: 'jobs@openai.com'
      },
      {
        user: userId,
        company: 'Stripe',
        role: 'Software Engineering Intern',
        status: 'Selected',
        jobType: 'Internship',
        workMode: 'Remote',
        location: 'Remote',
        salary: '$55/hr ($9,500/mo)',
        appliedDate: new Date('2026-03-15'),
        jobUrl: 'https://stripe.com/jobs/intern',
        notes: 'Summer internship offer accepted!',
        contactEmail: 'university@stripe.com'
      },
      {
        user: userId,
        company: 'Uber',
        role: 'DevOps Engineer',
        status: 'Rejected',
        jobType: 'Full-time',
        workMode: 'On-site',
        location: 'San Francisco, CA',
        salary: '$140,000 - $165,000',
        appliedDate: new Date('2026-03-10'),
        jobUrl: 'https://uber.com/careers',
        notes: 'Position closed internally. Encouraged to apply for future openings.',
        contactEmail: 'talent@uber.com'
      }
    ];

    const inserted = await Job.insertMany(sampleJobs);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample applications!`,
      data: inserted
    });
  } catch (error) {
    console.error('seedSampleJobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed sample jobs',
      error: error.message
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getStats,
  seedSampleJobs
};
