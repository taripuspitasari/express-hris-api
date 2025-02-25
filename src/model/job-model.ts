import {
  Job,
  JobStatus,
  JobType,
  WorkplaceType,
  ExperienceLevel,
} from "@prisma/client";

export type JobResponse = {
  id: number;
  title: string;
  description: string;
  status: JobStatus;
  job_type: JobType;
  workplace_type: WorkplaceType;
  experience_level: ExperienceLevel;
  location?: string | null;
  salary_range?: string | null;
  expiry_date?: string | null;
  user_id: string;
  applications_count: number;
  created_at: string;
};

export type CreateJobRequest = {
  title: string;
  description: string;
  status: JobStatus;
  job_type: JobType;
  workplace_type: WorkplaceType;
  experience_level: ExperienceLevel;
  location?: string;
  salary_range?: string;
  expiry_date?: string;
};

export type UpdateJobRequest = {
  id: number;
  title: string;
  description: string;
  status: JobStatus;
  job_type: JobType;
  workplace_type: WorkplaceType;
  experience_level: ExperienceLevel;
  location?: string;
  salary_range?: string;
  expiry_date?: string;
  user_id: string;
};

export function toJobResponse(job: Job): JobResponse {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    status: job.status,
    job_type: job.job_type,
    workplace_type: job.workplace_type,
    experience_level: job.experience_level,
    location: job.location ?? null,
    salary_range: job.salary_range ?? null,
    expiry_date: job.expiry_date ? job.expiry_date.toISOString() : null,
    user_id: job.user_id,
    applications_count: job.applications_count,
    created_at: job.created_at.toISOString(),
  };
}
