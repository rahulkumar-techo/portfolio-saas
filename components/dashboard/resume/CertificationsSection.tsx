"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useCertificates, { CertificateItem } from "@/hooks/resume/useCertificates";
import CertificateForm from "@/components/ui/resume/CertificateForm";

export default function CertificationsSection() {
  const {
    certificates,
    loading,
    fetchCertificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
  } = useCertificates();
  const [editing, setEditing] = useState<CertificateItem | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return (
    <div className="space-y-4">
      {certificates.map((certificate, i) => (
        <motion.div
          key={certificate._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4 border"
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <h4 className="font-semibold">{certificate.name}</h4>
              <p className="text-sm text-white/70">{certificate.issuer}</p>
              <p className="text-xs text-white/50">
                {certificate.issueDate}
                {certificate.expiryDate ? ` - ${certificate.expiryDate}` : ""}
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditing(certificate)}>Edit</button>
              <button
                className="text-red-400"
                onClick={() => deleteCertificate(certificate._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <CertificateForm
        initialData={editing}
        loading={loading}
        onSubmit={async (data) => {
          if (editing) {
            await updateCertificate(editing._id, data);
          } else {
            await addCertificate(data);
          }
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
