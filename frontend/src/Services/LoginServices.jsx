import { axiosPrivate } from "./CommonService/Interceptor";

  export const authenticateUser = (data) => {
    return axiosPrivate.post("player/login", data);
  };
  export const validateEmail =(email)=>{
    return axiosPrivate.post("player/validate_email",email)
  }
  export const playerRegister=(registrationData,token)=>{
    return axiosPrivate.post(`player/register/${token}`,registrationData)
  }
