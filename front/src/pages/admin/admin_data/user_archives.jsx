import React, { useEffect, useState } from "react";
import "../admin_css/admin_student_rec.css";
import "../admin_css/admin_rec_del.css";
import "../admin_css/user_popupPrint.css";
import ViewUserForm from "./user_regStudentView";

const ArchivedStudent = ({ student, unDelete }) => {
  const [viewShowModal, viewSetShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);

  const viewHandleShow = () => viewSetShowModal(true);
  const viewHandleClose = () => viewSetShowModal(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = () => {
    unDelete(editedStudent.idNumber);
    handleClose();
  };

  return (
    <>
      <td className="small-det-container">{student.idNumber}</td>
      <td className="medium-det-container">
        {student.userFName}{" "}
        {student.userMName
          .split(" ")
          .map((word) => word.charAt(0))
          .join(".")}
        {"."} {student.userLName} {student.userExt}
      </td>
      <td className="medium-det-container">{student.emailAddress}</td>
      <td className="large-det-container">
        {student.acadLevel === "College"
          ? `${student.course} - ${student.yearLevel}`
          : student.yearLevel}
      </td>
      <td className="status-det-container">
        <span className={`user-status ${student.status.toLowerCase()}`}>
          {student.status}
        </span>
      </td>
      <td className="user-record-actions-container">
        {/* Action buttons */}
        <span className="rec-edit-btn" onClick={viewHandleShow}>
          <i className="bx bx-detail"></i>
          <span className="edit-tooltip">View</span>
        </span>
        <span className="rec-id-btn" onClick={handleShow}>
          <i className="bx bxs-archive-out"></i>
          <span className="id-tooltip">Unarchive</span>
        </span>
      </td>

      {/* User View Popup Modal */}
      {viewShowModal && (
        <div className="qr-popup-overlay">
          <div className="user-main-popup-form-container">
            <div className="popup-form-container">
              <div className="view-popup-form-header">
                <span className="edit-popup-title-container">
                  <span className="epop-header-icon" onClick={viewHandleClose}>
                    <i className="bx bx-x"></i>
                  </span>
                </span>
              </div>
              <div className="user-details-popup-container">
                <ViewUserForm student={student} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unarchive User */}
      {showModal && (
        <div className="homepage-popup-container">
          <div className="user-profile-qr-container">
            {/* Homepage Popup Container - Header */}
            <div className="home-popup-form-header">
              <span className="home-header-icon">
                <i className="bx bxs-error-circle"></i>
              </span>
              <span className="home-header-txt">Unarchive User</span>
            </div>

            <div className="home-container-b-body">
              <span className="home-container-b-text">
                You are about to recover an archived account. Please note that
                this action will reactivate this account upon confirmation.
              </span>
            </div>

            <div className="home-popup-footer">
              <div className="home-popup-btns">
                <span className="home-cancel" onClick={handleClose}>
                  <span className="home-cancel-txt">Cancel</span>
                </span>
                <span className="home-submit">
                  <span className="home-submit-txt" onClick={handleDelete}>
                    Confirm
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivedStudent;
