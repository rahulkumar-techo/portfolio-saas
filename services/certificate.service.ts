import { ICertificate } from "@/models/resume/certificates.model";
import ResumeRepository from "@/repositories/resume.repository";
import { CertificateRequestBody } from "@/types/server-types/resume";

class CertificateService {
  private repo = new ResumeRepository();

  async addCertificate(userId: string, data: CertificateRequestBody) {
    return this.repo.addCertificate(userId, data);
  }

  async updateCertificate(
    userId: string,
    certificateId: string,
    data: Partial<ICertificate>
  ) {
    if (!certificateId) throw new Error("certificateId required");
    return this.repo.updateCertificate(userId, certificateId, data);
  }

  async deleteCertificate(userId: string, certificateId: string) {
    if (!certificateId) throw new Error("certificateId required");
    return this.repo.deleteCertificate(userId, certificateId);
  }

  async getCertificateById(userId: string, certificateId: string) {
    if (!certificateId) throw new Error("certificateId required");
    return this.repo.getCertificateById(userId, certificateId);
  }
}

const certificateService = new CertificateService();
export default certificateService;
