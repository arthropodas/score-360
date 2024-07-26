import React from "react";
import "@testing-library/jest-dom";

import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as apiUrls from "../../Services/PasswordServices";
import { ResetPassword } from "./ResetPassword";

jest.mock("../../Services/PasswordServices");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(() => ({
    search:
      "?j=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNTcyMTczLCJpYXQiOjE3MDA1NzE1NzMsImp0aSI6IjUxY2YyZTVmMGYyZDRlZTViMzBjYWM5OWEyNmNhOTEyIiwidXNlcl9pZCI6MX0.kd2wJ0AnHkoySav413q8f2GYsGidcbrU8Lk-i0SO-5U",
  })),
}));
const setupTest = async () => {
  const mockLinkValidation = jest.spyOn(apiUrls, "linkValidation");
  mockLinkValidation.mockResolvedValueOnce({ status: 200 });

  render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>
  );

  await act(async () => {});
  expect(mockLinkValidation).toHaveBeenCalled();

  const newPasswordInput = screen.getByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const resetButton = screen.getByRole("button", { name: /reset/i });

  return { newPasswordInput, confirmPasswordInput, resetButton };
};
describe("ResetPassword Component", () => {
  it("Test if the password is not matching", async () => {
    const { newPasswordInput, confirmPasswordInput, resetButton } =
      await setupTest();
    await waitFor(() => {
      fireEvent.change(newPasswordInput, {
        target: { value: "newPassword@1234" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newPassword123" },
      });
      fireEvent.click(resetButton);
    });
  });

  it("Reset password success", async () => {
    const { newPasswordInput, confirmPasswordInput, resetButton } =
      await setupTest();

    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();

    const mockData = {
      status: 200,
      data: { message: "Your password has been successfully reset" },
    };

    const mockResetPassword = jest.spyOn(apiUrls, "resetPassword");
    mockResetPassword.mockResolvedValueOnce(mockData);
    await waitFor(() => {
      fireEvent.change(newPasswordInput, {
        target: { value: "newPassword@123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newPassword@123" },
      });
      fireEvent.click(resetButton);
    });

    await waitFor(async () => {});

    expect(mockResetPassword).toHaveBeenCalled();
  });

  it("Reset password link validation fails", async () => {
    const mockLinkValidation = jest.spyOn(apiUrls, "linkValidation");
    mockLinkValidation.mockResolvedValueOnce({ status: 400, data: {} });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await waitFor(async () => {});

    expect(mockLinkValidation).toHaveBeenCalled();
  });

  it("Reset password fails", async () => {
    const mockLinkValidation = jest.spyOn(apiUrls, "linkValidation");
    mockLinkValidation.mockResolvedValueOnce({ status: 200, data: {} });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await waitFor(async () => {});

    const mockError = new Error();
    mockError.response = {
      data: { message: "Password change failed", errorCode: "2004" },
      status: 400,
    };

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const resetButton = screen.getByRole("button", { name: /reset/i });

    const mockResetPassword = jest.spyOn(apiUrls, "resetPassword");
    mockResetPassword.mockRejectedValueOnce(mockError);
    await waitFor(() => {
      fireEvent.change(newPasswordInput, {
        target: { value: "newPassword@123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newPassword@123" },
      });
      fireEvent.click(resetButton);
    });

    await waitFor(async () => {});
    expect(mockResetPassword).toHaveBeenCalled();
  });
  it("Reset password fails do to invalid password", async () => {
    const mockLinkValidation = jest.spyOn(apiUrls, "linkValidation");
    mockLinkValidation.mockResolvedValueOnce({ status: 200, data: {} });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await waitFor(async () => {});

    const mockData = {
      data: { message: "Password change failed" },
      status: 400,
    };

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const resetButton = screen.getByRole("button", { name: /reset/i });

    const mockResetPassword = jest.spyOn(apiUrls, "resetPassword");
    mockResetPassword.mockResolvedValueOnce(mockData);
    await waitFor(() => {
      fireEvent.change(newPasswordInput, {
        target: { value: "newPassword@1123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newPassword@1123" },
      });
      fireEvent.click(resetButton);
    });

    await waitFor(async () => {});

    expect(mockResetPassword).toHaveBeenCalled();
  });

  it("toggles password visibility on icon click", async () => {
    const { newPasswordInput, confirmPasswordInput, resetButton } =
      await setupTest();

    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();

    const mockData = {
      status: 200,
      data: { message: "Password reset successfully" },
    };

    const mockResetPassword = jest.spyOn(apiUrls, "resetPassword");
    mockResetPassword.mockResolvedValueOnce(mockData);
    await waitFor(() => {
      fireEvent.change(newPasswordInput, {
        target: { value: "newPassword@123" },
      });
      const toggleButton = screen.getAllByTestId("visibility-toggle");

      fireEvent.click(toggleButton[0]);

      fireEvent.change(confirmPasswordInput, {
        target: { value: "newPassword@123" },
      });

      fireEvent.click(toggleButton[1]);
    });
  });

  it("should handle error on mount", async () => {
    const mockLinkValidation = jest.spyOn(apiUrls, "linkValidation");
    mockLinkValidation.mockRejectedValueOnce(new Error("Some error"));

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    await waitFor(async () => {});

    expect(mockLinkValidation).toHaveBeenCalled();
    expect(screen.getByText("This link has expired.")).toBeInTheDocument();
  });
});
