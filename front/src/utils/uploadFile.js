import { Axios } from "../config";
import { cloud_name } from "../constant";
export async function uploadFile(selectedImage) {
  const folderName = "profile-images";

  const formData = new FormData();
  formData.append("file", selectedImage);
  formData.append("upload_preset", "fos6mazt"); // Replace with your Cloudinary upload preset

  // console.log("Cloud Name:", cloud_name);

  const cloudinaryResponse = await Axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (e) {
        console.log(e.loaded / e.total);
      },
      withCredentials: false,
    }
  );
  // console.log("Cloudinary Response Data:", cloudinaryResponse.data);

  const photoData = {
    public_id: cloudinaryResponse.data.public_id,
    format: cloudinaryResponse.data.format,
    version: cloudinaryResponse.data.version,
    signature: cloudinaryResponse.data.signature,
    pfpPic: `${cloudinaryResponse.data.public_id}.${cloudinaryResponse.data.format}`,
  };

  return photoData;
}
