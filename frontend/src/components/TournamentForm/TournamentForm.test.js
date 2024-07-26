import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TournamentForm from "./TournamentForm";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("TournamentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should render with default values", () => {
    render(<TournamentForm />);
    fireEvent.click(screen.getByTestId("submit"));

    expect(screen.getAllByText("Venue")[0]).toBeInTheDocument();

    expect(screen.getByTestId("submit")).toBeInTheDocument();
    expect(screen.getByTestId("cancel")).toBeInTheDocument();
  });

  test("should display error message if required fields are not filled", async () => {
    render(<TournamentForm />);

    fireEvent.click(screen.getByTestId("submit"));

    await waitFor(() => {
      expect(
        screen.getByText(/Tournament name is required./i)
      ).toBeInTheDocument();
    });
  });
});
