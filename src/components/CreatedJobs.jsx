import { getMyJobs } from "@/API/apijobs";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { useEffect } from "react";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: dataCreatedJobs = [],
    fetchData: fetchCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fetchCreatedJobs();
  }, []);

  if (loadingCreatedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataCreatedJobs?.length ? (
          dataCreatedJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                onJobSaved={fetchCreatedJobs}
                isMyJob
              />
            );
          })
        ) : (
          <div>No Jobs Found</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
