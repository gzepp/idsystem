import React, { useEffect, useState, useRef } from "react";
import {
  UserTopbar,
  UserFooter,
  PrintHeader,
  PrintFooter,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { parse, format } from "date-fns";

import { validateUsers, useAppUniidContext } from "../../context";

import "./css/user_records.css";
import "./css/user_attendance_rec.css";

import { fetchMyEntryrecord } from "../../utils";
import User_AttendanceRecordsData from "./data/user_AttendanceData";

// Local Images
import signature from "../../assets/signature.png";

export default function UserRecords() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  const [student_userData, setStudent] = useState({});

  const [origAttendanceRecords, setOrigAttendanceRecords] = useState([]); // Original data
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Filtered data
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mostRecentScanned, setmostRecentScanned] = useState({
    placeOfentry: "Gate 2",
    entryDatetime: "2023-10-16T07:50:50.167+00:00",
    logType: "Time Out",
  });

  console.log("sad", mostRecentScanned);
  const [dataFetched, setDataFetched] = useState(false);
  const totalPages = Math.ceil(attendanceCount / entriesToShow);
  const componentRef = useRef();
  const [printDate, setPrintDate] = useState(null);
  //console.log(entriesToShow);

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
        const mostRecentEntry = findMostRecentEntry(fetchedAttendanceData);
        setmostRecentScanned(mostRecentEntry);
        setDataFetched(true);
        setOrigAttendanceRecords(fetchedAttendanceData); // Store the original data
        setAttendanceRecords(fetchedAttendanceData); // Initialize filtered data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Filter the attendance records based on search query, start date, and end date
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

    // Update the attendance count
    setAttendanceCount(filteredRecords.length);

    // Calculate the totalPages based on the filtered records
    const totalPages = Math.ceil(filteredRecords.length / entriesToShow);

    // Adjust currentPage to ensure it's within a valid range
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    // Calculate the new start and end index for pagination
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
    setCurrentPage(1); // Reset to the first page when search query changes
    setStartDate(""); // Reset the start date
    setEndDate(""); // Reset the end date
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Printing Function
  const handlePrint = useReactToPrint({
    content: () => {
      const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      setPrintDate(new Date().toLocaleDateString("en-PH", options));
      return componentRef.current;
    },
  });

  //Dummy QR Data
  const userAttendance = [
    {
      idNumber: "2020102397",
      studName: "Aries Plaida Joson",
      placeOfentry: "SHASM Gate 2",
      entryDatetime: "2023-10-16T07:50:50.167+00:00",
      logType: "Time Out",
    },
  ];

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

  const findMostRecentEntry = (entries, logType) => {
    let mostRecentEntry = null;

    for (const entry of entries) {
      if (!logType || entry.logType === logType) {
        if (
          !mostRecentEntry ||
          entry.entryDatetime > mostRecentEntry.entryDatetime
        ) {
          mostRecentEntry = entry;
        }
      }
    }

    return mostRecentEntry;
  };

  if (!dataFetched) {
    // Render a loading indicator or return null while waiting for data
    return <div>Loading...</div>;
  }
  return (
    <div className="user-body-container">
      <div className="user-topbar">
        <UserTopbar userName={student_userData.userFName} />
        <div className="lower-topbar-wrapper">
          <div className="lower-topbar">
            <span className="lower-topbar-text">
              <Link to="/user_homepage" className="top-linking-page">
                <span className="active-linking">Home {""}</span>
              </Link>
              <span className="inactive-link">{"/"} Records</span>
            </span>
          </div>
        </div>
      </div>

      <div className="user-main-contents">
        <div className="user-body-limiter">
          <div className="student-side-profile-body">
            {/* Staff Side Profile */}
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
                    <Link to="/user_profileupdate" className="pp-linking-page">
                      <span className="side-user-profile-updater-btn">
                        UPDATE PROFILE <i className="bx bxs-pencil"></i>
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
              {/* QR Logs*/}
              <div className="student-user-side-qr-cont">
                <div className="qr-log-reports-header">
                  <i className="bx bxs-report"></i>
                  <span className="qr-log-reports-header-txt">
                    User Log Report
                  </span>
                </div>
                {/* Total Scanned Within a Day */}
                <div className="qr-scanned-cont">
                  <div className="user-qr-log-reports-subheader">
                    Most Recent Log
                  </div>
                  <div className="qr-links-container">
                    <span className="react-detail-indicator"></span>
                    <div className="qr-user-details">
                      <span className="qr-det-title">
                        {mostRecentScanned
                          ? mostRecentScanned.placeOfentry
                          : "N/A"}
                      </span>
                      {mostRecentScanned && (
                        <div>
                          <span className="qr-det-time">
                            Date:{" "}
                            {format(
                              parse(
                                mostRecentScanned.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "MM/dd/yyyy"
                            )}
                          </span>
                          <span className="qr-user-det-time">
                            <span className="qr-det-time">
                              Time:{" "}
                              {format(
                                parse(
                                  mostRecentScanned.entryDatetime,
                                  "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                  new Date()
                                ),
                                "h:mm a"
                              )}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="user-side-qr-log">
                      <span
                        className={`user-log-type ${
                          mostRecentScanned &&
                          (mostRecentScanned.logType.toLowerCase() ===
                            "time out" ||
                            mostRecentScanned.logType.toLowerCase() ===
                              "time in")
                            ? mostRecentScanned.logType
                                .toLowerCase()
                                .replace(" ", "-")
                            : "na"
                        }`}
                      >
                        {mostRecentScanned ? mostRecentScanned.logType : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-cont-bottom"></div>
            </div>
          </div>

          <div className="staff-attendance-records">
            {/* Attendance Records Table */}
            <div className="staff-attendance-rec-mainbody">
              <div className="staff-attendance-rec-table-container">
                {/* Table Header Container */}
                <div className="user-attendance-rec-table-header-container">
                  <div className="left-header-record">
                    <span className="user-attendance-rec-title">
                      <span className="attendance-rec-icon">
                        <i className="bx bx-file"></i>
                      </span>
                      <span className="attendance-rec-text">
                        Attendance Records
                      </span>
                    </span>
                  </div>

                  <div className="right-header-rec">
                    {/* Row Filter Container */}
                    <div className="user-record-filter-container">
                      <span className="filter-row-container">
                        <label className="filter-row-text">Show</label>
                        <input
                          type="number"
                          value={entriesToShow}
                          onChange={(e) => {
                            let value = parseInt(e.target.value, 10);
                            value = isNaN(value)
                              ? 10
                              : Math.max(10, Math.min(attendanceCount, value));
                            setEntriesToShow(value);
                          }}
                          min={10}
                          max={attendanceCount}
                        />
                        <label className="filter-row-text">entries</label>
                      </span>
                    </div>
                    {/* Search Bar Container */}
                    <div className="user-record-searchbar-container">
                      <i className="bx bx-search-alt-2"></i>
                      <div className="rec-searchbar-container">
                        <span className="user-rec-search-bar">
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Date Filter Container */}
                    <div className="user-date-filter-rec">
                      <span className="user-date-before">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </span>{" "}
                      <span className="space">-</span>{" "}
                      <span className="user-date-after">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/*Attendance Records Container / Print */}
                <div className="attendance-rec-container">
                  <div
                    className="attendance-record-print"
                    id="attendancelist-print"
                    ref={componentRef}
                  >
                    <div className="user-print-header">
                      <PrintHeader />
                    </div>
                    <div className="user-print-det">
                      <span className="user-name-det">
                        <b>Student Name:</b> {student_userData.userFName}{" "}
                        {student_userData.userLName}{" "}
                        {student_userData.userMName.charAt(0)}.{" "}
                        {student_userData.userExt}
                      </span>
                      <span className="user-acad-det">
                        <b>Student Number:</b> {student_userData.idNumber}
                      </span>
                      <span className="user-acad-det">
                        <b>Year Level:</b>{" "}
                        {student_userData.acadLevel === "College"
                          ? student_userData.course
                          : `${student_userData.acadLevel} - ${student_userData.yearLevel}`}
                      </span>
                      <span className="user-acad-det">
                        <b>Date Printed:</b>
                        {printDate}
                      </span>
                    </div>
                    <div className="user-print-body">
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
                    <div className="user-print-sub">
                      <div className="user-print-subgroup">
                        <span className="print-app-name">Approved By:</span>
                        <div className="user-printsub-det">
                          <span className="print-app-name-cont">
                            <img src={signature} className="signature"></img>
                            <span className="print-app-name">
                              JUAN A. DELA CRUZ
                            </span>
                            <span className="print-app-name">
                              Academy Registrar
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="user-print-footer">
                      <PrintFooter />
                    </div>
                  </div>
                </div>

                {/* Attendance Records Footer */}
                <div className="attendance-rec-table-footer-container">
                  <span className="attendance-rec-entry-count-container">
                    {/* Number of Entries in Database - To be updated */}
                    <span className="entry-count-indicator">
                      {attendanceCount}
                    </span>
                    <span className="entry-count-det">entries</span>
                  </span>

                  <div className="page-next-prev-btn-container">
                    <span
                      className="prev-btn"
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                    >
                      Previous
                    </span>

                    <span className="page-num-indicator">
                      <span className="page-num-indicator-txt">Page</span>
                      <span className="page-indicator-main">
                        <span className="shaded-num-indicator-cont">
                          <span className="num-indicator-cont-1">
                            {currentPage}
                          </span>
                        </span>
                        <span className="page-num-indicator-txt">of</span>
                        <span className="num-indicator-cont-2">
                          {totalPages}
                        </span>
                      </span>
                    </span>

                    <span
                      className="next-btn"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                    >
                      Next
                    </span>
                  </div>

                  <div className="attendance-rec-btn">
                    <span className="print-rec-btn" onClick={handlePrint}>
                      Print Records <i className="bx bxs-printer"></i>
                    </span>
                  </div>
                </div>
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
