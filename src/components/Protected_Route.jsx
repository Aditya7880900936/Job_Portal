import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const Protected_Route = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { pathname } = useLocation();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const token = await getToken({ template: "supabase" });
        localStorage.setItem("supabaseAccessToken", token);
      }
      setLoading(false);
    };
    fetchToken();
  }, [isSignedIn]);

  if (loading) return <div>Loading...</div>;

  if (isLoaded && !isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  if (user && !user?.unsafeMetadata?.role && pathname !== "/onBoarding") {
    return <Navigate to="/onBoarding" />;
  }

  return children;
};

export default Protected_Route;
