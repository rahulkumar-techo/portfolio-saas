import api from "@/lib/axios";
import { EducationRequestBody } from "@/types/server-types/resume";
import { useCallback, useState } from "react";

export interface EducationItem extends EducationRequestBody {
  _id: string;
  educationId: string;
}

const useEducation = () => {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEducations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/resume?section=education");
      setEducations(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch education");
    } finally {
      setLoading(false);
    }
  }, []);

  const addEducation = useCallback(async (data: EducationRequestBody) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/resume/education", data);
      const created = res?.data?.data as EducationItem | null;
      if (created) setEducations((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add education");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEducation = useCallback(
    async (educationId: string, data: Partial<EducationRequestBody>) => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.put("/resume/education", { educationId, body: data });
        const updated = res?.data?.data as EducationItem | null;
        if (updated) {
          setEducations((prev) =>
            prev.map((item) =>
              item._id === educationId || item.educationId === educationId
                ? updated
                : item
            )
          );
        }

        return updated;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update education");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEducation = useCallback(async (educationId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete("/resume/education", { data: { educationId } });
      setEducations((prev) =>
        prev.filter(
          (item) => item._id !== educationId && item.educationId !== educationId
        )
      );
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete education");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    educations,
    loading,
    error,
    fetchEducations,
    addEducation,
    updateEducation,
    deleteEducation,
  };
};

export default useEducation;
