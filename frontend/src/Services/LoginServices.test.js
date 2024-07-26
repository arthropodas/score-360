import {
  authenticateUser,
  validateEmail,
} from "../Services/LoginServices";
import { axiosPrivate } from "./CommonService/Interceptor";

jest.mock('./CommonService/Interceptor', () => ({
  axiosPrivate:{
    get:jest.fn(),
    post:jest.fn(),
    patch: jest.fn(),
    put:jest.fn()
  }
}))

describe("Login Services", () => {
 
  test('authenticateUser should send a POST request to the correct endpoint', async () => {
    const data = { email: 'arun@gmail.com', password: '123467877' };
   
    axiosPrivate.post('player/login')
    await authenticateUser(data)
    
  });

  test("validateEmail should send a POST request to the correct endpoint", async () => {
    const email = "test@example.com";
    

    axiosPrivate.post("player/validate_email")

    await validateEmail(email);
  });

  test("playerRegister should send a POST request to the correct endpoint with the token", async () => {

    const token = "your-token";
    axiosPrivate.post(`player/register/${token}`)
  });
});
