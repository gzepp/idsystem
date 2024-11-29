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
//import staffData from "./admin_data/staffData";
import RegisteredStaffList from "./admin_data/staff_registeredStaffList";

//functions
import { validateUsers, updateStaff, useAppUniidContext } from "../../context";
import { fetchStaff, decrypt } from "../../utils";

export default function AdminStaffRecords() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [originalstaffs, setOriginalStaffs] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [staffCount, setStaffCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(staffCount / entriesToShow);
  const componentRef = useRef();

  // Printing Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //function/useffect that fetches the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchStaff({ getUserlist: "" }); // Fetch the data

        const decryptedStaffs = fetchedStaffData.map((staff) => {
          const decryptField = (field) => {
            if (field && field.data) {
              field = decrypt(field.data, field.iv);
            }
            return field;
          };

          staff.birthDay = decryptField(staff.birthDay);
          staff.birthPlace = decryptField(staff.birthPlace);
          staff.contactNo = decryptField(staff.contactNo);
          staff.gender = decryptField(staff.gender);
          staff.userFName = decryptField(staff.userFName);
          staff.userLName = decryptField(staff.userLName);
          staff.userMName = decryptField(staff.userMName);
          staff.userExt = decryptField(staff.userExt);

          return staff;
        });

        return decryptedStaffs.reverse();
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };
    // Call the function to fetch and assign the data
    fetchData()
      .then((decryptedStaffs) => {
        setOriginalStaffs(decryptedStaffs.reverse()); // Store the original data
        setStaffs(decryptedStaffs.reverse()); // Assign the data to staffs
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (idNumber) => {
    const payload = {
      idNumber: idNumber,
      isArchive: true,
    };

    console.log(payload);
    updateStaff(dispatch, payload);

    updateStaffCount();
    window.location.reload();
  };

  const updateStaffCount = () => {
    // Calculate filtered staff count
    const filteredCount = staffs.filter(
      (staff) =>
        staff.userFName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
    setStaffCount(filteredCount);
  };

  useEffect(() => {
    updateStaffCount(staffs);
  }, [searchQuery, staffs]);

  useEffect(() => {}, [searchQuery]);

  useEffect(() => {}, [currentPage, entriesToShow, searchQuery]);

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

  //Export as Excel (raw data)
  const exportToExcel = () => {
    const data = staffs.map((staff) => ({
      "ID Number": staff.idNumber,
      "First Name": staff.userFName,
      "Middle Name": staff.userMName,
      "Last Name": staff.userLName,
      "Name Ext": staff.userExt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Records");

    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

    // Save As
    saveAs(blob, "staff_records.xlsx");
  };

  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-u-reg-contents">
        <AdminTopbar pageName="Records" />

        {/* Staff Records Table */}
        <div className="a-staff-rec-mainbody">
          <div className="a-staff-rec-table-container">
            {/* Table Header Container */}
            <div className="staff-rec-table-header-container">
              <div className="left-header-rec">
                <span className="staff-rec-title">
                  <span className="staff-rec-icon">
                    <i className="bx bx-file"></i>
                  </span>
                  <span className="staff-rec-text">Staff Records</span>
                </span>
              </div>

              <div className="right-header-rec">
                <div className="record-filter-container">
                  <span className="filter-row-container">
                    <label className="filter-row-text">Show</label>
                    <input
                      type="number"
                      value={entriesToShow}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        value = isNaN(value)
                          ? 10
                          : Math.max(10, Math.min(staffCount, value));
                        setEntriesToShow(value);
                      }}
                      min={10}
                      max={staffCount}
                    />
                    <label className="filter-row-text">entries</label>
                  </span>
                </div>

                {/* Search Bar Container */}
                <div className="record-searchbar-container">
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
                  <div className="add-new-btn-container">
                    <Link
                      to="/admin_staff_registration"
                      className="linking-page-anno"
                    >
                      <span className="add-new-btn">Add New +</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Records Container */}
            <div className="staff-rec-container">
              {staffCount === 0 ? (
                <div className="no-data-found-message">No data found.</div>
              ) : (
                <div
                  className="staff-rec-print"
                  id="stafflist-print"
                  ref={componentRef}
                >
                  <div className="staff-print-header">
                    <PrintHeader />
                  </div>

                  <div className="staff-print-body">
                    <RegisteredStaffList
                      staffs={staffs}
                      currentPage={currentPage}
                      entriesToShow={entriesToShow}
                      searchQuery={searchQuery}
                      onStaffCountChange={setStaffCount}
                      onPageChange={handlePageChange}
                      onDelete={handleDelete}
                    />
                  </div>
                  <div className="staff-print-footer">
                    <PrintFooter />
                  </div>
                </div>
              )}

              {/* Staff Records Footer */}
              <div className="staff-rec-table-footer-container">
                <span className="staff-rec-entry-count-container">
                  <span className="entry-count-indicator">{staffCount}</span>
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
                <div className="staff-rec-btn">
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
    </div>
  );
}
