const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');

// Multer storage for documents & study files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'resource-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// @route   GET /api/resources
// @desc    Browse study materials (filter by fileType, category, subject, keyword search)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, fileType, category, subject, semester, sort = 'popular', page = 1, limit = 12 } = req.query;

    const query = { isPublic: true };

    if (fileType && fileType !== 'All') {
      query.fileType = fileType;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    if (semester && semester !== 'All') {
      query.semester = { $regex: semester, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { downloadCount: -1 };
    if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'upvotes') {
      sortOptions = { upvotes: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('uploader', 'name college department avatar'),
      Resource.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      resources
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resources/my-resources
// @desc    Get resources uploaded by current user
// @access  Private
router.get('/my-resources', protect, async (req, res, next) => {
  try {
    const resources = await Resource.find({ uploader: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource detail
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'uploader',
      'name college department avatar'
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, resource });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resources/:id/download
// @desc    Increment download count and return download URL / info
// @access  Public
router.post('/:id/download', async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      message: 'Download registered',
      downloadUrl: resource.fileUrl,
      downloadCount: resource.downloadCount
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resources
// @desc    Upload a new study resource (file upload or shared drive link)
// @access  Private
router.post('/', protect, upload.single('resourceFile'), async (req, res, next) => {
  try {
    const { title, description, category, fileType, subject, semester, fileUrl, tags } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Title and subject are required'
      });
    }

    let finalFileUrl = fileUrl || '';
    let fileName = 'resource.pdf';
    let fileSize = '2.4 MB';

    if (req.file) {
      finalFileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      const sizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
      fileSize = `${sizeMB} MB`;
    } else if (!finalFileUrl) {
      // Default sample downloadable note
      finalFileUrl = '/covers/cover_placeholder.jpg';
      fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_notes.pdf`;
      fileSize = '3.8 MB';
    }

    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        parsedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const resource = await Resource.create({
      title,
      description: description || 'High-quality academic study resource shared on LitHaven.',
      category: category || 'Computer Science & AI',
      fileType: fileType || 'PDF',
      subject,
      semester: semester || 'Current Semester',
      fileUrl: finalFileUrl,
      fileName,
      fileSize,
      tags: parsedTags,
      uploader: req.user._id
    });

    const populated = await Resource.findById(resource._id).populate(
      'uploader',
      'name college department avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Study resource published to vault successfully',
      resource: populated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete a study resource (uploader only)
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resource'
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource removed from vault'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
