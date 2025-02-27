import mongoose, { Schema, Document } from "mongoose";

export interface TagDocument extends Document {
  name: string;
  type: string;
}

const TagSchema = new Schema<TagDocument>(
  {
    name: {
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
