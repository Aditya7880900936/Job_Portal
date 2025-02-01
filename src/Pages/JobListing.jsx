import { getCompanies } from "@/API/apiCompanies";
import { getJobs } from "@/API/apijobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 15;

  const { isLoaded } = useUser();

  const {
    fetchData: fetchDataJobs,
    data: { jobs: dataJobs, total } = { jobs: [], total: 0 },
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery, limit: jobsPerPage, page });
  

  useEffect(() => {
    if (total) {
      setTotalJobs(total);
    }
  }, [total]);

  const { fetchData: fetchDataCompanies, data: dataCompanies } =
    useFetch(getCompanies);

  // console.log(dataJobs);

  // console.log(dataCompanies);

  const handleSearch = (evt) => {
    // console.log("Searching");
    evt.preventDefault();
    let formData = new FormData(evt.target);

    const query = formData.get("search-query");
    if (query) {
      setSearchQuery(query);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSearchQuery("")
    setCompany_id("")
    setPage(1)
  }

  useEffect(() => {
    if (isLoaded) {
      const delayDebounce = setTimeout(() => {
        fetchDataJobs();
      }, 300); // Added debounce for performance
      return () => clearTimeout(delayDebounce);
    }
  }, [isLoaded, location, searchQuery, company_id, page]);

  useEffect(() => {
    if (isLoaded) fetchDataCompanies();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here  */}

      <form
        onSubmit={handleSearch}
        className="flex h-14 w-full gap-4 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="h-12 flex-1 px-4 text-md w-full rounded-lg"
        />
        <Button type="submit" className="h-12 ml-4 sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex  mb-4 flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>


        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataCompanies?.map(({ name , id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="destructive" className="sm:w-1/2" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataJobs?.length ? (
            dataJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  SavedInitial={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}

     <div className="flex justify-center items-center gap-2 mt-6">
        <Button variant="outline" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          <ChevronLeft className="w-5 h-5" />
          Prev
        </Button>

        <span className="px-4 py-2 border rounded-lg">Page {page} / {Math.ceil(totalJobs / jobsPerPage)}</span>

        <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={page >= Math.ceil(totalJobs / jobsPerPage)}>
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
}

export default JobListing;
