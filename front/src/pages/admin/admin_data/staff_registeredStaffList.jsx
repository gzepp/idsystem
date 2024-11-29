import React, { useEffect } from "react";
import RegisteredStaff from "./staff_regStaff";
import "../admin_css/admin_staff_rec.css";

const RegisteredStaffList = ({
  staffs,
  searchQuery,
  entriesToShow,
  onStaffCountChange,
  currentPage,
  onPageChange,
  onDelete,
}) => {
  const totalPages = Math.ceil(staffs.length / entriesToShow);

  // Calculate startIndex and endIndex for the current page
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;

  // Get the data for the current page
  const currentPageData = staffs
    .filter(
      (staff) =>
        staff.userFName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(startIndex, endIndex);

  // Update the staff count
  const updateStaffCount = () => {
    onStaffCountChange(staffs.length);
  };

  useEffect(() => {
    updateStaffCount();
  }, [searchQuery, entriesToShow]);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  return (
    <>
      <table className="staff-rec-main">
        <thead className="staff-rec-header">
          <tr className="staff-rec-row-header">
            <td className="small-det-container">Employee ID</td>
            <td className="large-det-container">Name</td>
            <td className="medium-det-container">Email</td>
            <td className="small-det-container">Status</td>
            <td className="staff-record-actions-container">Action</td>
          </tr>
        </thead>
        <tbody className="staff-record-contents">
          {currentPageData.map((staff, index) => (
            <tr key={index} className="staff-rec-row-data">
              <RegisteredStaff staff={staff} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RegisteredStaffList;
