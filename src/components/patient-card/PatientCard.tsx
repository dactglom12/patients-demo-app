import { routes } from "@/constants/routes";
import { Patient } from "@/entities/patient";
import Link from "next/link";
import React from "react";

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => (
  <Link
    href={routes.specificPatient(patient.ssn)}
    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
  >
    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
      {patient.givenName} {patient.familyName}
    </h5>
    <ul>
      <li>
        <span className="font-normal text-lg text-gray-700">
          Age: {patient.age}
        </span>
      </li>
      <li>
        <span className="font-normal text-lg text-gray-700">
          Date of birth: {patient.dateOfBirth}
        </span>
      </li>
      <li>
        <span className="font-normal text-lg text-gray-700">
          Gender: {patient.sex === "F" ? "Female" : "Male"}
        </span>
      </li>
    </ul>
  </Link>
);
