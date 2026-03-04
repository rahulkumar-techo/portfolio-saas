/**
 * Experience Form (Reusable - Page Based)
 * Pure Controlled Form
 */

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { PrimaryButton } from "../primary-button";
import { generateColorFromString } from "@/lib/random-color";
import { ExperienceRequestBody } from "@/types/server-types/resume";

interface ExperienceFormProps {
  initialData?: Partial<ExperienceRequestBody> | null;
  loading?: boolean;
  onSubmit: (data: ExperienceRequestBody) => Promise<void>;
}

const jobTypes = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
  "Remote",
  "Hybrid",
  "On-site",
];

const defaultForm: ExperienceRequestBody = {
  jobRole: "",
  jobType: "",
  company: "",
  period: "",
  description: "",
  tech: [],
  order: 0,
};

export default function ExperienceForm({
  initialData,
  loading = false,
  onSubmit,
}: ExperienceFormProps) {

  const [formData, setFormData] = useState(defaultForm);
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        tech: Array.isArray(initialData.tech) ? initialData.tech : [],
      });
    }
  }, [initialData]);

  const validate = () => {
    if (!formData.jobRole.trim()) return "Job role is required";
    if (!formData.jobType.trim()) return "Job type is required";
    if (!formData.company.trim()) return "Company is required";
    if (!formData.period.trim()) return "Period is required";
    if (!formData.description.trim()) return "Description is required";
    return null;
  };

  const addTech = (value: string) => {
    const items = value
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      tech: [...new Set([...prev.tech, ...items])],
    }));
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit({
      ...formData,
      jobRole: formData.jobRole.trim(),
      jobType: formData.jobType.trim(),
      company: formData.company.trim(),
      period: formData.period.trim(),
      description: formData.description.trim(),
    });

    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 bg-background p-8 rounded-2xl border"
    >
      <h2 className="text-xl font-bold">
        {initialData ? "Update Experience" : "Add Experience"}
      </h2>

      {/* Job Role */}
      <div>
        <Label>Job Role *</Label>
        <Input
          value={formData.jobRole}
          onChange={(e) =>
            setFormData({ ...formData, jobRole: e.target.value })
          }
        />
      </div>

      {/* Job Type */}
      <div>
        <Label>Job Type *</Label>
        <Select
          value={formData.jobType}
          onValueChange={(value) =>
            setFormData({ ...formData, jobType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company */}
      <div>
        <Label>Company *</Label>
        <Input
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>

      {/* Period */}
      <div>
        <Label>Period *</Label>
        <Input
          value={formData.period}
          onChange={(e) =>
            setFormData({ ...formData, period: e.target.value })
          }
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description *</Label>
        <Textarea
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Tech */}
      <div>
        <Label>Technologies</Label>
        <Input
          placeholder="Press space or enter"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (["Enter", " ", ","].includes(e.key)) {
              e.preventDefault();
              if (techInput.trim()) {
                addTech(techInput);
                setTechInput("");
              }
            }
          }}
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.tech ?? []).map((tech) => (
            <Badge
              key={tech}
              style={{
                backgroundColor: generateColorFromString(tech),
              }}
              className="text-white flex items-center gap-1"
            >
              {tech}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => removeTech(tech)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Order */}
      <div>
        <Label>Display Order</Label>
        <Input
          type="number"
          min={0}
          value={formData.order}
          onChange={(e) =>
            setFormData({
              ...formData,
              order: Number(e.target.value),
            })
          }
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <PrimaryButton type="submit" loading={loading}>
        {initialData ? "Update" : "Save"}
      </PrimaryButton>
    </form>
  );
}
