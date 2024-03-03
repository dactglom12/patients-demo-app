"use client";
import { DEFAULT_PAGE_LIMIT, SortOrders } from "@/constants/api";
import { PatientService } from "@/services/PatientService";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { NotesTable } from "@/components/notes-table";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useOpenCloseState } from "@/hooks/useOpenCloseState";
import { ResponsePatientNote } from "@/entities";

export default function PatientNotesPage() {
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<string>();
  const [sortOrder, setSortOrder] = useState<SortOrders>();
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const [isAddNotePopupOpen, open, close] = useOpenCloseState();
  const { data, isLoading, error, mutate } = useSWR(
    [params.id, page, DEFAULT_PAGE_LIMIT, sort, sortOrder],
    ([patientId, page, pageLimit, sort, sortOrder]) =>
      PatientService.getPatientNotes({
        patientId,
        page,
        limit: pageLimit,
        sortBy: sort,
        sortOrder,
      })
  );

  const onSortChange = (cellId: string) => {
    setPage(0);

    if (!sort || sort !== cellId) {
      setSort(cellId);
      setSortOrder(SortOrders.ASC);
      return;
    }

    setSortOrder((currentOrder) =>
      currentOrder === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC
    );
  };

  const closeAddNotePopup = useCallback(() => {
    setNoteContent("");
    setNoteTitle("");
    close();
  }, [close]);

  const onPageChange = (_event: unknown, page: number) => {
    setPage(page);
  };

  const onNoteContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value);
  };

  const onNoteTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(event.target.value);
  };

  const onNoteAddButtonClick = useCallback(async () => {
    if (!data || !data.notes || !noteTitle || !noteContent) return;

    const newNote: ResponsePatientNote = {
      content: noteContent,
      title: noteTitle,
      createdAt: +new Date(),
      updatedAt: +new Date(),
    };
    const notesSlice = data.notes.slice(0, DEFAULT_PAGE_LIMIT - 1);

    await PatientService.createNote(params.id, newNote);

    mutate(
      {
        count: data.count + 1,
        notes: [newNote, ...notesSlice],
      },
      { revalidate: false, populateCache: true }
    );

    closeAddNotePopup();
  }, [mutate, data, noteTitle, noteContent, closeAddNotePopup, params]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onNoteAddButtonClick();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [onNoteAddButtonClick]);

  const isAddNoteButtonDisabled =
    noteContent.trim().length === 0 || noteTitle.trim().length === 0;

  if (isLoading)
    return (
      <div className="flex h-full justify-center items-center">
        <CircularProgress />
      </div>
    );

  if (error || !data) return <div>Error happened</div>;

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={open} variant="outlined">
          Add note
        </Button>
      </div>
      <NotesTable
        headCells={[
          { id: "title", label: "Title" },
          { id: "note", label: "Note" },
          { id: "createdAt", label: "Created at", isSortable: true },
          { id: "updatedAt", label: "Updated at", isSortable: true },
        ]}
        onSortChange={onSortChange}
        currentPage={page}
        itemsCount={data.count}
        onPageChange={onPageChange}
        rowsPerPage={DEFAULT_PAGE_LIMIT}
        bodyRows={data.notes}
        orderBy={sort}
        sortOrder={sortOrder}
      />
      <Dialog maxWidth="sm" fullWidth open={isAddNotePopupOpen} onClose={close}>
        <DialogTitle>New note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            className="mb-4"
            placeholder="Enter note title..."
            value={noteTitle}
            onChange={onNoteTitleChange}
          />
          <TextField
            multiline
            placeholder="Enter note content..."
            onChange={onNoteContentChange}
            minRows={10}
            className="w-full"
            value={noteContent}
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onNoteAddButtonClick}
            disabled={isAddNoteButtonDisabled}
            variant="outlined"
          >
            Add
          </Button>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
