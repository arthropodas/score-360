import {
  axiosPrivate
} from "../Services/CommonService/Interceptor";

jest.mock("../Services/CommonService/Interceptor", () => ({
  axiosPrivate: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn()
  }
}));

import {
  getUserData,
  tournamentRegister,
  tournamentEdit,
  getTournamentData,
  tournamentDelete,
  getTournamentLists,
} from "./TournamentServices";

describe("Service Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserData should send a GET request to the correct endpoint", async () => {
    const responseData = {
      userData: {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
      },
    };

    axiosPrivate.get.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await getUserData();

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("tournamentRegister should send a POST request to the correct endpoint with form data", async () => {
    const formData = new FormData();
    formData.append("key", "value");

    const responseData = {
      message: "success"
    };
    axiosPrivate.post.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await tournamentRegister(formData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("tournamentEdit should send a PUT request to the correct endpoint with form data", async () => {
    const formData = new FormData();
    formData.append("key", "value");

    const responseData = {
      message: "success"
    };
    axiosPrivate.put.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await tournamentEdit(formData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("getTournamentData should send a GET request to the correct endpoint with tournamentId", async () => {
    const tournamentId = "someId";
    const responseData = {
      tournamentData: {
        name: "Some Name",
      },
    };

    axiosPrivate.get.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await getTournamentData(tournamentId);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("tournamentDelete should send a PATCH request to the correct endpoint with selectedIds", async () => {
    const selectedIds = ["id1", "id2", "id3"];
    const responseData = {
      message: "success"
    };

    axiosPrivate.patch.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await tournamentDelete(selectedIds);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("getTournamentLists should send a GET request to the correct endpoint with search and ordering params", async () => {
    const search = "keyword";
    const ordering = "asc";
    const responseData = {
      tournaments: [{
        id: "1",
        name: "Name 1"
      }],
    };

    axiosPrivate.get.mockResolvedValueOnce({
      status: 200,
      data: responseData
    });

    const response = await getTournamentLists(search, ordering);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });
});
