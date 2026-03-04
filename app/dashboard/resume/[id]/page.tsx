"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExperienceForm from "@/components/ui/resume/ExperienceForm";
import useExperience from "@/hooks/resume/useExperience";
import { ExperienceRequestBody } from "@/types/server-types/resume";

export default function Page() {

  const { id } = useParams();
  const router = useRouter();

  const {
    fetchExperienceById,
    addExperience,
    updateExperience,
    loading,
  } = useExperience();

  const [current, setCurrent] = useState<Partial<ExperienceRequestBody> | null>(null);
  const [notFound, setNotFound] = useState(false);

  const experienceId = Array.isArray(id) ? id[0] : id;
  const isCreateMode = experienceId === "new";

  useEffect(() => {
    if (!experienceId || isCreateMode) return;

    const loadCurrentExperience = async () => {
      const exp = await fetchExperienceById(experienceId);
      if (!exp) {
        setNotFound(true);
        return;
      }

      setCurrent(exp);
    };

    loadCurrentExperience();
  }, [experienceId, fetchExperienceById, isCreateMode]);

  if (notFound) return <div className="p-10">Experience not found.</div>;

  if (!isCreateMode && !current) return <div className="p-10">Loading...</div>;

  return (
    <ExperienceForm
      initialData={isCreateMode ? undefined : current}
      loading={loading}
      onSubmit={async (data) => {
        if (!experienceId) return;

        if (isCreateMode) {
          await addExperience(data);
        } else {
          await updateExperience(experienceId, data);
        }

        router.push("/dashboard/resume/");
      }}
    />
  );
}
