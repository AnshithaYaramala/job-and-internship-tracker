const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getStats,
  seedSampleJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// All job routes require JWT authentication
router.use(protect);

router.post('/seed', seedSampleJobs);
router.get('/stats', getStats);
router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJobById).put(updateJob).delete(deleteJob);

module.exports = router;
