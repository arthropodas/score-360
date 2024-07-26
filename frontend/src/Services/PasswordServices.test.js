import { forgotPassword, linkValidation, resetPassword, changePassword } from '../Services/PasswordServices';
import { axiosPrivate } from './CommonService/Interceptor';

jest.mock('./CommonService/Interceptor', () => ({
  axiosPrivate: {
    post: jest.fn(),
    put: jest.fn(),
  }
}));

describe('Service Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('forgotPassword should send a POST request to the correct endpoint', async () => {
    const email = 'test@example.com';
    const responseData = { message: 'sent successfully' };
    axiosPrivate.post.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await forgotPassword(email);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
    
  });

  test('linkValidation should send a PUT request to the correct endpoint', async () => {
    const token = 'your-token';
    const responseData = { message: 'sent successfully' };
    axiosPrivate.put.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await linkValidation(token);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
    
  });

  test('resetPassword should send a PUT request to the correct endpoint', async () => {
    const data = { newPassword: 'newpassword' };
    const responseData = { message: 'sent successfully' };
    axiosPrivate.put.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await resetPassword(data);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
    expect(axiosPrivate.put).toHaveBeenCalledWith('player/reset_password', data);
  });

  test('changePassword should send a PUT request to the correct endpoint', async () => {
    const data = { newPassword: 'newPassword' };
    const responseData = { message: 'sent successfully' };
    axiosPrivate.put.mockResolvedValueOnce({ status: 200, data: responseData });

    const response = await changePassword(data);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
    expect(axiosPrivate.put).toHaveBeenCalledWith('player/change_password', data);
  });
});
