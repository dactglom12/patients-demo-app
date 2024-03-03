import patientData from "@/mocks/patient-data.json";
import { Patient } from "@/entities/patient";

type ResponseDto = {
  patients: Patient[];
};

export async function GET() {
  // picking only relevant object pieces
  const patients: Patient[] = patientData.map(
    ({
      age,
      dateOfBirth,
      familyName,
      givenName,
      race,
      raceCode,
      sex,
      ssn,
      zip,
    }) => ({
      age,
      dateOfBirth,
      familyName,
      givenName,
      race,
      raceCode,
      sex,
      ssn,
      zip,
    })
  );

  return Response.json({ patients } as ResponseDto);
}
