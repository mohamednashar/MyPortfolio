import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Message from '../models/Message.js';
import Profile from '../models/Profile.js';

// @desc    Get dashboard metrics & overview stats
// @route   GET /api/stats
// @access  Private (Admin)
export const getStats = async (req, res) => {
  try {
    const [
      totalProjects,
      featuredProjects,
      publishedProjects,
      totalSkills,
      totalExperiences,
      totalEducations,
      unreadMessages,
      totalMessages,
      latestProject,
      profile,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.countDocuments({ published: true }),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.countDocuments(),
      Project.findOne().sort({ updatedAt: -1 }).select('title updatedAt'),
      Profile.findOne(),
    ]);

    res.json({
      success: true,
      data: {
        projects: {
          total: totalProjects,
          featured: featuredProjects,
          published: publishedProjects,
        },
        skills: {
          total: totalSkills,
        },
        experience: {
          total: totalExperiences,
        },
        education: {
          total: totalEducations,
        },
        messages: {
          total: totalMessages,
          unread: unreadMessages,
        },
        overview: {
          lastProjectUpdated: latestProject?.title || 'None',
          lastActiveAt: profile?.updatedAt || new Date(),
          profileName: profile?.name || 'Mohamed Alaa',
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
