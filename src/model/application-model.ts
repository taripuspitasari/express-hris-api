import {Application, ApplicationStatus} from "@prisma/client";

export type ApplicationResponse = {
  id: number;
  user_id: string;
  job_id: number;
  resume: string;
  status: ApplicationStatus;
  created_at: string;
};

export type CreateApplicationRequest = {
  job_id: number;
  resume: string;
};

export type UpdateApplicationRequest = {
  id: number;
  status?: ApplicationStatus;
};

export function toApplicationResponse(
  application: Application
): ApplicationResponse {
  return {
    id: application.id,
    user_id: application.user_id,
    job_id: application.job_id,
    resume: application.resume,
    status: application.status,
    created_at: application.created_at.toISOString(),
  };
}
