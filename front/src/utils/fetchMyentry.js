import { Axios } from "../config";

export async function fetchMyEntryrecord(dispatch, payload) {
  try {
    const res = await Axios.get("/guard/entry/myentry", {
      params: payload,
    });

    if (res.status === 200) {
      // Extract the 'entryrec' array from the response data
      const entryrec = res.data;

      return entryrec; // Return the array of entryrec
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Fetching Error",
      };
    }
  } catch (error) {
    console.error("Error fetching entryrec:", error);
    return {
      status: 500, // You can change this status code as needed
      errorMessage: "Internal Server Error",
    };
  }
}
