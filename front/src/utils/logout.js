import { updateStudent, updateStaff } from "../context";

export async function logOut(dispatch, idNumber, uType) {
  if (uType === "staff" || uType === "admin") {
    const payload = { status: "Inactive", idNumber: idNumber };
    updateStaff(dispatch, payload);
    sessionStorage.clear();
    window.location.assign("/staff");
  } else {
    const payload = { status: "Inactive", idNumber: idNumber };
    updateStudent(dispatch, payload);
    sessionStorage.clear();
    window.location.assign("/");
  }
}
