"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import useExperience from "@/hooks/resume/useExperience";
import { Badge } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function ExperienceSection() {

  const {
    experiences,
    fetchExperiences,
    deleteExperience,
  } = useExperience();

  const router = useRouter();

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return (
    <div className="space-y-4">

      <button
        onClick={() => router.push("/dashboard/resume/new")}
        className="px-4 py-2 bg-brand-500 rounded-lg text-sm"
      >
        Add Experience +
      </button>

      {experiences.map((exp, i) => (
        <motion.div
          key={exp._id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl p-5 border"
        >
          <span>
            <Badge variant="green" className="text-[10px]">
              {exp._id}
            </Badge>
          </span>

          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white text-sm">
                {exp.jobRole}
              </h4>
              <p className="text-xs text-brand-400">
                {exp.company} · {exp.period}
              </p>
            </div>

            <div className="flex gap-3 text-xs">
              <button
                onClick={() =>
                  router.push(`/dashboard/resume/${exp._id}`)
                }
              >
                Edit
              </button>

              <button
                className="text-red-400"
                onClick={async () => {
                  await deleteExperience(exp._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-white/60 text-xs mt-3">
            {exp.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
