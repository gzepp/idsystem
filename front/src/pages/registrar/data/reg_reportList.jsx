import React, { useEffect } from "react";
import RegistrarReport from "./reg_report";
import "../css/admin_student_rec.css";
import "../css/reg_homepage.css";
import "../css/reg_records.css";
import "../css/reg_popup.css";

const RegistrarReportList = ({
  reportData,
  searchQuery,
  entriesToShow,
  onReportCountChange,
  currentPage,
  onPageChange,
  onDelete,
  onApprove,
}) => {
  const totalPages = Math.ceil(reportData.length / entriesToShow);

  // Calculate startIndex and endIndex for the current page
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;

  // Get the data for the current page
  const currentPageData = reportData
    .filter(
      (reports) =>
        reports.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reports.reqFullname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(startIndex, endIndex);

  // Update the reports count
  const updateReportCount = () => {
    onReportCountChange(reportData.length);
  };

  useEffect(() => {
    updateReportCount();
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
            <td className="medium-det-container">Status</td>
            <td className="user-record-actions-container">Action</td>
          </tr>
        </thead>
        <tbody className="student-record-contents">
          {currentPageData.map((reports, index) => (
            <tr key={index} className="student-rec-row-data">
              <RegistrarReport
                reports={reports}
                onDelete={onDelete}
                onApprove={onApprove}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RegistrarReportList;
