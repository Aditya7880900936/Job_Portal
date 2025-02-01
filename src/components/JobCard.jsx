import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/Hooks/useFetch";
import { Button } from "./ui/button";
import { useState } from "react";
import { savedJobs } from "@/API/apijobs";

const JobCard = ({
  job,
  isMyJob = false,
  SavedInitial = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(SavedInitial);
  const {
    fetchData: fetchSavedJobs,
    data: saveJobs,
    loading: loadingSavedJobs,
  } = useFetch(savedJobs,{
    alreadySaved: saved,
  });

  const { user } = useUser();

  const handleSavedJob = async () => {
    await fetchSavedJobs({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };

  useEffect(() => {
    if (saveJobs !== undefined) setSaved(saveJobs?.length > 0);
  }, [saveJobs]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button
            variant="secondary "
            className="w-full hover:bg-white hover:text-black"
          >
            Apply
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15 "
            onClick={handleSavedJob}
            disabled={loadingSavedJobs}
          >
            {" "}
            {saved ? (
              <Heart size={20} stroke="red " fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
