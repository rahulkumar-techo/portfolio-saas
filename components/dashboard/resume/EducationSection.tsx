"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEducation, { EducationItem } from "@/hooks/resume/useEducation";
import EducationForm from "@/components/ui/resume/EducationForm";

export default function EducationSection() {
  const { educations, loading, fetchEducations, addEducation, updateEducation, deleteEducation } =
    useEducation();
  const [editing, setEditing] = useState<EducationItem | null>(null);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  return (
    <div className="space-y-4">
      {educations.map((edu, i) => (
        <motion.div
          key={edu._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4 border"
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <h4 className="font-semibold">{edu.degree} - {edu.field}</h4>
              <p className="text-sm text-white/70">{edu.institution}</p>
              <p className="text-xs text-white/50">{edu.startYear} - {edu.endYear || "Present"}</p>
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditing(edu)}>Edit</button>
              <button className="text-red-400" onClick={() => deleteEducation(edu._id)}>
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <EducationForm
        initialData={editing}
        loading={loading}
        onSubmit={async (data) => {
          if (editing) {
            await updateEducation(editing._id, data);
          } else {
            await addEducation(data);
          }
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
