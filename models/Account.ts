import { Types, Schema, Document, model, models } from "mongoose";

export interface IAccount extends Document {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
  id_token: string;
  userId: Types.ObjectId;
}

const AccountSchema = new Schema<IAccount>(
  {
    provider: { type: String, required: true },
    type: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: { type: String, required: true },
    expires_at: { type: Number, required: true },
    scope: { type: String, required: true },
    token_type: { type: String, required: true },
    id_token: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Export the User model (reuse existing model if already compiled)
export default models.Account || model<IAccount>("Account", AccountSchema);
