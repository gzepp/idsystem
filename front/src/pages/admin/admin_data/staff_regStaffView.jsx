import React, { useState } from "react";
import default_profile from "../../../assets/default_profile.png";
import upload_pp from "../../../assets/upload_profile.png";
import "../admin_css/staff_popup.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
const ViewStaffForm = ({ staff, onUpdate, onClose }) => {
  //format date
  const birthDay = staff.birthDay
    ? new Date(staff.birthDay).toISOString().split("T")[0]
    : "";
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,

    birthPlace,
    gender,
    userName,
    emailAddress,
    password,
    contactNo,
    pfpPic,
    uType,
  } = staff;

  //User Profile Download
  const handleDownload = () => {
    if (pfpPic) {
      const imageUrl = `https://res.cloudinary.com/debe9q66f/image/upload/${pfpPic}`;

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "profile.png";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch((error) => console.error("Error downloading image: ", error));
    }
  };
  return (
    <>
      <form className="view-staff-det-container">
        <div className="left-profile-container">
          <label className="view-profile-container" htmlFor="profileImageInput">
            <div className="upload-pp">
              <img
                className="stud-profile"
                alt="Default Profile"
                src={
                  pfpPic
                    ? `https://res.cloudinary.com/debe9q66f/image/upload/${pfpPic}`
                    : default_profile
                }
                width={"150px"}
                height={"150px"}
                id="profileImage"
              />
            </div>
          </label>
          <div className="edit-profile-ff">
            {pfpPic && (
              <span className="profile-download-btn" onClick={handleDownload}>
                DOWNLOAD PROFILE
              </span>
            )}
          </div>
        </div>

        <div className="view-staff-info-right">
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
                  readOnly
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
                  readOnly
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
                  readOnly
                />
              </div>

              <div className="popup-info-form-field-ext">
                <label>Ext.</label>
                <input
                  type="text"
                  id="userExt"
                  name="userExt"
                  value={userExt}
                  readOnly
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
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={idNumber}
                  readOnly
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
                  readOnly
                />
              </div>
            </div>

            <div className="popup-info-ff-3">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Gender</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={gender}
                  readOnly
                />
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
                  readOnly
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
                  readOnly
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
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <label>Email Address</label>
                <input
                  type="text"
                  id="emailAddress"
                  name="emailAddress"
                  value={emailAddress}
                  readOnly
                />
              </div>
            </div>

            <div className="popup-info-ff-5">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Password</label>
                  <p className="ast"> *</p>
                </div>
                <input type="password" id="password" name="password" readOnly />
              </div>

              <div className="popup-info-form-field">
                <label>Contact No.</label>
                <PhoneInput
                  defaultCountry="PH"
                  name="contactNo"
                  placeholder="Enter phone number"
                  maxLength="13"
                  value={contactNo}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
        </div>
      </form>
    </>
  );
};

export default ViewStaffForm;
