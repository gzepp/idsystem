import { Axios } from "../config";

export async function resetPassword(payload) {
  const { emailAddress, password } = payload;

  try {
    const res = await Axios.post("/admin/student/resetpass", {
      emailAddress: emailAddress,
      newPassword: password,
    });

    if (res) {
      return res;
    }
  } catch (error) {
    console.log(`Unhandled action type: ${error}`);

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage,
    };
  }
}
