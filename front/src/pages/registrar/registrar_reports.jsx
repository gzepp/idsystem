import React, { useEffect, useState, useRef } from "react";
import {
  RegTopbar,
  RegFooter,
  PrintHeader,
  PrintFooter,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "./css/reg_homepage.css";
import "./css/reg_records.css";
import "./css/reg_popup.css";

import RegistrarReportList from "./data/reg_reportList";

import {
  validateUsers,
  useAppUniidContext,
  updateQrrequest,
} from "../../context";
import { fetchrenewQRList } from "../../utils";

export default function RegReports() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [staff_userData, setStaff_userData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const totalPages = Math.ceil(reportCount / entriesToShow);
  const [currentPage, setCurrentPage] = useState(1);
  const componentRef = useRef();
  const [originalReports, setOriginalReports] = useState([]);

  //loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the necessary data for each of the four variables

        const reqQrlist = { getAllReq: "pending" };

        // Fetch the data for each variable

        const reqQRlistdata = await fetchrenewQRList(reqQrlist);

        // setDataFetched(true);
        // Assign the data to the useState variables

        setOriginalReports(reqQRlistdata);

        //bar graph
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchData();
  }, []);

  const handleDelete = (_id) => {
    setLoading(true);
    const payload = {
      _id: _id,
      isArchive: true,
      description: "canceled",
    };

    updateQrrequest(payload);

    window.location.reload();
  };

  const handleApprove = (_id) => {
    setLoading(true);
    const payload = {
      _id: _id,

      description: "approved",
    };

    console.log(payload);
    updateQrrequest(payload);

    window.location.reload();
  };

  //Validate User Function
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

  //-----------------------------
  //Dummy Data

  const updateReportCount = () => {
    // Calculate filtered report count
    const filteredCount = reportData.filter(
      (reports) =>
        reports.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reports.reqFullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reports.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
    setReportCount(filteredCount);
  };

  useEffect(() => {
    const filteredReports = originalReports.filter((reportData) => {
      return (
        reportData.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reportData.reqFullname
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        reportData.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setReportData(filteredReports);
    setReportCount(filteredReports.length);
  }, [searchQuery, originalReports]);

  useEffect(() => {}, [currentPage, entriesToShow, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Printing Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //Export as Excel (raw data)
  const exportToExcel = () => {
    const data = reportData.map((reports) => ({
      "ID Number": reports.idNumber,
      "First Name": reports.reqFullname,
      Status: reports.description,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lost ID Reports");

    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

    // Save As
    saveAs(blob, "lostID_reports.xlsx");
  };

  return (
    <div className="staff-body-container">
      <div className="staff-topbar">
        <RegTopbar userName={staff_userData.userFName} />
        <div className="staff-lower-topbar">
          <span className="lower-topbar-txt">
            <Link to="/reg_homepage" className="top-linking-page">
              <span className="active-linking">Homepage </span>
            </Link>{" "}
            {"/"} <span className="inactive-linking">Lost ID Reports</span>
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
          <div className="a-student-rec-table-container">
            <div className="student-rec-table-header-container">
              <div className="left-header-rec">
                <span className="student-rec-title">
                  <span className="student-rec-icon">
                    <i className="bx bx-file"></i>
                  </span>
                  <span className="student-rec-text">Lost ID Reports</span>
                </span>
              </div>
              {/* Search Functions / Filter Functions */}
              <div className="right-header-rec">
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
                          : Math.max(10, Math.min(reportCount, value));
                        setEntriesToShow(value);
                      }}
                      min={10}
                      max={reportCount}
                    />
                    <label className="filter-row-text">entries</label>
                  </span>
                </div>
                {/* Search Bar Function  */}
                <div className="reco-searchbar-container">
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
              </div>
            </div>
            <div className="student-rec-container">
              {reportData.length === 0 ? (
                <div className="no-data-found-message">No data found.</div>
              ) : (
                <div
                  className="student-rec-print"
                  id="studentlist-print"
                  ref={componentRef}
                >
                  <div className="student-print-header">
                    <PrintHeader />
                  </div>
                  <div className="student-print-body">
                    <RegistrarReportList
                      reportData={reportData}
                      currentPage={currentPage}
                      entriesToShow={entriesToShow}
                      searchQuery={searchQuery}
                      onReportCountChange={setReportCount}
                      onPageChange={handlePageChange}
                      onDelete={handleDelete}
                      onApprove={handleApprove}
                    />
                  </div>
                  <div className="student-print-footer">
                    <PrintFooter />
                  </div>
                </div>
              )}
              <div className="student-rec-table-footer-container">
                {/* Student Count */}
                <span className="student-rec-entry-count-container">
                  <span className="entry-count-indicator">{reportCount}</span>
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
                {/* Footer Buttons */}
                <div className="student-rec-btn">
                  <span className="exc-btn" onClick={exportToExcel}>
                    Export as Excel<i className="bx bxs-file-doc"></i>
                  </span>
                  <span className="print-pdf-btn" onClick={handlePrint}>
                    Print as PDF
                    <i className="bx bxs-file-pdf"></i>
                  </span>
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
