const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');

// Helper function to sign JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lithaven_super_secret_jwt_key_2026_modern_mern_academic',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new student account
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: errors.array()[0].msg
        });
      }

      const { name, email, password, college, department, year, phone, bio, avatar } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        college: college || 'Delhi Technological University',
        department: department || 'Computer Science & Engineering',
        year: year || '2nd Year',
        phone: phone || '',
        bio: bio || 'Passionate student active on LitHaven campus network.',
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          year: user.year,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          rating: user.rating,
          reviewCount: user.reviewCount,
          wishlist: user.wishlist,
          savedResources: user.savedResources
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: errors.array()[0].msg
        });
      }

      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          year: user.year,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          rating: user.rating,
          reviewCount: user.reviewCount,
          wishlist: user.wishlist,
          savedResources: user.savedResources
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile with populated wishlist
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist')
      .populate('savedResources');

    const bookListingCount = await Book.countDocuments({ owner: req.user._id });
    const resourceUploadCount = await Resource.countDocuments({ uploader: req.user._id });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        bookListingCount,
        resourceUploadCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'college', 'department', 'year', 'phone', 'bio', 'avatar'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/user/:id
// @desc    Get public profile of another student
// @access  Public
router.get('/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -wishlist -savedResources');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const books = await Book.find({ owner: user._id, status: 'available' }).sort({ createdAt: -1 });
    const resources = await Resource.find({ uploader: user._id, isPublic: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      listings: books,
      resources
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
