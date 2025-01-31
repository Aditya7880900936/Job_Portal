import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("Jobs")
    .select("* , company:Companies(name,logo_url),saved:Saved_Jobs(id)");

  if (location) {
    query = query.eq("location", Location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.like("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error Fetching data:", error);
    return null;
  }

  return data;
}

export async function savedJobs(token, { alreadySaved }, SavedData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("Saved_Jobs")
      .delete()
      .eq("job_id", SavedData.job_id);

    if (deleteError) {
      console.error("Error deleting Saved Jobs: ", deleteError);
      return null;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("Saved_Jobs")
      .insert([SavedData])
      .select();

    if (insertError) {
      console.error("Error inserting Saved Jobs: ", insertError);
      return null;
    }
    return data;
  }

  return data;
}
