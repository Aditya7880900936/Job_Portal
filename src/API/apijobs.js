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
