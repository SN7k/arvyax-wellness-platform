import express from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import Session from '../models/Session.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all published sessions (public)
// @route   GET /api/sessions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'name email')
      .sort({ created_at: -1 })
      .limit(50); // Limit results for performance

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
});

// @desc    Get user's own sessions (draft + published)
// @route   GET /api/sessions/my-sessions
// @access  Private
router.get('/my-sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ updated_at: -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your sessions'
    });
  }
});

// @desc    Get a single user session by ID
// @route   GET /api/sessions/my-sessions/:id
// @access  Private
router.get('/my-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({ 
      _id: req.params.id, 
      user_id: req.user._id 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session'
    });
  }
});

// @desc    Save or update a draft session
// @route   POST /api/sessions/my-sessions/save-draft
// @access  Private
router.post('/my-sessions/save-draft', authMiddleware, [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('json_file_url').isURL().withMessage('Please enter a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, tags = [], json_file_url, sessionId } = req.body;

    let session;

    if (sessionId) {
      // Update existing session - preserve status if already published
      const existingSession = await Session.findOne({ _id: sessionId, user_id: req.user._id });
      
      if (!existingSession) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user._id },
        {
          title,
          tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
          json_file_url,
          // Keep existing status if published, otherwise set to draft
          status: existingSession.status === 'published' ? 'published' : 'draft'
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new session
      session = new Session({
        user_id: req.user._id,
        title,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
        json_file_url,
        status: 'draft'
      });

      await session.save();
    }

    res.json({
      success: true,
      message: sessionId ? 'Draft updated successfully' : 'Draft saved successfully',
      data: session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving draft'
    });
  }
});

// @desc    Publish a session
// @route   POST /api/sessions/my-sessions/publish
// @access  Private
router.post('/my-sessions/publish', authMiddleware, [
  body('sessionId').notEmpty().withMessage('Session ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { sessionId } = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.user._id },
      { status: 'published' },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session published successfully',
      data: session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while publishing session'
    });
  }
});

// @desc    Delete a session
// @route   DELETE /api/sessions/my-sessions/:id
// @access  Private
router.delete('/my-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ 
      _id: req.params.id, 
      user_id: req.user._id 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting session'
    });
  }
});

export default router;
