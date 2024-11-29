import React, { useEffect, useState } from "react";
import { AdminSidebar, AdminTopbar } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import default_profile from "../../assets/default_profile.png";
import "./admin_css/admin_staff_form.css";
import "./adminpages.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

//fuction imports
import Axios from "axios";
import {
  validateUsers,
  registerStaff,
  useAppUniidContext,
  checkUserExists,
} from "../../context";
import { uploadFile } from "../../utils/";

const fileInputRef = React.createRef();

export default function AdminSReg() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [contactNo, setContactNo] = useState();
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
    userName: "",
    password: "",
    emailAddress: "",
    contactNo: "",
    pfpPic: "",
    uType: "",
  });

  //handle functions

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // remove image button
  const handleRemoveImage = () => {
    setSelectedImage(null);

    // Clear the file input field
    fileInputRef.current.value = "";
  };

  //file upload checks
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

  //submit functtions

  const pfpPic = "";
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Step 1: Check if the user already exists
      console.log("Selected Image:", selectedImage);
      const userExists = await checkUserExists(
        formData.userName,
        formData.idNumber
      );

      if (userExists) {
        alert(" User exist");
        setLoading(false);

        return;
      }
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

      console.log("Form Data:", formData);
      const res = await registerStaff(dispatch, formData);

      console.log("Register response:", res);
      // Handle the response if needed
      if (res.status === 200) {
        const successMessage = "Registration successful";
        console.log("Registration successful");
        setLoading(false);

        setError(successMessage);
        window.location.reload();
        // Clear the form fields and selected image
        setFormData({
          idNumber: "",
          userFName: "",
          userMName: "",
          userLName: "",
          userExt: "",
          birthDay: "",
          birthPlace: "",
          gender: "",
          userName: "",
          password: "",
          emailAddress: "",
          contactNo: "",
          pfpPic: "",
          uType: "",
        });
        setContactNo(null);
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
      <div className="admin-u-reg-contents">
        <AdminTopbar pageName="Staff Registration" />
        {/* loading overlay */}
        {loading && (
          <div className="loading-overlay">
            <span className="loading-container">
              <span className="loading-icon-animation"></span>
            </span>
            <span className="loading-text">Loading...</span>
          </div>
        )}
        {/* Staff Account Registration Form Main Container */}
        <div className="admin-sreg-container">
          <div className="sreg-container">
            <form onSubmit={handleSubmit}>
              {/* Staff Account Registration Header */}
              <div className="sreg-form-header">
                <span className="sreg-title-container">
                  <Link to="/admin_staff_records" className="back-btn-page">
                    <span className="sreg-header-icon">
                      <i class="bx bx-arrow-back"></i>
                    </span>
                    <span className="back-tooltip">Back</span>
                  </Link>
                  <span className="sreg-header-title">
                    <p>Staff Account Registration</p>
                  </span>
                </span>
              </div>

              <div className="staff-reg-input-container">
                {/* Staff Profile Upload*/}
                <div className="sreg-upload-profile-container">
                  <div className="staff-upload main container">
                    {selectedImage ? (
                      <div>
                        <img
                          alt="Staff Profile"
                          width={"200px"}
                          src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                        <button onClick={() => handleRemoveImage()}>
                          REMOVE
                        </button>
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

                  <div className="s-reg-form-field">
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

                <div className="s-basicinformation">
                  {/* Staff Subheader - Basic Student Information*/}
                  <div className="subheader-container">
                    <p className="s-basic-header">Basic Staff Information</p>
                  </div>

                  {/* Staff Basic Information Form Fields */}
                  <div className="basic-info-ff-container">
                    <div className="staff-reg-ff-1">
                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field-ext">
                        <label>Ext.</label>
                        <input
                          type="text"
                          name="userExt"
                          value={formData.userExt}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="staff-reg-ff-2">
                      <div className="s-reg-form-field">
                        <div className="important-ff">
                          <label>Employee No </label>
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

                      <div className="s-reg-form-field">
                        <div className="important-ff">
                          <label>Designation </label>
                          <p className="ast"> *</p>
                        </div>
                        <select
                          className="gender-dd"
                          name="uType"
                          onChange={handleChange}
                          value={formData.uType}
                          required
                        >
                          <option value=""></option>
                          <option value="staff">Staff</option>
                          <option value="registrar">Registar</option>
                        </select>
                      </div>
                    </div>

                    <div className="staff-reg-ff-3">
                      <div className="s-reg-form-field">
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
                          <option value=""></option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field">
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

                  {/* Staff Subheader - Staff Account Information*/}
                  <div className="subheader-container">
                    <p className="u-basic-header">Staff Account Information</p>
                  </div>

                  {/* Staff Account Information Form Fields*/}
                  <div className="staff-account-info-ff-container">
                    <div className="staff-reg-ff-4">
                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field">
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="staff-reg-ff-5">
                      <div className="s-reg-form-field">
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

                      <div className="s-reg-form-field">
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
                  <div className="bottom-container">
                    <div className="create-btn-container">
                      <button className="create-staff-btn" type="submit">
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
    </div>
  );
}
