"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "../primary-button";
import { ProjectRequestBody } from "@/types/server-types/resume";

interface ProjectFormProps {
  initialData?: Partial<ProjectRequestBody> | null;
  loading?: boolean;
  onSubmit: (data: ProjectRequestBody) => Promise<void>;
  onCancel?: () => void;
}

const defaultForm: ProjectRequestBody = {
  title: "",
  description: "",
  tech: [],
  link: "",
  image: "",
  stars: 0,
};

export default function ProjectForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectRequestBody>(defaultForm);
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        tech: Array.isArray(initialData.tech) ? initialData.tech : [],
      });
    } else {
      setFormData(defaultForm);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.title || !formData.description || !formData.link) {
      setError("Title, description and link are required");
      return;
    }

    setError(null);
    await onSubmit(formData);
    if (!initialData) {
      setFormData(defaultForm);
      setTechInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-4 bg-background">
      <div>
        <Label>Title *</Label>
        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label>Project Link *</Label>
        <Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Image URL</Label>
          <Input
            value={formData.image || ""}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>
        <div>
          <Label>Stars</Label>
          <Input
            type="number"
            min={0}
            value={formData.stars || 0}
            onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>Tech</Label>
        <Input
          placeholder="Type and press Enter"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = techInput.trim();
              if (!value) return;
              if (!formData.tech.includes(value)) {
                setFormData({ ...formData, tech: [...formData.tech, value] });
              }
              setTechInput("");
            }
          }}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tech.map((item) => (
            <button
              key={item}
              type="button"
              className="px-2 py-1 text-xs border rounded-full"
              onClick={() =>
                setFormData({ ...formData, tech: formData.tech.filter((t) => t !== item) })
              }
            >
              {item} ×
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <PrimaryButton type="submit" loading={loading}>
          {initialData ? "Update Project" : "Add Project"}
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
