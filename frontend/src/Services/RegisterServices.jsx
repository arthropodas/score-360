import { axiosPrivate } from "./CommonService/Interceptor";

export const playerRegister = (registrationData, token) => {
  return axiosPrivate.post(`player/register/${token}`, registrationData);
};

export const validateEmail = (email) => {
  return axiosPrivate.post("player/validate_email", email);
};
