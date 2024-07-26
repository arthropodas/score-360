import React from "react";
import "@testing-library/jest-dom";

import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as apiUrls from "../../Services/TournamentServices";
import TournamentEdit from "./TournamentEdit";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ tournamentId: "2" }),
}));
jest.mock("../../components/Common/notFound/NotFound");
jest.mock("../../assets/loginBackground.png", () => "mocked-background-image");

jest.mock("../../Services/TournamentServices", () => ({
  getTournamentData: jest.fn(),
  tournamentEdit: jest.fn(),
}));

describe("TournamentEdit Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(
      JSON.stringify({
        authTokens: {
          accessToken: "mockedAccessToken",
          refreshToken: "mockedRefreshToken",
          userId: "2",
          user_type: "0",
        },
      })
    );
  });
  test("submits the form with valid data", async () => {
    const mockTournamentData = {
      data: {
        ball_type: "tennis",
        created_at: "2024-02-01T03:27:13.175292Z",
        description: "This is a test tournament description.",
        end_date: "2024-06-23",
        ground: "TestGround",
        id: 2,
        organizer_contact: "1234567890",
        organizer_name: "TestOrganizer",
        start_date: "2024-02-20",
        status: 1,
        tournament_category: "open",
        tournament_name: "dfs",
        updated_at: "2024-02-01T03:27:13.175321Z",
        user: 2,
        venue: "TestVenue",
        tournamentId: 2,
      },
    };
    apiUrls.getTournamentData.mockResolvedValueOnce(mockTournamentData);

    const mockTournamentEditResolvedValue = {
      status: 200,
      data: {
        success: "Tournament updated successfully",
      },
    };
    apiUrls.tournamentEdit.mockResolvedValueOnce(
      mockTournamentEditResolvedValue
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentEdit />
        </MemoryRouter>
      );
    });

    act(() => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });
  });

  test("displays error message when submitting form with invalid data", async () => {
    const mockTournamentData = {
      data: {
        ball_type: "tennis",
        created_at: "2024-02-01T03:27:13.175292Z",
        description: "This is a test tournament description.",
        end_date: "2024-02-15",
        ground: "Test Ground",
        id: 7,
        organizer_contact: "1234567890",
        organizer_name: "Test Organizer",
        start_date: "2024-02-10",
        status: 1,
        tournament_category: "open",
        tournament_name: "dfs",
        updated_at: "2024-02-01T03:27:13.175321Z",
        user: 1,
        venue: "Test Venue",
      },
    };

    apiUrls.getTournamentData.mockResolvedValueOnce(mockTournamentData);

    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };
    apiUrls.tournamentEdit.mockResolvedValueOnce(mockErrorResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentEdit />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByTestId(/submit/i));
    fireEvent.change(screen.getAllByTestId(/tournament_name/i)[0], {
      target: { value: "de328209" },
    });
    fireEvent.change(screen.getAllByTestId(/venue/i)[0], {
      target: { value: "de328209" },
    });
    fireEvent.change(screen.getAllByTestId(/organizer_contact/i)[0], {
      target: { value: "de328209654654654654654" },
    });
    fireEvent.change(screen.getAllByTestId(/organizer_name/i)[0], {
      target: { value: "de328209654654654654654" },
    });
    fireEvent.click(screen.getByTestId(/submit/i));

    const endDate = screen.getByTestId("end_date");
    fireEvent.change(endDate, { target: { value: "05-11-2023" } });

    const startDate = screen.getByTestId("start_date");
    fireEvent.change(startDate, { target: { value: "10-12-2024" } });

    fireEvent.change(startDate, { target: { value: "25-6-2024" } });

    fireEvent.change(endDate, { target: { value: "05-11-2024" } });

    act(async () => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });
  });

  test("handles 403 response", async () => {
    const mockErrorResponse = {
      response: {
        status: "403",
        data: {
          message: "You do not have permission to perform this action",
        },
      },
    };
    apiUrls.getTournamentData.mockResolvedValueOnce(mockErrorResponse);

    render(
      <MemoryRouter>
        <TournamentEdit />
      </MemoryRouter>
    );
  });

  test("handles 403 response", async () => {
    const mockErrorResponse = {
      response: {
        status: 403,
        data: {
          message: "You do not have permission to perform this action",
        },
      },
    };
    apiUrls.getTournamentData.mockResolvedValueOnce(mockErrorResponse);

    render(
      <MemoryRouter>
        <TournamentEdit />
      </MemoryRouter>
    );
    screen.debug();
  });

  test("handles other errors", async () => {
    jest.clearAllMocks();

    const mockErrorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: "SOME_ERROR_CODE",
        },
      },
    };
    apiUrls.getTournamentData.mockResolvedValueOnce(mockErrorResponse);

    render(
      <MemoryRouter>
        <TournamentEdit />
      </MemoryRouter>
    );
  });
});
