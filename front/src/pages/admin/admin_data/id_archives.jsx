import React, { useEffect, useState } from "react";
import "../admin_css/admin_student_rec.css";
import "../admin_css/admin_rec_del.css";
import "../admin_css/user_popupPrint.css";

const ArchivedReport = ({ reports }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <td className="small-det-container">{reports.idNumber}</td>
      <td className="medium-det-container">{reports.reqFullname}</td>
      <td className="medium-det-container">
        <span className="user-status">{reports.description}</span>
      </td>
      {/* <td className="user-record-actions-container">
        <span className="rec-id-btn" onClick={handleShow}>
          <i className="bx bxs-archive-out"></i>
          <span className="id-tooltip">Unarchive</span>
        </span>
      </td> */}
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
                You are about to recover an archived lost ID report. Please take
                note that recovering this ticket will redisable the reporting of
                id lost on the user side of this specific user.
              </span>
            </div>

            <div className="home-popup-footer">
              <div className="home-popup-btns">
                <span className="home-cancel" onClick={handleClose}>
                  <span className="home-cancel-txt">Cancel</span>
                </span>
                <span className="home-submit">
                  <span className="home-submit-txt">Confirm</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivedReport;
