"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useResumeProjects, { ResumeProjectItem } from "@/hooks/resume/useResumeProjects";
import ProjectForm from "@/components/ui/resume/ProjectForm";

export default function ProjectsSection() {
  const { projects, loading, fetchProjects, addProject, updateProject, deleteProject } =
    useResumeProjects();
  const [editing, setEditing] = useState<ResumeProjectItem | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-4">
      {projects.map((project, i) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4 border"
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <h4 className="font-semibold">{project.title}</h4>
              <p className="text-sm text-white/70">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-400"
              >
                {project.link}
              </a>
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditing(project)}>Edit</button>
              <button className="text-red-400" onClick={() => deleteProject(project._id)}>
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <ProjectForm
        initialData={editing}
        loading={loading}
        onSubmit={async (data) => {
          if (editing) {
            await updateProject(editing._id, data);
          } else {
            await addProject(data);
          }
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
