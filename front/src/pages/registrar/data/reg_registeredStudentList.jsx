import React, { useEffect } from "react";
import RegisteredStudent from "./reg_regStudent";
import "../css/admin_student_rec.css";

const RegisteredStudentList = ({
  students,
  searchQuery,
  entriesToShow,
  onStudentCountChange,
  currentPage,
  onPageChange,
  onDelete,
  isPrinting,
}) => {
  const totalPages = Math.ceil(students.length / entriesToShow);

  // Calculate startIndex and endIndex for the current page
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;

  // Get the data for the current page
  const currentPageData = students
    .filter(
      (student) =>
        student.userFName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userLName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.course + " - " + student.yearLevel)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(startIndex, endIndex);

  // Update the student count
  const updateStudentCount = () => {
    onStudentCountChange(students.length);
  };

  useEffect(() => {
    updateStudentCount();
  }, [searchQuery, entriesToShow]);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  return (
    <>
      <table className="student-rec-main">
        <thead className="student-rec-header">
          <tr className="student-rec-row-header">
            <td className="small-det-container">Student No.</td>
            <td className="medium-det-container">Name</td>
            <td className="medium-det-container">Email Address</td>
            <td className="large-det-container">Course/Year Level</td>
            <td className="status-det-container">Status</td>
            <td
              className={`user-record-actions-container ${
                isPrinting ? "hide-when-printing" : ""
              }`}
            >
              Action
            </td>
          </tr>
        </thead>
        <tbody className="student-record-contents">
          {currentPageData.map((student, index) => (
            <tr key={index} className="student-rec-row-data">
              <RegisteredStudent student={student} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RegisteredStudentList;
