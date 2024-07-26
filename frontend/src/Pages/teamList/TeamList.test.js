import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TeamList from "./TeamList";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import * as apiUrls from "../../Services/TeamServices";
import { act } from "react-dom/test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ tournamentId: "2" }),
}));
jest.mock("../../components/Common/notFound/NotFound");
jest.mock("../../assets/loginBackground.png", () => "mocked-background-image");

jest.mock("../../Services/TeamServices", () => ({
  teamList: jest.fn(),
  getPlayers: jest.fn(),
  getTeamData: jest.fn(() =>
    Promise.resolve({
      data: {
        TeamName: "team name",
        city: "city",
        logo: "/media/logos/image.jpeg",
      },
    })
  ),

  deleteTeam: jest.fn(),
}));

describe("TeamList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(
      JSON.stringify({
        authTokens: {
          accessToken: "mockedAccessToken",
          refreshToken: "mockedRefreshToken",
          userId: "3",
          user_type: "0",
          tournamentId: "1",
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders team cards and paginates correctly", async () => {
    const mockResponse = {
      data: {
        count: 6,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            team_name: "Team A",
            city: "City A",
            logo: "logoA.png",
          },
          {
            id: 2,
            team_name: "Team B",
            city: "City B",
            logo: "logoB.png",
          },
          {
            id: 3,
            team_name: "Team C",
            city: "City C",
            logo: "logoC.png",
          },
          {
            id: 4,
            team_name: "Team D",
            city: "City D",
            logo: "logoD.png",
          },
          {
            id: 5,
            team_name: "Team E",
            city: "City E",
          },
          {
            id: 6,
            team_name: "Team F",
            city: "City F",
            logo: "logoF.png",
          },
        ],
      },
    };

    apiUrls.teamList.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <TeamList />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "summer" },
    });
    fireEvent.click(screen.getByLabelText(/search/i));
    await waitFor(() => {
      expect(apiUrls.teamList).toHaveBeenCalled();
    });

    const order = screen.getByLabelText(/order/i);
    fireEvent.click(order);
    fireEvent.keyDown(order.firstChild, { key: "ArrowDown" });
    fireEvent.click(screen.getByTestId(/pageSize/i));
  }, 10000);

  test("calls onSubmit correctly", async () => {
    const mockResponse = {
      data: {
        count: 1,
        results: [
          { id: 1, team_name: "Team A", city: "City A", logo: "logoA.png" },
        ],
      },
    };

    apiUrls.teamList.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TeamList />
        </MemoryRouter>
      );
    });
    screen.debug();

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "summer" },
    });

    fireEvent.submit(screen.getByTestId("search"));

    await waitFor(() => {
      expect(apiUrls.teamList).toHaveBeenCalled();
    });
  }, 30000);

  test("calls handleDelete correctly", async () => {
    const mockResponse = {
      data: {
        count: 1,
        results: [
          { id: 1, team_name: "Team A", city: "City A", logo: "logoA.png" },
        ],
      },
    };

    const mockDeleteResponse = {
      data: {
        success: "team deleted successfully",
      },
    };
    apiUrls.deleteTeam.mockResolvedValueOnce(mockDeleteResponse);

    apiUrls.teamList.mockResolvedValueOnce(mockResponse);
    apiUrls.deleteTeam.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <TeamList />
      </MemoryRouter>
    );
    screen.debug();
  });
});

describe("TeamList component for delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(
      JSON.stringify({
        authTokens: {
          accessToken: "mockedAccessToken",
          refreshToken: "mockedRefreshToken",
          userId: "3",
          user_type: "0",
          tournamentId: "1",
        },
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("delete team", async () => {
    const mockResponse = {
      data: {
        count: 6,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            team_name: "Team A",
            city: "City A",
            logo: "logoA.png",
          },
          {
            id: 2,
            team_name: "Team B",
            city: "City B",
            logo: "logoB.png",
          },
          {
            id: 3,
            team_name: "Team C",
            city: "City C",
            logo: "logoC.png",
          },
          {
            id: 4,
            team_name: "Team D",
            city: "City D",
            logo: "logoD.png",
          },
          {
            id: 5,
            team_name: "Team E",
            city: "City E",
          },
          {
            id: 6,
            team_name: "Team F",
            city: "City F",
            logo: "logoF.png",
          },
        ],
      },
    };

    const mockDeleteResponse = {
      data: {
        success: "team deleted successfully",
      },
    };

    apiUrls.teamList.mockResolvedValueOnce(mockResponse);
    apiUrls.deleteTeam.mockResolvedValueOnce(mockDeleteResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <TeamList />
        </MemoryRouter>
      );
    });
  });

  test("team deletion failed", async () => {
    const mockGetData = {
      data: [
        { first_name: "fname", last_name: "lname", phone_number: "0909090909" },
      ],
    };
    apiUrls.getPlayers.mockResolvedValueOnce(mockGetData);
    apiUrls.getPlayers.mockResolvedValueOnce(mockGetData);
    const mockResponse = {
      data: {
        count: 6,
        next: null,
        previous: null,
        results: [
          { id: 1, team_name: "Team A", city: "City A", logo: "logoA.png" },
          { id: 2, team_name: "Team B", city: "City B", logo: "logoB.png" },
          { id: 3, team_name: "Team C", city: "City C", logo: "logoC.png" },
          { id: 4, team_name: "Team D", city: "City D", logo: "logoD.png" },
          { id: 5, team_name: "Team E", city: "City E" },
          { id: 6, team_name: "Team F", city: "City F", logo: "logoF.png" },
        ],
      },
    };

    const errorCode = "5110";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };
    apiUrls.teamList.mockResolvedValueOnce(mockResponse);
    apiUrls.deleteTeam.mockRejectedValueOnce(mockErrorResponse);

    await act(async () => {
      render(
        <BrowserRouter>
          <TeamList />
        </BrowserRouter>
      );
    });

    fireEvent.click(screen.getByTestId(/testid1edit/i));

    fireEvent.click(screen.getByTestId("testid1"));
  });
});
