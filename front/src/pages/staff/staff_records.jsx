import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StaffTopbar, StaffFooter } from "../../components";
import { parse, format } from "date-fns";
import "./css/staff_records.css";

import { validateUsers, useAppUniidContext } from "../../context";
import { getStaffQrData, fetchMyEntryrecord, getData } from "../../utils";

import StaffAttendanceRecordsData from "./data/staff_AttendanceData";

export default function StaffRecords() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [origAttendanceRecords, setOrigAttendanceRecords] = useState([]); // Original data
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Filtered data
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //satff data
  const [staff_userData, setStaff_userData] = useState({});

  //QR log data
  const [recentTimeInQR, setRecentTimeInQR] = useState({});
  const [recentTimeOutQR, setRecentTimeOutQR] = useState({});
  const [totalScanned, settotalScanned] = useState();
  const [mostRecentScanned, setmostRecentScanned] = useState();
  const [timeinScanned, settimeinScanned] = useState();
  const [timeoutScanned, settimeoutScanned] = useState();
  const [dataFetched, setDataFetched] = useState(false);
  console.log(mostRecentScanned);
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
          scannedBy: userData.idNumber,
          speciDate: formattedDate,
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

        const mostRecentTimeInEntry = findMostRecentEntry(
          fetchedAttendanceData,
          "Time in"
        );
        const mostRecentTimeOutEntry = findMostRecentEntry(
          fetchedAttendanceData,
          "Time out"
        );

        // Log the most recent entries (you can set these in the state if needed)
        setDataFetched(true);
        // Set the parsed date and time in state
        setmostRecentScanned(mostRecentEntry);
        setRecentTimeInQR(mostRecentTimeInEntry);
        setRecentTimeOutQR(mostRecentTimeOutEntry);
        setOrigAttendanceRecords(fetchedAttendanceData); // Store the original data
        setAttendanceRecords(fetchedAttendanceData); // Initialize filtered data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const totalPages = Math.ceil(attendanceCount / entriesToShow);
  const componentRef = useRef();
  // console.log(recentTimeInQR.entryDatetime);
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
    const startIndex = 0; // Start from the beginning
    const endIndex = filteredRecords.length; // End at the last record
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

  //validate function
  const validate = async () => {
    try {
      const tokenString = window.sessionStorage.getItem("profile");
      // console.log(tokenString);

      if (!tokenString) {
        // Handle the absence of data
        navigate("/");
        return;
      }
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
        if (userType !== "staff") {
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

  useEffect(() => {
    const fetchDataQR = async () => {
      const userDataString = window.sessionStorage.getItem("profile");
      const userData = JSON.parse(userDataString);
      try {
        // Fetch the necessary data for each of the four variables
        const totalScannedPayload = {
          countTotal: "totalday",
          idNumber: userData.idNumber,
        };
        const timeinScannedPayload = {
          countTotal: "timein",
          idNumber: userData.idNumber,
        };
        const timeoutScannedPayload = {
          countTotal: "timeout",
          idNumber: userData.idNumber,
        };

        // Fetch the data for each variable
        const totalScannedData = await getStaffQrData(totalScannedPayload);
        const timeinScannedData = await getStaffQrData(timeinScannedPayload);
        const timeoutScannedData = await getStaffQrData(timeoutScannedPayload);

        // Assign the data to the useState variables

        settotalScanned(totalScannedData);
        settimeinScanned(timeinScannedData);
        settimeoutScanned(timeoutScannedData);
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchDataQR();
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

  // console.log(origAttendanceRecords);
  return (
    <div className="staff-body-container">
      <div className="staff-topbar">
        <StaffTopbar userName={staff_userData.userFName} />
      </div>

      <div className="staff-main-contents">
        <div className="staff-body-limiter">
          <div className="staff-side-profile-body">
            {/* Staff Side Profile */}
            <div className="side-profile-container">
              <div className="side-profile-contents">
                <div className="side-profile-cover-pfp">
                  <div className="side-profile-cover"></div>
                </div>
                <div
                  className="side-profile-picture"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${staff_userData.pfpPic})`,
                  }}
                ></div>
                <div className="side-profile-details-container">
                  <span className="side-profile-det">
                    <span className="side-profile-name">
                      {staff_userData.userFName} {staff_userData.userLName}{" "}
                      {staff_userData.userExt}
                    </span>
                    <span className="side-profile-number">
                      Employee No: {staff_userData.idNumber}
                    </span>
                  </span>
                </div>
              </div>
              {/* QR Logs*/}
              <div className="staff-side-qr-cont">
                <div className="qr-log-reports-header">
                  <i className="bx bxs-report"></i>
                  <span className="qr-log-reports-header-txt">
                    QR Log Reports
                  </span>
                </div>
                {/* Total Scanned Within a Day */}
                {/* Total Scanned Within a Day */}
                <div className="qr-scanned-cont">
                  <div className="qr-log-reports-subheader">
                    No. of QR Code Scanned {totalScanned}
                  </div>
                  <div className="qr-scanned-det">
                    <span className="qr-icon-rep-y">
                      <i class="bx bx-qr-scan"></i>
                    </span>
                    <div className="qr-details-rep-container">
                      <span className="qr-count-header">Scanned QR Code</span>
                      <span className="qr-count-det">
                        {mostRecentScanned?.entryDatetime ? (
                          <span>
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
                        ) : (
                          "Date: N/A"
                        )}
                      </span>
                      <span className="qr-count-det">
                        {mostRecentScanned?.entryDatetime ? (
                          <span>
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
                        ) : (
                          "Time: N/A"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* QR Time In */}
                <div className="qr-scanned-cont">
                  <div className="qr-log-reports-subheader">
                    No. of Student Time In {timeinScanned}
                  </div>
                  <div className="qr-scanned-det">
                    <span className="qr-icon-rep-g">
                      <i class="bx bx-qr-scan"></i>
                    </span>
                    <div className="qr-details-rep-container">
                      <span className="qr-count-header">Scanned QR Code</span>
                      <span className="qr-count-det">
                        {recentTimeInQR?.entryDatetime ? (
                          <span>
                            Date:{" "}
                            {format(
                              parse(
                                recentTimeInQR.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "MM/dd/yyyy"
                            )}
                          </span>
                        ) : (
                          "Date: N/A"
                        )}
                      </span>
                      <span className="qr-count-det">
                        {recentTimeInQR?.entryDatetime ? (
                          <span>
                            Time:{" "}
                            {format(
                              parse(
                                recentTimeInQR.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "h:mm a"
                            )}
                          </span>
                        ) : (
                          "Time: N/A"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* QR Time Out */}
                <div className="qr-scanned-cont">
                  <div className="qr-log-reports-subheader">
                    No. of Student Time Out {timeoutScanned}
                  </div>
                  <div className="qr-scanned-det">
                    <span className="qr-icon-rep-r">
                      <i class="bx bx-qr-scan"></i>
                    </span>
                    <div className="qr-details-rep-container">
                      <span className="qr-count-header">Scanned QR Code</span>
                      <span className="qr-count-det">
                        {recentTimeOutQR?.entryDatetime ? (
                          <span>
                            Date:{" "}
                            {format(
                              parse(
                                recentTimeOutQR.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "MM/dd/yyyy"
                            )}
                          </span>
                        ) : (
                          "Date: N/A"
                        )}
                      </span>
                      <span className="qr-count-det">
                        {recentTimeOutQR?.entryDatetime ? (
                          <span>
                            Time:{" "}
                            {format(
                              parse(
                                recentTimeOutQR.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "h:mm a"
                            )}
                          </span>
                        ) : (
                          "Time: N/A"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="qr-cont-bottom"></div>
            </div>
          </div>

          <div className="staff-attendance-records">
            {/* Attendance Records Table */}
            <div className="staff-attendance-rec-mainbody">
              <div className="staff-attendance-rec-table-container">
                {/* Table Header Container */}
                <div className="staff-att-rec-table-header-container">
                  <div className="left-header-record">
                    <span className="staff-attendance-rec-title">
                      <span className="attendance-rec-icon">
                        <i className="bx bx-file"></i>
                      </span>
                      <span className="staff-attendance-rec-text">
                        Scanning History
                      </span>
                    </span>

                    <div className="att-record-filter-container">
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
                  </div>

                  <div className="right-header-rec">
                    {/* Search Bar Container */}
                    <div className="staff-record-searchbar-container">
                      <i className="bx bx-search-alt-2"></i>
                      <div className="rec-searchbar-container">
                        <span className="rec-search-bar">
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
                    <div className="date-filter-rec">
                      <span className="date-before">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </span>{" "}
                      <span className="space">-</span>{" "}
                      <span className="date-after">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/*Attendance Records Container */}
                <div className="attendance-rec-container">
                  <StaffAttendanceRecordsData
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

                  <div className="attendance-rec-btn"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="staff-footer">
        <StaffFooter />
      </div>
    </div>
  );
}
