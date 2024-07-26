import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import * as apiUrls from "../../Services/TournamentServices";
import TournamentRegister from "./TournamentRegister";

jest.mock("../../Services/TournamentServices", () => ({
  getUserData: jest.fn(),
  tournamentRegister: jest.fn(),
}));

describe("TournamentRegister Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(
        JSON.stringify({
          authTokens: {
            accessToken: "mockedAccessToken",
            refreshToken: "mockedRefreshToken",
            userId: "2",
            user_type: "0",
          },
        })
      ),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("submits the form with valid data", async () => {
    const mockGetUserData = {
      data: {
        id: 1,
        email: "asifnp@gmail.com",
        first_name: "asif",
        last_name: "np",
        phone_number: "1234567890",
        balling_style: "left",
        batting_style: "right",
      },
    };
    apiUrls.getUserData.mockResolvedValueOnce(mockGetUserData);

    const mockData = {
      data: {
        success: "Tournament created successfully.",
      },
    };

    apiUrls.tournamentRegister.mockResolvedValueOnce(mockData);

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentRegister />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByTestId(/tournament_name/i), {
      target: { value: "tournament" },
    });

    fireEvent.change(screen.getByTestId(/venue/i), {
      target: { value: "venue" },
    });

    const tournamentCategory = screen.getByLabelText(/Tournament Category/i);
    fireEvent.click(tournamentCategory);

    fireEvent.keyDown(tournamentCategory.firstChild, { key: "ArrowDown" });
    await waitFor(() => {
      screen.queryByTestId("Open");
    });

    fireEvent.click(screen.getByTestId("Open"));

    const ballType = screen.getByTestId("tennis-button");
    expect(ballType).toBeInTheDocument();

    fireEvent.click(ballType);

    fireEvent.change(screen.getByTestId(/ground/i), {
      target: { value: "ground" },
    });

    fireEvent.change(screen.getByTestId(/description/i), {
      target: { value: "description" },
    });

    fireEvent.change(screen.getByTestId(/start_date/i), {
      target: { value: "2024-10-22" },
    });
    fireEvent.change(screen.getByTestId(/end_date/i), {
      target: { value: "2024-10-31" },
    });

    act(() => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });

    await waitFor(() => {
      expect(apiUrls.tournamentRegister).toHaveBeenCalled();
    });
  }, 10000);

  test("get user data failed", async () => {
    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };

    apiUrls.getUserData.mockRejectedValueOnce(mockErrorResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentRegister />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(apiUrls.getUserData).toHaveBeenCalled();
    });
  });

  test("submits the form with valid data and rejected register api", async () => {
    const mockGetUserData = {
      data: {
        id: 1,
        email: "asifnp@gmail.com",
        first_name: "asif",
        last_name: "np",
        phone_number: "1234567890",
        balling_style: "left",
        batting_style: "right",
      },
    };
    apiUrls.getUserData.mockResolvedValueOnce(mockGetUserData);

    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };
    apiUrls.tournamentRegister.mockRejectedValueOnce(mockErrorResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentRegister />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByTestId(/tournament_name/i), {
      target: { value: "tournament" },
    });

    fireEvent.change(screen.getByTestId(/venue/i), {
      target: { value: "venue" },
    });

    const tournamentCategory = screen.getByLabelText(/Tournament Category/i);
    fireEvent.click(tournamentCategory);
    screen.debug()
    fireEvent.keyDown(tournamentCategory.firstChild, { key: "ArrowDown" });
    await waitFor(() => {
      screen.queryByTestId("Open");
    });

    fireEvent.click(screen.getByTestId("Open"));

    const ballType = screen.getByTestId("tennis-button");
    expect(ballType).toBeInTheDocument();

    fireEvent.click(ballType);

    fireEvent.change(screen.getByTestId(/ground/i), {
      target: { value: "ground" },
    });

    fireEvent.change(screen.getByTestId(/description/i), {
      target: { value: "description" },
    });

    fireEvent.change(screen.getByTestId(/start_date/i), {
      target: { value: "2024-08-22" },
    });
    fireEvent.change(screen.getByTestId(/end_date/i), {
      target: { value: "2024-08-31" },
    });

    act(() => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });
  });
});

describe("TournamentRegister component for fail", () => {
  test("submits the form with valid data", async () => {
    const mockGetUserData = {
      data: {
        id: 1,
        email: "asifnp@gmail.com",
        first_name: "asif",
        last_name: "np",
        phone_number: "1234567890",
        balling_style: "left",
        batting_style: "right",
      },
    };

    const mockGetUserDataResolvedValue = jest.spyOn(apiUrls, "getUserData");
    mockGetUserDataResolvedValue.mockResolvedValueOnce(mockGetUserData);

    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };
    const mockTournamentRegister = jest.spyOn(apiUrls, "tournamentRegister");
    mockTournamentRegister.mockRejectedValueOnce(mockErrorResponse);
    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentRegister />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByTestId(/tournament_name/i), {
      target: { value: "tournament" },
    });

    fireEvent.change(screen.getByTestId(/venue/i), {
      target: { value: "venue" },
    });

    const tournamentCategory = screen.getByLabelText(/Tournament Category/i);
    fireEvent.click(tournamentCategory);

    fireEvent.keyDown(tournamentCategory.firstChild, { key: "ArrowDown" });
    await waitFor(() => {
      screen.queryByTestId("Open");
    });

    fireEvent.click(screen.getByTestId("Open"));

    const ballType = screen.getByTestId("tennis-button");
    expect(ballType).toBeInTheDocument();

    fireEvent.click(ballType);

    fireEvent.change(screen.getByTestId(/ground/i), {
      target: { value: "ground" },
    });

    fireEvent.change(screen.getByTestId(/description/i), {
      target: { value: "description" },
    });

    fireEvent.change(screen.getByTestId(/start_date/i), {
      target: { value: "2024-08-22" },
    });
    fireEvent.change(screen.getByTestId(/end_date/i), {
      target: { value: "2024-08-31" },
    });

    act(() => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });
  });
});
