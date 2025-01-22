import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./Pages/LandingPage";
import OnBoarding from "./Pages/OnBoarding";
import JobListing from "./Pages/JobListing";
import JobPage from "./Pages/Job";
import PostJob from "./Pages/PostJob";
import SavedJobs from "./Pages/SavedJobs";
import MyJobs from "./Pages/myJobs";

const router = createBrowserRouter([
  {
    element :<AppLayout/>,
    children : [
      {
        path:"/",
        element:<LandingPage/>
      },
      {
        path:"/onBoarding",
        element:<OnBoarding/>
      },
      {
        path:"/jobs",
        element:<JobListing/>
      },
      {
        path:"/job/:id",
        element:<JobPage/>
      },
      {
        path:"/post-Job",
        element:<PostJob/>
      },
      {
        path:"/saved-Job",
        element:<SavedJobs/>
      }
      ,
      {
        path:"/my-jobs",
        element:<MyJobs/>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router = {router}/>
  );
}  

export default App;
