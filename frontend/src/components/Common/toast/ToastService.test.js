import { toast } from "react-toastify";
import { ToastService } from "./ToastService";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe("ToastService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call toast.success with message for type success", () => {
    const message = "Success message";
    const type = "success";

    ToastService(message, type);

    expect(toast.success).toHaveBeenCalledWith(message, expect.any(Object));
  });

  it("should call toast.error with message for type error", () => {
    const message = "Error message";
    const type = "error";

    ToastService(message, type);

    expect(toast.error).toHaveBeenCalledWith(message, expect.any(Object));
  });
});
