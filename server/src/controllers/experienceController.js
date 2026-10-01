import Experience from '../models/Experience.js';

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Private (Admin)
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience, message: 'Experience added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience entry not found' });
    }

    res.json({ success: true, data: experience, message: 'Experience updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience entry not found' });
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
