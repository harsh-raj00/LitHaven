const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Multer storage for book cover uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'book-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// @route   GET /api/books
// @desc    Get all books with advanced filtering, search, sorting and pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      subject,
      semester,
      status = 'available',
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Availability filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Subject filter
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    // Semester filter
    if (semester && semester !== 'All') {
      query.semester = { $regex: semester, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Search query (title, author, subject, description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'popular') {
      sortOptions = { views: -1, wishlistCount: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'name college department year rating avatar'),
      Book.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      books
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/books/featured
// @desc    Get curated featured and top-demand academic books
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const featured = await Book.find({ status: 'available' })
      .sort({ views: -1, wishlistCount: -1, createdAt: -1 })
      .limit(6)
      .populate('owner', 'name college rating avatar');

    res.json({
      success: true,
      books: featured
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/books/categories
// @desc    Get categories with counts
// @access  Public
router.get('/categories', async (req, res, next) => {
  try {
    const counts = await Book.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categories = [
      'Engineering & Technology',
      'Medical & Healthcare',
      'Computer Science & AI',
      'Natural Sciences & Math',
      'Commerce, Finance & MBA',
      'Law & Legal Studies',
      'Humanities & Social Sciences',
      'Competitive Exams',
      'Literature & Fiction'
    ].map((cat) => {
      const match = counts.find((c) => c._id === cat);
      return {
        name: cat,
        count: match ? match.count : 0
      };
    });

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/books/my-listings
// @desc    Get all listings belonging to current authenticated user
// @access  Private
router.get('/my-listings', protect, async (req, res, next) => {
  try {
    const books = await Book.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/books/:id
// @desc    Get single book details by ID (increments views)
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name college department year rating reviewCount phone bio avatar');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Find similar books in the same category
    const relatedBooks = await Book.find({
      _id: { $ne: book._id },
      category: book.category,
      status: 'available'
    })
      .limit(4)
      .populate('owner', 'name college');

    res.json({
      success: true,
      book,
      relatedBooks
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/books
// @desc    Create a new book listing
// @access  Private
router.post(
  '/',
  protect,
  upload.single('coverImageFile'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a valid number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('condition').notEmpty().withMessage('Condition is required')
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

      const {
        title,
        author,
        description,
        isbn,
        edition,
        price,
        originalPrice,
        condition,
        category,
        subject,
        semester,
        conditionNotes,
        campusLocation,
        coverImageUrl
      } = req.body;

      // Determine cover image: uploaded file > passed url > preset
      let finalCover = '/covers/cover_placeholder.jpg';
      if (req.file) {
        finalCover = `/uploads/${req.file.filename}`;
      } else if (coverImageUrl && coverImageUrl.trim()) {
        finalCover = coverImageUrl.trim();
      }

      const book = await Book.create({
        title,
        author,
        description,
        isbn: isbn || '',
        edition: edition || 'Latest Edition',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.6,
        condition,
        category,
        subject: subject || 'General',
        semester: semester || 'All Semesters',
        coverImage: finalCover,
        images: [finalCover],
        conditionNotes: conditionNotes || 'Good condition, no missing pages.',
        campusLocation: campusLocation || 'Main Campus Library',
        owner: req.user._id
      });

      const populatedBook = await Book.findById(book._id).populate(
        'owner',
        'name college department rating avatar'
      );

      res.status(201).json({
        success: true,
        message: 'Book listing published successfully',
        book: populatedBook
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   PUT /api/books/:id
// @desc    Update book listing (owner only)
// @access  Private
router.put('/:id', protect, upload.single('coverImageFile'), async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Make sure user is owner
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this listing'
      });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.coverImageUrl) {
      updates.coverImage = req.body.coverImageUrl;
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);

    book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('owner', 'name college rating avatar');

    res.json({
      success: true,
      message: 'Listing updated successfully',
      book
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book listing (owner only)
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    // Remove from all user wishlists
    await User.updateMany({ wishlist: book._id }, { $pull: { wishlist: book._id } });

    res.json({
      success: true,
      message: 'Listing removed successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/books/:id/wishlist
// @desc    Toggle book in current user's wishlist
// @access  Private
router.post('/:id/wishlist', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const user = await User.findById(req.user._id);
    const isWishlisted = user.wishlist.some(
      (bId) => bId.toString() === book._id.toString()
    );

    if (isWishlisted) {
      // Remove from wishlist
      user.wishlist.pull(book._id);
      book.wishlistCount = Math.max(0, book.wishlistCount - 1);
    } else {
      // Add to wishlist
      user.wishlist.push(book._id);
      book.wishlistCount += 1;
    }

    await Promise.all([user.save(), book.save()]);

    res.json({
      success: true,
      isWishlisted: !isWishlisted,
      wishlistCount: book.wishlistCount,
      message: !isWishlisted ? 'Saved to your wishlist' : 'Removed from wishlist'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
