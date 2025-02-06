import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToApplications(token, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error Uploading Resume : ", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  let query = supabase
    .from("Applications")
    .insert([{ ...jobData, resume }])
    .select();

  const { data, error } = await query;
  if (error) {
    console.error("Error Submitting Appplications : ", error);
    return null;
  }
  return data;
}
