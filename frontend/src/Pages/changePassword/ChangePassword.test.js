import React from "react";
import "@testing-library/jest-dom";

import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as apiUrls from "../../Services/PasswordServices";
import { ChangePassword } from "./ChangePassword";
describe("ChangePassword Component", () => {
  beforeEach(() => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(
        JSON.stringify({
          authTokens: {
            accessToken: "mockedAccessToken",
            refreshToken: "mockedRefreshToken",
            userId: "2",
            user_type: "0",
          },
        })
      ),
    };
    Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
  });

  const renderChangePasswordComponent = () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );
  };

  const fillPasswordFieldsAndSubmit = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: currentPassword },
    });
    const toggleButton = screen.getAllByTestId("visibility-toggle");

    fireEvent.click(toggleButton[0]);
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: newPassword },
    });
    fireEvent.click(toggleButton[1]);
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: confirmPassword },
    });
    fireEvent.click(toggleButton[2]);
    fireEvent.click(screen.getByRole("button", { name: /change/i }));
    await act(async () => {});
  };

  it("renders the ChangePassword form", () => {
    renderChangePasswordComponent();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /change/i })).toBeInTheDocument();
  });

  it("Test if the password is not matching", () => {
    renderChangePasswordComponent();
    fillPasswordFieldsAndSubmit(
      "mockedCurrent@1Password",
      "mockedNewPassword@1",
      "mockedNewPassword"
    );
  });

  it("displays success message on successful password change", async () => {
    renderChangePasswordComponent();
    const mockData = {
      status: 200,
      data: { message: "Password changed successfully" },
    };
    const mockChangePassword = jest
      .spyOn(apiUrls, "changePassword")
      .mockResolvedValueOnce(mockData);
    await fillPasswordFieldsAndSubmit(
      "mockedCurrent@1Password",
      "mockedNewPassword@1",
      "mockedNewPassword@1"
    );
    expect(mockChangePassword).toHaveBeenCalled();
  });

  it("displays error message on failed password change", async () => {
    renderChangePasswordComponent();
    const mockError = new Error("Password change failed");
    mockError.response = {
      data: { errorCode: "2031", message: "Current password is not correct" },
      status: 400,
    };
    const mockChangePassword = jest
      .spyOn(apiUrls, "changePassword")
      .mockRejectedValueOnce(mockError);
    await fillPasswordFieldsAndSubmit(
      "mockedCurrent@12Password",
      "mockedNewPassword@1",
      "mockedNewPassword@1"
    );
    expect(mockChangePassword).toHaveBeenCalled();
  });
});
