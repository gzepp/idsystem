import { Axios } from "../config";

export async function fetchProfile(payload) {
  const { _id, idNumber } = payload;

  console.log(payload);
  try {
    const res = await Axios.get("/admin/me", {
      idNumber: idNumber,
      _id: _id,
    });

    if (res.status === 200) {
      return res;
    } else {
      return res;
    }
  } catch (error) {
    console.error("Error fetching staffs:", error);
    return {
      status: 500, // You can change this status code as needed
      errorMessage: "Internal Server Error",
    };
  }
}
