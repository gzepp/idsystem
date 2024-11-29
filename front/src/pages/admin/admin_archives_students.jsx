import React, { useState, useEffect, useRef } from "react";
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

import "./admin_css/admin_student_rec.css";
import "./adminpages.css";
import "./admin_css/user_popup.css";

import ArchivedStudentList from "./admin_data/user_archivesList";
//import studentData from "./admin_data/studentData";
//function
import {
  validateUsers,
  updateStudent,
  useAppUniidContext,
} from "../../context";
import { fetchUser, decrypt } from "../../utils";

export default function AdminArchiveUsers() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [originalStudents, setOriginalStudents] = useState([]); // Store the original data
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [studentCount, setStudentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [academicLevelFilter, setAcademicLevelFilter] = useState("");
  const [yearLevelFilter, setYearLevelFilter] = useState("");

  const totalPages = Math.ceil(studentCount / entriesToShow);
  const componentRef = useRef();

  //Function that fetches the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStudentData = await fetchUser({ getStud: "archived" }); // Fetch the data
        console.log("res ", fetchedStudentData);
        return fetchedStudentData.reverse();
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchData()
      .then((fetchedStudentData) => {
        const decryptedStudents = fetchedStudentData.map((student) => {
          const decryptField = (field) => {
            if (field && field.data) {
              field = decrypt(field.data, field.iv);
            }
            return field;
          };

          student.birthDay = decryptField(student.birthDay);
          student.birthPlace = decryptField(student.birthPlace);
          student.contactNo = decryptField(student.contactNo);
          student.gender = decryptField(student.gender);
          student.userFName = decryptField(student.userFName);
          student.userLName = decryptField(student.userLName);
          student.userMName = decryptField(student.userMName);
          student.userExt = decryptField(student.userExt);
          student.perAddress = decryptField(student.perAddress);
          student.perProvince = decryptField(student.perProvince);
          student.perMuniCity = decryptField(student.perMuniCity);
          student.perBarangay = decryptField(student.perBarangay);
          student.perZIP = decryptField(student.perZIP);
          student.parentGuardianName = decryptField(student.parentGuardianName);
          student.parentGuardianContact = decryptField(
            student.parentGuardianContact
          );

          return student;
        });

        setOriginalStudents(decryptedStudents); // Store the original data
        setStudents(decryptedStudents); // Assign the data to students
        console.log("new orig", originalStudents, "new stud", students);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Printing Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (idNumber) => {
    const payload = {
      idNumber: idNumber,
      isArchive: false,
    };

    console.log(payload);
    updateStudent(dispatch, payload);

    updateStudentCount();
    window.location.reload();
  };

  const updateStudentCount = () => {
    // Calculate filtered student count
    const filteredCount = students.filter(
      (student) =>
        student.userFName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userLName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.course + " - " + student.yearLevel)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
    setStudentCount(filteredCount);
  };

  // Defines content of DD according to Acad Level
  const generateYearLevelOptions = () => {
    if (academicLevelFilter === "College") {
      return ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    } else if (academicLevelFilter === "Senior High School") {
      return ["Grade 11", "Grade 12"];
    } else if (academicLevelFilter === "Junior High School") {
      return ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
    } else if (academicLevelFilter === "Elementary") {
      return ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
    } else if (academicLevelFilter === "Primary School") {
      return ["Kinder", "Preschool"];
    } else {
      return [];
    }
  };

  const handleReset = () => {
    // Reset displayed students to the original data
    setStudents(originalStudents);
    setSearchQuery(""); // Reset search query
    setAcademicLevelFilter(""); // Reset academic level filter
    setYearLevelFilter(""); // Reset year level filter
  };

  useEffect(() => {
    // Filter students based on academic level, year level, and search query
    const filteredStudents = originalStudents.filter((student) => {
      return (
        (academicLevelFilter === "" ||
          student.acadLevel === academicLevelFilter) &&
        (yearLevelFilter === "" || student.yearLevel === yearLevelFilter) &&
        (student.userFName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.userLName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.course + " - " + student.yearLevel)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.emailAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    });

    setStudents(filteredStudents);
    setStudentCount(filteredStudents.length);
  }, [academicLevelFilter, yearLevelFilter, searchQuery, originalStudents]);

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
    const data = students.map((student) => ({
      "ID Number": student.idNumber,
      "First Name": student.userFName,
      "Middle Name": student.userMName,
      "Last Name": student.userLName,
      "Name Ext": student.userExt,
      "Academic Level": student.acadLevel,
      Course: student.course,
      "Year Level": student.yearLevel,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Archived Student Records");

    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

    // Save As
    saveAs(blob, "archived_student_records.xlsx");
  };

  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-u-reg-contents">
        <AdminTopbar pageName="Archived Records" />
        <div className="a-student-rec-mainbody">
          <div className="a-student-rec-table-container">
            <div className="student-rec-table-header-container">
              <div className="left-header-rec">
                <span className="student-rec-title">
                  <span className="student-rec-icon">
                    <i className="bx bx-file"></i>
                  </span>
                  <span className="student-rec-text">Student Archives</span>
                </span>
              </div>
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
                          : Math.max(10, Math.min(studentCount, value));
                        setEntriesToShow(value);
                      }}
                      min={10}
                      max={studentCount}
                    />
                    <label className="filter-row-text">entries</label>
                  </span>
                </div>

                {/* Academic Level Filter Function */}
                <div className="student-records-filter-wrapper">
                  <div className="student-records-filter-container">
                    <select
                      id="acadlevel-filter-dropdown"
                      value={academicLevelFilter}
                      onChange={(e) => {
                        setAcademicLevelFilter(e.target.value);
                        setYearLevelFilter(""); // Clear year level filter
                      }}
                    >
                      <option value="">Academic Level</option>
                      <option value="College">College</option>
                      <option value="Senior High School">SHS</option>
                      <option value="Junior High School">JHS</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Primary School">Primary</option>
                    </select>
                  </div>
                </div>

                {/* Year Level Filter Function */}
                <div className="studentyear-records-filter-wrapper">
                  <div className="studentyear-records-filter-container">
                    <select
                      id="yearlevel-filter-dropdown"
                      value={yearLevelFilter}
                      onChange={(e) => setYearLevelFilter(e.target.value)}
                    >
                      <option value="">Grade Level</option>
                      {generateYearLevelOptions().map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
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
              {students.length === 0 ? (
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
                    <ArchivedStudentList
                      students={students}
                      currentPage={currentPage}
                      entriesToShow={entriesToShow}
                      searchQuery={searchQuery}
                      onStudentCountChange={setStudentCount}
                      onPageChange={handlePageChange}
                      unDelete={handleDelete}
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
                  <span className="entry-count-indicator">{studentCount}</span>
                  <span className="entry-count-det">entries</span>
                </span>
                {/* Pagination */}
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
