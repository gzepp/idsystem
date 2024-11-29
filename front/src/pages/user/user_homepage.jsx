import React, { useEffect, useState, useRef } from "react";
import { UserTopbar, UserFooter } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { Input, QRCode, Space, Button } from "antd";

import "./css/user_homepage.css";
import "./css/announcement.css";

import AnnoCarousel from "./data/user_AnnoCarousel";
import User_AttendanceRecordsData from "./data/user_AttendanceData";
import UserHomePageEvents from "./data/user_homepageEvents";

import { validateUsers, useAppUniidContext, reqQrreset } from "../../context";

//function import
import { fetchMyEntryrecord, fetchAnnouncerecord } from "../../utils";

export default function UserHomePage() {
  const navigate = useNavigate();

  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  const [student_userData, setStudent] = useState({});

  //QR Popup
  const [viewQRModal, viewsetQRModal] = useState(false);
  const [viewQRModalErr, viewsetQRModalErr] = useState(false);

  const handleShow = () => viewsetQRModal(true);
  const handleClose = () => viewsetQRModal(false);

  const handleCloseErr = () => viewsetQRModalErr(false);
  //Homepage Records
  const [origAttendanceRecords, setOrigAttendanceRecords] = useState([]); // Original data
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Filtered data
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const totalPages = Math.ceil(attendanceCount / entriesToShow);
  const componentRef = useRef();
  //console.log(entriesToShow);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        console.log("Req Success:", res);
        handleClose();
        // window.location.reload();
      } else {
        console.log("Req Failed:", res);
      }
    } catch (error) {
      console.log("failed request has done");
      viewsetQRModalErr(true);
    }
  };

  //Attendance Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the user data from sessionStorage and parse it
        const userDataString = window.sessionStorage.getItem("profile");
        const userData = JSON.parse(userDataString);

        // Create a Date object for the current date
        const currentDate = new Date();

        // Format the current date as YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split("T")[0];

        const payload = {
          idNumber: userData.idNumber,
          // speciDate: formattedDate,
        };

        console.log(payload);
        const fetchedAttendanceData = await fetchMyEntryrecord(
          dispatch,
          payload
        );
        console.log(fetchedAttendanceData);
        return fetchedAttendanceData.reverse();
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    fetchData()
      .then((fetchedAttendanceData) => {
        setOrigAttendanceRecords(fetchedAttendanceData); // Store the original data
        setAttendanceRecords(fetchedAttendanceData); // Initialize filtered data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const filteredRecords = origAttendanceRecords.filter((att_records) => {
      // Apply filters here
      return (
        att_records.studentName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (!startDate || att_records.entryDatetime >= startDate) &&
        (!endDate || att_records.entryDatetime <= endDate)
      );
    });

    setAttendanceCount(filteredRecords.length);

    const totalPages = Math.ceil(filteredRecords.length / entriesToShow);

    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    const startIndex = (validCurrentPage - 1) * entriesToShow;
    const endIndex = startIndex + entriesToShow;
  }, [
    searchQuery,
    entriesToShow,
    currentPage,
    startDate,
    endDate,
    origAttendanceRecords,
  ]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setStartDate("");
    setEndDate("");
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //Carousel Data
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    // Function that fetches the announcement data and keeps only the three most recent posts
    const fetchData = async () => {
      try {
        const fetchedAnnouncementData = await fetchAnnouncerecord();
        console.log("Fetched Announcement Data: ", fetchedAnnouncementData);

        // Keep only the three most recent posts
        const mostRecentPosts = fetchedAnnouncementData.slice(0, 3);
        setCarouselData(mostRecentPosts);
      } catch (error) {
        console.error("Error fetching announcement data: ", error);
      }
    };

    fetchData();
  }, []);

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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="user-body-container">
      <div className="user-topbar">
        <UserTopbar userName={student_userData.userFName} />
      </div>

      <div className="user-main-contents">
        <div className="user-body-limiter">
          <div className="user-homepage-wrapper">
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
                      backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${student_userData.pfpPic})`,
                    }}
                  ></div>
                </div>
                <div className="user-details-container">
                  <span className="user-det">
                    <span className="user-name">
                      {" "}
                      {student_userData.userFName} {student_userData.userMName}{" "}
                      {student_userData.userLName} {student_userData.userExt}{" "}
                      <i className="bx bxs-badge-check"></i>
                    </span>
                    <span className="user-number">
                      Student No: {student_userData.idNumber}
                    </span>
                    <span className="user-course">
                      {student_userData.acadLevel === "College"
                        ? student_userData.course
                        : `${student_userData.acadLevel} - ${student_userData.yearLevel}`}
                    </span>
                  </span>
                  <div className="separator-line"></div>
                  <div className="profile-buttons">
                    <Link to="/user_profileupdate" className="pp-linking-page">
                      <span className="profile-updater-btn">
                        UPDATE PROFILE <i className="bx bxs-pencil"></i>
                      </span>
                    </Link>
                    <span className="profile-qr-btn" onClick={handleShow}>
                      REPORT LOST ID <i className="bx bxs-id-card"></i>
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
                                  onClick={handleSubmit}
                                >
                                  Confirm
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>{" "}
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
            {/* Announcements Highlights */}
            <div className="anno-carousel-wrapper">
              <div className="anno-carousel-limiter">
                <div className="anno-highlight-container">
                  <AnnoCarousel carouselData={carouselData} />
                </div>
              </div>
            </div>
            {/* Recent Logs and Events */}
            <div className="log-events-containers">
              <div className="recent-logs-main-container">
                {/* Home Attendance Records Table */}
                <div className="homepage-attendance-records">
                  <div className="homepage-attendance-rec-table-container">
                    {/* Table Header Container */}
                    <div className="homepage-attendance-rec-table-header-container">
                      <div className="left-header-record">
                        <span className="user-attendance-rec-title">
                          <span className="attendance-rec-icon">
                            <i className="bx bx-file"></i>
                          </span>
                          <span className="attendance-rec-text">
                            Recent Logs
                          </span>
                        </span>
                      </div>

                      <div className="right-header-rec">
                        <Link to="/user_records" className="pp-linking-page">
                          <span className="view-more-rec-btn">View More</span>
                        </Link>
                      </div>
                    </div>

                    {/*Attendance Records Container / Print */}
                    <div className="attendance-rec-container">
                      <User_AttendanceRecordsData
                        attendanceRecords={attendanceRecords}
                        searchQuery={searchQuery}
                        entriesToShow={entriesToShow}
                        onAttendanceCountChange={setAttendanceCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>

                    {/* Attendance Records Footer */}
                    <div className="homepage-table-footer-container">
                      <span className="attendance-rec-entry-count-container">
                        {/* Number of Entries in Database - To be updated */}
                        <span className="entry-count-indicator">
                          {attendanceCount}
                        </span>
                        <span className="entry-count-det">entries</span>
                      </span>

                      <div className="page-next-prev-btn-container">
                        <span className="page-num-indicator"></span>
                      </div>

                      <div className="attendance-rec-btn"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="events-side-main-container">
                <UserHomePageEvents />
              </div>
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
