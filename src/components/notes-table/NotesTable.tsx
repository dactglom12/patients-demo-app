"use client";
import { SortOrders } from "@/constants/api";
import { PatientNoteWithOwner, ResponsePatientNote } from "@/entities";
import { useOpenCloseState } from "@/hooks/useOpenCloseState";
import { generateId } from "@/utilities/random";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface NotesTableProps {
  orderBy?: string;
  sortOrder?: SortOrders;
  headCells: {
    isSortable?: boolean;
    label: string;
    id: string;
  }[];
  onSortChange: (cellId: string) => void;
  itemsCount: number;
  currentPage: number;
  onPageChange: (_event: unknown, page: number) => void;
  rowsPerPage: number;
  bodyRows: (ResponsePatientNote | PatientNoteWithOwner)[];
}

const isNoteWithOwner = (
  note: ResponsePatientNote | PatientNoteWithOwner
): note is PatientNoteWithOwner => {
  return "owner" in note;
};

export const NotesTable: React.FC<NotesTableProps> = ({
  headCells,
  orderBy,
  sortOrder,
  onSortChange,
  currentPage,
  onPageChange,
  itemsCount,
  rowsPerPage,
  bodyRows,
}) => {
  const [isNoteInfoPopupDisplayed, open, close] = useOpenCloseState();
  const [noteToDisplay, setNoteToDisplay] =
    useState<ResponsePatientNote | null>(null);

  const displayNoteContent = (note: ResponsePatientNote) => {
    open();
    setNoteToDisplay(note);
  };

  return (
    <>
      <TableContainer sx={{ height: "72.5vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  padding="normal"
                  sortDirection={orderBy === headCell.id ? sortOrder : false}
                >
                  {headCell.isSortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      onClick={() => onSortChange(headCell.id)}
                      {...(orderBy === headCell.id
                        ? { direction: sortOrder }
                        : {})}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyRows.map((bodyRow) => {
              return (
                <TableRow key={bodyRow.title + generateId(20)}>
                  <TableCell>{bodyRow.title}</TableCell>
                  <TableCell className="whitespace-break-spaces">
                    <Button onClick={() => displayNoteContent(bodyRow)}>
                      Open note content
                    </Button>
                  </TableCell>
                  {isNoteWithOwner(bodyRow) && (
                    <TableCell>
                      {bodyRow.owner.familyName} {bodyRow.owner.givenName}
                    </TableCell>
                  )}
                  <TableCell>
                    {new Date(bodyRow.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {bodyRow.updatedAt
                      ? new Date(bodyRow.updatedAt).toLocaleString()
                      : new Date(bodyRow.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={itemsCount}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        page={currentPage}
        onPageChange={onPageChange}
      />
      <Dialog maxWidth="xl" open={isNoteInfoPopupDisplayed} onClose={close}>
        <DialogTitle>{noteToDisplay?.title}</DialogTitle>
        <DialogContent>
          <Typography className="whitespace-pre" variant="body1">
            {noteToDisplay?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
