import supabaseClient from "@/utils/supabase";
import { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("Companies").select("*");
  const { data, error } = await query;
  if (error) {
    console.error("Error Fetching data : ", error);
    return null;
  }
  return data;
}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("Companies_Logo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading company logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/Companies_Logo/${fileName}`;

  let query = supabase
    .from("Companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();
  const { data, error } = await query;
  if (error) { 
    console.error("Error Subkitting  company: ", error);
    return null;
  }
  return data;
}
