import mongoose, { Schema } from "mongoose";
import Tag, { TagDocument } from "./Tag";
import { TagType } from "@/types/tagType";

export interface ArtworkDocument extends mongoose.Document {
  _id: string;
  name: string;
  description: string;
  src: string;
  thumbSrc: string;
  alt: string;
  metaWidth: number;
  metaHeight: number;
  substance: mongoose.Types.ObjectId;
  medium: mongoose.Types.ObjectId;
  size: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  price: number;
  isAvailable: boolean;
  isMainImage: boolean;
  isFeatured: boolean;
  isCategoryImage: boolean;
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
  metaWidth: {
    type: Number,
  },
  metaHeight: {
    type: Number,
  },
  substance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  medium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  price: {
    type: Number,
    min: [0, "Price cannot be negative"],
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isMainImage: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isCategoryImage: {
    type: Boolean,
    default: false,
  },
});

// Pre-save middleware to enforce constraints
ArtworkSchema.pre("save", async function (next) {
  const model = this.constructor as mongoose.Model<ArtworkDocument>;
  const Tag = mongoose.models.Tag; // Import the Tag model

  // Ensure only one home main image
  if (this.isMainImage) {
    await model.updateMany(
      { _id: { $ne: this._id }, isMainImage: true },
      { $set: { isMainImage: false } }
    );
  }

  // Limit featured artworks to 3
  if (this.isFeatured) {
    const featuredCount = await model.countDocuments({
      _id: { $ne: this._id },
      isFeatured: true,
    });

    if (featuredCount >= 3) {
      throw new Error("Maximum of 3 featured artworks allowed");
    }
  }

  if (this.isCategoryImage && this.category) {
    // Check if another artwork is already a category image for this specific category
    const existingCategoryImage = await model.findOne({
      _id: { $ne: this._id }, // Exclude the current artwork
      isCategoryImage: true,
      category: this.category, // Match the specific category tag
    });

    if (existingCategoryImage) {
      throw new Error(`A category image already exists for this category`);
    }
  }

  next();
});

export default mongoose.models.Artwork ||
  mongoose.model<ArtworkDocument>("Artwork", ArtworkSchema);

// Extended type for populated categories:
export type PopulatedArtworkDocument = Omit<
  ArtworkDocument,
  "substance" | "medium" | "size" | "category"
> & {
  substance: TagDocument;
  medium: TagDocument;
  size: TagDocument;
  category: TagDocument;
};
