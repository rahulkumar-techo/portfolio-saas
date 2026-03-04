"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "../primary-button";
import { CertificateRequestBody } from "@/types/server-types/resume";

interface CertificateFormProps {
  initialData?: Partial<CertificateRequestBody> | null;
  loading?: boolean;
  onSubmit: (data: CertificateRequestBody) => Promise<void>;
  onCancel?: () => void;
}

const defaultForm: CertificateRequestBody = {
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

export default function CertificateForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  const [formData, setFormData] = useState<CertificateRequestBody>(defaultForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultForm, ...initialData });
    } else {
      setFormData(defaultForm);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name || !formData.issuer || !formData.issueDate) {
      setError("Name, issuer and issue date are required");
      return;
    }

    setError(null);
    await onSubmit(formData);
    if (!initialData) {
      setFormData(defaultForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-4 bg-background">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Name *</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
          <Label>Issuer *</Label>
          <Input value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} />
        </div>
        <div>
          <Label>Issue Date *</Label>
          <Input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
        </div>
        <div>
          <Label>Expiry Date</Label>
          <Input
            type="date"
            value={formData.expiryDate || ""}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Credential ID</Label>
          <Input
            value={formData.credentialId || ""}
            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
          />
        </div>
        <div>
          <Label>Credential URL</Label>
          <Input
            value={formData.credentialUrl || ""}
            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <PrimaryButton type="submit" loading={loading}>
          {initialData ? "Update Certificate" : "Add Certificate"}
        </PrimaryButton>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
