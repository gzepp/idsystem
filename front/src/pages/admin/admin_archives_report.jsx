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

import "./admin_css/admin_staff_rec.css";
import "./adminpages.css";

import ArchivedReportList from "./admin_data/id_archivesList";
import { fetchrenewQRList } from "../../utils";
//functions
import { validateUsers, updateStaff, useAppUniidContext } from "../../context";

export default function AdminArchiveReports() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const totalPages = Math.ceil(reportCount / entriesToShow);
  const [currentPage, setCurrentPage] = useState(1);
  const componentRef = useRef();

  const [originalReports, setOriginalReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the necessary data for each of the four variables

        const reqQrlist = { getAllReq: "archived" };

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
      "Full Name": reports.reqFullname,
      Status: reports.description,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Archived Lost ID Reports");

    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

    // Save As
    saveAs(blob, "archived_lostID_reports.xlsx");
  };

  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-u-reg-contents">
        <AdminTopbar pageName="Archived Reports" />

        {/* Staff Records Table */}
        <div className="a-staff-rec-mainbody">
          <div className="a-student-rec-table-container">
            <div className="student-rec-table-header-container">
              <div className="left-header-rec">
                <span className="student-rec-title">
                  <span className="student-rec-icon">
                    <i className="bx bx-file"></i>
                  </span>
                  <span className="student-rec-text">Lost ID Archives</span>
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
                    <ArchivedReportList
                      reportData={reportData}
                      currentPage={currentPage}
                      entriesToShow={entriesToShow}
                      searchQuery={searchQuery}
                      onReportCountChange={setReportCount}
                      onPageChange={handlePageChange}
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
    </div>
  );
}
