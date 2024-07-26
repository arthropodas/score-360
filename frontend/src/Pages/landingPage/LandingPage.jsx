import React, { useEffect } from "react";
import AppHeader from "../../layout/appHeader/AppHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageWithBorderLayout from "../../layout/box/Box";


export const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    if (location.pathname === "/")
    {
      navigate("/tournament");
    }
  },[])
 
 

  return (
    <>  
    <AppHeader />
     
      
      <PageWithBorderLayout>
        <Outlet />
      </PageWithBorderLayout>
    </>
  );
};
