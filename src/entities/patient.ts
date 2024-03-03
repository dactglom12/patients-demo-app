import patientData from "@/mocks/patient-data.json";

export type RawPatientNote = (typeof patientData)[0]["PatientNote"][0];

export type ResponsePatientNote = {
  createdAt: number;
  updatedAt?: number;
  title: string;
  content: string;
};

export type PatientNoteWithOwner = ResponsePatientNote & {
  owner: Patient;
};

export type Patient = {
  age: number;
  race: string;
  raceCode: number;
  sex: string;
  dateOfBirth: string;
  givenName: string;
  familyName: string;
  ssn: string;
  zip: number;
};
