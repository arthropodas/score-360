import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Protected =  ({Comp}) => {
   
    const navigate = useNavigate();
    let login = localStorage?.getItem("authTokens");
    useEffect(() => {

      if (login == null) {
        navigate("/login");
      }
    
    }, []);
    
    return <Comp/>;
    
};

Protected.propTypes = {
  Comp: PropTypes.elementType.isRequired,
};

export default Protected;
