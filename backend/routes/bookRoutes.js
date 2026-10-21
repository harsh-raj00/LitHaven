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

    // Category filter with alias and fuzzy matching
    if (category && category !== 'All' && category !== '') {
      if (/^engineering/i.test(category)) {
        query.category = { $regex: /Engineering/i };
      } else if (/^quantitative\s*finance/i.test(category) || /^commerce/i.test(category)) {
        query.$or = [
          { category: { $regex: /Commerce/i } },
          { subject: { $regex: /Quantitative Finance/i } },
          { title: { $regex: /Quantitative/i } }
        ];
      } else if (/^computer\s*science/i.test(category)) {
        query.category = { $regex: /Computer Science/i };
      } else if (/^machine\s*learning/i.test(category)) {
        query.category = { $regex: /Machine Learning/i };
      } else if (/^competitive/i.test(category)) {
        query.category = { $regex: /Competitive Exams/i };
      } else {
        query.category = category;
      }
    }

    // Condition filter
    if (condition && condition !== 'All' && condition !== '') {
      query.condition = condition;
    }

    // Subject filter
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    // Semester filter
    if (semester && semester !== 'All' && semester !== '') {
      query.semester = { $regex: semester, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = {};
      if (minPrice !== undefined && minPrice !== '') {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        priceFilter.$lte = Number(maxPrice);
      }
      if (Object.keys(priceFilter).length > 0) {
        query.price = priceFilter;
      }
    }

    // Search query (title, author, subject, description, isbn, category)
    if (search && search.trim() !== '') {
      const rawSearch = search.trim();
      const escaped = rawSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const searchConditions = [
        { title: { $regex: escaped, $options: 'i' } },
        { author: { $regex: escaped, $options: 'i' } },
        { subject: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { isbn: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } }
      ];

      // Handle common aliases for popular subject searches
      if (/engineering\s*(&\s*tech|\s*tech)/i.test(rawSearch)) {
        searchConditions.push({ category: { $regex: /Engineering/i } });
        searchConditions.push({ subject: { $regex: /Engineering/i } });
      }
      if (/quantitative\s*finance/i.test(rawSearch)) {
        searchConditions.push({ subject: { $regex: /Quantitative Finance/i } });
        searchConditions.push({ title: { $regex: /Quantitative/i } });
        searchConditions.push({ category: { $regex: /Commerce, Finance/i } });
      }
      if (/computer\s*science/i.test(rawSearch)) {
        searchConditions.push({ category: { $regex: /Computer Science/i } });
      }
      if (/machine\s*learning/i.test(rawSearch)) {
        searchConditions.push({ category: { $regex: /Machine Learning/i } });
        searchConditions.push({ subject: { $regex: /Machine Learning/i } });
      }
      if (/competitive\s*exams?/i.test(rawSearch)) {
        searchConditions.push({ category: { $regex: /Competitive Exams/i } });
        searchConditions.push({ subject: { $regex: /GATE|CAT|Aptitude/i } });
      }

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
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
      'Computer Science & AI',
      'Machine Learning & AI',
      'Software Development & Web',
      'Interview Preparation & Coding',
      'Competitive Exams',
      'Engineering & Technology',
      'Medical & Healthcare',
      'Commerce, Finance & MBA',
      'Natural Sciences & Math',
      'Law & Legal Studies',
      'Humanities & Social Sciences',
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
