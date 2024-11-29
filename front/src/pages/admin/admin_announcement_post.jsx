import React, { useEffect, useState } from "react";
import { AdminSidebar, AdminTopbar } from "../../components";
import { Link, useNavigate } from "react-router-dom";

import "./admin_css/admin_anno_post.css";
import admin_logo from "../../assets/sha_logo.png";
import AdminAnnoListSearch from "./admin_data/admin_component_sidesearch";

//fuction imports
import Axios from "axios";
import {
  validateUsers,
  postAnnounce,
  useAppUniidContext,
  checkPostExists,
} from "../../context";
import { uploadFile, generateRandomId } from "../../utils/";

export default function AdminAnnouncementPost() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateposted: "",
    postImage: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // remove image button

  // file upload
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
  };

  const postImage = "";
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
        const resit = await Axios.post("/cloudinary/delete-photo", {
          pfpPicId,
        });

        if (resit.status === 200) {
          console.log(resit.data);
        }
      }

      console.log("No image found continuing");
      formData.postId = generateRandomId(11);
      console.log(formData.postId);

      // Step 2: Check if the post already exists
      const postExists = await checkPostExists(formData.title, formData.postId);

      if (postExists) {
        console.log("Did the post exist:", postExists);
        return;
      }

      // Step 3: Upload the image if selected
      if (selectedImage) {
        const uplpic = await uploadFile(selectedImage);
        console.log(uplpic);
        if (uplpic && uplpic.pfpPic) {
          // Set formData.postimage to the uploaded image
          formData.postImage = uplpic.pfpPic;
          console.log(formData.postImage);
        }
      } else {
        // No image selected, set postimage to an empty string
        formData.postImage = "";
      }

      console.log("Form Data:", formData);
      const res = await postAnnounce(dispatch, formData);

      console.log("Post response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        const successMessage = "Post successful";
        console.log("Post successful");
        setError(successMessage);
        setLoading(false);
        window.location.reload();
      } else {
        const errorMessage = "Post existed";
        alert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      const networkErrorMessage = error.message || "Post  failed";
      alert(networkErrorMessage);
      setLoading(false);
    }
  };

  //validate function admin?
  const validate = async () => {
    try {
      // Get the token JSON string from sessionStorage
      const tokenString = window.sessionStorage.getItem("profile");

      if (!tokenString) {
        // Handle the absence of data in sessionStorage as needed
        navigate("/");
        return;
      }
      // Parse the JSON string to an object
      const tokenObject = JSON.parse(tokenString);

      // Access the token property
      const token = tokenObject._id;
      const isArchive = tokenObject.isArchive;

      const res = await validateUsers(dispatch, {
        token: token,
        isArchive: isArchive,
      });
      // Check user type
      const userType = res.data?.uType;

      if (res?.status === 200) {
        if (userType !== "admin") {
          navigate("/");
          return;
        } else {
          return;
        }
      } else {
        navigate("/");
        return;
      }
    } catch (error) {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    validate();
  }, []);
  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
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
      <div className="admin-a-reg-contents">
        <AdminTopbar pageName="Post Announcement" />
        <div className="admin-post-anno-wrapper">
          {/* Admin Post Main Form */}
          <div className="anno-post-container-wrapper">
            <div className="anno-post-container-body">
              <div className="anno-post-main-container">
                <form
                  className="anno-post-subcontainer"
                  onSubmit={handleSubmit}
                >
                  {/* Admin Post Header  */}
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
                            defaultValue="Category"
                            name="tags"
                            onChange={handleChange}
                            value={formData.tags}
                            required
                          >
                            <option value="" disabled>
                              Category
                            </option>
                            <option value="News">News</option>
                            <option value="Events">Events</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Post Input Body  */}
                  <div className="anno-input-main-container">
                    <div className="anno-input-title">
                      <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="anno-input-body-contents">
                      <textarea
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Input post details here"
                        required
                        rows="5"
                        style={{ width: "100%" }}
                      ></textarea>
                    </div>

                    <div className="anno-input-upload-file-img">
                      <div className="anno-post-img-container">
                        {selectedImage && (
                          <div className="image-container">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Uploaded Image"
                              width="200px"
                              name="postImage"
                              id="postImage"
                            />
                            <div>
                              <p>{selectedImage.name}</p>
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="image-upload-input"
                          name="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleFileUpload(event);
                            console.log(event.target.files[0]);
                          }}
                        />
                        <div className="upload-file-btn-ctr">
                          <label
                            htmlFor="image-upload-input"
                            className="upload-file-btn"
                          >
                            {selectedImage ? "Replace Image" : "Upload Image"}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="anno-post-btn-container">
                      <button type="submit" className="anno-post-btn">
                        POST
                      </button>
                      <Link to="/admin_anno_list" className="linking-back-page">
                        <span className="anno-cancel-btn">CANCEL</span>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <AdminAnnoListSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
