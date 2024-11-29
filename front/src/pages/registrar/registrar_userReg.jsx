import React, { useEffect, useState } from "react";
import { RegTopbar, RegFooter } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";
import default_profile from "../../assets/default_profile.png";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import "./css/reg_homepage.css";
import "./css/reg_userReg.css";

import Axios from "axios";
import {
  validateUsers,
  registerStudent,
  useAppUniidContext,
  checkUserExists,
} from "../../context";
import { uploadFile } from "../../utils/";

const fileInputRef = React.createRef();

export default function RegHomepage() {
  const navigate = useNavigate();

  const [globalState, dispatch] = useAppUniidContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("");
  const [error, setError] = useState(null);
  const [staff_userData, setStaff_userData] = useState({});
  const [contactNo, setContactNo] = useState();
  const [parentGuardianContact, setparentGuardianContact] = useState();
  //loading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    idNumber: "",
    userFName: "",
    userMName: "",
    userLName: "",
    userExt: "",
    birthDay: "",
    birthPlace: "",
    gender: "",
    acadLevel: "",
    course: "",
    yearLevel: "",
    perAddress: "",
    perProvince: "",
    perMuniCity: "",
    perBarangay: "",
    perZIP: "",
    userName: "",
    password: "",
    emailAddress: "",
    contactNo: "",
    parentGuardianName: "",
    parentGuardianContact: "",
    pfpPic: "",
  });

  // handle change function

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAcademicLevelChange = (event) => {
    const level = event.target.value;
    setFormData({
      ...formData,
      acadLevel: level,
    });
    setSelectedAcademicLevel(level);
  };

  // remove image button
  const handleRemoveImage = () => {
    setSelectedImage(null);

    // Clear the file input field
    fileInputRef.current.value = "";
  };

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

  const handlephoneChange = (value) => {
    setContactNo(value);
    console.log(contactNo);
  };

  const handleparentPhone = (value) => {
    setparentGuardianContact(value);
    console.log(parentGuardianContact);
  };

  // submit function

  const pfpPic = "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Check if the user already exists
      const userExists = await checkUserExists(
        formData.userName,
        formData.idNumber
      );

      if (userExists) {
        alert(" User exist");
        setLoading(false);
        return;
      }

      console.log("Selected Image:", selectedImage);

      // Step 2: Check if there's an image to delete
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

      console.log("No image found continuing");

      // Step 3: Upload the image if selected
      if (selectedImage) {
        const uplpic = await uploadFile(selectedImage);
        formData.pfpPic = uplpic.pfpPic;
        console.log(formData.pfpPic);
      } else {
        // No image selected, set pfpPic to an empty string
        formData.pfpPic = "";
      }

      formData.contactNo = contactNo;
      formData.parentGuardianContact = parentGuardianContact;

      console.log("Form Data:", formData);
      const res = await registerStudent(dispatch, formData);

      console.log("Register response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        const successMessage = "Registration successful";
        console.log("Registration successful");
        setError(successMessage);
        window.location.reload();
        // Clear the form fields and selected image
        setLoading(false);
        setFormData({
          idNumber: "",
          userFName: "",
          userMName: "",
          userLName: "",
          userExt: "",
          birthDay: "",
          birthPlace: "",
          gender: "",
          acadLevel: "",
          course: "",
          yearLevel: "",
          perAddress: "",
          perProvince: "",
          perMuniCity: "",
          perBarangay: "",
          perZIP: "",
          userName: "",
          password: "",
          emailAddress: "",
          contactNo: "",
          parentGuardianName: "",
          parentGuardianContact: "",
          pfpPic: "",
        });
        setContactNo(null);
        setparentGuardianContact(null);
        setSelectedImage(null);
        document.getElementById("fileInput").value = null;
      } else {
        const errorMessage = "Registration failed user existed";
        alert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      const networkErrorMessage = error.message || "Registration failed";
      alert(networkErrorMessage);
      setLoading(false);
    }
  };

  //validate function
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
        if (userType !== "registrar") {
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
        setStaff_userData(userData); // Store the original data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="staff-body-container">
      <div className="staff-topbar">
        <RegTopbar userName={staff_userData.userFName} />
        <div className="staff-lower-topbar">
          <span className="lower-topbar-txt">
            <Link to="/reg_homepage" className="top-linking-page">
              <span className="active-linking">Homepage </span>
            </Link>{" "}
            {"/"}{" "}
            <Link to="/reg_records" className="top-linking-page">
              <span className="active-linking">User Records </span>
            </Link>
            {"/"} <span className="inactive-linking">User Registration</span>
          </span>
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

      <div className="staff-main-contents">
        <div className="staff-body-limiter">
          <div className="staff-ureg-container">
            <form onSubmit={handleSubmit}>
              <div className="ureg-form-header">
                <span className="ureg-title-container">
                  <Link to="/reg_records" className="back-btn-page">
                    <span className="ureg-header-icon">
                      <i class="bx bx-arrow-back"></i>
                    </span>
                    <span className="back-tooltip">Back</span>
                  </Link>
                  <span className="ureg-header-title">
                    <p>User Account Registration</p>
                  </span>
                </span>
              </div>

              <div className="user-reg-input-container">
                <div className="ureg-upload-profile-container">
                  <div className="user-upload main container">
                    {selectedImage ? (
                      <div>
                        <img
                          alt="User Profile"
                          width={"200px"}
                          src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                        <button onClick={handleRemoveImage}>REMOVE</button>
                      </div>
                    ) : (
                      <img
                        alt="Default Profile"
                        src={default_profile}
                        width={"200px"}
                        height={"200px"}
                      />
                    )}
                  </div>

                  <div className="u-reg-form-field">
                    <input
                      type="file"
                      name="file"
                      id="fileInput"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(event) => {
                        handleFileUpload(event);
                        console.log(event.target.files[0]);
                      }}
                    />
                  </div>
                </div>

                <div className="u-basicinformation">
                  <div className="subheader-container">
                    <p className="u-basic-header">Basic Student Information</p>
                  </div>

                  <div className="basic-info-ff-container">
                    <div className="user-reg-ff-1">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>First Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="userFName"
                          value={formData.userFName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Middle Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="userMName"
                          value={formData.userMName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Last Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="userLName"
                          value={formData.userLName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field-ext">
                        <label>Ext.</label>
                        <input
                          type="text"
                          name="userExt"
                          value={formData.userExt}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="user-reg-ff-2">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Student No</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="number"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Academic Level</label>
                          <p className="ast"> *</p>
                        </div>
                        <select
                          className="gender-dd"
                          required
                          onChange={handleAcademicLevelChange}
                          value={selectedAcademicLevel}
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

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Course</label>
                        </div>

                        <select
                          className="gender-dd"
                          name="course"
                          onChange={handleChange}
                          value={formData.course}
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

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Year Level</label>
                          <p className="ast"> *</p>
                        </div>
                        <select
                          className="gender-dd"
                          name="yearLevel"
                          onChange={handleChange}
                          value={formData.yearLevel}
                          required
                        >
                          <option value="" disabled hidden></option>
                          <option value="None"></option>
                          {selectedAcademicLevel === "Primary" && (
                            <>
                              <option value="Kinder">Kinder</option>
                              <option value="Preschool">Preschool</option>
                            </>
                          )}
                          {selectedAcademicLevel === "Elementary" && (
                            <>
                              <option value="Grade 1">Grade 1</option>
                              <option value="Grade 2">Grade 2</option>
                              <option value="Grade 3">Grade 3</option>
                              <option value="Grade 4">Grade 4</option>
                              <option value="Grade 5">Grade 5</option>
                              <option value="Grade 6">Grade 6</option>
                            </>
                          )}
                          {selectedAcademicLevel === "High School" && (
                            <>
                              <option value="Grade 7">Grade 7</option>
                              <option value="Grade 8">Grade 8</option>
                              <option value="Grade 9">Grade 9</option>
                              <option value="Grade 10">Grade 10</option>
                            </>
                          )}
                          {selectedAcademicLevel === "Senior High School" && (
                            <>
                              <option value="Grade 11">Grade 11</option>
                              <option value="Grade 12">Grade 12</option>
                            </>
                          )}
                          {selectedAcademicLevel === "College" && (
                            <>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="user-reg-ff-3">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Gender</label>
                          <p className="ast"> *</p>
                        </div>
                        <select
                          className="gender-dd"
                          name="gender"
                          onChange={handleChange}
                          value={formData.gender}
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

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Date of Birth</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="date"
                          name="birthDay"
                          value={formData.birthDay}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Place of Birth</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="birthPlace"
                          value={formData.birthPlace}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="subheader-container">
                    <p className="u-basic-header">Residential Address</p>
                  </div>

                  <div className="basic-info-ff-container">
                    <div className="user-reg-ff-4">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>
                            Address (House #/Block/Street/Subdivision/Building)
                          </label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="perAddress"
                          value={formData.perAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="user-reg-ff-5">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <div className="important-ff">
                            <label>Province/Region</label>
                            <p className="ast"> *</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="perProvince"
                          value={formData.perProvince}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <div className="important-ff">
                            <label>Municipality/City</label>
                            <p className="ast"> *</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="perMuniCity"
                          value={formData.perMuniCity}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <div className="important-ff">
                            <label>Barangay</label>
                            <p className="ast"> *</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="perBarangay"
                          value={formData.perBarangay}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <div className="important-ff">
                            <label>Postal Code</label>
                            <p className="ast"> *</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="2009"
                          maxLength="4"
                          name="perZIP"
                          value={formData.perZIP}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="subheader-container">
                    <p className="u-basic-header">User Account Information</p>
                  </div>

                  <div className="user-account-info-ff-container">
                    <div className="user-reg-ff-4">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Username</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Email Address</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="email"
                          name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="user-reg-ff-5">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Password</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
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

                  <div className="subheader-container">
                    <p className="u-basic-header">
                      Emergency Contact Information
                    </p>
                  </div>

                  <div className="emergency-information-ff-container">
                    <div className="user-reg-ff-6">
                      <div className="u-reg-form-field">
                        <div className="important-ff">
                          <label>Parent/Guardian Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input
                          type="text"
                          name="parentGuardianName"
                          value={formData.parentGuardianName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="u-reg-form-field">
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
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bottom-container">
                    <div className="create-btn-container">
                      <button className="create-user-btn" type="submit">
                        CREATE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="staff-footer">
        <RegFooter />
      </div>
    </div>
  );
}
