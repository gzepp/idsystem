import React, { useState } from "react";
import "../admin_css/admin_anno_post.css";
import admin_logo from "../../../assets/sha_logo.png";

//function import
import { updateAnno, useAppUniidContext } from "../../../context";
import { uploadFile } from "../../../utils";
import Axios from "axios";

const AdminAnnouncementEdit = ({ annoModalData, onUpdate, onClose }) => {
  const [globalState, dispatch] = useAppUniidContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [updatedAnno, setUpdatedAnno] = useState(annoModalData);
  //loading
  const [loading, setLoading] = useState(false);
  const {
    postId: postId,
    title: title,
    description: description,
    tags: tags,
    postImage: postImage,
  } = updatedAnno;

  const fileInputRef = React.createRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setUpdatedAnno({
      ...updatedAnno,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);

    setUpdatedAnno({
      ...updatedAnno,
      postImage: event.target.files[0],
    });
  };

  //file upload checks size and type
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      return; // No file selected
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = null; // Clear the file input
      return;
    }

    // Check file size (e.g., limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size exceeds the limit (5MB). Please choose a smaller file.");
      event.target.value = null; // Clear the file input
      return;
    }

    // File is valid; set it in the state
    setSelectedImage(file);
    console.log("filtered", selectedImage);
  };

  //sumit form for update and delete of file in cloud
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      console.log("Selected Image:", selectedImage);

      // Step 1: Check if there's an image to delete
      if (postImage) {
        //splitter function for update
        const separatedParts = postImage.split(".");
        const pfpPicId = separatedParts[0];

        console.log(pfpPicId);
        // Delete the image if PicId is defined
        try {
          const resit = await Axios.post("/cloudinary/delete-photo", {
            pfpPicId,
          });

          if (resit.status === 200) {
            console.log(resit.data);
          } else {
            // Handle the error
            console.error("Error deleting image:", resit.data.errorMessage);
          }
        } catch (deleteError) {
          // Handle the delete error
          console.error("Error deleting image:", deleteError);
        }
      }
      console.log("No/deleted image found continuing");

      // Step 2: Upload the image if selected
      if (selectedImage) {
        const uplpic = await uploadFile(selectedImage);
        updatedAnno.postImage = uplpic.pfpPic;
        console.log(updatedAnno.postImage);
      } else {
        // No image selected, set pfpPic to the same string
        updatedAnno.postImage = postImage;
      }

      //update anno
      console.log("Form Data:", updatedAnno);
      const res = await updateAnno(dispatch, updatedAnno);

      console.log("Update  response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        console.log("Update  successful");
        setLoading(false);
        window.location.reload();
      } else {
        const errorMessage = "Update failed no post";
        alert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      const networkErrorMessage = error.message || "Update failed network";
      alert(networkErrorMessage);
      setLoading(false);
    }
    onClose();
  };

  return (
    <div className="admin-u-regpage">
      <div className="anno-post-container-body">
        <div className="anno-post-main-container">
          <form className="anno-post-subcontainer" onSubmit={handleSubmit}>
            {/* Admin Post Header */}
            <div className="anno-post-header">
              <div className="anno-poster-name-container">
                <div className="anno-user-pic">
                  <img alt="SHASM Admin" width="40px" src={admin_logo} />
                </div>
                <div className="anno-post-details-container">
                  <span className="anno-poster-name">
                    <p>SHASM Admin</p>
                  </span>
                  <div className="post-category-dd">
                    <select
                      className="category-dd"
                      id="tags"
                      name="tags"
                      value={tags}
                      onChange={handleInputChange}
                      required
                    >
                      <option value=""></option>
                      <option value="News">News</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* loading overlay */}
            {loading && (
              <div className="loading-overlay">
                <span className="loading-container">
                  <span className="loading-icon-animation"></span>
                </span>
                <span className="loading-text">Loading...</span>
              </div>
            )}

            {/* Admin Post Input Body */}
            <div className="anno-input-main-container">
              <div className="anno-input-title">
                <input
                  type="text"
                  value={title}
                  name="title"
                  id="title"
                  onChange={handleInputChange}
                  placeholder="Title"
                  required
                />
              </div>

              <div className="anno-input-body-contents">
                <textarea
                  placeholder="Input post details here"
                  required
                  rows="5"
                  value={description}
                  name="description"
                  id="description"
                  onChange={handleInputChange}
                  style={{ width: "100%" }}
                ></textarea>
              </div>

              <div className="anno-input-upload-file-img">
                <div className="anno-post-img-container">
                  {(selectedImage || postImage) && (
                    <div className="image-container">
                      <img
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : `https://res.cloudinary.com/debe9q66f/image/upload/${postImage}`
                        }
                        alt="Uploaded Image"
                        width="200px"
                        name="postImage"
                        id="postImage"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    style={{ opacity: 0 }}
                    id="image-upload-input"
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                    required
                  />
                  <div className="upload-file-btn-ctr">
                    <label
                      htmlFor="image-upload-input"
                      className="upload-file-btn"
                    >
                      {selectedImage || postImage
                        ? "Replace Image"
                        : "Upload Image"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="anno-post-btn-container">
                <button className="anno-post-btn" type="submit">
                  EDIT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementEdit;
