import { Axios } from "../config";

export async function getData(payload) {
  try {
    const res = await Axios.get("/admin/getdata", {
      params: payload, // Pass the payload as query parameters
    });
    if (res.status === 200) {
      return res.data; // Return data numbers
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

export async function getDatastud(payload) {
  try {
    const res = await Axios.get("/admin/getdata/studentall", {
      params: payload, // Pass the payload as query parameters
    });
    if (res.status === 200) {
      return res.data; // Return data numbers
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

export async function getStaffQrData(payload) {
  try {
    const res = await Axios.get("/admin/getstaffqrRdata", {
      params: payload, // Pass the payload as query parameters
    });
    if (res.status === 200) {
      return res.data; // Return data numbers
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

export async function getEntryRdata(payload) {
  try {
    const res = await Axios.get("/admin/getentryRdata", {
      params: payload, // Pass the payload as query parameters
    });
    if (res.status === 200) {
      return res.data; // Return data numbers
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
