import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import { IArtwork } from "./Artwork";

export interface IIllustration extends Document {
  _id: string;
  name: string;
  artwork: ObjectId[];
}

const IllustrationSchema = new Schema<IIllustration>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    artwork: [
      {
        type: Types.ObjectId,
        default: undefined,
        required: false,
        ref: "Artwork",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Illustration ||
  mongoose.model<IIllustration>("Illustration", IllustrationSchema);
