import mongoose from "mongoose";
import { CategoryType, categoryValues } from "@/lib/categories";

export interface ArtworkDocument extends mongoose.Document {
  name: string;
  description: string;
  category: string
  medium: CategoryType;
  size: string;
  src: string;
  thumbSrc: string;
  alt: string;
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
  category: {
    type: String,
    enum: categoryValues,
  },
  medium: {
    type: String,
    maxlength: [40, "Medium cannot be more than 40 characters long"],
  },
  size:{
    type: String,
    maxlength: [40, "Size cannot be more than 40 characters long"],
  },
  src: {
    type: String,
    maxlength: [255, "Source cannot be more than 255 characters long"],
  },
  thumbSrc:{
    type: String,
    maxlength: [255, "Source cannot be more than 255 characters long"],
  },
  alt: {
    type: String,
    maxlength: [255, "Alt text cannot be more than 255 characters long"],
  },
});

export default mongoose.models.Artwork ||
  mongoose.model<ArtworkDocument>("Artwork", ArtworkSchema);
