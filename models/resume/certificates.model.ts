import mongoose, { Schema, models } from "mongoose";

export interface ICertificate {
  userId: mongoose.Types.ObjectId;
  certificateId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    certificateId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

CertificateSchema.index({ userId: 1, certificateId: 1 }, { unique: true });

export default models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);
