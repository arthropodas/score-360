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

import * as apiUrls from "../../Services/PasswordServices";
import { ForgotPassword } from "./ForgotPassword";

describe("Login Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
  });

  it("renders the login form", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("Forgot password email send successfully", async () => {
    const mockData = {
      status: 200,
      data: { message: "Password reset link sent successfully" },
    };

    const mockForgotPassword = jest.spyOn(apiUrls, "forgotPassword");
    mockForgotPassword.mockResolvedValueOnce(mockData);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mithra@gmail.com" },
      });

      const Button = screen.getByRole("button", { name: /send/i });
      fireEvent.click(Button);
    });

    await waitFor(async () => {
      expect(mockForgotPassword).toHaveBeenCalled();
    });
  });

  it("Forgot password email send fail", async () => {
    const mockData = {
      status: 400,
    };

    const mockForgotPassword = jest.spyOn(apiUrls, "forgotPassword");
    mockForgotPassword.mockResolvedValueOnce(mockData);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mitra@gmail.com" },
      });

      const Button = screen.getByRole("button", { name: /send/i });
      fireEvent.click(Button);
    });

    await waitFor(async () => {
      expect(mockForgotPassword).toHaveBeenCalled();
    });
  });

  it("Forgot email send faild by invalid email", async () => {
    const mockData = {
      response: {
        data: {
          message: "Error message",
          erroCode: "2004",
        },
      },
    };

    const mockForgotPassword = jest.spyOn(apiUrls, "forgotPassword");
    mockForgotPassword.mockRejectedValue(mockData);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "mith@gmail.com" },
      });

      const Button = screen.getByRole("button", { name: /send/i });
      fireEvent.click(Button);
    });

    expect(mockForgotPassword).toHaveBeenCalled();
  });
});
