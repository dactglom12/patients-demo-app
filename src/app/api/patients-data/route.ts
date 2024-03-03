import { SortOrders } from "@/constants/api";
import { RawPatientNote } from "@/entities";
import patientData from "@/mocks/patient-data.json";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const transformNote = (note: RawPatientNote) => ({
  title: note[2],
  content:
    typeof note[3] === "string"
      ? note[3].replaceAll(/\n{2,}/g, "\n\n")
      : note[3],
  createdAt: note[0],
  updatedAt: note[1],
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  const patient = patientData.find((entry) => entry.ssn === patientId);

  if (!patient)
    return NextResponse.json(
      {},
      { status: 404, statusText: "Record not found" }
    );

  let patientNotes = [...patient.PatientNote];

  if (sortBy && sortOrder) {
    patientNotes = patientNotes.sort((a, b) => {
      const fieldIndex = sortBy === "createdAt" ? 0 : 1;
      const aCandidate = a[fieldIndex]
        ? a[fieldIndex]
        : a[fieldIndex === 0 ? 1 : 0];
      const bCandidate = b[fieldIndex]
        ? b[fieldIndex]
        : b[fieldIndex === 0 ? 1 : 0];

      if (sortOrder === SortOrders.ASC) {
        return Number(aCandidate) - Number(bCandidate);
      } else {
        return Number(bCandidate) - Number(aCandidate);
      }
    });
  }

  if (!limit || !page)
    return NextResponse.json(
      { notes: patientNotes.map(transformNote), count: patientNotes.length },
      {
        status: 200,
      }
    );

  const numberizedLimit = Number(limit);
  const numberizedPage = Number(page);

  if (isNaN(numberizedLimit) || isNaN(numberizedPage))
    return NextResponse.json({}, { status: 400, statusText: "Bad request" });

  const start = numberizedLimit * numberizedPage;

  const notesSlice = patientNotes.slice(start, start + numberizedLimit);

  return NextResponse.json(
    { notes: notesSlice.map(transformNote), count: patientNotes.length },
    {
      status: 200,
    }
  );
}

export async function POST(req: Request) {
  const filePath = path.join(process.cwd(), "/src/mocks/patient-data.json");

  try {
    const body = await req.json();
    const file = await fs.readFile(filePath, "utf-8");

    if (!body.note) throw new Error("Patient note must be present");

    const parsed: typeof patientData = JSON.parse(file);

    const clientEntryIndex = parsed.findIndex(
      (patient) => patient.ssn === body.patientId
    );

    if (clientEntryIndex === -1) throw new Error("Patient notes not found");

    const clientEntry = parsed[clientEntryIndex];
    const notes: RawPatientNote[] = parsed[clientEntryIndex].PatientNote;

    if (!clientEntry || !notes) throw new Error("Patient notes not found");

    const rawNote: RawPatientNote = [
      body.note.createdAt,
      body.note.updatedAt,
      body.note.title,
      body.note.content,
    ];

    notes.push(rawNote);

    parsed[clientEntryIndex] = {
      ...parsed[clientEntryIndex],
      PatientNote: notes,
    };

    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2));

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
