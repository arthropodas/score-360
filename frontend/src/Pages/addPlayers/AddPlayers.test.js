import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddPlayers } from "./AddPlayers";
import { addPlayer, getPlayers } from "../../Services/TeamServices";

jest.mock("../../Services/TeamServices", () => ({
  addPlayer: jest.fn(),
  getPlayers: jest.fn(),
}));

describe("AddPlayers component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<AddPlayers setIsAddOpen={true} isAddOpen={true} id={1} />);
  });

  test("displays players", async () => {
    const mockGetData = {
      data: [
        { first_name: "fname", last_name: "lname", phone_number: "0909090909" },
      ],
    };
    getPlayers.mockResolvedValueOnce(mockGetData);
    const mockAddData = { status: 200, data: { success: "sdfsdf" } };
    addPlayer.mockResolvedValueOnce(mockAddData);
    render(<AddPlayers isAddOpen={true} id={1} />);

    // Wait for players to be loaded
    await waitFor(() => expect(getPlayers).toHaveBeenCalledTimes(1));

    // Check if players are displayed
    expect(screen.getByText(/fname/i)).toBeInTheDocument();
    const cbox = screen.getAllByRole("checkbox");
    expect(cbox).toHaveLength(1);
    fireEvent.click(cbox[0]);
    fireEvent.click(screen.getByTestId("addButton"));
    expect(
      screen.getByText(
        /Are you sure you want to add the selected players to the team?/i
      )
    );
    fireEvent.click(screen.getByTestId("confirmButton"));
    expect(addPlayer).toHaveBeenCalledTimes(1);
  });

  test("displays players search", async () => {
    const mockGetData = {
      data: [
        { first_name: "fname", last_name: "lname", phone_number: "0909090909" },
      ],
    };
    getPlayers.mockResolvedValueOnce(mockGetData);
    const mockAddData = { status: 200, data: { success: "sdfsdf" } };
    addPlayer.mockResolvedValueOnce(mockAddData);
    render(<AddPlayers isAddOpen={true} id={1} />);
    waitFor(() => {
      getPlayers.mockResolvedValue({ data: mockGetData });
      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: "PL1001" },
      });
      expect(screen.getByTestId("search")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("search"));
    });

    await waitFor(() => {
      expect(getPlayers).toHaveBeenCalled();
    });
  });

  test("displays players search invalid", async () => {
    const mockGetData = {
      data: [
        { first_name: "fname", last_name: "lname", phone_number: "0909090909" },
      ],
    };
    getPlayers.mockResolvedValueOnce(mockGetData);
    const mockAddData = { status: 200, data: { success: "sdfsdf" } };
    addPlayer.mockResolvedValueOnce(mockAddData);
    render(<AddPlayers isAddOpen={true} id={1} />);
    waitFor(() => {
      getPlayers.mockResolvedValue({ data: mockGetData });
      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: "  " },
      });
      expect(screen.getByTestId("search")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("search"));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/search term is not valid./i)
      ).toBeInTheDocument();
    });
  });

  test("displays players search invalid", async () => {
    const mockGetData = { data: [{ message: "no data recieved" }] };

    render(<AddPlayers isAddOpen={true} id={1} />);
    waitFor(() => {
      getPlayers.mockRejectedValueOnce(mockGetData);
    });
  });

  it('Modal should close when cancel button is clicked', () => {
    const setIsAddOpen = jest.fn(); 
    const isAddOpen = true;
    const id = 123; 
  
    render(<AddPlayers setIsAddOpen={setIsAddOpen} isAddOpen={isAddOpen} id={id} />);
  
    const cancelButton = screen.getByTestId('cancelButton');
  
    fireEvent.click(cancelButton);
  
    expect(setIsAddOpen).toHaveBeenCalledWith(false);
  });
});



