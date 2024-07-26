import React from "react";
import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as apiUrls from "../../Services/TournamentServices";
import TournamentEdit from "./TournamentEdit";
import { act } from "react-dom/test-utils";
import NotFound from "../../components/Common/notFound/NotFound";

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

  it("handles 403 response", async () => {
    const mockErrorResponse = {
      response: {
        status: 403,
        data: {
          message: "You do not have permission to perform this action",
        },
      },
    };
    apiUrls.getTournamentData.mockRejectedValue(mockErrorResponse);

    render(
      <MemoryRouter>
        <TournamentEdit />
        <NotFound />
      </MemoryRouter>
    );
    screen.debug();
  });

  it("handles other errors", async () => {
    jest.clearAllMocks();

    const mockErrorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: "SOME_ERROR_CODE",
        },
      },
    };
    apiUrls.getTournamentData.mockRejectedValueOnce(mockErrorResponse);

    render(
      <MemoryRouter>
        <TournamentEdit />
      </MemoryRouter>
    );

    expect(apiUrls.getTournamentData).toHaveBeenCalledWith("2");
  });

  it("displays error message when submitting form with invalid data", async () => {
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
    apiUrls.tournamentEdit.mockRejectedValueOnce(mockErrorResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TournamentEdit />
        </MemoryRouter>
      );
    });

    act(async () => {
      const registerButton = screen.getByTestId("submit");
      fireEvent.click(registerButton);
    });
  });
});
