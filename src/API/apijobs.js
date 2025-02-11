import supabaseClient from "@/utils/supabase";

export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, limit = 15 }
) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("* , company:Companies(name,logo_url),saved:Saved_Jobs(id)", {
      count: "exact",
    });

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const start = (page - 1) * limit;
  const end = start + limit - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error Fetching data:", error);
    return { jobs: [], count: 0 };
  }

  return { jobs: data, totalJobs: count };
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

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:Companies(name,logo_url),applications:applications(*)")
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error Fetching Job: ", error);
    return null;
  }
  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  const { data, error } = await query;

  if (error) {
    console.error("Error Updating Job: ", error);
    return null;
  }
  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error Adding Job: ", error);
    return null;
  }
  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("Saved_Jobs")
    .select("* , job:jobs(*,company:Companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Job: ", error);
    return null;
  }
  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("* , company:Companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs : ", error);
    return null;
  }
  return data;
}

export async function deleteJobs(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Deleting Jobs : ", error);
    return null;
  }
  return data;
}
