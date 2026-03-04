import api from "@/lib/axios";
import { ProjectRequestBody } from "@/types/server-types/resume";
import { useCallback, useState } from "react";

export interface ResumeProjectItem extends ProjectRequestBody {
  _id: string;
  projectId: string;
}

const useResumeProjects = () => {
  const [projects, setProjects] = useState<ResumeProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/resume?section=projects");
      setProjects(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (data: ProjectRequestBody) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/resume/projects", data);
      const created = res?.data?.data as ResumeProjectItem | null;
      if (created) setProjects((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add project");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(
    async (projectId: string, data: Partial<ProjectRequestBody>) => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.put("/resume/projects", { projectId, body: data });
        const updated = res?.data?.data as ResumeProjectItem | null;
        if (updated) {
          setProjects((prev) =>
            prev.map((item) =>
              item._id === projectId || item.projectId === projectId
                ? updated
                : item
            )
          );
        }

        return updated;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update project");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete("/resume/projects", { data: { projectId } });
      setProjects((prev) =>
        prev.filter((item) => item._id !== projectId && item.projectId !== projectId)
      );
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
};

export default useResumeProjects;
