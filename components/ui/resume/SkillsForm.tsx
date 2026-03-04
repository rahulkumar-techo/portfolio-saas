/**
 * Skills Form
 * Handles skill groups + nested skills CRUD
 */

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SkillGroup } from "@/types/server-types/resume";

interface SkillsFormProps {
  initialData?: SkillGroup[];
  loading?: boolean;
  onSubmit: (data: SkillGroup[]) => Promise<void>;
}

export default function SkillsForm({
  initialData = [],
  loading,
  onSubmit,
}: SkillsFormProps) {
  const [groups, setGroups] = useState<SkillGroup[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGroups(initialData);
  }, [initialData]);

  const addGroup = () => {
    setGroups([
      ...groups,
      { category: "", color: "#6366f1", skills: [] },
    ]);
  };

  const removeGroup = (index: number) => {
    setGroups(groups.filter((_, i) => i !== index));
  };

  const updateGroup = (index: number, field: string, value: any) => {
    const updated = [...groups];
    (updated[index] as any)[field] = value;
    setGroups(updated);
  };

  const addSkill = (groupIndex: number) => {
    const updated = [...groups];
    updated[groupIndex].skills.push({
      name: "",
      level: 50,
    });
    setGroups(updated);
  };

  const removeSkill = (groupIndex: number, skillIndex: number) => {
    const updated = [...groups];
    updated[groupIndex].skills.splice(skillIndex, 1);
    setGroups(updated);
  };

  const updateSkill = (
    groupIndex: number,
    skillIndex: number,
    field: string,
    value: any
  ) => {
    const updated = [...groups];
    (updated[groupIndex].skills[skillIndex] as any)[field] = value;
    setGroups(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasInvalid = groups.some(
      (group) =>
        !group.category.trim() ||
        group.skills.some((skill) => !skill.name.trim())
    );

    if (hasInvalid) {
      setError("Category and skill names are required.");
      return;
    }

    setError(null);
    await onSubmit(groups);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Skills</h2>
        <Button type="button" onClick={addGroup}>
          Add Skill Group
        </Button>
      </div>

      {groups.map((group, gIndex) => (
        <div
          key={gIndex}
          className="border rounded-xl p-5 space-y-4 bg-background"
        >
          {/* Group Header */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Label>Category</Label>
              <Input
                value={group.category}
                onChange={(e) =>
                  updateGroup(gIndex, "category", e.target.value)
                }
                placeholder="Frontend / Backend / DevOps"
              />
            </div>

            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={group.color}
                onChange={(e) =>
                  updateGroup(gIndex, "color", e.target.value)
                }
                className="w-16 p-1"
              />
            </div>

            <button
              type="button"
              onClick={() => removeGroup(gIndex)}
              className="text-red-500 mt-6"
            >
              <X size={18} />
            </button>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            {group.skills.map((skill, sIndex) => (
              <div
                key={sIndex}
                className="flex gap-3 items-center"
              >
                <Input
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(
                      gIndex,
                      sIndex,
                      "name",
                      e.target.value
                    )
                  }
                />

                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={(e) =>
                    updateSkill(
                      gIndex,
                      sIndex,
                      "level",
                      Number(e.target.value)
                    )
                  }
                  className="w-24"
                />

                <button
                  type="button"
                  onClick={() => removeSkill(gIndex, sIndex)}
                  className="text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => addSkill(gIndex)}
          >
            Add Skill
          </Button>
        </div>
      ))}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        Save Skills
      </Button>
    </form>
  );
}
