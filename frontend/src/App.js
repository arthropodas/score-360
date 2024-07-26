import React from "react";
import { ErrorBoundary } from "./Services/CommonService/ErrorBoundary";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/Theme";


function App() {
  return (
    <div className="App">
      
      <ErrorBoundary>
        <ThemeProvider theme={theme}>

        <RouterProvider router={router} />
        </ThemeProvider>
    
      </ErrorBoundary>
     
      
    </div>


  );
}

export default App;
