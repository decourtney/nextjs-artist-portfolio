import mongoose, { Schema } from "mongoose";
import { CategoryType, categoryValues } from "@/lib/categories";

export interface ArtworkDocument extends mongoose.Document {
  _id: string;
  name: string;
  description: string;
  src: string;
  thumbSrc: string;
  alt: string;
  medium: mongoose.Types.ObjectId;
  size: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
}

const ArtworkSchema = new mongoose.Schema<ArtworkDocument>({
  name: {
    type: String,
    unique: true,
    maxlength: [60, "Name cannot be more than 60 characters long"],
  },
  description: {
    type: String,
    maxlength: [255, "Description cannot be more than 255 characters long"],
  },
  src: {
    type: String,
    maxlength: [255, "Source cannot be more than 255 characters long"],
  },
  thumbSrc: {
    type: String,
    maxlength: [255, "Source cannot be more than 255 characters long"],
  },
  alt: {
    type: String,
    maxlength: [255, "Alt text cannot be more than 255 characters long"],
  },
  medium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

export default mongoose.models.Artwork ||
  mongoose.model<ArtworkDocument>("Artwork", ArtworkSchema);
