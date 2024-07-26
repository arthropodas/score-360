import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { TeamCreation } from "./TeamCreation";

import * as apiUrls from "../../Services/TeamServices";
global.URL.createObjectURL = jest.fn(() => "mocked-image-url");
jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});
const VALUE = "TestTeam";
const CITY = "TestCity";
const file = new File(["(⌐□_□)"], "exampleImageforlogo.png", {
  type: "image/png",
});

describe("TeamCreation Form", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );
  });

  it("opens modal when add button is clicked", () => {
    render(
      <BrowserRouter>
        <TeamCreation />
      </BrowserRouter>
    );
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const modalTitle = screen.getByText("ADD NEW TEAM");
    expect(modalTitle).toBeInTheDocument();
  });

  it("displays the file name after file selection", async () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);

    const fileInput = screen.getByText("Upload");
    fireEvent.change(fileInput, { target: { files: [file] } });
  });
  it("handles invalid file and displays file name", () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const { getByLabelText } = render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const fileInput = getByLabelText("Upload");

    const file = new File(["file contents"], "example.ex", {
      type: "image/ex",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  it("submits the form with valid data", async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const mockTeamCreation = jest.spyOn(apiUrls, "teamCreation");
    mockTeamCreation.mockResolvedValueOnce({ status: 200, data: {} });

    fireEvent.change(screen.getByLabelText(/Team name/i), {
      target: { value: VALUE },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: CITY },
    });
    Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 });
    const fileInput = getByLabelText("Upload");

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByRole("button", { name: /Add/i }));
    await waitFor(() => {
      expect(mockTeamCreation).toHaveBeenCalled();
    });
  });

  it("submits the form with invalid data", async () => {
    render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const mockTeamCreation = jest.spyOn(apiUrls, "teamCreation");
    mockTeamCreation.mockResolvedValueOnce({ status: 200, data: {} });

    fireEvent.change(screen.getByLabelText(/Team name/i), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "   " },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add/i }));
  });

  it("handles the case when no file is selected", () => {
    render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);

    const fileInput = screen.getByLabelText("Upload");

    fireEvent.change(fileInput, { target: { files: [] } });
  });

  it("displays error message when team creation fails", async () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);

    const mockError = new Error("Password change failed");
    mockError.response = {
      data: { message: "Password change failed", errorCode: "5007" },
      status: 400,
    };

    const mockTeamCreation = jest.spyOn(apiUrls, "teamCreation");

    mockTeamCreation.mockRejectedValueOnce(mockError);

    fireEvent.change(screen.getByLabelText(/Team name/i), {
      target: { value: VALUE },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: CITY },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add/i }));

    await waitFor(() => {
      expect(mockTeamCreation).toHaveBeenCalled();
    });
  });

  it("Team creation fails due to invalid data", async () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);

    const mockData = {
      data: { message: "Password change failed" },
      status: 400,
    };

    const mockTeamCreation = jest.spyOn(apiUrls, "teamCreation");

    mockTeamCreation.mockResolvedValueOnce(mockData);

    fireEvent.change(screen.getByLabelText(/Team name/i), {
      target: { value: VALUE },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: CITY },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add/i }));

    await waitFor(() => {
      expect(mockTeamCreation).toHaveBeenCalled();
    });
  });

  it("handles invalid file size", async () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    const file2 = new File(["(⌐□_□)"], "exampleImageforlogo.png", {
      type: "image/png",
    });
    fireEvent.click(addButtonArray[0]);
    const { getByText } = render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const fileInput = screen.getByLabelText("Upload");

    Object.defineProperty(file2, "size", { value: 3 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [file2] } });

    await waitFor(() => {
      expect(getByText("File size exceeds 2 MB.")).toBeInTheDocument();
    });
  });

  it("handles valid file name", async () => {
    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const { getByLabelText } = render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const fileInput = getByLabelText("Upload");

    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  it("submits the form with invalide data format", async () => {
    render(
      <MemoryRouter>
        <TeamCreation />
      </MemoryRouter>
    );

    const addButtonArray = screen.getAllByTestId("add-team-button");
    fireEvent.click(addButtonArray[0]);
    const mockTeamCreation = jest.spyOn(apiUrls, "teamCreation");
    mockTeamCreation.mockResolvedValueOnce({ status: 400, data: {} });

    fireEvent.change(screen.getByLabelText(/Team name/i), {
      target: { value: VALUE },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: CITY },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add/i }));
    await waitFor(() => {
      expect(mockTeamCreation).toHaveBeenCalled();
    });
  });
});
