import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'Please provide a position title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: 'Present',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Training', 'Freelance'],
      default: 'Full-time',
    },
    description: {
      type: String,
      default: '',
    },
    achievements: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    companyLogo: {
      type: String,
      default: '',
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

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
