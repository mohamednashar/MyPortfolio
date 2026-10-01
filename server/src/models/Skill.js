import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend & APIs', 'Programming & Algorithms', 'Tools & Methodologies'],
      default: 'Frontend',
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    icon: {
      type: String,
      default: 'Code',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
