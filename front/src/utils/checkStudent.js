import { Axios } from "../config";

export async function checkStudent(payload) {
  const { emailAddress } = payload;

  try {
    const res = await Axios.post("/admin/student/checkstudent", {
      emailAddress,
    });

    return res;
  } catch (error) {
    console.log(`Unhandled action type: ${error}`);

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage,
    };
  }
}
