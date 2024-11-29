import React, { useState, useRef } from "react";
import { Input, QRCode, Space, Button } from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import default_profile from "../../../assets/default_profile.png";
import "../css/reg_popup.css";

import { updateStudent, useAppUniidContext } from "../../../context";
import { uploadFile } from "../../../utils";
import Axios from "axios";

const UpdateUserForm = ({ student, onUpdate, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  //loading
  const [loading, setLoading] = useState(false);
  //format date
  const formattedBirthDay = student.birthDay
    ? new Date(student.birthDay).toISOString().split("T")[0]
    : "";

  const initialUpdatedStudent = {
    ...student,
    birthDay: formattedBirthDay,
  };

  const [updatedStudent, setUpdatedStudent] = useState(initialUpdatedStudent);
  const fileInputRef = React.createRef();

  const [contactNoN, setContactNo] = useState();
  const [parentGuardianContactN, setparentGuardianContact] = useState();

  const {
    idNumber: idNumber,
    userFName: userFName,
    userMName: userMName,
    userLName: userLName,
    userExt: userExt,
    birthDay: birthDay,
    birthPlace: birthPlace,
    gender: gender,
    acadLevel: acadLevel,
    course: course,
    yearLevel: yearLevel,
    perAddress: perAddress,
    perProvince: perProvince,
    perMuniCity: perMuniCity,
    perBarangay: perBarangay,
    perZIP: perZIP,
    userName: userName,
    Newpassword: Newpassword,
    emailAddress: emailAddress,
    contactNo: contactNo,
    pfpPic: pfpPic,
    parentGuardianName: parentGuardianName,
    parentGuardianContact: parentGuardianContact,
    studentQR: studentQR,
  } = updatedStudent;

  // handle change function

  const handlephoneChange = (value) => {
    setContactNo(value);
    console.log(contactNoN);
  };

  const handleparentPhone = (value) => {
    setparentGuardianContact(value);
    console.log(parentGuardianContactN);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setUpdatedStudent({
      ...updatedStudent,
      [name]: value,
    });
  };

  //file upload checks size and type
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    console.log(file);
    if (!file) {
      return; //No file selected
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
    setLoading(true);
    try {
      updatedStudent.contactNo = contactNoN;
      updatedStudent.parentGuardianContact = parentGuardianContactN;

      console.log("Form Data:", updatedStudent);
      const res = await updateStudent(dispatch, updatedStudent);

      console.log("Update  response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        console.log("Update  successful");
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
    setLoading(true);
    try {
      console.log("Selected Image:", selectedImage);

      // Step 1: Check if there's an image to delete
      if (pfpPic) {
        // Splitter function for update
        const separatedParts = pfpPic.split(".");
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

      console.log("No/del image found continuing");

      // Step 2: Upload the image if selected
      if (selectedImage) {
        const uplpic = await uploadFile(selectedImage);
        updatedStudent.pfpPic = uplpic.pfpPic;
        console.log(updatedStudent.pfpPic);
      } else {
        // No image selected, set pfpPic to the same string
        updatedStudent.pfpPic = pfpPic;
      }

      // Step 3: set payload update profile pic based on id
      const payload = {
        idNumber: updatedStudent.idNumber,
        pfpPic: updatedStudent.pfpPic,
      };
      console.log(payload);

      const res = await updateStudent(dispatch, payload);
      if (res.status === 200) {
        console.log("Update successful");
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

  // QR Update
  const handleQRUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      idNumber: idNumber,
      qrReset: true,
    };

    const res = await updateStudent(dispatch, payload);

    if (res.status === 200) {
      console.log("Update successful");
      window.location.reload();
    } else {
      const errorMessage = "Update failed no profile";
      setError(errorMessage);
    }
    onClose();
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

      <form className="user-det-container" onSubmit={handleSubmit}>
        <div className="left-profile-container">
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

          <div className="qr-user-code-container">
            <Space direction="vertical" align="center">
              <div className="qr-user-container" id="myqrcode">
                <QRCode value={studentQR} size={150} />
              </div>
              {studentQR ? (
                <span className="qr-update-btn" onClick={handleQRUpdate}>
                  UPDATE QR
                </span>
              ) : (
                <div className="input-container">
                  <Input
                    placeholder="-"
                    maxLength={200}
                    value={studentQR}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: "studentQR", value: e.target.value },
                      })
                    }
                  />
                </div>
              )}
            </Space>
          </div>
        </div>

        <div className="user-info-right">
          {/* User Subheader - Basic Student Information*/}
          <div className="popup-subheader-container">
            <p className="u-basic-header">Basic Student Information</p>
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
              <div className="popup-info-form-field-sn">
                <div className="important-ff">
                  <label>Student No </label>
                  <p className="ast"> *</p>
                </div>
                <input
                  type="number"
                  id="idNumber"
                  name="idNumber"
                  value={idNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Academic Level</label>
                  <p className="ast"> *</p>
                </div>
                <select
                  className="gender-dd"
                  name="acadLevel"
                  id="acadLevel"
                  value={acadLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value=""></option>
                  <option value="Primary">Primary School</option>
                  <option value="Elementary">Elementary</option>
                  <option value="High School">High School</option>
                  <option value="Senior High School">Senior High School</option>
                  <option value="College">College</option>
                </select>
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Course</label>
                </div>
                <select
                  className="gender-dd"
                  name="course"
                  id="course"
                  value={course}
                  onChange={handleInputChange}
                >
                  <option value="" disabled hidden></option>
                  <option value="None"></option>
                  <option value="BA in Psychology">
                    Bachelor of Arts in Psychology
                  </option>
                  <option value="BS in Entrepreneurship">
                    Bachelor of Science in Entrepreneurship
                  </option>
                  <option value="BS in Management Accounting">
                    Bachelor of Science in Management Accounting
                  </option>
                  <option value="BS in Office Administration">
                    Bachelor of Science in Office Administration
                  </option>
                </select>
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <label>Year Level</label>
                  <p className="ast"> *</p>
                </div>
                <select
                  className="gender-dd"
                  name="yearLevel"
                  id="yearLevel"
                  value={yearLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled hidden></option>
                  <option value="Preschool">Preschool</option>
                  <option value="Kinder">Kinder</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
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
                  name="gender"
                  value={gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled hidden></option>
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

          {/* User Subheader - Temporary Address*/}
          <div className="popup-subheader-container">
            <p className="u-basic-header">Permanent Address</p>
          </div>

          {/* User Address Information Form Fields*/}
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
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="popup-info-ff-5">
              <div className="popup-info-form-field">
                <div className="important-ff">
                  <div className="important-ff">
                    <label>Province/Region</label>
                    <p className="ast"> *</p>
                  </div>
                </div>
                <input
                  type="text"
                  id="perProvince"
                  name="perProvince"
                  value={perProvince}
                  onChange={handleInputChange}
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <div className="important-ff">
                    <label>Municipality/City</label>
                    <p className="ast"> *</p>
                  </div>
                </div>
                <input
                  type="text"
                  id="perMuniCity"
                  name="perMuniCity"
                  value={perMuniCity}
                  onChange={handleInputChange}
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <div className="important-ff">
                    <label>Barangay</label>
                    <p className="ast"> *</p>
                  </div>
                </div>
                <input
                  type="text"
                  id="perBarangay"
                  name="perBarangay"
                  value={perBarangay}
                  onChange={handleInputChange}
                />
              </div>

              <div className="popup-info-form-field">
                <div className="important-ff">
                  <div className="important-ff">
                    <label>Postal Code</label>
                    <p className="ast"> *</p>
                  </div>
                </div>
                <input
                  type="text"
                  id="perZIP"
                  name="perZIP"
                  value={perZIP}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* User Subheader - Emergency Contact Information*/}
          <div className="popup-subheader-container">
            <p className="u-basic-header">Emergency Contact Information</p>
          </div>

          {/* Emergency Contact Information Form Fields*/}
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
                  onChange={handleInputChange}
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
                  onChange={handleparentPhone}
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

export default UpdateUserForm;
