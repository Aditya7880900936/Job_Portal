import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/Hooks/useFetch";
import { applyToApplications } from "@/API/apiApplications";
import { BarLoader } from "react-spinners";

const schema = z.object({
  yearsOfExperience: z
    .number()
    .min(0, { message: "Years of experience should be greater than 0" })
    .max(100)
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["InterMediate", "Graduate", "Post Graduate"], {
    required_error: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword" ||
          file[0].type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      {
        message: "Please upload a PDF, DOC or DOCX file",
      }
    ),
});

const ApplyJobDrawer = ({ job, user, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fetchData: fnApply,
  } = useFetch(applyToApplications);

  const onSubmit = async (data) => {
    await fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.name,
      status: "Applied",
      resume: data.resume[0],
    }).then(()=>{
      fetchJob(),
      reset()
    })
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill out the form below</DrawerDescription>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("yearsOfExperience", { valueAsNumber: true })}
          />

          {errors.yearsOfExperience && (
            <p className="text-red-500">{errors.yearsOfExperience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (Comma Seprated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="InterMediate" id="InterMediate" />
                  <Label htmlFor="InterMediate">InterMediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="Graduate" />
                  <Label htmlFor="Graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="Post Graduate" />
                  <Label htmlFor="Post Graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />

          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {errorApply?.message && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
