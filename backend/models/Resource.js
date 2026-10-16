const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the resource title'],
      trim: true,
      maxlength: [180, 'Resource title cannot exceed 180 characters']
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select an academic category'],
      default: 'Computer Science & AI'
    },
    fileType: {
      type: String,
      required: true,
      enum: [
        'PDF',
        'Notes',
        'Assignment',
        'Question Paper',
        'Solution',
        'Cheat Sheet',
        'Presentation',
        'Other'
      ],
      default: 'PDF'
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject/course'],
      trim: true
    },
    semester: {
      type: String,
      default: 'Semester 4'
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL or path is required']
    },
    fileName: {
      type: String,
      default: 'document.pdf'
    },
    fileSize: {
      type: String,
      default: '2.5 MB'
    },
    tags: {
      type: [String],
      default: []
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    upvotes: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

resourceSchema.index({ title: 'text', subject: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, fileType: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
