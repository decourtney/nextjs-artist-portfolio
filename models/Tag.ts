import mongoose, { Schema, Document } from "mongoose";
import { TagType } from "@/types/tagType";

export interface ITag extends Document {
  // _id: string;
  label: string;
  type: TagType;
  description: string;
}

const TagSchema = new Schema<ITag>(
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
      enum: [TagType.CATEGORY, TagType.MEDIUM, TagType.SIZE, TagType.SUBSTANCE],
    },
    description: {
      type: String,
      maxlength: [255, "Description cannot be more than 255 characters long"],
    },
  },
  { timestamps: true }
);

// Adding a compound index for label and type to ensure uniqueness
TagSchema.index({ label: 1, type: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
