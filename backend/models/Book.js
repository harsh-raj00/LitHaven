const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the book title'],
      trim: true,
      maxlength: [180, 'Book title cannot exceed 180 characters']
    },
    author: {
      type: String,
      required: [true, 'Please specify the author name(s)'],
      trim: true,
      maxlength: [120, 'Author name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the book and condition'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    isbn: {
      type: String,
      trim: true,
      default: ''
    },
    edition: {
      type: String,
      trim: true,
      default: 'Standard Edition'
    },
    price: {
      type: Number,
      required: [true, 'Please specify the listing price (0 for free giveaway)'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0
    },
    condition: {
      type: String,
      required: [true, 'Please select the book condition'],
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Engineering & Technology',
        'Medical & Healthcare',
        'Computer Science & AI',
        'Natural Sciences & Math',
        'Commerce, Finance & MBA',
        'Law & Legal Studies',
        'Humanities & Social Sciences',
        'Interview Preparation & Coding',
        'Competitive Exams',
        'Literature & Fiction',
        'Other'
      ],
      default: 'Engineering & Technology'
    },
    subject: {
      type: String,
      trim: true,
      default: 'General'
    },
    semester: {
      type: String,
      trim: true,
      default: 'All Semesters'
    },
    images: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: '/covers/cover_placeholder.jpg'
    },
    conditionNotes: {
      type: String,
      default: 'Clean pages, minimal highlighting.'
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    campusLocation: {
      type: String,
      default: 'Campus Central Library or Main Quad'
    },
    views: {
      type: Number,
      default: 0
    },
    wishlistCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for fast text searches and filtered queries
bookSchema.index({ title: 'text', author: 'text', subject: 'text', description: 'text' });
bookSchema.index({ category: 1, status: 1, price: 1 });
bookSchema.index({ owner: 1 });

module.exports = mongoose.model('Book', bookSchema);
