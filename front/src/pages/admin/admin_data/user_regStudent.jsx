import React, { useEffect, useState } from "react";
import "../admin_css/admin_student_rec.css";
import "../admin_css/admin_rec_del.css";
import "../admin_css/user_popupPrint.css";
import UpdateUserForm from "./user_regStudentModal";
import ViewUserForm from "./user_regStudentView";
import PrintIDForm from "./user_regStudentPrint";

const RegisteredStudent = ({ student, onDelete }) => {
  const [viewShowModal, viewSetShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [delShowModal, viewDelShowModal] = useState(false);
  const [printShowModal, setPrintShowModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const viewHandleShow = () => viewSetShowModal(true);
  const viewHandleClose = () => viewSetShowModal(false);

  const viewDel = () => viewDelShowModal(true);
  const closeDel = () => viewDelShowModal(false);

  const openID = () => setPrintShowModal(true);
  const closeID = () => setPrintShowModal(false);

  const handleUpdate = (updatedStudent) => {
    setEditedStudent(updatedStudent);
  };

  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleDelete = () => {
    onDelete(editedStudent.idNumber);
    closeDel();
  };

  return (
    <>
      <td className="small-det-container">{editedStudent.idNumber}</td>
      <td className="medium-det-container">
        {editedStudent.userFName}{" "}
        {editedStudent.userMName
          .split(" ")
          .map((word) => word.charAt(0))
          .join(".")}
        {"."} {editedStudent.userLName} {editedStudent.userExt}
      </td>
      <td className="medium-det-container">{editedStudent.emailAddress}</td>
      <td className="large-det-container">
        {editedStudent.acadLevel === "College"
          ? `${editedStudent.course} - ${editedStudent.yearLevel}`
          : editedStudent.yearLevel}
      </td>
      <td className="status-det-container">
        <span className={`user-status ${editedStudent.status.toLowerCase()}`}>
          {editedStudent.status}
        </span>
      </td>
      <td className="user-record-actions-container">
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
        <span className="rec-id-btn" onClick={openID}>
          <i className="bx bx-id-card"></i>
          <span className="id-tooltip">Student ID</span>
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
                <UpdateUserForm
                  student={editedStudent}
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
                <ViewUserForm student={student} />
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
                  <i className="bx bx-error-circle"></i>
                </span>
                <span className="del-title">Archive this Student?</span>
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

      {/* Print ID Modal */}
      {printShowModal && (
        <div className="qr-popup-overlay">
          <div className="print-id-popup-container">
            <div className="print-id-form-container">
              <div className="print-id-header">
                <span className="print-id-title-container">
                  <span className="epop-header-icon" onClick={closeID}>
                    <i className="bx bx-x"></i>
                  </span>
                </span>
              </div>
              <div className="print-id-contents">
                <PrintIDForm student={student} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisteredStudent;
