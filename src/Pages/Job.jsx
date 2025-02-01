import { getSingleJob } from "@/API/apijobs";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: SingleJobData,
    fetchData: SingleJob,
  } = useFetch(getSingleJob, { job_id: id });

  useEffect(() => {
    if (isLoaded) {
      SingleJob();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {SingleJobData?.title}
        </h1>
        <img
          src={SingleJobData?.company?.logo_url}
          alt={SingleJobData?.company?.name}
          className="h-12"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {SingleJobData?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {SingleJobData?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {SingleJobData?.isOpen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>

      {/* Hiring Status */}

      

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{SingleJobData?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What We Are Looking For
      </h2>

      <MDEditor.Markdown
        source={SingleJobData?.requirements}
        style={{ background: "transparent", color: "white", fontSize: "1.3rem" }}
      />


      {/* Render Applications */}


    </div>
  );
};

export default JobPage;
