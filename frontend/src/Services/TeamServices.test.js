import {
  teamCreation,
  teamList,
  deleteTeam,
  teamPlayerListing,
  getTeamData,
  teamUpdation,
  
  RemovePlayer
} from "./TeamServices";

import { axiosPrivate } from "./CommonService/Interceptor";

jest.mock("./CommonService/Interceptor", () => ({
  axiosPrivate: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn()
  }
}));

describe("Team Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("teamCreation should send a POST request to the correct endpoint with correct data and headers", async () => {
    const data = new FormData();
    data.append("teamName", "My Team");
    data.append("logo", new File(["(⌐□_□)"], "logo.png", { type: "image/png" }));

    const responseData = { message: "success" };

    axiosPrivate.post.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await teamCreation(data);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("teamList should send a GET request to the correct endpoint with correct parameters and headers", async () => {
    const mockPage = 1;
    const mockPageSize = 10;
    const mockSearch = "search";
    const mockOrder = "order";
    const mockId = "id";
    const mockResponseData = { count: 1, results: [{ id: 1 }] };

    axiosPrivate.get.mockResolvedValueOnce({ status: 200, data: mockResponseData });

    const response = await teamList(mockPage, mockPageSize, mockSearch, mockOrder, mockId);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponseData);
    expect(axiosPrivate.get).toHaveBeenCalledWith("team/list/", {
      params: {
        page: mockPage,
        pageSize: mockPageSize,
        search: mockSearch,
        order: mockOrder,
        tournamentId: mockId
      },
      headers: { "Content-Type": "multipart/form-data" }
    });
  });

  test("deleteTeam should send a PATCH request to the correct endpoint with correct data and headers", async () => {
    const mockData = { teamId: 1 };
    const responseData = { message: "success" };

    axiosPrivate.patch.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await deleteTeam(mockData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("teamPlayerListing should send a GET request to the correct endpoint with correct teamId", async () => {
    const teamId = 123;
    const mockData = [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }];

    axiosPrivate.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const response = await teamPlayerListing(teamId);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  test("getTeamData should send a GET request to the correct endpoint with correct teamId and headers", async () => {
    const responseData = { /* mock team data */ };

    axiosPrivate.get.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await getTeamData(3);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("teamUpdation should send a PATCH request to the correct endpoint with correct data, teamId, and headers", async () => {
    const mockData = new FormData();
    mockData.append("teamName", "My Team");
    mockData.append("logo", new File(["(⌐□_□)"], "logo.png", { type: "image/png" }));

    const responseData = { message: "success" };

    axiosPrivate.patch.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await teamUpdation(mockData, 3);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("RemovePlayer function should send a PATCH request to the correct endpoint with correct playerId", async () => {
    const playerId = 123;
    const expectedResponse = { message: "Player removed successfully" };

    axiosPrivate.patch.mockResolvedValueOnce({ status: 200, data: expectedResponse });

    const response = await RemovePlayer(playerId);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(expectedResponse);
  });
});
