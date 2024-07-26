import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("authTokens");
    navigate("/login");
  });
};

export default LogoutButton;
