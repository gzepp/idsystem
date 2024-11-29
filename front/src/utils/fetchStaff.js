import { Axios } from "../config";

export async function fetchStaff(payload) {
  try {
    const res = await Axios.get("/admin", {
      params: payload, // Pass the payload as query parameters
    });

    if (res.status === 200) {
      // Extract the 'staffs' array from the response data
      const staffs = res.data.users || [];

      return staffs; // Return the array of staffs
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Fetching Error",
      };
    }
  } catch (error) {
    console.error("Error fetching staffs:", error);
    return {
      status: 500, // You can change this status code as needed
      errorMessage: "Internal Server Error",
    };
  }
}
