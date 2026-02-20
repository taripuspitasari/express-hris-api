import {Person} from "@prisma/client";

export type PersonResponse = {
  id: number;
  email: string;
  fullname: string;
  phone: string | null;
  birth_date: Date | null;
  gender: string | null;
};

export function toPersonResponse(person: Person): PersonResponse {
  return {
    id: person.id,
    email: person.email,
    fullname: person.fullname,
    phone: person.phone,
    birth_date: person.birth_date,
    gender: person.gender,
  };
}
