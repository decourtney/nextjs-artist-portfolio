import mongoose, { Schema, Document } from "mongoose";

export interface TagDocument extends Document {
  _id: string;
  label: string;
  type: string;
}

const TagSchema = new Schema<TagDocument>(
  {
    label: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["category", "medium", "size"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tag ||
  mongoose.model<TagDocument>("Tag", TagSchema);
