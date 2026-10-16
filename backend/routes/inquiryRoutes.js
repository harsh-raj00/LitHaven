const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// @route   POST /api/inquiries
// @desc    Initiate an inquiry or purchase offer for a book
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { bookId, offeredPrice, proposedLocation, message } = req.body;

    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Prevent making offer on own book
    if (book.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot make an offer on your own book listing'
      });
    }

    // Check if an existing inquiry already exists between this buyer and book
    let inquiry = await Inquiry.findOne({
      book: bookId,
      buyer: req.user._id
    });

    if (inquiry) {
      // Append message to existing thread
      inquiry.messages.push({
        sender: req.user._id,
        text: message || `Updated offer: $${offeredPrice || book.price}`
      });
      if (offeredPrice) inquiry.offeredPrice = Number(offeredPrice);
      if (proposedLocation) inquiry.proposedLocation = proposedLocation;
      inquiry.lastMessageAt = Date.now();
      await inquiry.save();
    } else {
      inquiry = await Inquiry.create({
        book: bookId,
        buyer: req.user._id,
        seller: book.owner,
        offeredPrice: offeredPrice !== undefined ? Number(offeredPrice) : book.price,
        proposedLocation: proposedLocation || 'Campus Library Main Entrance',
        messages: [
          {
            sender: req.user._id,
            text: message || `Hi! I am interested in purchasing "${book.title}". Is it available?`
          }
        ]
      });
    }

    const populated = await Inquiry.findById(inquiry._id)
      .populate('book', 'title coverImage price status')
      .populate('buyer', 'name college avatar')
      .populate('seller', 'name college avatar');

    res.status(201).json({
      success: true,
      message: 'Inquiry and offer sent to seller',
      inquiry: populated
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/inquiries/my-inquiries
// @desc    Get all active conversations where current user is buyer OR seller
// @access  Private
router.get('/my-inquiries', protect, async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    })
      .sort({ lastMessageAt: -1 })
      .populate('book', 'title author coverImage price status')
      .populate('buyer', 'name college department avatar')
      .populate('seller', 'name college department avatar');

    res.json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/inquiries/:id
// @desc    Get single inquiry conversation details
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('book', 'title author coverImage price condition status campusLocation')
      .populate('buyer', 'name college department phone avatar rating')
      .populate('seller', 'name college department phone avatar rating')
      .populate('messages.sender', 'name avatar');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify user is participant
    const isParticipant =
      inquiry.buyer._id.toString() === req.user._id.toString() ||
      inquiry.seller._id.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this inquiry'
      });
    }

    res.json({
      success: true,
      inquiry
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/inquiries/:id/messages
// @desc    Send a new chat message inside an inquiry thread
// @access  Private
router.post('/:id/messages', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const isParticipant =
      inquiry.buyer.toString() === req.user._id.toString() ||
      inquiry.seller.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to message in this thread'
      });
    }

    inquiry.messages.push({
      sender: req.user._id,
      text: text.trim()
    });
    inquiry.lastMessageAt = Date.now();
    await inquiry.save();

    const updated = await Inquiry.findById(req.params.id)
      .populate('messages.sender', 'name avatar')
      .populate('book', 'title coverImage price status')
      .populate('buyer', 'name college avatar')
      .populate('seller', 'name college avatar');

    res.json({
      success: true,
      message: 'Message delivered',
      inquiry: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/inquiries/:id/status
// @desc    Update offer status (accepted, declined, completed)
// @access  Private
router.put('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Only seller can accept/decline; either can mark completed once accepted
    const isSeller = inquiry.seller.toString() === req.user._id.toString();
    const isBuyer = inquiry.buyer.toString() === req.user._id.toString();

    if (!isSeller && !isBuyer) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    inquiry.status = status;
    inquiry.messages.push({
      sender: req.user._id,
      text: `Offer status changed to: ${status.toUpperCase()}`
    });
    inquiry.lastMessageAt = Date.now();
    await inquiry.save();

    // If accepted or completed, optionally update book status
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(inquiry.book, { status: 'reserved' });
    } else if (status === 'completed') {
      await Book.findByIdAndUpdate(inquiry.book, { status: 'sold' });
    }

    res.json({
      success: true,
      message: `Offer status updated to ${status}`,
      inquiry
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
