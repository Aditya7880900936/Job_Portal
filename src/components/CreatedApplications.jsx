import { getApplications } from "@/API/apiApplications";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: dataApplications = [],
    fetchData: fetchApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {dataApplications.map((application) => {
        return (
          <ApplicationCard key={application.id} application={application} isCandidate/>
        );
      })}
    </div>
  );
};

export default CreatedApplications;
