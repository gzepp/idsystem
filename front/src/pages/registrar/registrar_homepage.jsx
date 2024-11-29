import React, { useEffect, useState } from "react";
import { RegTopbar, RegFooter } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";

import "./css/reg_homepage.css";

import { validateUsers, useAppUniidContext } from "../../context";

export default function RegHomepage() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [staff_userData, setStaff_userData] = useState({});
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

  const [viewObj, viewSetObj] = useState(false);
  const [viewTerms, viewSetTerms] = useState(false);

  const handleShow = () => viewSetObj(true);
  const handleClose = () => viewSetObj(false);

  const termsShow = () => viewSetTerms(true);
  const termsClose = () => viewSetTerms(false);

  return (
    <div className="staff-body-container">
      <div className="staff-topbar">
        <RegTopbar userName={staff_userData.userFName} />
      </div>

      <div className="staff-main-contents">
        <div className="staff-body-limiter">
          <div className="staff-reg-contents">
            {/* User Profile */}
            <div className="user-profile-contents">
              <div className="user-cover-pfp">
                <div className="user-cover"></div>
              </div>
              <div className="profile-main-det-container">
                <div className="user-picture-container">
                  <div
                    className="user-picture"
                    style={{
                      backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${staff_userData.pfpPic})`,
                    }}
                  ></div>
                </div>
                <div className="user-details-container">
                  <span className="user-det">
                    <span className="user-name">
                      {" "}
                      {staff_userData.userFName} {staff_userData.userMName}{" "}
                      {staff_userData.userLName} {staff_userData.userExt}{" "}
                      <i className="bx bxs-badge-check"></i>
                    </span>
                    <span className="user-number">
                      Staff No: {staff_userData.idNumber}
                    </span>
                    <span className="user-course"></span>
                  </span>
                  <div className="separator-line"></div>
                  <div className="profile-buttons">
                    <Link to="/reg_userreg" className="pp-linking-page">
                      <span className="profile-qr-btn">
                        REGISTER USER <i className="bx bx-user-plus"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-terms-and-conditions">
              <div className="reg-instruction-container">
                {/* Goals */}
                <div className="reg-instruction-det">
                  <span className="reg-inst-header">
                    <div className="qr-cont">
                      <i className="bx bx-target-lock"></i>
                    </div>
                    <span className="reg-header-txt">Objectives</span>
                    <span className="reg-details">
                      {/* <span className="reg-bold">Condition of Use </span> */}

                      <span className="reg-obj">
                        <span className="reg-bullets">
                          &#8226; To discover and enhance students’
                          intelligence, problem solving and communication skills
                        </span>
                        <span className="reg-bullets">
                          &#8226; To maintain collaborative partnerships with
                          stakeholders towards holistic student development
                        </span>
                        <span className="reg-bullets">
                          &#8226; To continuously support its human resources
                          towards personal and professional development
                        </span>

                        <span className="reg-bullets">
                          &#8226; To develop the students’ respect and
                          appreciation of Philippine culture
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="read-more-btn" onClick={handleShow}>
                    Read More
                  </span>

                  {/* Objectives Popup Container */}
                  {viewObj && (
                    <div className="qr-popup-overlay">
                      <div className="user-main-popup-form-container">
                        <div className="popup-form-container">
                          <div className="view-popup-form-header">
                            <span className="edit-popup-title-container">
                              <span
                                className="epop-header-icon"
                                onClick={handleClose}
                              >
                                <i className="bx bx-x"></i>
                              </span>
                            </span>
                          </div>
                          <div className="user-details-popup-container">
                            <div className="obj-details">
                              <span className="cond-main-header">
                                Objectives
                              </span>
                              <div className="cond-section">
                                <span className="cond-det">
                                  <span className="reg-obj">
                                    <span className="reg-bullets">
                                      &#8226; To discover and enhance students’
                                      intelligence, problem solving and
                                      communication skills
                                    </span>
                                    <span className="reg-bullets">
                                      &#8226; To maintain collaborative
                                      partnerships with stakeholders towards
                                      holistic student development
                                    </span>
                                    <span className="reg-bullets">
                                      &#8226; To continuously support its human
                                      resources towards personal and
                                      professional development
                                    </span>

                                    <span className="reg-bullets">
                                      &#8226; To develop the students’ respect
                                      and appreciation of Philippine culture
                                    </span>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Core Values */}
                <div className="reg-instruction-det">
                  <span className="reg-inst-header">
                    <div className="qr-cont">
                      <i className="bx bx-book-open"></i>
                    </div>
                    <span className="reg-header-txt">Core Values</span>
                    <span className="reg-core">
                      {/* <span className="reg-bold">Condition of Use </span> */}

                      <span className="reg-core">
                        <span className="reg-core-det">
                          {" "}
                          <b>S</b> ERVICE – for the common good
                        </span>
                        <span className="reg-core-det">
                          <b>H</b> ONESTY – at all times
                        </span>
                        <span className="reg-core-det">
                          <b>I</b> NTEGRITY – in all of our actions
                        </span>
                        <span className="reg-core-det">
                          <b>N</b> ATIONALISM – for the love of country{" "}
                        </span>
                        <span className="reg-core-det">
                          <b>E</b> XCELLENCE – in everything that we do
                        </span>
                      </span>
                    </span>
                  </span>
                </div>

                {/* Terms and Conditions */}
                <div className="reg-instruction-det">
                  <span className="reg-inst-header">
                    <div className="qr-cont">
                      <i className="bx bx-file"></i>
                    </div>
                    <span className="reg-header-txt">UniID Conditions</span>
                    <span className="reg-details">
                      {/* <span className="reg-bold">Condition of Use </span> */}

                      <span className="reg-det">
                        By using this website, you certify that you have read
                        and reviewed this Agreement and you agree to comply with
                        its terms. If you do not want to be bound by the terms
                        of this Agreement, you are advised to stop using the
                        website accordingly. UniID only grants use and access of
                        this website, and its services to those who have
                        accepted its terms.
                      </span>
                    </span>
                  </span>
                  <span className="read-more-btn" onClick={termsShow}>
                    Read More
                  </span>

                  {/* Terms and Conditions Popup */}
                  {viewTerms && (
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
                                Terms and Conditions
                              </span>
                              <div className="cond-section">
                                <span className="cond-header">
                                  Condition of Use
                                </span>
                                <span className="cond-det">
                                  By using this website, you certify that you
                                  have read and reviewed this Agreement and you
                                  agree to comply with its terms. If you do not
                                  want to be bound by the terms of this
                                  Agreement, you are advised to stop using the
                                  website accordingly. UniID only grants use and
                                  access of this website, and its services to
                                  those who have accepted its terms.
                                </span>
                              </div>
                              <div className="cond-section">
                                <span className="cond-header">
                                  Privacy Policy
                                </span>
                                <span className="cond-det">
                                  Before you continue using our website, we
                                  advised you to read our privacy policy
                                  regarding our user data collection. It will
                                  help you better understand our practices.
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
                                  User Accounts
                                </span>
                                <span className="cond-det">
                                  As a user of this website, you may be asked to
                                  register with us and provide private
                                  information. You are responsible for ensuring
                                  the accuracy of this information, and you are
                                  responsible for maintaining the safety and
                                  security of your identifying information. You
                                  are also responsible for all activities that
                                  occur under your account or password.
                                </span>
                                <span className="cond-det">
                                  If you think there are any possible issue
                                  regarding the security of your account on the
                                  website, inform us immediately so we may
                                  address them accordingly.
                                </span>
                                <span className="cond-det">
                                  We reserve all the rights to terminate
                                  account, edit or remove content on our sole
                                  discretion.
                                </span>
                              </div>
                              <div className="cond-section">
                                <span className="cond-header">
                                  Applicable Law
                                </span>
                                <span className="cond-det">
                                  By using this website, you agree that the laws
                                  of the Philippines, without regard to
                                  principle of conflict laws, will govern these
                                  terms and condition, or any dispute of any
                                  sort that might come between UniId and you, or
                                  its business partner and associates.
                                </span>
                              </div>
                              <div className="cond-section">
                                <span className="cond-header">Disputes</span>
                                <span className="cond-det">
                                  Any dispute related in any way to your use of
                                  this website or to service you received from
                                  us shall be arbitrated by state or federal
                                  court of Philippines and you consent to
                                  exclusive jurisdiction and venue such as
                                  courts.
                                </span>
                              </div>
                              <div className="cond-section">
                                <span className="cond-header">
                                  Indemnification
                                </span>
                                <span className="cond-det">
                                  You agree to indemnify UniID and its
                                  affiliates and hold UniID harmless against
                                  legal claims and demands that may arise from
                                  your use or misuse of our services. We reserve
                                  the right to select our own legal counsel.
                                </span>
                              </div>
                              <div className="cond-section">
                                <span className="cond-header">
                                  Limitation on Liability
                                </span>
                                <span className="cond-det">
                                  UniID is not liable for any damage that may
                                  occur to you as a result of your misuse of our
                                  website. UniID reserves the right to edit,
                                  modify, and changes this Agreement at any
                                  time. We shall let our users know of these
                                  changes through electronic mail. This
                                  Agreement is an understanding between UniID
                                  and the user, and this supersedes and replaces
                                  all prior agreements regarding the use of this
                                  website.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="staff-footer">
        <RegFooter />
      </div>
    </div>
  );
}
