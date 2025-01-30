import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Protected_Route = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { pathname } = useLocation();

  if(isLoaded && !isSignedIn && isSignedIn !== undefined){
    return <Navigate to="/?sign-in=true"/>
  }

//  Check OnBoarding Status

  if(user !== undefined && !user?.unsafeMetadata?.role && pathname !== '/onBoarding') {
    return <Navigate to='/onBoarding'/>
  }

  return children;
};

export default Protected_Route;
