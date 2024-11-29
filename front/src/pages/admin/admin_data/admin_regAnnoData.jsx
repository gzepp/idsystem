import React, { useEffect, useState, useRef } from "react";
import "../admin_css/admin_annolist.css";
import "../admin_css/anno_popup.css";
import AdminAnnouncementEdit from "./admin_annoModal";
import { Link } from "react-router-dom";
import { parse, format } from "date-fns";

const PostedAnnouncement = ({ announcementData, onDelete }) => {
  const [editedAnnoData, setEditedAnnoData] = useState(announcementData); //data

  //DD
  const [showOverlay, setShowOverlay] = useState(false);
  const openSettings = () => {
    setShowOverlay(true);
  };

  const closeSettings = () => {
    setShowOverlay(false);
  };

  // Delete Popup
  const [delShowModal, setDelShowModal] = useState(false);

  const viewDel = () => {
    setDelShowModal(true);
    closeSettings();
  };
  const closeDel = () => setDelShowModal(false);

  // Delete function

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeSettings();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Edit Popup
  const [showEdit, setShowEdit] = useState(false);

  const viewEdit = () => {
    setShowEdit(true);
    closeSettings();
  };
  const EditClose = () => {
    setShowEdit(false);
  };

  // Updates
  const handleUpdate = (updatedAnnoData) => {
    setEditedAnnoData(updatedAnnoData);
  };

  const confirmDelete = () => {
    onDelete(editedAnnoData.postId); // Adjust this based on your data structure
    setDelShowModal(false); // Close the modal
  };

  useEffect(() => {
    setEditedAnnoData(announcementData);
  }, [announcementData]); // convert back

  return (
    <>
      <div className="annolist-card">
        <div className="annolist-card-img">
          <img
            alt="Announcement Picture"
            width="350px"
            src={`https://res.cloudinary.com/debe9q66f/image/upload/${editedAnnoData.postImage}`}
          />
        </div>
        <Link
          to={`/admin_anno_view/${encodeURIComponent(
            JSON.stringify(editedAnnoData)
          )}`}
          className="announcementData-linking-page"
          key={editedAnnoData.postId}
        >
          <div className="annolist-card-details">
            <span className="annolist-news-title">{editedAnnoData.title}</span>
            <span className="annolist-news-details">
              {editedAnnoData.description}
            </span>
            <div className="annolist-category-date">
              <span className="annolist-category-indicator">
                {editedAnnoData.tags}
              </span>
              <span className="annolist-date-indicator">
                {format(
                  parse(
                    editedAnnoData.dateposted,
                    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                    new Date()
                  ),
                  "MMMM dd, yyyy"
                )}
              </span>
            </div>
          </div>
        </Link>
        <div className="annolistcard-dd-header">
          {/* Header/Dropdown Options */}
          <div className="anno-post-btn-cont">
            {/* Button */}
            <span className="anno-post-settings-btn" onClick={openSettings}>
              <i className="bx bx-dots-vertical-rounded"></i>
            </span>

            {/* Dropdown Container */}
            {showOverlay && (
              <div className="annolist-post-options" ref={dropdownRef}>
                <span className="anno-edit-btn" onClick={viewEdit}>
                  <i className="bx bx-pencil"></i>Edit Post
                </span>

                <span className="anno-del-btn" onClick={viewDel}>
                  <i className="bx bxs-trash"></i>Archive Post
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {delShowModal && (
        <div className="anno-del-modal">
          <div className="del-modal-container">
            <div className="del-header">
              <span className="del-icon">
                <i className="bx bx-error-circle"></i>
              </span>
              <span className="del-title">Archive this Post?</span>
            </div>
            <div className="del-selection-container">
              <span className="confirm-del-btn" onClick={confirmDelete}>
                ARCHIVE
              </span>
              <span className="cancel-del-btn" onClick={closeDel}>
                CANCEL
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Popup Announcement Post Edit Form */}
      {showEdit && (
        <div className="anno-main-popup-form-container">
          <div className="anno-popup-form-container">
            <div className="anno-edit-popup-form-header">
              <span className="anno-edit-popup-title-container">
                <span className="epop-header-icon" onClick={EditClose}>
                  <i className="bx bx-x"></i>
                </span>
              </span>
            </div>
            <div className="anno-details-popup-container">
              <div className="anno-y-container">
                <AdminAnnouncementEdit
                  annoModalData={editedAnnoData}
                  onUpdate={handleUpdate}
                  onClose={EditClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostedAnnouncement;
