import { getSingleJob, updateHiringStatus } from "@/API/apijobs";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/applyJob";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: SingleJobData,
    fetchData: SingleJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fetchData: HiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open" ? true : false;
    HiringStatus(isOpen).then(() => SingleJob());
  };

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
      {SingleJobData?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              SingleJobData?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" +
                (SingleJobData?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{SingleJobData?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What We Are Looking For
      </h2>

      <MDEditor.Markdown
        source={SingleJobData?.requirements}
        style={{
          background: "transparent",
          color: "white",
          fontSize: "1.3rem",
        }}
      />

      {/* Render Applications */}

      {SingleJobData?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={SingleJobData}
          user={user}
          fetchJob={SingleJob}
          applied={SingleJobData?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
    </div>
  );
};

export default JobPage;
