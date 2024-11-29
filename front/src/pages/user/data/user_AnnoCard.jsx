import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { parse, format } from "date-fns";

const AnnoCard = ({ announcementData }) => {
  const [editedAnnoData, setEditedAnnoData] = useState(announcementData); //data

  return (
    <>
      <div className="anno-card">
        <div className="anno-card-img">
          <img
            alt="Announcement Picture"
            width="350px"
            src={`https://res.cloudinary.com/debe9q66f/image/upload/${editedAnnoData.postImage}`}
          />
        </div>
        <Link
          to={`/user_annoview/${encodeURIComponent(
            JSON.stringify(editedAnnoData)
          )}`}
          className="announcementData-linking-page"
          key={editedAnnoData.postId}
        >
          <div className="anno-card-details">
            <span className="anno-news-title">{editedAnnoData.title}</span>
            <span className="anno-news-details">
              {editedAnnoData.description}
            </span>
            <div className="anno-category-date">
              <span className="anno-category-indicator">
                {editedAnnoData.tags}
              </span>
              <span className="anno-date-indicator">
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
      </div>
    </>
  );
};

export default AnnoCard;
