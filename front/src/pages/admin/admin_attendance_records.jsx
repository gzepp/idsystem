import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AdminTopbar,
  AdminSidebar,
  PrintHeader,
  PrintFooter,
} from "../../components";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { parse, format } from "date-fns";

import "./admin_css/admin_attendance_rec.css";
import "./adminpages.css";

import { validateUsers, useAppUniidContext } from "../../context";
import { fetchEntryrecord } from "../../utils";

import AttendanceRecordsData from "./admin_data/user_AttendanceData";

export default function AdminAttendanceRecords() {
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
  const totalPages = Math.ceil(attendanceCount / entriesToShow);
  const componentRef = useRef();
  //console.log(entriesToShow);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAttendanceData = await fetchEntryrecord();
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

    // Update the attendanceRecords state with the filtered data
    setAttendanceRecords(filteredRecords);

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

  //Printing Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page when search query changes
    setStartDate(""); // Reset the start date
    setEndDate(""); // Reset the end date
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  // Export as Excel that depends on filtration
  const exportToExcel = () => {
    const filteredRecords = attendanceRecords.filter((att_records) => {
      return (
        att_records.studentName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (!startDate || att_records.entryDatetime >= startDate) &&
        (!endDate || att_records.entryDatetime <= endDate)
      );
    });

    if (filteredRecords.length === 0) {
      alert("No data to export.");
      return;
    }

    const maxRowsToExport = Math.min(entriesToShow, filteredRecords.length);

    const data = filteredRecords
      .slice(0, maxRowsToExport)
      .map((att_records) => ({
        "Student Name": att_records.studentName,
        "Log Date": format(
          parse(
            att_records.entryDatetime,
            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
            new Date()
          ),
          "MM/dd/yyyy"
        ),
        "Log Time": format(
          parse(
            att_records.entryDatetime,
            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
            new Date()
          ),
          "h:mm a"
        ),
      }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Attendance Records");

    const arrayBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "student_attendance_records.xlsx");
  };

  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-u-reg-contents">
        <AdminTopbar pageName="Records" />

        {/* Attendance Records Table */}
        <div className="a-attendance-rec-mainbody">
          <div className="a-attendance-rec-table-container">
            {/* Table Header Container */}
            <div className="attendance-rec-table-header-container">
              <div className="left-header-rec">
                <span className="attendance-rec-title">
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
                <div className="a-record-filter-container">
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
                <div className="a-record-searchbar-container">
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
              <div
                className="attendance-record-print"
                id="attendancelist-print"
                ref={componentRef}
              >
                <div className="attendance-print-header">
                  <PrintHeader />
                </div>
                <div className="attendance-print-body">
                  <AttendanceRecordsData
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
                <div className="attendance-print-footer">
                  <PrintFooter />
                </div>
              </div>
            </div>

            {/* Attendance Records Footer */}
            <div className="attendance-rec-table-footer-container">
              <span className="attendance-rec-entry-count-container">
                {/* Number of Entries in Database - To be updated */}
                <span className="entry-count-indicator">{attendanceCount}</span>
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
                    <span className="num-indicator-cont-2">{totalPages}</span>
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
                <span className="exc-btn" onClick={exportToExcel}>
                  Export as Excel<i className="bx bxs-file-doc"></i>
                </span>
                <span className="print-pdf-btn" onClick={handlePrint}>
                  Print as PDF<i className="bx bxs-file-pdf"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
