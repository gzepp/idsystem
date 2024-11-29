import { Axios } from "../config";

export async function fetchAnnouncerecord(dispatch, payload) {
  try {
    const res = await Axios.get("/admin/announcement", payload);

    if (res.status === 200) {
      // Extract the ' announcement' array from the response data
      const announcement = res.data.announcement || [];

      return announcement; // Return the array of  announcement
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Fetching Error",
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      status: 500, // You can change this status code as needed
      errorMessage: "Internal Server Error",
    };
  }
}
