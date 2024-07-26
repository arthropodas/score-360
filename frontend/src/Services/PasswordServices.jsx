import { axiosPrivate } from "./CommonService/Interceptor";

export const forgotPassword = (email) => {
  return axiosPrivate.post("player/forgot_password", email);
};

export const linkValidation = (token) => {
  return axiosPrivate.put("player/link_validation", token);
};

export const resetPassword = (data) => {
  return axiosPrivate.put("player/reset_password", data);
};

export const changePassword = (data) => {
  return axiosPrivate.put("player/change_password", data);
};
