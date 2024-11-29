import { Axios } from "../config";

export async function fetchUser(payload) {
  const { getStud } = payload;
  try {
    const res = await Axios.get("/admin/student/", {
      params: payload, // Pass the payload as query parameters
    });

    if (res.status === 200) {
      // Extract the 'students' array from the response data
      const students = res.data.students || [];

      return students; // Return the array of students
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
