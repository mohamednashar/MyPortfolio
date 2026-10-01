import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an education title or degree'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Please provide an institution name'],
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    period: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Degree', 'Competition', 'Activity', 'Certification'],
      default: 'Degree',
    },
    description: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
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

const Education = mongoose.model('Education', educationSchema);
export default Education;
