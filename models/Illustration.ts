import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import { IArtwork } from "./Artwork";
import slugify from "slugify";

export interface IIllustration extends Document {
  // _id: string;
  name: string;
  artworkIds: ObjectId[];
  slug: string;
}

const IllustrationSchema = new Schema<IIllustration>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    artworkIds: [
      {
        type: Types.ObjectId,
        default: undefined,
        required: false,
        ref: "Artwork",
      },
    ],
    slug: { type: String, unique: true },
  },
  { timestamps: true },
);

IllustrationSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, trim: true });
  }
  next();
});

IllustrationSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update || Array.isArray(update)) return next();

  const u = update as { $set?: { name?: string; slug?: string } };

  if (u.$set?.name) {
    u.$set.slug = slugify(u.$set.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

export default mongoose.models.Illustration ||
  mongoose.model<IIllustration>("Illustration", IllustrationSchema);
