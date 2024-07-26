import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import TeamEdit from "./TeamEdit";
import { BrowserRouter } from "react-router-dom";
import * as apiUrls from "../../Services/TeamServices";

jest.mock("../../Services/TeamServices", () => ({
  getTeamData: jest.fn(() =>
    Promise.resolve({
      data: {
        TeamName: "team name",
        city: "city",
        logo: "/media/logos/image.jpeg",
      },
    })
  ),
  teamUpdation: jest.fn(() => Promise.resolve({ status: 200 })),
}));
jest.mock("../../components/Common/toast/ToastService", () => ({
  ToastService: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => "mocked-image-url");
jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});
describe("TeamEdit component", () => {
  const mockGetTeam = jest.spyOn(apiUrls, "getTeamData");
  mockGetTeam.mockResolvedValueOnce({
    data: {
      TeamName: "team name",
      city: "city",
      logo: "/media/logos/image.jpeg",
    },
  });

  it("renders properly", () => {
    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} />
      </BrowserRouter>
    );
  });

  it("updates team data on form submission", async () => {
    const mockUpdateService = jest.spyOn(apiUrls, "teamUpdation");
    mockUpdateService.mockRejectedValueOnce({ message: "failed" });
    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Team name*"), {
      target: { value: "New Team Name" },
    });
    fireEvent.change(screen.getByLabelText("City*"), {
      target: { value: "New City" },
    });

    const file = new File(["(⌐□_□)"], "team_logo.docx", {
      type: "application/msword",
    });
    const fileInput = screen.getByLabelText("Upload");
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);

  });
  it("updates team data on form submission", async () => {
    const mockUpdateService = jest.spyOn(apiUrls, "teamUpdation");
    mockUpdateService.mockRejectedValueOnce({ message: "failed" });

    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Team name*"), {
      target: { value: "New Team Name" },
    });
    fireEvent.change(screen.getByLabelText("City*"), {
      target: { value: "New City" },
    });

    const file = new File(["a".repeat(3 * 1024 * 1024)], "team_logo.docx", {
      type: "application/msword",
    });
    const fileInput = screen.getByLabelText("Upload");
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);
  });
  it("updates team data on form submission", async () => {
    const mockUpdateService = jest.spyOn(apiUrls, "teamUpdation");
    mockUpdateService.mockResolvedValueOnce({ message: "success" });

    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} id={3} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Team name*"), {
      target: { value: "New Team Name" },
    });
    fireEvent.change(screen.getByLabelText("City*"), {
      target: { value: "New City" },
    });

    const file = new File(["a".repeat(1 * 1024 * 1024)], "team_logo.docx", {
      type: "application/msword",
    });
    const fileInput = screen.getByLabelText("Upload");

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);

    expect(screen.findByText(/UPDATE/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/UPDATE/i));
    });
    // Correctly reference the mocked function
    expect(mockUpdateService).toHaveBeenCalled();
    screen.findAllByText(/Team updated successfully/i);
  });
});
describe("TeamEdit component", () => {
  const mockGetTeam = jest.spyOn(apiUrls, "getTeamData");
  mockGetTeam.mockRejectedValueOnce({ data: "0error" });

  it("renders properly", () => {
    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} />
      </BrowserRouter>
    );
    waitFor(() => {
      expect(mockGetTeam).toHaveBeenCalled();
    });
  });

  it("updates team data on form submission", async () => {
    const mockGetTeam = jest.spyOn(apiUrls, "getTeamData");
    mockGetTeam.mockResolvedValueOnce({
      data: {
        TeamName: "team name",
        city: "city",
        logo: "/media/logos/image.jpeg",
      },
    });
    const mockUpdateService = jest.spyOn(apiUrls, "teamUpdation");
    mockUpdateService.mockResolvedValueOnce({ message: "success" });

    render(
      <BrowserRouter>
        <TeamEdit isOpen={true} id={3} />
      </BrowserRouter>
    );
    waitFor(() => {
      expect(mockGetTeam).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText("Team name*"), {
      target: { value: "New Team Name" },
    });
    fireEvent.change(screen.getByLabelText("City*"), {
      target: { value: "New City" },
    });
    expect(screen.findByText(/UPDATE/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/UPDATE/i));
      expect(mockUpdateService).toHaveBeenCalled();
    });
    // Correctly reference the mocked function
  });
  it('Modal should close when cancel button is clicked', () => {
    // Mock necessary props
    const setIsOpen = jest.fn(); // Mock setIsOpen function
    const setChanges = jest.fn(); // Mock setChanges function
    const isOpen = true;
    const id = 123; // Mock id
  
    // Render the TeamEdit component
    render(<TeamEdit id={id} isOpen={isOpen} setIsOpen={setIsOpen} setChanges={setChanges} />);
  
    // Find the cancel button
    const cancelButton = screen.getByText('Cancel');
  
    // Simulate click on cancel button
    fireEvent.click(cancelButton);
  
    // Verify that setIsOpen function is called with false
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
