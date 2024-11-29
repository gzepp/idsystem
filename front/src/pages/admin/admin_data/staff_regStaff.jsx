import React, { useEffect, useState } from "react";
import UpdateStaffForm from "./staff_regStaffModal";
import ViewStaffForm from "./staff_regStaffView";

import "../admin_css/admin_staff_rec.css";
import "../admin_css/user_popupPrint.css";

const RegisteredStaff = ({ staff, onDelete }) => {
  const [viewShowModal, viewSetShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedStaff, setEditedStaff] = useState(staff);
  const [delShowModal, viewDelShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const viewHandleShow = () => viewSetShowModal(true);
  const viewHandleClose = () => viewSetShowModal(false);

  const viewDel = () => viewDelShowModal(true);
  const closeDel = () => viewDelShowModal(false);

  const handleUpdate = (updatedStaff) => {
    setEditedStaff(updatedStaff);
  };

  useEffect(() => {
    setEditedStaff(staff);
  }, [staff]);

  const handleDelete = () => {
    onDelete(editedStaff.idNumber);
    closeDel();
  };

  return (
    <>
      <td className="small-det-container">{editedStaff.idNumber}</td>
      <td className="large-det-container">
        {editedStaff.userFName}{" "}
        {editedStaff.userMName
          .split(" ")
          .map((word) => word.charAt(0))
          .join(".")}
        {"."} {editedStaff.userLName} {editedStaff.userExt}
      </td>

      <td className="medium-det-container">{editedStaff.emailAddress}</td>
      <td className="small-det-container">
        <span className={`user-status ${editedStaff.status.toLowerCase()}`}>
          {editedStaff.status}
        </span>
      </td>

      <td className="staff-record-actions-container">
        {/* Action buttons */}
        <span className="rec-view-btn" onClick={viewHandleShow}>
          <i className="bx bx-detail"></i>
          <span className="view-tooltip">View</span>
        </span>
        <span className="rec-edit-btn" onClick={handleShow}>
          <i className="bx bxs-edit-alt"></i>
          <span className="edit-tooltip">Edit</span>
        </span>
        <span className="rec-del-btn" onClick={viewDel}>
          <i className="bx bxs-trash"></i>
          <span className="del-tooltip">Archive</span>
        </span>
      </td>

      {/* User Edit Popup Modal */}
      {showModal && (
        <div className="qr-popup-overlay">
          <div className="user-main-popup-form-container">
            <div className="popup-form-container">
              <div className="edit-popup-form-header">
                <span className="edit-popup-title-container">
                  <span className="epop-header-icon" onClick={handleClose}>
                    <i className="bx bx-x"></i>
                  </span>
                </span>
              </div>
              <div className="user-details-popup-container">
                <UpdateStaffForm
                  staff={editedStaff}
                  onUpdate={handleUpdate}
                  onClose={handleClose}
                />
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

      {/* Delete Modal */}
      {delShowModal && (
        <div className="qr-popup-overlay">
          <div className="anno-del-modal">
            <div className="del-modal-container">
              <div className="del-header">
                <span className="del-icon">
                  <i class="bx bx-error-circle"></i>
                </span>
                <span className="del-title">Archive this Staff?</span>
              </div>
              <div className="del-selection-container">
                <span className="confirm-del-btn" onClick={handleDelete}>
                  ARCHIVE
                </span>
                <span className="cancel-del-btn" onClick={closeDel}>
                  CANCEL
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisteredStaff;
