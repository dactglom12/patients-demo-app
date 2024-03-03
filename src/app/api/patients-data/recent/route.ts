import { Patient, PatientNoteWithOwner, RawPatientNote } from "@/entities";
import patientData from "@/mocks/patient-data.json";
import { NextResponse } from "next/server";

const transformNote = (note: RawPatientNote, patient: Patient) => ({
  title: note[2],
  content:
    typeof note[3] === "string"
      ? note[3].replaceAll(/\n{2,}/g, "\n\n")
      : note[3],
  createdAt: note[0],
  updatedAt: note[1],
  owner: patient,
});

export async function GET() {
  const notesWithPatient: PatientNoteWithOwner[] = patientData.reduce(
    (acc, entry) => {
      const patient: Patient = {
        age: entry.age,
        dateOfBirth: entry.dateOfBirth,
        familyName: entry.familyName,
        givenName: entry.givenName,
        race: entry.race,
        raceCode: entry.raceCode,
        sex: entry.sex,
        ssn: entry.ssn,
        zip: entry.zip,
      };

      const withPatient = entry.PatientNote.map((note) =>
        transformNote(note, patient)
      );

      return [...acc, ...withPatient] as PatientNoteWithOwner[];
    },
    [] as PatientNoteWithOwner[]
  );

  notesWithPatient.sort((a, b) => b.createdAt - a.createdAt);
  const slice = notesWithPatient.slice(0, 30);

  return NextResponse.json({ notes: slice, count: slice.length });
}
