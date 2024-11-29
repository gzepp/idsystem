import React, { useState } from "react";
import default_profile from "../../../assets/default_profile.png";
import default_qr from "../../../assets/Default-QR.png";
import "../admin_css/user_popup.css";
import { Input, QRCode, Space, Button } from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const ViewUserForm = ({ student }) => {
  //format date
  const birthDay = student.birthDay
    ? new Date(student.birthDay).toISOString().split("T")[0]
    : "";

  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
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
    emailAddress,
    password,
    contactNo,
    pfpPic,
    parentGuardianName,
    parentGuardianContact,
    studentQR,
  } = student;

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

  const downloadQRCode = () => {
    const canvas = document.getElementById("myqrcode").querySelector("canvas");
    if (canvas) {
      const url = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      a.download = "QRCode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <form className="user-det-container">
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

          <div className="qr-user-code-container">
            <Space direction="vertical" align="center">
              <div className="qr-user-container" id="myqrcode">
                <QRCode value={studentQR} size={150} />
              </div>
              {studentQR ? (
                <span className="qr-download-btn" onClick={downloadQRCode}>
                  DOWNLOAD QR
                </span>
              ) : (
                <div className="input-container">
                  <Input placeholder="-" maxLength={200} value={studentQR} />
                </div>
              )}
            </Space>
          </div>
        </div>

        <div className="user-info-right">
          <div className="popup-subheader-container">
            <p className="u-basic-header">Basic Student Information</p>
          </div>

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
              <div className="popup-info-form-field-sn">
                <div className="important-ff">
                  <label>Student No </label>
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
                  <label>Academic Level</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="acadLevel"
                  name="acadLevel"
                  value={acadLevel}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Course</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={course}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Year Level</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="yearLevel"
                  name="yearLevel"
                  value={yearLevel}
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

          <div className="popup-subheader-container">
            <p className="u-basic-header">User Account Information</p>
          </div>

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

          <div className="popup-subheader-container">
            <p className="u-basic-header">Residential Address</p>
          </div>

          <div className="popup-user-account-info-ff-container">
            <div className="popup-info-ff-4">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>
                    Address (House #/Block/Street/Subsdivision/Building)
                  </label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="perAddress"
                  name="perAddress"
                  value={perAddress}
                  readOnly
                />
              </div>
            </div>

            <div className="popup-info-ff-5">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Province/Region</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="perProvince"
                  name="perProvince"
                  value={perProvince}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Municipality/City</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="perMuniCity"
                  name="perMuniCity"
                  value={perMuniCity}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Barangay</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="perBarangay"
                  name="perBarangay"
                  value={perBarangay}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Postal Code</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="perZIP"
                  name="perZIP"
                  value={perZIP}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="popup-subheader-container">
            <p className="u-basic-header">Emergency Contact Information</p>
          </div>

          <div className="popup-emergency-information-ff-container">
            <div className="popup-info-ff-6">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Parent/Guardian Name</label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="text"
                  id="parentGuardianName"
                  name="parentGuardianName"
                  value={parentGuardianName}
                  readOnly
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Contact No.</label>
                  <p className="ast"> *</p>
                </div>
                <PhoneInput
                  defaultCountry="PH"
                  name="parentGuardianContact"
                  placeholder="Enter phone number"
                  maxLength="13"
                  value={parentGuardianContact}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ViewUserForm;
