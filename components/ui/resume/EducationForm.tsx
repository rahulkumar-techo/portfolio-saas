"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "../primary-button";
import { EducationRequestBody } from "@/types/server-types/resume";

interface EducationFormProps {
  initialData?: Partial<EducationRequestBody> | null;
  loading?: boolean;
  onSubmit: (data: EducationRequestBody) => Promise<void>;
  onCancel?: () => void;
}

const defaultForm: EducationRequestBody = {
  degree: "",
  field: "",
  institution: "",
  location: "",
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  grade: "",
  description: "",
  order: 0,
};

export default function EducationForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const [formData, setFormData] = useState<EducationRequestBody>(defaultForm);
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

    if (!formData.degree || !formData.field || !formData.institution || !formData.startYear) {
      setError("Degree, field, institution and start year are required");
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
          <Label>Degree *</Label>
          <Input
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          />
        </div>
        <div>
          <Label>Field *</Label>
          <Input
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          />
        </div>
        <div>
          <Label>Institution *</Label>
          <Input
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <Label>Start Year *</Label>
          <Input
            type="number"
            value={formData.startYear}
            onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>End Year</Label>
          <Input
            type="number"
            value={formData.endYear || ""}
            onChange={(e) => setFormData({ ...formData, endYear: Number(e.target.value) || undefined })}
          />
        </div>
      </div>

      <div>
        <Label>Grade</Label>
        <Input
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          rows={3}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <PrimaryButton type="submit" loading={loading}>
          {initialData ? "Update Education" : "Add Education"}
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
