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

import * as apiUrls from "../../Services/LoginServices";
import Login from "./Login";

jest.mock("jwt-decode");

jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});

jest.mock("../../Services/LoginServices", () => ({
  authenticateUser: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("login successfully", async () => {
    const mockData = {
      status: 200,
      data: {
        results: [
          {
            access:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNTcyMTczLCJpYXQiOjE3MDA1NzE1NzMsImp0aSI6IjUxY2YyZTVmMGYyZDRlZTViMzBjYWM5OWEyNmNhOTEyIiwidXNlcl9pZCI6MX0.kd2wJ0AnHkoySav413q8f2GYsGidcbrU8Lk-i0SO-5U",
            refresh:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwMDY1Nzk3MywiaWF0IjoxNzAwNTcxNTczLCJqdGkiOiJmNTQ2Yzc0OTIwYzQ0YmRjODY2Mzc2OTkxOWI2YThmZiIsInVzZXJfaWQiOjF9.p25VK91qPxa9_WP6Iigj7OxOS2dC0mcIF6pTqJAGLM8",
            id: 2,
            user_type: 1,
          },
        ],
      },
    };
    apiUrls.authenticateUser.mockResolvedValueOnce(mockData);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mithra@gmail.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "mithra@123" },
      });

      const loginButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(loginButton);
    });

    expect(apiUrls.authenticateUser).toHaveBeenCalled();
  });

  it("login fails do to invalid credencials", async () => {
    const mockData = {
      status: 400,
    };
    apiUrls.authenticateUser.mockResolvedValueOnce(mockData);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mithra@gmail.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "mithra@1234" },
      });

      const loginButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(loginButton);
    });

    expect(apiUrls.authenticateUser).toHaveBeenCalled();
  });

  it("login fails", async () => {
    const mockError = new Error("Login failed. Please check your credentials.");
    apiUrls.authenticateUser.mockRejectedValueOnce(mockError);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mithra@gmail.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "incorrectPassword" },
      });

      const loginButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(loginButton);
    });

    expect(apiUrls.authenticateUser).toHaveBeenCalled();
  });
  it("toggles password visibility on icon click", async () => {
    await waitFor(() => {
      expect(screen.getByLabelText(/password/i).type).toBe("password");
    });
    const toggleButton = screen.getByTestId("visibility-toggle");

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText(/password/i).type).toBe("text");

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText(/password/i).type).toBe("password");
  });

  it("Test if the email is not entered", async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "" },
      });

      const loginButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });
});
