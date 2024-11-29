import React, { useEffect, useState } from "react";
import UpdateStaffForm from "./staff_regStaffModal";
import ViewStaffForm from "./staff_regStaffView";

import "../admin_css/admin_staff_rec.css";
import "../admin_css/user_popupPrint.css";

const ArchivedStaff = ({ staff, unDelete }) => {
  const [viewShowModal, viewSetShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedStaff, setEditedStaff] = useState(staff);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const viewHandleShow = () => viewSetShowModal(true);
  const viewHandleClose = () => viewSetShowModal(false);
  const handleDelete = () => {
    unDelete(editedStaff.idNumber);
    viewHandleClose();
  };
  return (
    <>
      <td className="small-det-container">{staff.idNumber}</td>
      <td className="large-det-container">
        {staff.userFName}{" "}
        {staff.userMName
          .split(" ")
          .map((word) => word.charAt(0))
          .join(".")}
        {"."} {staff.userLName} {staff.userExt}
      </td>

      <td className="medium-det-container">{staff.emailAddress}</td>
      <td className="small-det-container">
        <span className={`user-status ${staff.status.toLowerCase()}`}>
          {staff.status}
        </span>
      </td>

      <td className="staff-record-actions-container">
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
                <ViewStaffForm staff={staff} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivedStaff;
