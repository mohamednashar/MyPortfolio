import Education from '../models/Education.js';

// @desc    Get all education & activities
// @route   GET /api/education
// @access  Public
export const getEducations = async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create education / activity
// @route   POST /api/education
// @access  Private (Admin)
export const createEducation = async (req, res) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json({ success: true, data: item, message: 'Education/Activity added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update education / activity
// @route   PUT /api/education/:id
// @access  Private (Admin)
export const updateEducation = async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, data: item, message: 'Updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete education / activity
// @route   DELETE /api/education/:id
// @access  Private (Admin)
export const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
