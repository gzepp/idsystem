import React, { useState, useEffect, useRef } from "react";

import PostedAnnouncement from "./admin_regAnnoData";

import "../admin_css/admin_annolist.css";

const AnnoListData = ({
  annoData,
  currentPage,
  itemsPerPage,
  onUpdateTotalAnno,
  onDelete,
}) => {

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const slicedAnnoData = annoData.slice(startIndex, endIndex);

  const totalAnno = annoData.length;

  useEffect(() => {
    onUpdateTotalAnno(totalAnno);
  }, [totalAnno, onUpdateTotalAnno]);

  return (
    <>
      {slicedAnnoData.map((annoItem, index) => (
        <div className="annolist-card-container" key={annoItem.postId}>
          <PostedAnnouncement announcementData={annoItem} onDelete={onDelete} />
        </div>
      ))}
    </>
  );
};

export default AnnoListData;
