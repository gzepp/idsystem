import { Axios } from "../config";

export async function verifyOtp(payload) {
  const { emailAddress, otpCode } = payload;

  try {
    const res = await Axios.post("/admin/student/verifiotp", {
      emailAddressInput: emailAddress,
      otpCodeInput: otpCode,
    });

    if (res) {
      console.log(res);
      return res;
    }
  } catch (error) {
    console.error(`Unhandled action type: ${error}`);

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage,
    };
  }
}
