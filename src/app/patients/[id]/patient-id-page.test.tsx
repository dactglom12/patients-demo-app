import React from "react";
import PatientPage from "./page";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import * as NavigationModule from "next/navigation";
import * as SWRModule from "swr";
import "@testing-library/jest-dom";
import * as PatientServiceModule from "@/services/PatientService";

jest.mock("next/navigation", () => ({
  __esModule: true,
  ...jest.requireActual("next/navigation"),
}));

describe("Patient id page", () => {
  beforeEach(() => {
    jest
      .spyOn(NavigationModule, "useParams")
      .mockReturnValue({ id: "mock-id-1" });
  });

  it("should render loading while request is loading", () => {
    jest.spyOn(SWRModule, "default").mockReturnValue({
      isLoading: true,
    } as any);

    const { getByRole } = render(<PatientPage />);

    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render error text when request fails", () => {
    jest.spyOn(SWRModule, "default").mockReturnValue({
      isLoading: false,
      error: true,
    } as any);

    const { getByText } = render(<PatientPage />);

    expect(getByText(/error happened/i)).toBeInTheDocument();
  });

  it("should add new note", async () => {
    const mutateSpy = jest.fn();

    jest.spyOn(SWRModule, "default").mockReturnValue({
      isLoading: false,
      error: false,
      data: {
        notes: [],
        count: 0,
      },
      isValidating: false,
      mutate: mutateSpy,
    });

    const createNoteSpy = jest
      .spyOn(PatientServiceModule.PatientService, "createNote")
      .mockImplementation(() => Promise.resolve({ ok: true }));

    const { getByPlaceholderText, getByText } = render(<PatientPage />);

    const openNoteDialogButton = getByText(/add note/i);

    act(() => {
      fireEvent.click(openNoteDialogButton);
    });

    const nodeTitleTextField = getByPlaceholderText("Enter note title...");
    const nodeContentTextField = getByPlaceholderText("Enter note content...");

    act(() => {
      fireEvent.change(nodeTitleTextField, { target: { value: "New title" } });
      fireEvent.change(nodeContentTextField, {
        target: { value: "New content" },
      });
    });

    const addNoteCtaButton = getByText("Add");

    act(() => {
      fireEvent.click(addNoteCtaButton);
    });

    await waitFor(() => {
      expect(createNoteSpy).toHaveBeenLastCalledWith("mock-id-1", {
        content: "New content",
        title: "New title",
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
      expect(mutateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
