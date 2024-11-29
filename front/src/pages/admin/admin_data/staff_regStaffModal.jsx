import React, { useState } from "react";
import default_profile from "../../../assets/default_profile.png";
//import upload_pp from "../../../assets/upload_profile.png";
import "../admin_css/staff_popup.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { updateStaff, useAppUniidContext } from "../../../context";
import { uploadFile } from "../../../utils";
import Axios from "axios";

const UpdateStaffForm = ({ staff, onUpdate, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  const [contactNoN, setContactNo] = useState();
  //loading
  const [loading, setLoading] = useState(false);

  const formattedBirthDay = staff.birthDay
    ? new Date(staff.birthDay).toISOString().split("T")[0]
    : "";

  const initialUpdatedStaff = {
    ...staff,
    birthDay: formattedBirthDay,
  };

  const [updatedStaff, setUpdatedStaff] = useState(initialUpdatedStaff);

  const fileInputRef = React.createRef();
  const {
    idNumber: idNumber,
    userFName: userFName,
    userMName: userMName,
    userLName: userLName,
    userExt: userExt,
    birthDay: birthDay,
    birthPlace: birthPlace,
    gender: gender,
    userName: userName,
    emailAddress: emailAddress,
    Newpassword: Newpassword,
    contactNo: contactNo,
    pfpPic: pfpPic,
    uType: uType,
  } = updatedStaff;

  // handle change function

  const handlephoneChange = (value) => {
    setContactNo(value);
    console.log(contactNo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setUpdatedStaff({
      ...updatedStaff,
      [name]: value,
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
  };

  //submits text change only
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      updatedStaff.contactNo = contactNoN;

      console.log("Form Data:", updatedStaff);
      const res = await updateStaff(dispatch, updatedStaff);

      console.log("Update  response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        console.log("Update  successful");
        setLoading(false);
        window.location.reload();
      } else {
        const errorMessage = "Update failed no user";
        alert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      const networkErrorMessage = error.message || "Update failed network";
      alert(networkErrorMessage);
      setLoading(false);
    }
  };

  //change profile
  const handleImageUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Selected Image:", selectedImage);

      // Step 1: Check if there's an image to delete
      if (pfpPic) {
        //splitter function for update
        const separatedParts = pfpPic.split(".");
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

      console.log("No/del image found continuing");

      // Step 2: Upload the image if selected
      if (selectedImage) {
        const uplpic = await uploadFile(selectedImage);
        updatedStaff.pfpPic = uplpic.pfpPic;
        console.log(updatedStaff.pfpPic);
      } else {
        // No image selected, set pfpPic to the same string
        updatedStaff.pfpPic = pfpPic;
      }

      //Step 3: set payload update profile pic based on id
      const payload = {
        idNumber: updatedStaff.idNumber,
        pfpPic: updatedStaff.pfpPic,
      };

      const res = await updateStaff(dispatch, payload);
      if (res.status === 200) {
        console.log("Update  successful");
        setLoading(false);
        window.location.reload();
      } else {
        const errorMessage = "Update failed no profile";
        alert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      alert("Update profile failed", error);
      setLoading(false);
    }
  };

  const shouldShowUpdateProfileButton = selectedImage !== null;

  return (
    <>
      {/* loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <span className="loading-container">
            <span className="loading-icon-animation"></span>
          </span>
          <span className="loading-text">Loading...</span>
        </div>
      )}
      <form className="staff-det-container" onSubmit={handleSubmit}>
        <div className="staff-left-profile-container">
          <label className="profile-container" htmlFor="profileImageInput">
            <div className="view-user-upload-main-container">
              {selectedImage ? (
                <img
                  className="stud-profile"
                  alt="User Profile"
                  width={"150px"}
                  src={URL.createObjectURL(selectedImage)}
                />
              ) : (
                <img
                  className="stud-profile"
                  alt="Default Profile"
                  src={
                    `https://res.cloudinary.com/debe9q66f/image/upload/${pfpPic}` ||
                    default_profile
                  }
                  width={"150px"}
                  height={"150px"}
                  id="profileImage"
                />
              )}
            </div>
            <span className="upload-icon">
              <span className="upload-det">
                <i className="user-profile-upload-icon bx bx-camera"></i>
                <span className="ui-txt">Upload Profile</span>
              </span>
            </span>
          </label>
          <div className="edit-profile-ff">
            <input
              type="file"
              id="profileImageInput"
              name="myImage"
              onChange={handleFileUpload}
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            {shouldShowUpdateProfileButton && (
              <span className="profile-update-btn" onClick={handleImageUpdate}>
                UPDATE PROFILE
              </span>
            )}
            {shouldShowUpdateProfileButton && (
              <span
                className="profile-cancel-btn"
                onClick={() => setSelectedImage(null)}
              >
                CANCEL
              </span>
            )}
          </div>
        </div>

        <div className="staff-info-right">
          {/* User Subheader - Basic Staff Information*/}
          <div className="popup-subheader-container">
            <p className="u-basic-header">Basic Staff Information</p>
          </div>

          {/* User Basic Information Form Fields */}
          <div className="popup-basic-info-ff-container">
            <div className="popup-info-ff-1">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>First Name</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="userFName"
                  name="userFName"
                  value={userFName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Middle Name</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="userMName"
                  name="userMName"
                  value={userMName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Last Name</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="userLName"
                  name="userLName"
                  value={userLName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field-ext">
                <label>Ext.</label>
                <input
                  type="text"
                  id="userExt"
                  name="userExt"
                  value={userExt}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="popup-info-ff-2">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Employee No.</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="number"
                  id="idNumber"
                  name="idNumber"
                  value={idNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Designation</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="uType"
                  name="uType"
                  value={uType}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="popup-info-ff-3">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Gender</label>
                  <p className="ast"> *</p>
                </div>
                <select
                  className="gender-dd"
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected hidden></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Date of Birth</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="date"
                  id="birthDay"
                  name="birthDay"
                  value={birthDay}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Place of Birth</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  value={birthPlace}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* User Subheader - User Account Information*/}
          <div className="popup-subheader-container">
            <p className="u-basic-header">User Account Information</p>
          </div>

          {/* User Account Information Form Fields*/}
          <div className="popup-user-account-info-ff-container">
            <div className="popup-info-ff-4">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Username</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={userName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popup-info-form-field">
                <label>Email Address</label>
                <input
                  type="text"
                  id="emailAddress"
                  name="emailAddress"
                  value={emailAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="popup-info-ff-5">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>New Password</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="password"
                  id="Newpassword"
                  name="Newpassword"
                  onChange={handleInputChange}
                />
              </div>

              <div className="popup-info-form-field">
                <label>Contact No.</label>
                <PhoneInput
                  defaultCountry="PH"
                  name="contactNo"
                  placeholder="Enter phone number"
                  maxLength="13"
                  value={contactNo}
                  onChange={handlephoneChange}
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="popup-bottom-container">
            <div className="update-btn-container">
              <button className="update-user-btn" type="submit">
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateStaffForm;
