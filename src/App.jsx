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
import { ThemeProvider } from "./components/theme-provider";
import Protected_Route from "./components/Protected_Route";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onBoarding",
        element: (
          <Protected_Route>
            <OnBoarding />
          </Protected_Route>
        ),
      },
      {
        path: "/jobs",
        element: (
          <Protected_Route>
            <JobListing />
          </Protected_Route>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <Protected_Route>
            <JobPage/>
          </Protected_Route>
        ),
      },
      {
        path: "/post-Job",
        element: (
          <Protected_Route>
            <PostJob />
          </Protected_Route>
        ),
      },
      {
        path: "/saved-Job",
        element: (
          <Protected_Route>
            <SavedJobs />
          </Protected_Route>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <Protected_Route>
            <MyJobs />
          </Protected_Route>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
