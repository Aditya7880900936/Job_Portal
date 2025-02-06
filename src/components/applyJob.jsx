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
import { useForm } from "react-hook-form";
import zodResolver from "@hookform/resolvers/zod";

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
    formState: { errors, reset },
  } = useForm({
    resolver: zodResolver(schema),
  });

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
        <form className="flex flex-col gap-4 p-4 pb-0">
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="Skills (Comma Seprated)"
            className="flex-1"
          />
          <RadioGroup defaultValue="option-one">
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
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
          />
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
