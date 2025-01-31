import { getJobs } from "@/API/apijobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { data } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fetchData: fetchDataJobs,
    data: dataJobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  console.log(dataJobs);

  useEffect(() => {
    if (isLoaded) fetchDataJobs();
  }, [isLoaded, location, searchQuery, company_id]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here  */}

      {loadingJobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      {
        loadingJobs === false && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataJobs?.length ? (
               dataJobs.map((job)=>{
                return <JobCard key={job.id} job={job} SavedInitial = {job?.saved?.length>0} />
               })
            ):(
               <div>No Jobs Found</div>
            )}
          </div>
        ) 
      }
    </div>
  );
};

export default JobListing;
