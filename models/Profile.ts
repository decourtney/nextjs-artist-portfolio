import { Types, Schema, Document, model, models } from "mongoose";

export interface IProfile extends Document {
  username: string;
  bio?: string;
  avatar?: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  userId: Types.ObjectId; // References NextAuth user
}

const ProfileSchema = new Schema<IProfile>(
  {
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    avatar: { type: String, default: "/default-avatar.png" },
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: { type: Boolean, default: true },
    },
    // Link to NextAuth user
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default models.Profile || model<IProfile>("Profile", ProfileSchema);
