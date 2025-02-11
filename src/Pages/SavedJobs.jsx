import { getSavedJobs, savedJobs } from "@/API/apijobs";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: DataSavedJobs = [],
    fetchData: fetchSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fetchSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DataSavedJobs?.length ? (
            DataSavedJobs.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  SavedInitial={true}
                  onJobSaved={fetchSavedJobs}
                />
              );
            })
          ) : (
            <div>No Saved Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
