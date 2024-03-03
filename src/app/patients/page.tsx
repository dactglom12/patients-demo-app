"use client";
import { PatientCard } from "@/components/patient-card";
import { PatientService } from "@/services/PatientService";
import { CircularProgress } from "@mui/material";
import useSWR from "swr";

export default function PatientsPage() {
  const { data, isLoading, error } = useSWR("/api/patients", () =>
    PatientService.getPatients()
  );

  if (isLoading)
    return (
      <div className="flex h-full justify-center items-center">
        <CircularProgress />
      </div>
    );

  if (error || !data) return <div>Error happened</div>;

  return (
    <div className="flex flex-wrap w-full">
      {data.patients.map((patient) => (
        <div key={patient.ssn} className="mr-4">
          <PatientCard patient={patient} />
        </div>
      ))}
    </div>
  );
}
