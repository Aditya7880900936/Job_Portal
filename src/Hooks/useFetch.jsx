import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (callBack, options = {}) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const { session } = useSession();

  const fetchData = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      const response = await callBack(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData , data , error , loading}
};

export default useFetch;
