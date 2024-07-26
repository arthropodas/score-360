import { playerRegister, validateEmail } from "../Services/RegisterServices";
import { axiosPrivate } from "../Services/CommonService/Interceptor";

jest.mock("../Services/CommonService/Interceptor", () => ({
  axiosPrivate: {
    post: jest.fn()
  }
}));

describe("Service Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("playerRegister should send a POST request to the correct endpoint", async () => {
    const registrationData = { data: "datas" };
    const token = "your-token";
    const responseData = { message: "successfully registered" };
    axiosPrivate.post.mockResolvedValueOnce({ status: 200, data: responseData });
    const response = await playerRegister(registrationData, token);
   
    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  test("validateEmail should send a POST request to the correct endpoint", async () => {
    const email = "test@example.com";
    const responseData = { message: "successfully registered" };
    axiosPrivate.post.mockResolvedValueOnce({ status: 200, data: responseData });
    const response = await validateEmail(email);
   
    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });
});
