import Axios from "../config/axios";

import { USER_ACTION } from "./reducer";
/////////////////////post funtions///////////////////////////////////
export async function registerStudent(dispatch, payload) {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    acadLevel,
    course,
    yearLevel,
    perAddress,
    perProvince,
    perMuniCity,
    perBarangay,
    perZIP,
    userName,
    password,
    emailAddress,
    contactNo,
    parentGuardianName,
    parentGuardianContact,
  } = payload;

  try {
    const res = await Axios.post("/admin/student", payload);

    if (res.status === 200) {
      // dispatch({
      //   type: USER_ACTION,
      //   payload: res.data,
      // });

      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);

    return {
      status: 500,
      errorMessage: "Registration failed",
    };
  }
}

//////////////////////////////////////////////////////////////
export async function registerStaff(dispatch, payload) {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    userName,
    password,
    emailAddress,
    contactNo,
    pfpPic,
    uType,
  } = payload;

  try {
    const res = await Axios.post("/admin", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);

    return {
      status: 500,
      errorMessage: "Registration failed",
    };
  }
}

//////////////////////////////////////////////////////////////
export async function postAnnounce(dispatch, payload) {
  const { title, description, dateposted, postImage, tags } = payload;

  try {
    const res = await Axios.post("/admin/announcement", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Post failed",
      };
    }
  } catch (error) {
    console.error("Post error:", error);

    return {
      status: 500,
      errorMessage: "Post failed",
    };
  }
}

////////////////////////////////////////////////////////
export async function logInuser(dispatch, payload) {
  const { userName, password } = payload;

  try {
    // Send a POST request to your login endpoint with user data
    const res = await Axios.post("/admin/login", payload); // Update the endpoint URL as per your API

    if (res.status === 200) {
      return res;
    } else {
      // Handle other response statuses or errors as needed
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Login failed",
      };
    }
  } catch (error) {
    // Handle network errors or exceptions
    console.error("Login error:", error);

    return {
      status: 500, // Set an appropriate status code
      errorMessage: "Login failed",
    };
  }
}

/////////////////////validate funtions///////////////////////////////////
export async function validateUsers(dispatch, payload) {
  const { token } = payload;

  try {
    const res = await Axios.post("/admin/validate", { token });

    return res;
  } catch (error) {
    console.error(`Unhandled action type: ${error}`);

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage,
    };
  }
}

////////////////////////////////////////////////////////

export async function fetchProfile(dispatch, payload) {
  console.log("hahahaha", payload);
  try {
    const res = await Axios.post("/admin/me", payload); // Use POST request to send data in the body

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

////////////////////////////////////////////////////////

export async function recordEntry(dispatch, payload) {
  const res = await Axios.post("/guard/entry", payload);

  console.log("Response from server:", res); // Log the entire response

  if (res.status === 200) {
    return res;
  } else {
    return {
      status: 500,
      errorMessage: "Entry failed",
    };
  }
}
///////////////////////////////////////////////

export async function checkUserExists(userName, idNumber) {
  try {
    const res = await Axios.get("/admin/student/userExist", {
      params: {
        userName: userName,
        idNumber: idNumber,
      },
    });

    return res.data.exists;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

///////////////////////////////////////////////

export async function checkPostExists(title, postId) {
  try {
    const res = await Axios.get("/admin/announcement/checkpost", {
      params: {
        title: title,
        postId: postId,
      },
    });

    return res.data.exists;
  } catch (error) {
    console.error("Error checking post existence:", error);
    throw error;
  }
}
/////////////////////put/update funtions///////////////////////////////////
export async function updateStudent(dispatch, payload) {
  const {
    idNumber,
    qrReset,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    acadLevel,
    course,
    yearLevel,
    perAddress,
    perProvince,
    perMuniCity,
    perBarangay,
    perZIP,
    userName,
    Newpassword,
    emailAddress,
    contactNo,
    parentGuardianName,
    parentGuardianContact,
    pfpPic,
    isArchive,
    status,
  } = payload;

  try {
    const res = await Axios.put("/admin/student", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Update failed",
      };
    }
  } catch (error) {
    console.error("Update error:", error);

    return {
      status: 500,
      errorMessage: "Update failed",
    };
  }
}

////////////////////////////////////////////////////////
export async function updateStaff(dispatch, payload) {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    userName,
    password,
    emailAddress,
    contactNo,
    pfpPic,
    isArchive,
    status,
  } = payload;

  try {
    const res = await Axios.put("/admin/", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Update failed",
      };
    }
  } catch (error) {
    console.error("Update error:", error);

    return {
      status: 500,
      errorMessage: "Update failed",
    };
  }
}

////////////////////////////////////////////////////////
export async function updateAnno(dispatch, payload) {
  const { postId, title, description, dateposted, postImage, tags } = payload;

  try {
    const res = await Axios.put("/admin/announcement", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Update failed",
      };
    }
  } catch (error) {
    console.error("Update error:", error);

    return {
      status: 500,
      errorMessage: "Update failed",
    };
  }
}
///////////////////////////////////////////////
export async function reqQrreset(payload) {
  const res = await Axios.post("/registrar", payload);

  console.log("Response from server:", res); // Log the entire response

  if (res.status === 200) {
    return res;
  } else {
    return {
      status: 500,
      errorMessage: "Entry failed",
    };
  }
}
///////////////////////////////////////////////
export async function updateQrrequest(payload) {
  const { _id, idNumber, reqFullname, description } = payload;

  try {
    const res = await Axios.put("/registrar", payload);

    if (res.status === 200) {
      return res;
    } else {
      return {
        status: res.status,
        errorMessage: res.data.errorMessage || "Update failed",
      };
    }
  } catch (error) {
    console.error("Update error:", error);

    return {
      status: 500,
      errorMessage: "Update failed",
    };
  }
}
//////////////////////test/////////////////////////

export async function teskCon(dispatch, payload) {
  const res = await Axios.get("/test", payload);

  if (res.status === 200) {
    // dispatch({
    //   type: USER_ACTION,
    //   payload: res.data,
    // });

    return res;
  } else {
    return {
      status: res.status,
      errorMessage: res.data.errorMessage || "Login failed",
    };
  }
}
