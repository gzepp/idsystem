import React, { useEffect, useState } from "react";
import { UserTopbar, UserFooter } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { Input, QRCode, Space, Button } from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import "./css/user_homepage.css";
import "./css/user_profileupdate.css";

import {
  calculatePasswordStrength,
  handlePasswordChange,
  handleConfirmPasswordChange,
} from "./js/u_password_utils";

import {
  validateUsers,
  updateStudent,
  useAppUniidContext,
  reqQrreset,
} from "../../context";
import { uploadFile, decrypt, resetPassword } from "../../utils";
import Axios from "axios";

export default function UserProfileUpdate() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basicInfo"); //Tab Switching
  const [viewQRModal, viewsetQRModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); //Student Data Update Logic
  const [globalState, dispatch] = useAppUniidContext();

  const [isChecked, setIsChecked] = useState(false); // Checking checkbox
  const [showMessage, setShowMessage] = useState(false); // State to control the message popup for data privacy

  const [student_userData, setStudent] = useState({});
  const [updatedStudent, setUpdatedStudent] = useState({});
  const fileInputRef = React.createRef();

  console.log("up", updatedStudent);
  //mobile number
  const [contactNoN, setContactNo] = useState();
  const [parentGuardianContactN, setparentGuardianContact] = useState();
  //password reset
  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const isFormValid = password && confirmPassword && passwordsMatch;
  console.log(confirmPassword);

  //loading
  const [loading, setLoading] = useState(false);
  //format date
  const formattedBirthDay = student_userData.birthDay
    ? new Date(student_userData.birthDay).toISOString().split("T")[0]
    : "";

  const initialUpdatedStudent = {
    ...updatedStudent,
    birthDay: formattedBirthDay,
  };

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

    emailAddress: emailAddress,
    contactNo: contactNo,
    pfpPic: pfpPic,
    parentGuardianName: parentGuardianName,
    parentGuardianContact: parentGuardianContact,
    studentQR: studentQR,
  } = updatedStudent;

  //handle changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedStudent({
      ...updatedStudent,
      [name]: value,
    });
  };

  const handlephoneChange = (value) => {
    setContactNo(value);
    console.log(contactNoN);
  };

  const handleparentPhone = (value) => {
    setparentGuardianContact(value);
    console.log(parentGuardianContactN);
  };
  //qr popup

  const [viewQRModalErr, viewsetQRModalErr] = useState(false);

  const handleShow = () => viewsetQRModal(true);
  const handleClose = () => viewsetQRModal(false);

  const handleCloseErr = () => viewsetQRModalErr(false);

  //QR Download
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

  //file upload checks size and type
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    console.log(file);
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

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isChecked) {
      try {
        // Check if contactNoN and parentGuardianContactN are not falsy (i.e., they have a value)
        if (contactNoN) {
          updatedStudent.contactNo = contactNoN;
        }
        if (parentGuardianContactN) {
          updatedStudent.parentGuardianContact = parentGuardianContactN;
        }

        console.log("Form Data:", updatedStudent);
        const res = await updateStudent(dispatch, updatedStudent);

        console.log("Update  response:", res);
        // Handle the response if needed
        if (res.status === 200) {
          const newupdatedStudent = res;
          console.log("new/reassigned data", newupdatedStudent);

          const decryptAndSetField = (fieldName) => {
            if (
              newupdatedStudent[fieldName] &&
              newupdatedStudent[fieldName].data
            ) {
              newupdatedStudent[fieldName] = decrypt(
                newupdatedStudent[fieldName].data,
                newupdatedStudent[fieldName].iv
              );
            }
          };

          // Decrypt and update each field
          decryptAndSetField("birthDay");
          decryptAndSetField("birthPlace");
          decryptAndSetField("contactNo");
          decryptAndSetField("gender");
          decryptAndSetField("userFName");
          decryptAndSetField("userLName");
          decryptAndSetField("userMName");
          decryptAndSetField("userExt");
          decryptAndSetField("perAddress");
          decryptAndSetField("perBarangay");
          decryptAndSetField("perMuniCity");
          decryptAndSetField("perProvince");
          decryptAndSetField("perZIP");
          decryptAndSetField("parentGuardianName");
          decryptAndSetField("parentGuardianContact");

          // Set the updatedStudent state
          setUpdatedStudent(newupdatedStudent);

          // Store the updatedStudent in session storage
          window.sessionStorage.setItem(
            "profileInfo",
            JSON.stringify(updatedStudent)
          );
          console.log("new::", updatedStudent);
          setLoading(false);
          window.location.reload();
        } else {
          const errorMessage = "Update failed no user";
          setError(errorMessage);
          setLoading(false);
        }
      } catch (error) {
        const networkErrorMessage = error.message || "Update failed network";
        setError(networkErrorMessage);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setShowMessage(true);

      console.log("Please agree with the Data Privacy Policy.");
    }
  };

  const closeMessage = () => {
    setLoading(false);
    setShowMessage(false);
  };

  //change profile
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isChecked) {
      try {
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
          updatedStudent.pfpPic = uplpic.pfpPic;
          console.log(updatedStudent.pfpPic);
        } else {
          // No image selected, set pfpPic to the same string

          // updatedStudent = pfpPic;
          updatedStudent.pfpPic = pfpPic;
        }

        //Step 3: set payload update profile pic based on id
        const payload = {
          idNumber: updatedStudent.idNumber,
          pfpPic: updatedStudent.pfpPic,
        };
        console.log(payload);

        const res = await updateStudent(dispatch, payload);
        if (res.status === 200) {
          const newupdatedStudent = res;
          console.log("new/reassigned data", newupdatedStudent);

          const decryptAndSetField = (fieldName) => {
            if (
              newupdatedStudent[fieldName] &&
              newupdatedStudent[fieldName].data
            ) {
              newupdatedStudent[fieldName] = decrypt(
                newupdatedStudent[fieldName].data,
                newupdatedStudent[fieldName].iv
              );
            }
          };

          // Decrypt and update each field
          decryptAndSetField("birthDay");
          decryptAndSetField("birthPlace");
          decryptAndSetField("contactNo");
          decryptAndSetField("gender");
          decryptAndSetField("userFName");
          decryptAndSetField("userLName");
          decryptAndSetField("userMName");
          decryptAndSetField("userExt");
          decryptAndSetField("perAddress");
          decryptAndSetField("perBarangay");
          decryptAndSetField("perMuniCity");
          decryptAndSetField("perProvince");
          decryptAndSetField("perZIP");
          decryptAndSetField("parentGuardianName");
          decryptAndSetField("parentGuardianContact");

          // Set the updatedStudent state
          setUpdatedStudent(newupdatedStudent);

          // Store the updatedStudent in session storage
          window.sessionStorage.setItem(
            "profileInfo",
            JSON.stringify(updatedStudent)
          );
          console.log("new::", updatedStudent);
          setLoading(false);
          window.location.reload();
        } else {
          setLoading(false);
          const errorMessage = "Update failed no profile";
          setError(errorMessage);
        }
      } catch (error) {
        console.log("Update profile failed", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setShowMessage(true);
      console.log("Please agree with the Data Privacy Policy.");
    }
  };

  //password reset
  const passhandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isChecked) {
      const res = await resetPassword({
        emailAddress: emailAddress,
        password: confirmPassword,
      });

      if (res.status === 200) {
        setLoading(false);
        window.location.reload();
      }

      if (res.status === 400) {
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
        alert("Password is same as previous");
      }
    } else {
      setLoading(false);
      setShowMessage(true);
      console.log("Please agree with the Data Privacy Policy.");
    }
  };

  const shouldShowUpdateProfileButton = selectedImage !== null;

  //validate function user
  const validate = async () => {
    try {
      // Get the token JSON string from sessionStorage
      const tokenString = window.sessionStorage.getItem("profile");
      // console.log(tokenString);

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
      // console.log(userType);

      if (res?.status === 200) {
        if (userType !== "student") {
          navigate("/");
        } else {
          return;
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  //qr reset req
  const handleSubmitQrReq = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userToken = JSON.parse(sessionStorage.getItem("profile"));
    const userData = JSON.parse(sessionStorage.getItem("profileInfo"));

    try {
      const userFullname = `${userData.userFName} ${userData.userMName} ${userData.userLName}`;

      // Assuming reqQrUser is an object containing the data to be updated
      const reqQrresetData = {
        _id: userToken._id,
        idNumber: userToken.idNumber,
        reqFullname: userFullname,
        description: "pending",
      };

      const res = await reqQrreset(reqQrresetData);

      console.log("Req response:", res);

      if (res.status === 200) {
        console.log("Request Success");
        setLoading(false);
        handleClose();
        // window.location.reload();
      } else {
        setLoading(false);
        console.log("Req Failed:", res);
      }
    } catch (error) {
      setLoading(false);
      console.log("failed request has done");
      viewsetQRModalErr(true);
    }
  };

  const getProfile = async () => {
    // Check if user data is present in session storage
    const userData = JSON.parse(sessionStorage.getItem("profileInfo"));
    if (!userData) {
      navigate("/");
      return null;
    } else {
      return userData;
    }
  };

  useEffect(() => {
    validate();
    getProfile()
      .then((userData) => {
        setStudent(userData); // Store the original data
        setUpdatedStudent(userData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //Data Privacy Popup

  const [viewPriv, viewSetPriv] = useState(false);

  const termsShow = () => viewSetPriv(true);
  const termsClose = () => viewSetPriv(false);

  return (
    <div className="user-body-container">
      <div className="user-topbar">
        <UserTopbar userName={student_userData.userFName} />
        {/* Lower Topbar */}
        <div className="lower-topbar-wrapper">
          <div className="lower-topbar">
            <span className="lower-topbar-text">
              <Link to="/user_homepage" className="top-linking-page">
                <span className="active-linking">Home {""}</span>
              </Link>
              {"/"}
              <Link to="/user_records" className="top-linking-page">
                <span className="active-linking"> Records {""}</span>
              </Link>
              <span className="inactive-link">
                {"/"} {""}User Update Profile
              </span>
            </span>
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

      <div className="user-main-contents">
        <div className="user-body-limiter">
          <div className="student-side-profile-body">
            {/* User Side Profile */}
            <div className="user-side-profile-container">
              <div className="user-side-profile-contents">
                <div className="user-side-profile-cover-pfp">
                  <div className="user-side-profile-cover"></div>
                </div>

                <div className="user-side-picture-container">
                  <div
                    className="user-side-profile-picture"
                    style={{
                      backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${student_userData.pfpPic})`,
                    }}
                    id="profileImage"
                  ></div>
                </div>
                <div className="user-side-profile-details-container">
                  <span className="user-side-profile-det">
                    <span className="user-side-profile-name">
                      {student_userData.userFName} {student_userData.userLName}{" "}
                      {student_userData.userExt}
                      <i className="bx bxs-badge-check"></i>
                    </span>
                    <span className="user-side-profile-number">
                      Student No: {student_userData.idNumber}
                    </span>
                    <span className="user-side-profile-course">
                      {student_userData.acadLevel === "College"
                        ? student_userData.course
                        : `${student_userData.acadLevel} - ${student_userData.yearLevel}`}
                    </span>
                    <span className="user-profile-qr-btn" onClick={handleShow}>
                      REPORT ID LOST <i className="bx bxs-id-card"></i>
                    </span>
                    {/* Report ID Lost */}
                    {viewQRModal && (
                      <div className="homepage-popup-container">
                        <div className="user-profile-qr-container">
                          {/* Homepage Popup Container - Header */}
                          <div className="home-popup-form-header">
                            <span className="home-header-icon">
                              <i className="bx bxs-error-circle"></i>
                            </span>
                            <span className="home-header-txt">
                              Lost ID Report Confirmation
                            </span>
                          </div>

                          <div className="home-container-body">
                            <span className="home-container-b-text">
                              You're about to submit a report regarding your
                              lost ID, please be aware that upon receipt, we
                              will initiate the printing of a new ID.
                              Consequently, the current ID reported as lost will
                              be deactivated. It is important to note that the
                              Lost ID reporting can only be performed once, and
                              subsequent requests will be available again only
                              after validation.
                            </span>
                          </div>

                          <div className="home-popup-footer">
                            <div className="home-popup-btns">
                              <span
                                className="home-cancel"
                                onClick={handleClose}
                              >
                                <span className="home-cancel-txt">Cancel</span>
                              </span>
                              <span className="home-submit">
                                <span
                                  className="home-submit-txt"
                                  onClick={handleSubmitQrReq}
                                >
                                  Confirm
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </div>
              {viewQRModalErr && (
                <div className="homepage-popup-container">
                  <div className="user-profile-qr-container">
                    {/* Homepage Popup Container - Header */}
                    <div className="home-popup-form-header">
                      <span className="home-header-icon">
                        <i className="bx bxs-error-circle"></i>
                      </span>
                      <span className="home-header-txt">
                        Lost ID Report Confirmation
                      </span>
                    </div>

                    <div className="home-container-body">
                      <span className="home-container-b-text">
                        You've already requested to reset your QR Code. Please
                        contact the registrar regarding the confirmation of your
                        request.
                      </span>
                    </div>

                    <div className="home-popup-footer">
                      <div className="home-popup-btns">
                        <span className="home-cancel"></span>
                        <span className="home-submit" onClick={handleCloseErr}>
                          <span className="home-cancel-txt"> Confirm</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="student-cont-bottom"></div>
            </div>
          </div>

          <div className="user-attendance-records">
            {/* Update Account Table */}
            <div className="user-update-rec-mainbody">
              <div className="user-update-rec-table-container">
                <div className="profile-update-header">
                  <div className="left-header-update">
                    <span className="user-attendance-rec-title">
                      <span className="attendance-rec-icon">
                        <i className="bx bx-file"></i>
                      </span>
                      <span className="attendance-rec-text">
                        Student Profile Update
                      </span>
                    </span>
                  </div>
                  <div className="user-form-switching">
                    <span
                      className={`basic-information-tab ${
                        activeTab === "basicInfo" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("basicInfo")}
                    >
                      Basic Information
                    </span>
                    <span
                      className={`account-details-tab ${
                        activeTab === "accountDetails" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("accountDetails")}
                    >
                      User Account Info
                    </span>
                    <span
                      className={`change-password-tab ${
                        activeTab === "changePass" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("changePass")}
                    >
                      Change Password
                    </span>
                  </div>
                </div>

                {/* Student Details Update */}
                <div
                  className="basic-information-tab-form"
                  style={{
                    display: activeTab === "basicInfo" ? "block" : "none",
                    transform: `translateX(${
                      activeTab === "basicInfo" ? 0 : -100
                    }%)`,
                    transition: "transform 0.3s ease-in-out", // Add a transition effect
                  }}
                >
                  <form className="update-profile-form" onSubmit={handleSubmit}>
                    <div className="main-user-det-container">
                      <span className="user-profile-update-subheader">
                        Basic Student Information
                      </span>
                      <div className="update-basic-info-ff-container">
                        <div className="update-info-ff-1">
                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>First Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="userFName"
                              name="userFName"
                              value={updatedStudent.userFName}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Middle Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="userMName"
                              name="userMName"
                              value={updatedStudent.userMName}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Last Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="userLName"
                              name="userLName"
                              value={updatedStudent.userLName}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field-ext">
                            <label>Ext.</label>
                            <input
                              type="text"
                              id="userExt"
                              name="userExt"
                              value={updatedStudent.userExt}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="update-info-ff-2">
                          <div className="update-info-form-field-sn">
                            <div className="important-ff">
                              <label>Student No </label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="idNumber"
                              name="idNumber"
                              value={updatedStudent.idNumber}
                              disabled
                            />
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Academic Level</label>
                              <p className="ast"> *</p>
                            </div>
                            <select
                              className="gender-dd"
                              name="acadLevel"
                              id="acadLevel"
                              value={updatedStudent.acadLevel}
                              onChange={handleInputChange}
                              required
                            >
                              <option value=""></option>
                              <option value="Primary">Primary School</option>
                              <option value="Elementary">Elementary</option>
                              <option value="High School">High School</option>
                              <option value="Senior High School">
                                Senior High School
                              </option>
                              <option value="College">College</option>
                            </select>
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff-none">
                              <label>Course</label>
                            </div>
                            <select
                              className="gender-dd"
                              name="course"
                              id="course"
                              value={updatedStudent.course}
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

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Year Level</label>
                              <p className="ast"> *</p>
                            </div>
                            <select
                              className="gender-dd"
                              name="yearLevel"
                              id="yearLevel"
                              value={updatedStudent.yearLevel}
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

                        <div className="update-info-ff-3">
                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Gender</label>
                              <p className="ast"> *</p>
                            </div>
                            <select
                              className="gender-dd"
                              name="gender"
                              value={updatedStudent.gender}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="" disabled hidden></option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Prefer not to say">
                                Prefer not to say
                              </option>
                            </select>
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Date of Birth</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="date"
                              id="birthDay"
                              name="birthDay"
                              value={updatedStudent.birthDay}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Place of Birth</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="birthPlace"
                              name="birthPlace"
                              value={updatedStudent.birthPlace}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="main-address-det-container">
                      <span className="user-profile-update-subheader">
                        User Permanent Address
                      </span>
                      <div className="update-address-info-ff-container">
                        <div className="update-info-ff-4">
                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>
                                Address (House
                                #/Block/Street/Subsdivision/Building)
                              </label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="perAddress"
                              name="perAddress"
                              value={updatedStudent.perAddress}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="update-info-ff-5">
                          <div className="update-info-form-field">
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
                              value={updatedStudent.perProvince}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
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
                              value={updatedStudent.perMuniCity}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
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
                              value={updatedStudent.perBarangay}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
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
                              maxLength="4"
                              value={updatedStudent.perZIP}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="main-emergency-det-container">
                      <span className="user-profile-update-subheader">
                        Emergency Contact Information
                      </span>
                      <div className="update-emergency-information-ff-container">
                        <div className="update-info-ff-6">
                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Parent/Guardian Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input
                              type="text"
                              id="parentGuardianName"
                              name="parentGuardianName"
                              value={updatedStudent.parentGuardianName}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff">
                              <label>Contact No.</label>
                              <p className="ast"> *</p>
                            </div>
                            <PhoneInput
                              defaultCountry="PH"
                              name="parentGuardianContact"
                              placeholder="Enter phone number"
                              maxLength="14"
                              value={parentGuardianContact}
                              onChange={handleparentPhone}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="submit-form-footer">
                      {/* Check Before Submit */}
                      <span className="data-privacy">
                        <label className="data-priv">
                          <input
                            type="checkbox"
                            className="cb"
                            onChange={handleCheckboxChange}
                            checked={isChecked}
                          />
                          <span className="cm"></span>
                          <span className="data-priv-text" onClick={termsShow}>
                            I agree with the Data Privacy Policy
                          </span>
                        </label>
                      </span>
                      <button className="update-user-form-btn" type="submit">
                        UPDATE
                      </button>
                    </div>
                  </form>
                </div>

                <div
                  className="account-details-tab-form"
                  style={{
                    display: activeTab === "accountDetails" ? "block" : "none",
                    transform: `translateX(${
                      activeTab === "accountDetails" ? 0 : 100
                    }%)`,
                    transition: "transform 0.3s ease-in-out", // Add a transition effect
                  }}
                >
                  <span className="user-profile-update-subheader">
                    Account Details Information
                  </span>
                  {/* User Account Information Form Fields*/}
                  <div className="update-avatar-container">
                    {/* Update Avatar  */}
                    <form
                      className="update-account-form"
                      onSubmit={handleSubmit}
                    >
                      <div className="profile-update-container">
                        <div className="main-account-det-container">
                          <label
                            className="profile-container"
                            htmlFor="profileImageInput"
                          >
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
                                    `https://res.cloudinary.com/debe9q66f/image/upload/${updatedStudent.pfpPic}`
                                    //|| default_profile
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
                              <span
                                className="profile-update-btn"
                                onClick={handleImageUpdate}
                              >
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
                        <span className="update-pfp-det"></span>
                      </div>
                      <div className="main-account-det-container">
                        <div className="update-account-info-ff-container">
                          {/* Account Details */}
                          <div className="update-info-ff-7">
                            <div className="update-info-form-field">
                              <div className="important-ff">
                                <label>Username</label>
                                <p className="ast"> *</p>
                              </div>
                              <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={updatedStudent.userName}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="update-info-form-field">
                              <label>Email Address</label>
                              <input
                                type="text"
                                id="emailAddress"
                                name="emailAddress"
                                value={updatedStudent.emailAddress}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="update-info-form-field">
                              <label>Contact No.</label>
                              <PhoneInput
                                defaultCountry="PH"
                                name="contactNo"
                                placeholder="Enter phone number"
                                maxLength="14"
                                value={contactNo}
                                onChange={handlephoneChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="account-submit-form-footer">
                          <button
                            className="account-update-user-form-btn"
                            type="submit"
                          >
                            UPDATE
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Password Update */}
                <div
                  className="account-password-tab-form"
                  style={{
                    display: activeTab === "changePass" ? "block" : "none",
                    transform: `translateX(${
                      activeTab === "changePass" ? 0 : 100
                    }%)`,
                    transition: "transform 0.3s ease-in-out", // Add a transition effect
                  }}
                >
                  <form
                    className="update-pass-form"
                    onSubmit={passhandleSubmit}
                  >
                    <span className="user-profile-update-subheader">
                      Update User Password
                    </span>
                    <div className="main-account-det-container">
                      <div className="update-account-info-ff-container">
                        <div className="update-info-ff-7">
                          <div className="update-info-form-field">
                            <div className="important-ff-none"></div>
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff-none">
                              <label>New Password</label>
                            </div>
                            <input
                              className="password-field"
                              type="password"
                              required
                              value={password}
                              onChange={(event) =>
                                handlePasswordChange(
                                  password,
                                  confirmPassword,
                                  setPassword,
                                  setPasswordsMatch,
                                  event
                                )
                              }
                            />
                          </div>
                          <div className="indicator">
                            <span className="weak"></span>
                            <span className="medium"></span>
                            <span className="strong"></span>
                          </div>

                          <div className="update-info-form-field">
                            <div className="important-ff-none">
                              <label>Confirm Password</label>
                            </div>
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(event) =>
                                handleConfirmPasswordChange(
                                  password,
                                  confirmPassword,
                                  setConfirmPassword,
                                  setPasswordsMatch,
                                  event
                                )
                              }
                            />
                          </div>
                          {!passwordsMatch && confirmPassword && (
                            <div className="password-mismatch-cont">
                              The two passwords that you entered does not match.
                            </div>
                          )}
                          <div className="password-submit-form-footer">
                            <button
                              className="update-user-form-btn"
                              type="submit"
                              disabled={!isFormValid}
                            >
                              UPDATE
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {viewPriv && (
                <div className="qr-popup-overlay">
                  <div className="user-main-popup-form-container">
                    <div className="popup-form-container">
                      <div className="view-popup-form-header">
                        <span className="edit-popup-title-container">
                          <span
                            className="epop-header-icon"
                            onClick={termsClose}
                          >
                            <i className="bx bx-x"></i>
                          </span>
                        </span>
                      </div>
                      <div className="user-details-popup-container">
                        <div className="cond-details">
                          <span className="cond-main-header">
                            Data Privacy Policy
                          </span>
                          <div className="cond-section">
                            <span className="cond-det">
                              The UniID is committed to upholding the Philippine
                              Data Privacy Act of 2021 (DPA) in the course of
                              processing such information. Republic Act No.
                              10173 this notice explains, in general terms, the
                              purpose and legal basis for the processing of such
                              personal information collected by UniID from
                              users, the measures in place to protect your data
                              privacy, and the rights that you may exercise in
                              relation to such information.
                            </span>
                            <span className="cond-det">
                              The term UniID/us/our refers to the Sacred Heart
                              Academy.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">
                              Personal Information Collected From Users
                            </span>
                            <span className="cond-det">
                              UniID collects personal information you
                              voluntarily provide to us your name, contact
                              details, and information about your education,
                              including your course, section, etc. are used to
                              verify your identity and prevent identity fraud,
                              create or update your user record, and provide you
                              with an User ID.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">
                              Intellectual Property
                            </span>
                            <span className="cond-det">
                              You agree that all materials, and services
                              provided in this website are the property of
                              UniID, Its affiliates, admins, and staffs
                              including all copyright, patent, and other
                              intellectual property. You also agree that you
                              will not reproduce or redistribute the UniID’s
                              intellectual property in any way.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">
                              Non-Disclosure of Your Personal Information
                            </span>
                            <span className="cond-det">
                              As a general rule, UniID will only disclose your
                              personal and sensitive personal information to
                              third parties with your consent.
                            </span>
                            <span className="cond-det">
                              Under the DPA, personal information may be
                              processed, e.g. collected, stored and disclosed,
                              when it is necessary in order for UniID to comply
                              with a legal obligation; to protect your vitally
                              important interests, including life and health;
                              respond to a national emergency, public order, and
                              safety; fulfill the functions of public authority
                              the pursuant to the legitimate interests of the
                              Sacred Heart Academy or a third party, except
                              where such interests are overridden by your
                              fundamental rights.
                            </span>
                            <span className="cond-det">
                              Sensitive personal information (e.g. confidential
                              educational records, age/birthdate, civil status,
                              health ), on the other hand may be processed, e.g.
                              collected, stored, and disclosed, when such is
                              allowed by laws and regulations, such regulatory
                              enactments provide for the protection of such
                              information and the consent of the data subject is
                              not required under such law or regulation.
                              Sensitive personal information may also be
                              processed when needed to protect the life and
                              health of the data subject or another person and
                              the data subject is unable to legally or
                              physically express consent, in the case of medical
                              treatment, or needed for the protection of lawful
                              rights and interests of natural or legal persons
                              in court proceedings, and for the establishment,
                              exercise or defense of legal claims or where
                              provided to government or public authority.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">
                              How We Protect Your Personal Information
                            </span>
                            <span className="cond-det">
                              Even before the effectivity of the DPA, UniID put
                              in place physical, organizational and technical
                              measures to protect your right to privacy and is
                              committed to reviewing and improving the same, so
                              as to be able to comply, among others, with its
                              obligations under the applicable provisions of the
                              Education Act of 1982 which require us to keep
                              your educational records confidential.
                            </span>
                            <span className="cond-det">
                              From time to time, UniID posts information on
                              relevant sites and sends emails that explain how
                              you can secure and maintain the confidentiality of
                              your personal information.
                            </span>
                            <span className="cond-det">
                              Rest assured that UniID/Sacred Heart Academy
                              personnel are allowed to process your personal
                              information only when such processing is part of
                              their official duties.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">
                              Access To and Correction Of Your Personal
                              Information
                            </span>
                            <span className="cond-det">
                              You have the right to access personal information
                              being processed by UniID about you.
                            </span>
                            <span className="cond-det">
                              In order for UniID to see to it that your personal
                              information is disclosed only to you, these
                              offices will require the presentation of your
                              Student ID or other documents that will enable
                              UniID to verify and confirm your identity. In case
                              you process or request documents through a
                              representative, in order to protect your privacy,
                              UniID requires you to provide a letter of
                              authorization specifying the purpose for the
                              request of documents or the processing of
                              information and your Student ID or other valid
                              government-issued ID (GIID) as well as the valid
                              GIID of your representative.
                            </span>
                            <span className="cond-det">
                              As mentioned above, UniID requires you to provide
                              correct information. In the event that your
                              information needs to be updated, the relevant
                              University websites and offices provide
                              information regarding how you can request the
                              correction of your personal information.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">Indemnification</span>
                            <span className="cond-det">
                              You agree to indemnify UniID and its affiliates
                              and hold UniID harmless against legal claims and
                              demands that may arise from your use or misuse of
                              our services. We reserve the right to select our
                              own legal counsel.
                            </span>
                          </div>
                          <div className="cond-section">
                            <span className="cond-header">Policy Updates</span>
                            <span className="cond-det">
                              We encourage you to visit this site occasionally
                              to see any updates regarding this Privacy Notice.
                              We will alert you regarding changes to this Policy
                              through this site and/or through written notices,
                              e.g. email.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System message popup */}
              {showMessage && (
                <div className="qr-popup-overlay">
                  <div className="system-message-popup">
                    <div className="system-message-header">
                      <span
                        className="system-message-close"
                        onClick={closeMessage}
                      >
                        <i className="bx bx-x"></i>
                      </span>
                    </div>

                    <div className="system-message-content">
                      <span className="system-message-icon">
                        <i className="bx bx-error-circle"></i>
                      </span>
                      <span className="system-txt">
                        You must agree with the Data Privacy Policy first,
                        before proceeding.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="user-footer">
        <UserFooter />
      </div>
    </div>
  );
}
