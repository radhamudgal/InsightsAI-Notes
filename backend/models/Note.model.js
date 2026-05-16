const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const noteSchema = new mongoose.Schema({
  // every note belongs to one user — we use this to scope all queries
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, default: 'Untitled Note', trim: true },
  content:  { type: String, default: '' },
  tags:     [{ type: String, lowercase: true, trim: true }],
  category: { type: String, default: 'general', trim: true },
  color:    { type: String, default: '#ffffff' }, // hex color for card background

  isPinned:   { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isPublic:   { type: Boolean, default: false },

  // shareId is only set when isPublic becomes true (see pre-save hook below)
  // sparse: true means the unique index ignores null values
  shareId: { type: String, unique: true, sparse: true },

  // AI-generated fields — populated when user clicks AI buttons in the editor
  aiSummary:     { type: String, default: '' },
  aiActionItems: [{ type: String }],

  // auto-calculated on every save for the dashboard word count stat
  wordCount: { type: Number, default: 0 },
}, { timestamps: true });

// before saving: generate shareId if note is made public, and count words
noteSchema.pre('save', function (next) {
  if (this.isPublic && !this.shareId) {
    this.shareId = nanoid(10); // short unique ID for the share URL
  }
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).filter(Boolean).length;
  }
  next();
});

// index for fast per-user note listing (most common query)
noteSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
