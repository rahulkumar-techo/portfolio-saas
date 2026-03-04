/**
 * useExperience Hook
 * Dedicated Experience State Manager
 */

import api from "@/lib/axios";
import { ExperienceRequestBody } from "@/types/server-types/resume";
import { useCallback, useState } from "react";

export interface ExperienceItem extends ExperienceRequestBody {
    _id: string;
    experienceId: string;
}

const useExperience = () => {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ FETCH EXPERIENCE
    const fetchExperiences = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get(`/resume?section=${"experience"}`);
            const list = Array.isArray(res?.data?.data) ? res.data.data : [];
            setExperiences(list);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch experiences");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchExperienceById = useCallback(async (experienceId: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get(`/resume/experience/${experienceId}`);
            return res?.data?.data ?? null;

        }
        catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch experiences");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ ADD EXPERIENCE
    const addExperience = useCallback(async (data: ExperienceRequestBody) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/resume/experience", data);
            const newExp = res?.data?.data as ExperienceItem | null;

            if (newExp) {
                setExperiences((prev) => [...prev, newExp]);
            }

            return newExp ?? null;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add experience");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ UPDATE EXPERIENCE
    const updateExperience = useCallback(async (
        experienceId: string,
        data: Partial<ExperienceRequestBody>
    ) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.put("/resume/experience", {
                experienceId,
                body: data,
            });

            const updated = res?.data?.data as ExperienceItem | null;

            if (!updated) return null;

            setExperiences((prev) =>
                prev.map((exp) =>
                    exp._id === experienceId || exp.experienceId === experienceId ? updated : exp
                )
            );

            return updated ?? null;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update experience");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ DELETE EXPERIENCE
    const deleteExperience = useCallback(async (experienceId: string) => {
        try {
            setLoading(true);
            setError(null);

            await api.delete("/resume/experience", {
                data: { experienceId },
            });

            setExperiences((prev) =>
                prev.filter((exp) => exp._id !== experienceId && exp.experienceId !== experienceId)
            );

            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete experience");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        experiences,
        loading,
        error,
        fetchExperiences,
        addExperience,
        updateExperience,
        deleteExperience,
        fetchExperienceById
    };
};

export default useExperience;
