import api from "@/lib/axios";
import { CertificateRequestBody } from "@/types/server-types/resume";
import { useCallback, useState } from "react";

export interface CertificateItem extends CertificateRequestBody {
  _id: string;
  certificateId: string;
}

const useCertificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/resume?section=certifications");
      setCertificates(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCertificate = useCallback(async (data: CertificateRequestBody) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/resume/certifications", data);
      const created = res?.data?.data as CertificateItem | null;
      if (created) setCertificates((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add certificate");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCertificate = useCallback(
    async (certificateId: string, data: Partial<CertificateRequestBody>) => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.put("/resume/certifications", {
          certificateId,
          body: data,
        });
        const updated = res?.data?.data as CertificateItem | null;
        if (updated) {
          setCertificates((prev) =>
            prev.map((item) =>
              item._id === certificateId || item.certificateId === certificateId
                ? updated
                : item
            )
          );
        }

        return updated;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update certificate");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCertificate = useCallback(async (certificateId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete("/resume/certifications", { data: { certificateId } });
      setCertificates((prev) =>
        prev.filter(
          (item) =>
            item._id !== certificateId && item.certificateId !== certificateId
        )
      );
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete certificate");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    certificates,
    loading,
    error,
    fetchCertificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
  };
};

export default useCertificates;
