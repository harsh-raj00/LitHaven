const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Submit a seller review after book handover
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { sellerId, bookId, rating, comment } = req.body;

    if (!sellerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID, rating and comment are required'
      });
    }

    if (sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself'
      });
    }

    const review = await Review.create({
      seller: sellerId,
      book: bookId || null,
      reviewer: req.user._id,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Update seller's average rating
    const allReviews = await Review.find({ seller: sellerId });
    const avgRating =
      allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(sellerId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allReviews.length
    });

    const populated = await Review.findById(review._id).populate(
      'reviewer',
      'name college avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review: populated
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reviews/seller/:sellerId
// @desc    Get all reviews for a specific seller
// @access  Public
router.get('/seller/:sellerId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .sort({ createdAt: -1 })
      .populate('reviewer', 'name college avatar')
      .populate('book', 'title');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
