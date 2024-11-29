import { Axios } from "../config";

export async function fetchrenewQRList(payload) {
  try {
    const res = await Axios.get("/registrar", {
      params: payload, // Pass the payload as query parameters
    });

    if (res.status === 200) {
      // Extract the 'staffs' array from the response data
      const renewqrlist = res.data.renewQRList || [];

      return renewqrlist; // Return the array of staffs
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Fetching Error",
      };
    }
  } catch (error) {
    console.error("Error fetching renewQRList:", error);
    return {
      status: 500, // You can change this status code as needed
      errorMessage: "Internal Server Error",
    };
  }
}
