<<<<<<< HEAD
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better query performance
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ tags: 1 }); // For tag-based searches
sessionSchema.index({ created_at: -1 }); // For sorting by creation date

// Virtual for populating user information
sessionSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
sessionSchema.set('toJSON', { virtuals: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
=======
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better query performance
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ tags: 1 }); // For tag-based searches
sessionSchema.index({ created_at: -1 }); // For sorting by creation date

// Virtual for populating user information
sessionSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
sessionSchema.set('toJSON', { virtuals: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
>>>>>>> b35576396d070ca49a2c74ab27e42f4d40196187
