const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  reporter: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Issue"
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  environmentalImpact: {
    type: String  // e.g., "Affects local water table", "Wildlife risk"
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved']
  },
  upvotes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String // Store user IDs
  }],
  comments: [{
    text: { type: String },
    sender: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Issue', IssueSchema);