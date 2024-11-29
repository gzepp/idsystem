import { Axios } from "../config";

export async function uploadCsvFile(file) {
  try {
    console.log(
      `Uploading CSV file: ${file.name} (${file.type}), Size: ${file.size} bytes`
    );

    const formData = new FormData();
    formData.append("file", file);

    console.log("form file data", formData);

    const res = await Axios.post("/admin/student/batchreg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res && res.status === 200) {
      console.log(`CSV file (${file.name}) uploaded successfully.`);
    } else {
      console.error(
        `Failed to upload CSV file (${file.name}). Status: ${res.status}`
      );
      throw new Error("File upload failed");
    }

    return res;
  } catch (error) {
    console.error("Error uploading CSV file:", error);
    throw error;
  }
}
