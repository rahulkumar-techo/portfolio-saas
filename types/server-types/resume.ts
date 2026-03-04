
export interface ExperienceRequestBody {
    jobRole: string;
    jobType:string;
    company: string;
    period: string;
    description: string;
    tech: string[];
    order: number;
}

export interface SkillItem {
    name: string;
    level: number;
}

export interface SkillGroup {
    category: string;
    color: string;
    skills: SkillItem[];
}

export interface EducationRequestBody {
    degree: string;
    field: string;
    institution: string;
    location?: string;
    startYear: number;
    endYear?: number;
    grade?: string;
    description?: string;
    order?: number;
}

export interface ProjectRequestBody {
    title: string;
    description: string;
    tech: string[];
    link: string;
    image?: string;
    stars?: number;
}

export interface CertificateRequestBody {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
}
