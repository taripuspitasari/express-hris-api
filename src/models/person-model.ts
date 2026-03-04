import {Person} from "@prisma/client";

export type ProfileResponse = {
  id: number;
  fullname: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
};

export function toPersonResponse(person: Person): ProfileResponse {
  return {
    id: person.id,
    fullname: person.fullname,
    email: person.email,
    phone: person.phone,
    gender: person.gender,
    birth_date: person.birth_date
      ? person.birth_date.toISOString().split("T")[0]
      : null,
  };
}
