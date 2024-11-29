import React, { useEffect, useState } from "react";

const RegistrarReport = ({ reports, onDelete, onApprove, onConfirmPrint }) => {
  const [showModal, setShowModal] = useState(false);
  const [delShowModal, viewDelShowModal] = useState(false);
  const [printShowModal, viewPrintShowModal] = useState(false);
  console.log(reports);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const viewDel = () => viewDelShowModal(true);
  const closeDel = () => viewDelShowModal(false);

  const viewPrint = () => viewPrintShowModal(true);
  const closePrint = () => viewPrintShowModal(false);

  const handleDelete = () => {
    onDelete(reports._id);
    closeDel();
  };

  const handleApprove = () => {
    onApprove(reports._id);
    handleClose();
  };
  const handlePrintconfirm = () => {
    onConfirmPrint(reports._id);
    handleClose();
  };
  return (
    <>
      <td className="small-det-container">{reports.idNumber}</td>
      <td className="medium-det-container">{reports.reqFullname}</td>
      <td className="medium-det-container">
        <span className="user-status">{reports.description}</span>
      </td>
      <td className="user-record-actions-container">
        <span className="rec-view-btn" onClick={handleShow}>
          <i className="bx bx-check"></i>
          <span className="view-tooltip">Approve</span>
        </span>
        <span className="rec-del-btn" onClick={viewDel}>
          <i className="bx bx-x"></i>
          <span className="del-tooltip">Cancel</span>
        </span>
        <span className="rec-id-btn" onClick={viewPrint}>
          <i className="bx bxs-printer"></i>
          <span className="id-tooltip">Confirm Print</span>
        </span>
      </td>
      {/* Approve */}
      {showModal && (
        <div className="homepage-popup-container">
          <div className="user-profile-qr-container">
            {/* Homepage Popup Container - Header */}
            <div className="home-popup-form-header">
              <span className="home-header-icon">
                <i className="bx bxs-error-circle"></i>
              </span>
              <span className="home-header-txt">Validate Lost ID Report</span>
            </div>

            <div className="home-container-b-body">
              <span className="home-container-b-text">
                You are about to validate a lost ID report. Please note that
                upon confirmation, the QR code of the user who reported the lost
                ID will become obsolete and be updated. The validated request
                will then be forwarded to the admin for ID printing.
              </span>
            </div>

            <div className="home-popup-footer">
              <div className="home-popup-btns">
                <span className="home-cancel" onClick={handleClose}>
                  <span className="home-cancel-txt">Cancel</span>
                </span>
                <span className="home-submit">
                  <span className="home-submit-txt" onClick={handleApprove}>
                    Confirm
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {delShowModal && (
        <div className="homepage-popup-container">
          <div className="user-profile-qr-container">
            {/* Homepage Popup Container - Header */}
            <div className="home-popup-form-header">
              <span className="home-header-del-icon">
                <i className="bx bxs-error-circle"></i>
              </span>
              <span className="home-header-txt">Archive Lost ID Report</span>
            </div>

            <div className="home-container-b-body">
              <span className="home-container-b-text">
                You're about to cancel a request. Please note that archiving
                this ticket will re-enable the lost id request of this specific
                user.
              </span>
            </div>

            <div className="home-popup-footer">
              <div className="home-popup-btns">
                <span className="home-cancel" onClick={closeDel}>
                  <span className="home-cancel-txt">Cancel</span>
                </span>
                <span className="home-del">
                  <span className="home-submit-txt" onClick={handleDelete}>
                    Confirm
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Renewal of ID */}
      {printShowModal && (
        <div className="homepage-popup-container">
          <div className="user-profile-qr-container">
            {/* Homepage Popup Container - Header */}
            <div className="home-popup-form-header">
              <span className="home-header-icon">
                <i className="bx bxs-error-circle"></i>
              </span>
              <span className="home-header-txt">Confirm Renewal of ID</span>
            </div>

            <div className="home-container-b-body">
              <span className="home-container-b-text">
                You're about to confirm that this user's ID has been printed.
                Please note that this will serve as confirmation of the user's
                ID renewal on your side and the requested ID will be ready for
                the student user.
              </span>
            </div>

            <div className="home-popup-footer">
              <div className="home-popup-btns">
                <span className="home-cancel" onClick={closePrint}>
                  <span className="home-cancel-txt">Cancel</span>
                </span>
                <span className="home-submit">
                  <span
                    className="home-submit-txt"
                    onClick={handlePrintconfirm}
                  >
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

export default RegistrarReport;
