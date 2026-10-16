const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Resource = require('../models/Resource');
const User = require('../models/User');

// @route   GET /api/stats
// @desc    Get aggregate community statistics for LitHaven landing counters
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const [totalBooks, totalResources, totalStudents, availableBooks] = await Promise.all([
      Book.countDocuments(),
      Resource.countDocuments(),
      User.countDocuments(),
      Book.find({ status: 'available' })
    ]);

    // Calculate total student savings
    let totalSavings = 0;
    availableBooks.forEach((b) => {
      if (b.originalPrice && b.originalPrice > b.price) {
        totalSavings += b.originalPrice - b.price;
      }
    });

    // Total study downloads
    const resourceAgg = await Resource.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
    ]);
    const totalDownloads = resourceAgg[0] ? resourceAgg[0].totalDownloads : 0;

    res.json({
      success: true,
      stats: {
        activeListings: totalBooks,
        studyVaultResources: totalResources,
        scriptoriumResources: totalResources,
        registeredStudents: totalStudents,
        totalDownloads,
        totalStudentSavings: Math.round(totalSavings),
        activeCampuses: 48
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
