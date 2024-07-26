import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { teamPlayerListing, RemovePlayer } from "../../Services/TeamServices";
import PlayerList from "./PlayerList";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../Services/TeamServices", () => ({
  teamPlayerListing: jest.fn(),
  RemovePlayer: jest.fn(),
}));

jest.mock("../../assets/user_profile.png", () => {
  return {
    default: "user_profile.png",
  };
});

describe("PlayerList Component", () => {
  beforeEach(() => {
    teamPlayerListing.mockResolvedValue({
      data: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          player_id: "101",
          phone_number: "1234567890",
        },
      ],
    });
  });

  test("clicking on delete button opens delete confirmation dialog", async () => {
    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByLabelText("remove player");
    fireEvent.click(deleteButton);
    expect(await screen.findByText("Delete Confirmation")).toBeInTheDocument();
  });
  test("clicking on view more button to view profile", async () => {
    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByLabelText("view profile");
    fireEvent.click(deleteButton);
  });

  test("clicking on delete button calls RemovePlayer and closes dialog", async () => {
    RemovePlayer.mockResolvedValueOnce({ status: 200 });
    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );
    const deleteButton = await screen.findByLabelText("remove player");
    fireEvent.click(deleteButton);

    expect(
      screen.getByText("Are you sure you want to delete the selected player?")
    ).toBeInTheDocument();
    const confirmButton = screen.getByTestId("deleteButton");
    fireEvent.click(confirmButton);

    expect(RemovePlayer).toHaveBeenCalledTimes(1);
    expect(RemovePlayer).toHaveBeenCalledWith({ playerListId: 1 });
  });

  test("clicking on delete button calls RemovePlayer and closes dialog by status code 400", async () => {
    const response = {
      data: { message: "Error message from server", errorCode: 4603 },
      status: 400,
    };
    RemovePlayer.mockResolvedValueOnce(response);
    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );
    const deleteButton = await screen.findByLabelText("remove player");
    fireEvent.click(deleteButton);

    expect(
      screen.getByText("Are you sure you want to delete the selected player?")
    ).toBeInTheDocument();
    const confirmButton = screen.getByTestId("deleteButton");
    fireEvent.click(confirmButton);
  });
  test("clicking on delete button handles error", async () => {
    const mockError = new Error("Failed to delete player");
    mockError.response = {
      data: { message: "Error message from server", errorCode: 4603 },
    };
    RemovePlayer.mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByLabelText("remove player");
    fireEvent.click(deleteButton);

    expect(
      screen.getByText("Are you sure you want to delete the selected player?")
    ).toBeInTheDocument();

    const confirmButton = screen.getByTestId("deleteButton");
    fireEvent.click(confirmButton);
  });

  test("handles error code 4603", async () => {
    teamPlayerListing.mockRejectedValueOnce({
      response: { data: { errorCode: 4603 } },
    });

    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );
  });
  test("handles other error codes", async () => {
    teamPlayerListing.mockRejectedValueOnce({
      response: { data: { errorCode: 4601 } },
    });

    render(
      <MemoryRouter>
        <PlayerList />
      </MemoryRouter>
    );
  });
});
