"use client";
import { NotesTable } from "@/components/notes-table";
import { PatientService } from "@/services/PatientService";
import { CircularProgress, Typography } from "@mui/material";
import React from "react";
import useSWR from "swr";

export default function RecentPatientNotesPage() {
  const { data, error, isLoading } = useSWR("/api/patients/recent", () =>
    PatientService.getRecentNotes()
  );

  if (isLoading)
    return (
      <div className="flex h-full justify-center items-center">
        <CircularProgress />
      </div>
    );

  if (error || !data) return <div>Error happened</div>;

  return (
    <>
      <Typography variant="h5">Last {data.count} notes</Typography>
      <NotesTable
        bodyRows={data.notes}
        currentPage={0}
        headCells={[
          { id: "title", label: "Title" },
          { id: "note", label: "Note" },
          { id: "owner", label: "Patient" },
          { id: "createdAt", label: "Created at" },
          { id: "updatedAt", label: "Updated at" },
        ]}
        itemsCount={data.count}
        onPageChange={() => null}
        onSortChange={() => null}
        rowsPerPage={30}
      />
    </>
  );
}
