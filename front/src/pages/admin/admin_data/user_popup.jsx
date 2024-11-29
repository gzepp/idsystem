import React, { useState } from "react";
import "./comp_css/popup.css";
import default_profile from "../assets/default_profile.png";
import default_qr from "../assets/Default-QR.png";

export default function PopupForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div>
      <div className="main-popup-form-container">
        
          <div className="popup-form-container">
            <form>
              {/* User Account Registration Header */}
              <div className="edit-popup-form-header">
                <span className="edit-popup-title-container">
                  <span className="epop-header-icon">
                    <i class='bx bx-x'></i>
                  </span>
                </span>
              </div>

              <div className="user-details-popup-container">
                {/* User Profile Upload */}
                <div className="left-profile-container">
                  <div className="view-user-upload-main-container">
                    {selectedImage ? (
                      <div>
                        <img
                          alt="User Profile"
                          width={"150px"}
                          src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                        <button onClick={() => setSelectedImage(null)}>
                          REMOVE
                        </button>
                      </div>
                    ) : (
                      <img
                        alt="Default Profile"
                        src={default_profile}
                        width={"150px"}
                        height={"150px"}
                      />
                    )}
                  </div>

                  <div className="edit-profile-ff">
                    <input
                      type="file"
                      name="myImage"
                      onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                      }}
                    />
                  </div>

                  <span className="profile-download-btn">DOWNLOAD PROFILE</span>

                  <div className="qr-code-main-container">
                    <div className="qr-code-container">
                      <img
                        alt="Default QR"
                        src={default_qr}
                        width={"150px"}
                        height={"150px"}
                      />
                      
                    </div>
                    <span className="qr-download-btn">
                        DOWNLOAD QR
                      </span>
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
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Middle Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Last Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field-ext">
                        <label>Ext.</label>
                        <input type="text" />
                      </div>
                    </div>

                    <div className="popup-info-ff-2">
                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Student No </label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Course/Grade Level</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" required />
                      </div>
                    </div>

                    <div className="popup-info-ff-3">
                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Gender</label>
                          <p className="ast"> *</p>
                        </div>
                        <select className="gender-dd" required>
                          <option defaultValue="" disabled  hidden></option>
                          <option defaultValue="Male">Male</option>
                          <option defaultValue="Female">Female</option>
                          <option defaultValue="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Date of Birth</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="date" required />
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Place of Birth</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" />
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
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field">
                        <label>Email Address</label>
                        <input type="email" required />
                      </div>
                    </div>

                    <div className="popup-info-ff-5">
                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Password</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" required />
                      </div>

                      <div className="popup-info-form-field">
                        <label>Contact No.</label>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  {/* User Subheader - Emergency Contact Information*/}
                  <div className="popup-subheader-container">
                    <p className="u-basic-header">
                      Emergency Contact Information
                    </p>
                  </div>

                  {/* Emergency Contact Information Form Fields*/}
                  <div className="popup-emergency-information-ff-container">
                    <div className="popup-info-ff-6">
                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Parent/Guardian Name</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" />
                      </div>

                      <div className="popup-info-form-field">
                        <div className="important-ff">
                          <label>Contact No.</label>
                          <p className="ast"> *</p>
                        </div>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="popup-bottom-container">
                    <div className="update-btn-container">
                      <button className="update-user-btn">UPDATE</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        
      </div>

{/* User Popup */}
      <div className="user-main-popup-form-container">
              <div className="popup-form-container">
                <form>
                  {/* User Account Registration Header */}
                  <div className="edit-popup-form-header">
                    <span className="edit-popup-title-container">
                      <span className="epop-header-icon">
                        <i class="bx bx-x"></i>
                      </span>
                    </span>
                  </div>

                  <div className="user-details-popup-container">
                    {/* User Profile Upload */}
                    <div className="left-profile-container">
                      <div className="view-user-upload-main-container">
                        {selectedImage ? (
                          <div>
                            <img
                              alt="User Profile"
                              width={"150px"}
                              src={URL.createObjectURL(selectedImage)}
                            />
                            <br />
                            <button onClick={() => setSelectedImage(null)}>
                              REMOVE
                            </button>
                          </div>
                        ) : (
                          <img
                            alt="Default Profile"
                            src={default_profile}
                            width={"150px"}
                            height={"150px"}
                          />
                        )}
                      </div>

                      <div className="edit-profile-ff">
                        <input
                          type="file"
                          name="myImage"
                          onChange={(event) => {
                            console.log(event.target.files[0]);
                            setSelectedImage(event.target.files[0]);
                          }}
                        />
                      </div>

                      <span className="profile-download-btn">
                        DOWNLOAD PROFILE
                      </span>

                      <div className="qr-code-main-container">
                        <div className="qr-code-container">
                          <img
                            alt="Default QR"
                            src={default_qr}
                            width={"150px"}
                            height={"150px"}
                          />
                        </div>
                        <span className="qr-download-btn">DOWNLOAD QR</span>
                      </div>
                    </div>

                    <div className="user-info-right">
                      {/* User Subheader - Basic Student Information*/}
                      <div className="popup-subheader-container">
                        <p className="u-basic-header">
                          Basic Student Information
                        </p>
                      </div>

                      {/* User Basic Information Form Fields */}
                      <div className="popup-basic-info-ff-container">
                        <div className="popup-info-ff-1">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>First Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Middle Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Last Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field-ext">
                            <label>Ext.</label>
                            <input type="text" />
                          </div>
                        </div>

                        <div className="popup-info-ff-2">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Student No </label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Course/Grade Level</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>
                        </div>

                        <div className="popup-info-ff-3">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Gender</label>
                              <p className="ast"> *</p>
                            </div>
                            <select className="gender-dd" required>
                              <option
                                defaultValue=""
                                disabled
                                
                                hidden
                              ></option>
                              <option defaultValue="Male">Male</option>
                              <option defaultValue="Female">Female</option>
                              <option defaultValue="Prefer not to say">
                                Prefer not to say
                              </option>
                            </select>
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Date of Birth</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="date" required />
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Place of Birth</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      {/* User Subheader - User Account Information*/}
                      <div className="popup-subheader-container">
                        <p className="u-basic-header">
                          User Account Information
                        </p>
                      </div>

                      {/* User Account Information Form Fields*/}
                      <div className="popup-user-account-info-ff-container">
                        <div className="popup-info-ff-4">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Username</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field">
                            <label>Email Address</label>
                            <input type="email" required />
                          </div>
                        </div>

                        <div className="popup-info-ff-5">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Password</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" required />
                          </div>

                          <div className="popup-info-form-field">
                            <label>Contact No.</label>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      {/* User Subheader - Emergency Contact Information*/}
                      <div className="popup-subheader-container">
                        <p className="u-basic-header">
                          Emergency Contact Information
                        </p>
                      </div>

                      {/* Emergency Contact Information Form Fields*/}
                      <div className="popup-emergency-information-ff-container">
                        <div className="popup-info-ff-6">
                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Parent/Guardian Name</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" />
                          </div>

                          <div className="popup-info-form-field">
                            <div className="important-ff">
                              <label>Contact No.</label>
                              <p className="ast"> *</p>
                            </div>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Bar */}
                      <div className="popup-bottom-container">
                        <div className="update-btn-container">
                          <button className="update-user-btn">UPDATE</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
      </div>
    </div>
  );
}
