import { SortOrders } from "@/constants/api";
import {
  Patient,
  PatientNoteWithOwner,
  ResponsePatientNote,
} from "@/entities/patient";

type GetPatientNotesParams = {
  patientId: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrders;
};

type GetPatientNotesResponseDto = {
  notes: ResponsePatientNote[];
  count: number;
};

type GetPatientsResponseDto = {
  patients: Patient[];
};

type GetRecentNotesResponseDto = {
  notes: PatientNoteWithOwner[];
  count: number;
};

// having a separate service is an overkill for such tiny app
// but that's what I'm used to having in all of my projects
// (for simplicity I used only one service for both patients and their notes, not splitting them into 2 separate services)
export class PatientService {
  static async getPatients(): Promise<GetPatientsResponseDto> {
    try {
      const response = await fetch("/api/patients", {
        method: "GET",
      });

      return response.json();
    } catch (error) {
      // we can pass the error to some 3rd party error logger here
      console.error(error);
      throw new Error("There was an error while getting list of patients");
    }
  }

  static async getRecentNotes(): Promise<GetRecentNotesResponseDto> {
    try {
      const response = await fetch("/api/patients-data/recent", {
        method: "GET",
      });

      return response.json();
    } catch (error) {
      // we can pass the error to some 3rd party error logger here
      console.error(error);
      throw new Error("There was an error while getting recent notes");
    }
  }

  static async getPatientNotes(
    params: GetPatientNotesParams
  ): Promise<GetPatientNotesResponseDto> {
    const searchParams = new URLSearchParams();

    searchParams.set("patientId", params.patientId);
    searchParams.set("page", String(params.page));
    searchParams.set("limit", String(params.limit));

    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    try {
      const response = await fetch(
        `/api/patients-data?${searchParams.toString()}`,
        {
          method: "GET",
        }
      );

      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("There was an error while getting patient notes");
    }
  }

  static async createNote(patientId: string, note: ResponsePatientNote) {
    try {
      const response = await fetch("/api/patients-data", {
        method: "POST",
        body: JSON.stringify({
          patientId,
          note,
        }),
      });

      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("There was an error while creating patient note");
    }
  }
}
